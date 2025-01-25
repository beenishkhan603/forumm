import { MockedResponse } from '@apollo/client/testing'
import { GET_EVENTS_BY_COMPANY_OVERVIEWS } from '@graphql/events/getEventsByCompanyOverviews'
import { EVENT_DATA } from './EventData'

export const GET_EVENTS_BY_COMPANY_MOCK: MockedResponse = {
  request: {
    query: GET_EVENTS_BY_COMPANY_OVERVIEWS,
  },
  variableMatcher: () => true,
  result: {
    data: {
      getEventsByCompany: [EVENT_DATA],
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
}
