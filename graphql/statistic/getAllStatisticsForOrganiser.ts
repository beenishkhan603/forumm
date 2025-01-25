import { graphql } from '@graphql/__generated'

export const GET_ALL_STATISTICS_FOR_ORGANISER = graphql(`
  query getAllStatisticsForOrganiser {
    getAllStatisticsForOrganiser {
      anonymousId
      userId
      name
      country
      donation {
        coverFee
        giftAid
        eventId
        organizationName
        eventName
        url
        currency
        amount
        fee
        donation
      }
      url
      companyId
      loggedUserId
      datetime
    }
  }
`)
