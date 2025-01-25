import { graphql } from '@graphql/__generated'

export const UPDATE_CHANNEL_INFO = graphql(`
  mutation updateChannelInfo($channelName: String!) {
    updateChannelInfo(channelName: $channelName)
  }
`)
