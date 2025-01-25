import { graphql } from '@graphql/__generated'

export const REQUEST_EARLY_ACCESS = graphql(`
  mutation requestEarlyAccess(
    $email: String!
    $firstName: String!
    $lastName: String!
    $notes: String
  ) {
    requestEarlyAccess(
      email: $email
      firstName: $firstName
      lastName: $lastName
      notes: $notes
    ) {
      success
    }
  }
`)
