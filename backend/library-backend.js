import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Author } from './models/author.js';
import { Book } from './models/book.js';
import jwt from "jsonwebtoken";
import { User } from './models/user.js';

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

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963,
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ];
// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon ',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

const typeDefs = `
    type Author {
        name: String!
        born: Int
        bookCount(author: String): Int
        id: ID!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String!]!
        id: ID!
    }

    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }

    type Token {
      value: String!
    }

    type Query {
        bookCount(author: String): Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        me: User
    }

    type Mutation {
        addBook(
            title: String!
            published: Int!
            authorName: String!
            genres: [String!]!
        ): Book

        addAuthor(
            name: String!
            born: Int
        ): Author

        editAuthor(
            name: String!
            born: Int!
        ): Author

        createUser(
          username: String!
          favoriteGenre: String!
        ): User

        login(
          username: String!
          password: String!
        ): Token
    }
`

const resolvers = {
  Author: {
    bookCount: async (root, args) => {
      const result = await Book.count({author: root.name});
      return null; //
    }
  },

  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
        if(!args.author && !args.genre){
            return await Book.find({}).populate('author', {name: 1, born: 1, id: 1});
        }else if(args.author){
            return await Book.find({author: args.author}).populate('author', {name: 1, born: 1, id: 1});
        }else if(args.genre){
            return await Book.find({"genres": args.genre}).populate('author', {name: 1, born: 1, id: 1});
        }
    },

    allAuthors: async () => await Author.find({}),

    me: (root, args, context) => {
      return context.currentUser;
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      const author = await Author.findOne({name: args.authorName});
      const newBook2 = new Book({title: args.title, published: args.published, genres: args.genres, author: author});

        if(!currentUser){
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          });
        }

        if(!author){
          const newAuthor = new Author({name: args.authorName});
          const response = await newAuthor.save();
          const newBook = new Book({title: args.title, published: args.published, genres: args.genres, author: response});
            try {
              await newBook.save();
            }
            catch (error) {
                throw new GraphQLError('Saving book hhhh failed', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.authorName,
                    error
                  }
                })
              }
              return newBook;
        }else{
          try {
            await newBook2.save();
          }
          catch (error) {
            throw new GraphQLError('Saving book failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.authorName,
                error
              }
            })
          }
          return newBook2;
        }
    },

    addAuthor: (root, args) => {
        const newAuthor = new Author({...args});
        return newAuthor.save();
    },

    editAuthor: (root, args, context) => {
        const currentUser = context.currentUser;
        if(!currentUser){
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          });
        }
        const newAuthor = Author.findOneAndUpdate({name: args.name}, {born: args.born});
        return newAuthor;
    },

    createUser: async (root, args) => {
      const user = new User({username: args.username, favoriteGenre: args.favoriteGenre});

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({username: args.username});

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return {value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    }

  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({req, res}) => {
    const auth = req ? req.headers.authorization : null;
    if(auth && auth.startsWith('Bearer ')){
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return {currentUser};
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
});