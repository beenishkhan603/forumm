import { graphql } from '@graphql/__generated'

export const LINK_MERCHANT = graphql(`
  mutation LinkMerchant($input: LinkMerchantInput!) {
    linkMerchant(input: $input) {
      status
      error
    }
  }
`)
