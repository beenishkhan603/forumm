import { graphql } from "@graphql/__generated";

export const GET_ALL_EVENTS = graphql(`
  query GetAllEvents {
    getAllEvents {
      ...EventFull
    }
  }
`);
