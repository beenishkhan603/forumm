import { graphql } from "@graphql/__generated";

export const CREATE_MESSAGE_FOR_CHAT_ID = graphql(`
  mutation CreateMessageForChatId($input: CreateMessageInput!) {
    createMessageForChatId(input: $input) {
      ...MessageFull
    }
  }
`);
