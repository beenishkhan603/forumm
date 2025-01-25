import { graphql } from "@graphql/__generated";

export const GET_USERS_IN_COMPANY = graphql(`
  query GetUsersInCompany($company: String!) {
    getUsersInCompany(company: $company) {
      total
      items {
        ...UserFull
      }
    }
  }
`);
