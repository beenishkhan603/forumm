import { graphql } from '@graphql/__generated'

export const GET_USERS_IN_GROUP = graphql(`
  query getUsersInGroup($input: GetUsersInGroupInput!) {
    getUsersInGroup(input: $input) {
      items {
        ...UserFull
      }
      total
    }
  }
`)
