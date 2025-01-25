import { graphql } from '@graphql/__generated'

export const GET_ORGANISATION_BY_NAME = graphql(`
  query getOrganisationByName($name: String!) {
    getOrganisationByName(name: $name) {
      name
      organisationType
      bannerImage
      logoImage
      mainColour
      currency
      percentage
      headerTextOne
      headerTextTwo
      dashboardPopupDoNotShowAgain
      blackBaudAccessToken
      url
    }
  }
`)
