import { graphql } from '@graphql/__generated'

export const CHANNEL_INFO_CHANGED = graphql(`
  subscription ChannelInfoChanged($channelName: String!) {
    ChannelInfoChanged(channelName: $channelName) {
      channelName
      isLive
      totalUsers
      users
    }
  }
`)
