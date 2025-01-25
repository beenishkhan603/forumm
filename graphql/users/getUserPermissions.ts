import { graphql } from '@graphql/__generated'

export const GET_USER_PERMISSIONS = graphql(`
  query GetUserPermissions($input: GetUserPermissionsInput!) {
    getUserPermissions(input: $input)
  }
`)
