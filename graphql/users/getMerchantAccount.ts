import { graphql } from '@graphql/__generated'

export const GET_IS_MERCHANT = graphql(`
  query GetMerchantAccount($input: GetMerchantAccountInput!) {
    getMerchantAccount(input: $input) {
      merchantAccountExists
      chargesEnabled
      required
    }
  }
`)
