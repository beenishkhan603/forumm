import { graphql } from "@graphql/__generated";

export const GET_ALL_EVENT_OVERVIEWS = graphql(`
  query GetAllEventOverviews {
    getAllPublicEvents {
      ...EventOverview
    }
  }
`);
