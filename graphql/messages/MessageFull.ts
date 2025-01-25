import { graphql } from "@graphql/__generated";

export const MessageFull = graphql(`
  fragment MessageFull on Message {
    messageId
    chatId
    user {
      ...UserFull
    }
    message
    dateCreated
    reactions {
      users {
        ...UserFull
      }
      emoji
    }
  }
`);
