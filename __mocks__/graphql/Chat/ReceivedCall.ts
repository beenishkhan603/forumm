import { MockedResponse } from '@apollo/client/testing'
import { RECEIVED_CALL } from '@graphql/messages/receivedCall'
import { USER_DATA } from '../User/UserData'

export const RECEIVED_CALL_MOCK: MockedResponse = {
  request: {
    query: RECEIVED_CALL,
    variables: {
      myUserId: '123',
    },
  },
  result: {
    data: {
      receivedCall: {
        from: USER_DATA,
        to: USER_DATA,
      },
    },
  },
}
