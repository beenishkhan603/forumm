import { MockedResponse } from '@apollo/client/testing'
import { ME } from '@graphql/users/me'
import { USER_DATA } from './UserData'

export const ME_MOCK: MockedResponse = {
  request: {
    query: ME,
    variables: {},
  },
  result: {
    data: {
      me: USER_DATA,
    },
  },
}
