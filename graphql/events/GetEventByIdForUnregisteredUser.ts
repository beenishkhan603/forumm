import { graphql } from '@graphql/__generated'

export const GET_EVENT_BY_ID_FOR_UNREGISTERED_USER = graphql(`
  query getEventByIdForUnregisteredUser(
    $input: GetEventByIdForUnregisteredUserInput!
  ) {
    getEventByIdForUnregisteredUser(input: $input) {
      ...EventFull
    }
  }
`)
