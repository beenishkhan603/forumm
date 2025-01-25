import { graphql } from "@graphql/__generated";

export const GET_MY_EVENT_OVERVIEWS = graphql(`
  query GetMyEventOverviews {
    getMyEvents {
      ...EventOverview
    }
  }
`);
