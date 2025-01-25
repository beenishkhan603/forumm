import { graphql } from "@graphql/__generated";

export const GET_CHATS = graphql(`
  query GetChats {
    getChats {
      chatId
      lastMessage
      dateCreated
      user {
        ...UserFull
      }
    }
  }
`);
