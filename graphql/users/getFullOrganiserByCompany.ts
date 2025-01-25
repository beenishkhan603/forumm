import { graphql } from '@graphql/__generated'

export const GET_FULL_ORGANISERS_BY_COMPANY = graphql(`
  query GetFullOrganiserByCompany($company: String!) {
    getOrganiserByCompany(company: $company) {
      items {
        ...UserFull
      }
      total
      nextToken
    }
  }
`)
