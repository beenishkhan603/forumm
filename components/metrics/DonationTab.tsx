import Box from '@components/base/Box'
import Text from '@components/base/Text'
import DonationChartRaised from '@components/metrics/DonationChartRaised'
import DonationChartTarget from '@components/metrics/DonationChartTarget'
import DonationChartUsers from '@components/metrics/DonationChartUsers'
import DonationTableTransaction from '@components/metrics/DonationTableTransaction'
import DonationMap from '@components/metrics/DonationMap'
import DonationOverall from '@components/metrics/DonationOverall'
import {
  getUniqueUsersDonation,
  getTotalUsersDonation,
} from '@libs/Utility/util'
import type {
  Statistic,
  EventOverviewFragment,
} from '@graphql/__generated/graphql'
import FunnelChart from './DonationChartFunnel'

const DonationTab = ({
  metrics,
  fundraises,
  loading,
  organisationLoading,
  currency,
  fundraiserId,
}: {
  metrics: Statistic[]
  fundraises: EventOverviewFragment[]
  loading: boolean
  organisationLoading: boolean
  currency: string
  fundraiserId: string
}) => {
  const uniqueUsers = getUniqueUsersDonation(metrics, 'default')
  const totalUsers = getTotalUsersDonation(metrics, 'default')
  return (
    <>
      <Box className="w-full flex flex-col md:flex-row gap-6 mt-10">
        <DonationOverall
          loading={loading || organisationLoading}
          fundraises={fundraises}
          currency={currency}
          metrics={metrics}
        />
        <Box
          color="foregroundColour"
          className="flex-2 min-h-[300px] max-h-[500px] rounded-3xl border shadow-md border-forumm-menu-border p-5"
        >
          <Box className="text-left mb-5">
            <Text className="text-lg xl:text-xl">Conversion Funnel</Text>
          </Box>
          <FunnelChart metrics={metrics} fundraises={fundraises} />
        </Box>
      </Box>
      <Box className="w-full flex flex-col md:flex-row gap-6 mt-10">
        <Box
          color="foregroundColour"
          className="flex-1 min-h-[300px] rounded-3xl border shadow-md border-forumm-menu-border p-5"
        >
          <Box className="text-left mb-5">
            <Text className="text-lg xl:text-xl">Total Raised</Text>
          </Box>
          {fundraiserId ? (
            <DonationChartTarget
              loading={loading || organisationLoading}
              currency={currency}
              fundraises={fundraises}
            />
          ) : (
            <DonationChartRaised
              loading={loading || organisationLoading}
              currency={currency}
              fundraises={fundraises}
            />
          )}
        </Box>
        <DonationTableTransaction currency={currency} fundraises={fundraises} />
      </Box>
      <Box className="w-full flex flex-col md:flex-row gap-6 mt-10">
        <DonationChartUsers metrics={metrics} />
        <Box
          color="foregroundColour"
          className="flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-5"
        >
          <Box className="text-left mb-5">
            <Text className="text-lg xl:text-xl">Users by Country</Text>
          </Box>
          <DonationMap metrics={metrics} />
        </Box>
      </Box>
    </>
  )
}

export default DonationTab
