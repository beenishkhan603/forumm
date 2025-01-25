import { graphql } from "@graphql/__generated";

export const DELETE_EVENT_BY_ID = graphql(`
  mutation deleteEventById($input: DeleteEventByIdInput!) {
    deleteEventById(input: $input)
  }
`);
