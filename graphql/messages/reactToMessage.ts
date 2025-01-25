import { graphql } from "@graphql/__generated";

export const REACT_TO_MESSAGE = graphql(`
  mutation ReactToMessage(
    $emoji: String!
    $messageUserId: String!
    $chatId: String!
    $messageId: String!
  ) {
    reactToMessage(
      emoji: $emoji
      messageUserId: $messageUserId
      chatId: $chatId
      messageId: $messageId
    ) {
      ...MessageFull
    }
  }
`);
