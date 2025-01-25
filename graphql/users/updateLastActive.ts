import { graphql } from '@graphql/__generated'

export const UPDATE_LAST_ACTIVE = graphql(`
  mutation UpdateLastActive($input: UpdateLastActiveInput!) {
    updateLastActive(input: $input)
  }
`)
