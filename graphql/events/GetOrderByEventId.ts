import { graphql } from '@graphql/__generated'

export const GET_ORDER_BY_EVENT_ID = graphql(`
  query getOrderByEventId($eventId: String!, $userId: String!) {
    getOrderByEventId(eventId: $eventId, userId: $userId) {
      userId
      eventId
      quantity
      tickets {
        title
        email
        fullName
      }
    }
  }
`)
