import { graphql } from '@graphql/__generated'

export const SEND_ATTENDEE_EMAILS_FOR_EVENT = graphql(`
	mutation sendAttendeeEmailsForEvent(
	  $emails: [String!]!
	  $eventId: String!
	) {
	  sendAttendeeEmailsForEvent(
	  emails: $emails
	  eventId: $eventId
	  )
	}
`)

