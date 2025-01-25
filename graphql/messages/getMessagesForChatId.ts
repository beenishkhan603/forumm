import { graphql } from "@graphql/__generated";

export const GET_MESSAGES_FOR_CHAT_ID = graphql(`
  query GetMessagesForChatId($input: GetMessagesForChatId!) {
    getMessagesForChatId(input: $input) {
      ...MessageFull
    }
  }
`);
