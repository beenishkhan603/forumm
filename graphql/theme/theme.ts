import { graphql } from "@graphql/__generated";

export const THEME = graphql(`
  query Theme($themeId: String!) {
    theme(themeId: $themeId) {
      themeId
      color
      logoUrl
      url
    }
  }
`);
