import { gql } from '@apollo/client'

export const GET_ALL_EVENTS_BY_COMPANY = gql`
  query getAllEventsByCompany($company: String!) {
    getAllEventsByCompany(company: $company) {
      eventId
      organizerId
      isPublished
      isComplete
      availableTickets {
        tickets {
          ticketTitle
          totalQuantity
          remaining
          ticketType
          price
        }
      }
      event {
        eventType
        bannerImage
        description
        eventMainColour
        eventBackgroundColour
        eventTextColour
        endDateTime
        shortDescription
        startDateTime
        title
        organizationName
        thumbnailImage
        donationUrl
        currency
      }
      attendees {
        name
        email
        profileImage
        ticketTitle
        invitationSentDatetime
        registered
        checkInStatus
        checkInDatetime
        ticketCode
      }
      fundraising {
        title
        media {
          url
        }
        goal
        donors
        raised
        transactions {
          firstName
          lastName
          amount
          currency
          selectedProgram
          coverFee
          fee
          donation
          total
          created
          selectedProgram
        }
      }
      breakoutRooms {
        title
        totalUsers
        thumbnailImage
        users
        maxAttendees
        channelName
      }
      speakers {
        name
        email
        profileImage
        position
        organization
        ticketType
        bio
      }
      ondemandContent {
        id
        title
        description
        url
      }
    }
  }
`
