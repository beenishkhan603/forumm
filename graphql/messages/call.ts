import { graphql } from "@graphql/__generated";

export const CALL_USER = graphql(`
  mutation CallUser($userId: String!) {
    call(userId: $userId)
  }
`);
