import { graphql } from "@graphql/__generated";

export const GET_EVENT_BY_ID = graphql(`
  query getEventById($input: GetEventByIdInput!) {
    getEventById(input: $input) {
      ...EventFull
    }
  }
`);
