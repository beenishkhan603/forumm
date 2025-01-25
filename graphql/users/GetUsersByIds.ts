import { graphql } from "@graphql/__generated";

export const GET_USERS_BY_IDS = graphql(`
  query GetUsersByIds($input: GetUsersByIdsInput!) {
    getUsersByIds(input: $input) {
      items {
        ...UserFull
      }
      total
      nextToken
    }
  }
`);
