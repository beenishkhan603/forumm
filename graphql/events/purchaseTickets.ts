import { graphql } from '@graphql/__generated'

export const PURCHASE_TICKETS = graphql(`
  mutation PurchaseTickets(
    $input: PurchaseTicketsInput!
    $donation: DonationInput
  ) {
    purchaseTickets(input: $input, donation: $donation) {
      checkoutUrl
      user
      userAlreadyExist
    }
  }
`)
