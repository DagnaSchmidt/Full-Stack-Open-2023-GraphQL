export const typeDefs = `
    type Author {
        name: String!
        born: Int
        bookCount: Int
        id: ID!
        books: [Book]
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
        allGenres: [String]
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

    type Subscription {
        bookAdded: Book!
      } 
`