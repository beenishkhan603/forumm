import { graphql } from '@graphql/__generated'

export const GET_FUNDRAISING_CSV = graphql(`
  query GetFundraisingCSV($eventId: String!) {
    getFundraisingCSV(eventId: $eventId)
  }
`)
