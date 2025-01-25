import { MockedResponse } from '@apollo/client/testing'
import { GET_MY_EVENT_OVERVIEWS } from '@graphql/events/getMyEventOverviews'
import { GET_MY_EVENTS } from '@graphql/events/getMyEvents'
import { EVENT_DATA } from './EventData'

export const GET_MY_EVENTS_OVERVIEW_MOCK: MockedResponse = {
  request: {
    query: GET_MY_EVENT_OVERVIEWS,
  },
  variableMatcher: () => true,
  result: {
    data: {
      getMyEvents: [EVENT_DATA],
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
}

export const GET_MY_EVENTS_MOCK: MockedResponse = {
  request: {
    query: GET_MY_EVENTS,
  },
  variableMatcher: () => true,
  result: {
    data: {
      getMyEvents: [EVENT_DATA],
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
}
