import { graphql } from "@graphql/__generated";

export const GET_EVENTS_BY_COMPANY_OVERVIEWS = graphql(`
  query GetEventsByCompanyOverviews($company: String!) {
    getEventsByCompany(company: $company) {
      ...EventOverview
    }
  }
`);
