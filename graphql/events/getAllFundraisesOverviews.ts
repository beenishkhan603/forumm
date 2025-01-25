import { graphql } from '@graphql/__generated'

export const GET_ALL_FUNDRAISE_OVERVIEWS = graphql(`
  query GetAllFundraisesOverviews {
    getAllPublicFundraises {
      ...EventOverview
    }
  }
`)
