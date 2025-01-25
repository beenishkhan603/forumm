import { MockedResponse } from '@apollo/client/testing'
import { GET_ALL_EVENT_OVERVIEWS } from '@graphql/events/getAllEventOverviews'
import { EVENT_DATA } from './EventData'

export const GET_PUBLIC_EVENTS_MOCK: MockedResponse = {
  request: {
    query: GET_ALL_EVENT_OVERVIEWS,
  },
  variableMatcher: () => true,
  result: {
    data: {
      getAllPublicEvents: [EVENT_DATA],
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
}
