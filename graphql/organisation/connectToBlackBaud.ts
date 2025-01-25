import { graphql } from '@graphql/__generated'

export const CONNECT_TO_BLACKBAUD = graphql(`
  mutation connectToBlackBaud(
    $name: String!
    $code: String!
    $codeVerifier: String!
    $clientId: String!
    $redirectUri: String!
  ) {
    connectToBlackBaud(
      name: $name
      code: $code
      codeVerifier: $codeVerifier
      clientId: $clientId
      redirectUri: $redirectUri
    ) {
      success
    }
  }
`)
