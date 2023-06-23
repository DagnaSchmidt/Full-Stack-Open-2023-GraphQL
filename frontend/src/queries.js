import { gql } from "@apollo/client"

export const ALL_PERSONS = gql`
    query {
        allAuthors {
            name,
            born,
            id
        }
    }
    `
export const ALL_BOOKS = gql`
    query {
        allBooks {
            title,
            published,
            author,
            id,
            genres
        }
    }
`

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
        addBook(
            title: $title,
            published: $published,
            author: $author,
            genres: $genres
        ) {
            title 
            published
            author
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