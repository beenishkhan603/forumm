import { graphql } from "@graphql/__generated";

export const ME = graphql(`
  query Me {
    me {
      ...UserFull
    }
  }
`);
