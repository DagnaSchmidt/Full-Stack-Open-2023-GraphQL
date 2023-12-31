import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name,
            born,
            id,
            bookCount
        }
    }
`

export const ALL_GENRES = gql`
    query {
        allGenres
    }
`
export const ALL_BOOKS = gql`
    query allBooks($genre: String) {
        allBooks(genre: $genre) {
            title,
            published,
            id,
            genres,
            author {
                name,
                id,
                born
            }
        }
    }
`

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $published: Int!, $authorName: String!, $genres: [String!]!) {
        addBook(
            title: $title,
            published: $published,
            authorName: $authorName,
            genres: $genres
        ) {
            title 
            published
            author {
                name,
                born,
                id
            }
            genres
            id
        }
    }
`

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $born: Int!) {
        editAuthor(
            name: $name,
            born: $born
        ) {
            name,
            born,
            id
        }
    }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
    query {
        me {
            favoriteGenre,
            username,
            id
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            title 
            published
            author {
                name,
                born,
                id
            }
            genres
            id
        }
    }
`