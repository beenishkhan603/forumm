import { MockedResponse } from '@apollo/client/testing'
import { UPDATE_ORGANISATION } from '@graphql/organisation/updateOrganisation'

export const UPDATE_ORGANISATION_MOCK: MockedResponse = {
  request: {
    query: UPDATE_ORGANISATION,
    variables: {
      name: '448 Studio',
    },
  },
  result: {
    data: {
      getOrganisationByName: {
        success: true,
      },
    },
  },
}
