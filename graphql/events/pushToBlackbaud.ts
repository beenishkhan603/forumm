import { graphql } from '@graphql/__generated'

export const PUSH_TO_BLACKBAUD = graphql(`
  mutation pushToBlackbaud(
    $eventId: String!
    $blackbaudId: String
    $fields: [String!]!
    $updatedConstituents: [UpdatedConstituentInput!]
  ) {
    pushToBlackbaud(
      eventId: $eventId
      blackbaudId: $blackbaudId
      fields: $fields
      updatedConstituents: $updatedConstituents
    ) {
      success
      completed
      error
      isOrganizer
      blackBaudAccessToken
      orgName
      currentBlackbaudId
      newBlackbaudId
      bbServiceInitialized
      bbPrimaryAccessKey
      bbUrl
      eventPreUpdate
      eventPostUpdate
      eventUpdated
      eventId
    }
  }
`)
