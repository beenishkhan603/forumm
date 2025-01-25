import { MockedResponse } from '@apollo/client/testing'
import { GET_EVENT_BY_ID } from '@graphql/events/GetEventById'
import { Event } from '@graphql/__generated/graphql'
import { EVENT_DATA } from './EventData'

export const GET_EVENT_BY_ID_MOCK: MockedResponse = {
  request: {
    query: GET_EVENT_BY_ID,
    variables: {
      input: {
        eventId: '123',
      },
    },
  },
  result: {
    data: {
      getEventById: EVENT_DATA,
    },
  },
}

export const buildEventMock = (event?: Partial<Event>) => {
  const payload = GET_EVENT_BY_ID_MOCK as any
  if (!event) return payload
  if (event.stages)
    payload.result.data.getEventById.stages = event.stages as any
  if (event.sessions)
    payload.result.data.getEventById.sessions = event.sessions as any
  return payload
}
