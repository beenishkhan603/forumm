import { MockedResponse } from '@apollo/client/testing'
import { GET_USERS_BY_IDS } from '@graphql/users/GetUsersByIds'
import { USER_DATA } from './UserData'

export const GET_USERS_BY_IDS_MOCK: MockedResponse = {
  request: {
    query: GET_USERS_BY_IDS,
  },
  variableMatcher: () => true,
  maxUsageCount: Number.POSITIVE_INFINITY,
  result: {
    data: {
      getUsersByIds: {
        total: 1,
        items: [USER_DATA],
        nextToken: null,
      },
    },
  },
}
