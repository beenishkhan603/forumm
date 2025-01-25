import { MockedResponse } from '@apollo/client/testing'
import { GET_MESSAGES_FOR_CHAT_ID } from '@graphql/messages/getMessagesForChatId'
import { MESSAGE_CHANGED } from '@graphql/messages/messageChanged'
import moment from 'moment'

export const GET_MESSAGES_FOR_CHAT_ID_MOCK: MockedResponse = {
  request: {
    query: GET_MESSAGES_FOR_CHAT_ID,
  },
  variableMatcher: () => true,
  result: {
    data: {
      getMessagesForChatId: [],
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
}

export const MESSAGE_CHANGED_MOCK: MockedResponse = {
  request: {
    query: MESSAGE_CHANGED,
  },
  variableMatcher: () => true,
  result: {
    data: {
      messageChanged: {
        messageId: '',
        chatId: '',
        user: {
          name: 'Paul Pirie',
          profileImage:
            'https://images-qa.forumm.to/user-content/b01ee7a7-8cd8-46ed-8974-d32e689e6a79/fda5515b-791f-4102-a345-06a061f44f9b.jpg',
          email: 'pauljohnpirie@yahoo.co.uk',
          userId: 'b01ee7a7-8cd8-46ed-8974-d32e689e6a79',
          company: 'Forumm',
          dateCreated: '2023-10-11T10:42:27.275Z',
          location: 'Unknown',
          university: 'Forumm',
          registrationFields: {
            Forumm: {
              'Test 3': 'Test',
              'Test 1': 'Test',
            },
          },
          lastActive:
            '{"timestamp":"2024-03-07T10:56:30.479Z","isLoggedIn":true}',
          isActive: true,
          isAnonymous: 'false',
          phoneNumber: null,
          jobTitle: null,
          otherProfiles:
            '{"facebookAccount":"","twitterAccount":"","instagramAccount":"","linkedinAccount":""}',
          companyTitle: null,
          __typename: 'User',
        },
        message: '',
        dateCreated: moment().toISOString(),
        reactions: null,
      },
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
}
