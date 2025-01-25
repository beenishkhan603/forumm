import { graphql } from "@graphql/__generated";

export const GET_MEETING_FOR_CHANNEL_NAME = graphql(`
  query GetMeetingForChannelName($channelName: String!) {
    getMeetingForChannelName(channelName: $channelName)
  }
`);
