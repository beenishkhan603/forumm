import { graphql } from '@graphql/__generated'

export const SET_CHECKIN_FOR_ATTENDEE = graphql(`
	mutation setCheckInforAttendee (
	  $email: String!
	  $eventId: String!
      $checkInStatus: String!
	) {
	  setCheckInforAttendee (
	    email: $email
	    eventId: $eventId
        checkInStatus: $checkInStatus
	  )
	}
`)

