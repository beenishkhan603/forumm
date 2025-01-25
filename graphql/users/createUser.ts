import { graphql } from '@graphql/__generated'

export const CREATE_USER = graphql(`
    mutation CreateUser(
        $university: String!,
        $email: String!
        $name: String!
            ) {
            createUser(
            university: $university,
            email: $email,
            name: $name
        )
    }
`)

