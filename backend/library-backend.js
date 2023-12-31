import { ApolloServer } from '@apollo/server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { User } from './models/user.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {expressMiddleware} from '@apollo/server/express4';
import { WebSocketServer } from 'ws';
import {useServer} from 'graphql-ws/lib/use/ws';

dotenv.config();

mongoose.set('strictQuery', false);
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

mongoose.set('debug', true);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path:'/'
  });

  const schema = makeExecutableSchema({typeDefs, resolvers});
  const serverCleanup = useServer({schema}, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer}),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ]
  });

  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
          const currentUser = await User.findById(decodedToken.id);
          return {currentUser};
        }
      },
    }),
  );

  const PORT = 4000;

  httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`));

};

start();

