import { graphql } from '@graphql/__generated'

export const GET_EVENT_BY_DONATION_URL = graphql(`
  query getEventByDonationUrl($input: GetEventByDonationUrlInput!) {
    getEventByDonationUrl(input: $input) {
      ...EventData
      __typename
      fundraising {
        id
        title
        description
        goal
        programs {
          title
          description
          goal
          media {
            title
            body
            platform
            url
          }
        }
        media {
          title
          body
          platform
          url
        }
        transactions {
          selectedProgram
          fee
          total
          email
          amount
          created
          currency
          coverFee
          address
          giftAid
          firstName
          lastName
          donation
        }
      }
    }
  }

  fragment EventData on Event {
    eventId
    isPublished
    organizerId
    event {
      bannerImage
      description
      eventMainColour
      eventBackgroundColour
      eventTextColour
      endDateTime
      registrationCloseDateTime
      shortDescription
      startDateTime
      title
      organizationName
      thumbnailImage
      publiclyListed
      currency
      fixedAdminFee
      eventType
      eventLocation
      donationUrl
    }
    donations {
      email
      fullName
      amount
      message
      created
      currency
      avatarUrl
      selectedProgram
    }
  }
`)
