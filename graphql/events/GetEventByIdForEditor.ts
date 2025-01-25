import { graphql } from '@graphql/__generated'

export const GET_EVENT_BY_ID_FOR_EDITOR = graphql(`
  query getEventByIdForEditor($input: GetEventByIdInput!) {
    getEventById(input: $input) {
      eventId
      organizerId
      isPublished
      isComplete
      dateCreated
      notifyOrganiser
      availableTickets {
        tickets {
          ticketTitle
          totalQuantity
          remaining
        }
      }
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
        eventLocation
        donationUrl
        eventType
        blackbaudId
        timeZone
      }
      registrationFields {
        name
      }
      fundraising {
        enabled
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
      }
      tickets {
        price
        ticketType
        title
        quantity
      }
      speakers {
        userId
        email
        name
        organization
        position
        profileImage
        ticketType
        bio
      }
      stages {
        class
        description
        holdingVideoUrl
        title
      }
      sponsors {
        description
        facebookUrl
        linkedinUrl
        logoUrl
        title
        twitterUrl
        websiteUrl
        ondemandContent {
          url
          title
          description
          id
        }
      }
      sessions {
        description
        endDateTime
        speakers {
          email
          name
          organization
          position
          profileImage
          ticketType
        }
        stage {
          class
          description
          holdingVideoUrl
          title
        }
        startDateTime
        title
        isBreak
      }
      breakoutRooms {
        thumbnailImage
        description
        maxAttendees
        title
      }
      communications {
        socials {
          platform
          url
        }
        announcements {
          title
          body
        }
      }
      ondemandContent {
        id
        url
        title
        description
      }
      attendees {
        email
        name
        profileImage
        ticketTitle
        invitationSentDatetime
        registered
        checkInStatus
        checkInDatetime
        ticketCode
        userId
      }
    }
  }
`)
