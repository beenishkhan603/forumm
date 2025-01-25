import { graphql } from "@graphql/__generated";

export const GET_MY_EVENTS = graphql(`
  query GetMyEvents {
    getMyEvents {
      ...EventFull
    }
  }
`);
