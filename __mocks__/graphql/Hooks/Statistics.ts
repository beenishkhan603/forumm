import { MockedResponse } from '@apollo/client/testing'
import { ADD_STATISTIC } from '@graphql/statistic/addStatistic'

export const ADD_STATISTIC_MOCK: MockedResponse = {
  request: {
    query: ADD_STATISTIC,
  },
  variableMatcher: () => true,
  result: {
    data: {
      addStatistic: {
        success: true,
        id: 'mocked-statistic-id',
      },
    },
  },
  maxUsageCount: Number.POSITIVE_INFINITY,
}
