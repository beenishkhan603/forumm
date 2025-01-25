import { MockedResponse } from '@apollo/client/testing'
import { GET_PAST_EVENTS } from '@graphql/events/getPastEvents'
import { EVENT_DATA } from './EventData'

export const GET_PAST_EVENTS_MOCK: MockedResponse = {
  request: {
    query: GET_PAST_EVENTS,
  },
  variableMatcher: () => true,
  result: {
    data: {
      getPastEvents: [EVENT_DATA],
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
}
