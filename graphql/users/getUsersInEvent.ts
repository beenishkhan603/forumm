import { graphql } from "@graphql/__generated";

export const GET_USERS_IN_EVENT = graphql(`
  query GetUsersInEvent($input: String!) {
    getUsersInEvent(input: $input) {
      items {
        ...UserFull
      }
      total
    }
  }
`);
