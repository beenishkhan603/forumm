import { graphql } from '@graphql/__generated'

export const EventOverview = graphql(`
  fragment EventOverview on Event {
    eventId
    organizerId
    isPublished
    isComplete
    availableTickets {
      tickets {
        ticketTitle
        totalQuantity
        remaining
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
    }
    fundraising {
      goal
      donors
      raised
    }
    speakers {
      email
    }
  }
`)
