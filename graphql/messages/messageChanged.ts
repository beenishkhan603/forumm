import { graphql } from "@graphql/__generated";

export const MESSAGE_CHANGED = graphql(`
  subscription MessageChanged($input: String!) {
    messageChanged(chatId: $input) {
      ...MessageFull
    }
  }
`);
