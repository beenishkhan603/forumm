import { graphql } from '@graphql/__generated'

export const GET_BREAKOUT_USER_COUNT = graphql(`
  query getBreakoutUserCount($input: GetEventByIdInput!) {
    getEventById(input: $input) {
      eventId
      breakoutRooms {
        title
        channelName
        totalUsers
        maxAttendees
      }
    }
  }
`)
