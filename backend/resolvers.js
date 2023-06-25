import { Book } from './models/book.js';
import { GraphQLError } from 'graphql';
import { Author } from './models/author.js';
import { User } from './models/user.js';
import jwt from "jsonwebtoken";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
    Author: {
      bookCount: async (root) => {
        const books = await Book.find({author: {$in: [root._id]}})
        return books.length;
      }, 
      books: async (root) => {
        const books = await Book.find({author: {$in: [root._id]}})
        return books;
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
  
      allGenres: async () => {
        const result = await Book.find({});
        let list = [];
        const allGenres = result.map(i => i.genres.map(g => list.push(g)));
        return [...new Set(list)];
      },
  
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
                pubsub.publish('BOOK_ADDED', {bookAdded: newBook});
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
            pubsub.publish('BOOK_ADDED', {bookAdded: newBook2});
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
  
    },

    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
  };