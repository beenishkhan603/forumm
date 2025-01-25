import { graphql } from '@graphql/__generated'

export const EVENT_DONATON_CREATE_PAYMENT_INTENT = graphql(`
  mutation eventDonationCreatePaymentIntent(
    $input: DonationPaymentIntentInput!
  ) {
    eventDonationCreatePaymentIntent(input: $input) {
      clientSecret
      nextAction
      error
    }
  }
`)
