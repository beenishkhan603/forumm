import { graphql } from '@graphql/__generated'

export const EVENT_DONATON_SEND_STRIPE_MAIL = graphql(`
  mutation eventDonationSendStripeMail(
    $eventId: String!
    $firstName: String
    $lastName: String
    $email: String
  ) {
    eventDonationSendStripeMail(
      eventId: $eventId
      firstName: $firstName
      lastName: $lastName
      email: $email
    ) {
      success
    }
  }
`)
