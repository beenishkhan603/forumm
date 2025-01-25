import { graphql } from "@graphql/__generated";

export const GET_LOCATION = graphql(`
  query GetLocation($latitude: Float!, $longitude: Float!) {
    getLocation(latitude: $latitude, longitude: $longitude)
  }
`);
