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