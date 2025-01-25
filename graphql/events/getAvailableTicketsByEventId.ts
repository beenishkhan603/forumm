import { graphql } from '@graphql/__generated'

export const GET_AVAILABLE_TICKETS_BY_EVENT_ID = graphql(`
  query getAvailableTicketsByEventId(
    $input: GetAvailableTicketsByEventIdInput!
  ) {
    getAvailableTicketsByEventId(input: $input) {
      tickets {
        ticketTitle
        totalQuantity
        remaining
      }
    }
  }
`)
