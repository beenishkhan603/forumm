import { graphql } from '@graphql/__generated'

export const GET_AGORA_TOKEN = graphql(`
  query GetAgoraToken($channelName: String!) {
    getAgoraToken(channelName: $channelName)
  }
`)
