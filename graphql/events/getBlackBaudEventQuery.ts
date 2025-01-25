import { graphql } from '@graphql/__generated'

export const GET_BLACKBAUD_EVENT_BY_ID = graphql(`
  mutation getBlackBaudEvent($eventId: String!, $blackbaudId: String) {
    getBlackBaudEvent(eventId: $eventId, blackbaudId: $blackbaudId) {
      id
      name
      description
      start_date
      start_time
      end_date
      end_time
      attendees {
        name
        email
      }
      speakers {
        name
        email
      }
    }
  }
`)
