import { MockedResponse } from '@apollo/client/testing'
import { THEME } from '@graphql/theme/theme'

export const GET_THEME_MOCK: MockedResponse = {
  request: {
    query: THEME,
    variables: {
      themeId: '448 Studio',
    },
  },
  result: {
    data: {
      theme: {
        themeId: '448 Studio',
        color: '#000',
        url: 'www.google.com',
        logoUrl: `https://logo.clearbit.com/Google`,
      },
    },
  },
}
