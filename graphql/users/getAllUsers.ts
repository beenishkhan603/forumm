import { graphql } from "@graphql/__generated";

export const GET_ALL_USERS = graphql(`
  query GetAllUsers {
    getAllUsers(input: { getAll: true }) {
      total
      items {
        ...UserFull
      }
    }
  }
`);
