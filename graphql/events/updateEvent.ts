import { graphql } from "@graphql/__generated";

export const UPDATE_EVENT = graphql(`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      eventId
    }
  }
`);
