import { graphql } from '@graphql/__generated'

export const EventFull = graphql(`
  fragment EventFull on Event {
    eventId
    organizerId
    isComplete
    isPublished
    dateCreated
    availableTickets {
      tickets {
        ticketTitle
        totalQuantity
        remaining
      }
    }
    ondemandContent {
      id
      title
      description
      url
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
    messages {
      ...MessageFull
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
      fixedAdminFee
      eventType
      eventLocation
      donationUrl
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
      adminFee
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
      channelName
      token
      grToken
      isLive
    }
    sponsors {
      title
      description
      logoUrl
      ondemandContent {
        url
        title
        description
        id
      }
      websiteUrl
      twitterUrl
      linkedinUrl
      facebookUrl
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
      channelName
      token
      totalUsers
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
`)
