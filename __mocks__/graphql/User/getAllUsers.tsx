import { MockedResponse } from '@apollo/client/testing'
import { GET_ALL_USERS } from '@graphql/users/getAllUsers'
import { USER_DATA } from './UserData'

export const GET_ALL_USERS_MOCK: MockedResponse = {
  request: {
    query: GET_ALL_USERS,
    variables: {},
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
  result: {
    data: {
      getAllUsers: {
        total: 1,
        items: [USER_DATA],
      },
    },
  },
}
