import { graphql } from '@graphql/__generated'

export const ORGANISER_REQUEST_ACCESS = graphql(`
  mutation organiserRequestAccess(
    $firstName: String!
    $lastName: String!
    $organisation: String!
    $email: String!
    $notes: String
  ) {
    organiserRequestAccess(
      firstName: $firstName
      lastName: $lastName
      organisation: $organisation
      email: $email
      notes: $notes
    ) {
      success
      password
    }
  }
`)
