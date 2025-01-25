import { graphql } from '@graphql/__generated'

export const CREATE_MERCHANT = graphql(`
  mutation CreateMerchant($input: CreateMerchantInput!) {
    createMerchant(input: $input) {
      redirectUrl
    }
  }
`)
