import { MockedResponse } from '@apollo/client/testing'
import { GET_ORGANISATION_BY_NAME } from '@graphql/organisation/getOrganisationByName'

export const GET_ORGANISATION_BY_NAME_MOCK: MockedResponse = {
  request: {
    query: GET_ORGANISATION_BY_NAME,
    variables: {
      name: '448 Studio',
    },
  },
  result: {
    data: {
      getOrganisationByName: {
        name: '448 Stufio',
        organisationType: 'COMPANY',
        bannerImage: '',
        logoImage: '',
        mainColour: '',
        currency: 'GBP',
        percentage: 42,
      },
    },
  },
}
