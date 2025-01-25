import { graphql } from "@graphql/__generated";

export const CREATE_EVENT = graphql(`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      eventId
    }
  }
`);
