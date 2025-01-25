import { graphql } from '@graphql/__generated'

export const ADD_STATISTIC = graphql(`
  mutation addStatistic(
    $anonymousId: String
    $userId: String
    $url: String
    $ip: String
    $country: String
    $browser: String
  ) {
    addStatistic(
      anonymousId: $anonymousId
      userId: $userId
      url: $url
      ip: $ip
      country: $country
      browser: $browser
    )
  }
`)
