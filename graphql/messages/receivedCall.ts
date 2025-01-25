import { graphql } from "@graphql/__generated";

export const RECEIVED_CALL = graphql(`
  subscription ReceivedCall($myUserId: String!) {
    receivedCall(userId: $myUserId) {
      from {
        ...UserFull
      }
      to {
        ...UserFull
      }
    }
  }
`);
