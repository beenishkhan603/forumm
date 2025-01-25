import { graphql } from '@graphql/__generated'

export const GET_PUBLIC_EVENTS_BY_ORGANISATION_URL = graphql(`
  query GetPublicEventsByOrganisationUrlOverviews($url: String!) {
    getPublicEventsByOrganisationUrl(url: $url) {
      ...EventOverview
    }
  }
`)
