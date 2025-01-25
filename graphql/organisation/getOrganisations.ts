import { graphql } from '@graphql/__generated'

export const GET_ORGANISATIONS = graphql(`
  query GetAllOrganisations {
    getAllOrganisations {
      name
      organisationType
      bannerImage
      logoImage
      mainColour
      currency
      percentage
    }
  }
`)
