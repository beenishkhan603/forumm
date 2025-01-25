import { graphql } from '@graphql/__generated'

export const GET_ORGANISERS_BY_COMPANY = graphql(`
  query GetOrganiserByCompany($company: String!) {
    getOrganiserByCompany(company: $company) {
      items {
        email
      }
      total
      nextToken
    }
  }
`)
