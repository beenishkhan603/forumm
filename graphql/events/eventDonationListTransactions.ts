import { graphql } from '@graphql/__generated'

export const EVENT_DONATON_LIST_TRANSACTIONS = graphql(`
  query eventDonationListTransactions(
    $eventId: String
    $donationUrl: String
    $eventName: String
  ) {
    eventDonationListTransactions(
      eventId: $eventId
      donationUrl: $donationUrl
      eventName: $eventName
    ) {
      transactions {
        firstName
        lastName
        amount
        currency
        eventId
        eventName
        message
        coverFee
        fee
        donation
        total
        created
        address
        giftAid
        selectedProgram
        email
        visibility
        donorDob
      }
    }
  }
`)
