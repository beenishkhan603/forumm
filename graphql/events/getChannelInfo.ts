import { graphql } from '@graphql/__generated'

export const GET_CHANNEL_INDO = graphql(`
  query getChannelInfo($channelName: String!) {
    getChannelInfo(channelName: $channelName) {
      channelName
      isLive
      totalUsers
      users
    }
  }
`)
