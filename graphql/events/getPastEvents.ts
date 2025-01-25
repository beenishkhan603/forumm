import { graphql } from "@graphql/__generated";

export const GET_PAST_EVENTS = graphql(`
  query GetPastEvents {
    getPastEvents {
      ...EventOverview
    }
  }
`);
