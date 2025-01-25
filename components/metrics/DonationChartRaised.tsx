import Box from '@components/base/Box'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { Doughnut } from 'react-chartjs-2'
import { useTheme } from '@libs/useTheme'
import { roundAmount } from '@libs/Utility/util'
import type { EventOverviewFragment } from '@graphql/__generated/graphql'

ChartJS.register(ArcElement, Tooltip, Legend)

const DonationChartRaised = ({
  fundraises,
  currency,
  loading,
}: {
  fundraises: EventOverviewFragment[]
  loading: boolean
  currency?: string
}) => {
  const { StaticColours, theme } = useTheme()

  if (!fundraises || loading)
    return (
      <Box className="w-full flex h-[200px] justify-center items-center text-center">
        <LoadingSpinner size="medium" />
      </Box>
    )

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
      legend: {
        labels: {
          color: theme.textColour,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = ''
            if (label) {
              label += ': '
            }
            if (context.parsed !== null) {
              label += currency + roundAmount(context.parsed)
            }
            return label
          },
        },
      },
    },
  }

  // Sort by the highest raise
  const sortedFundraises = [...fundraises].sort(
    // @ts-ignore
    (a, b) => b.fundraising.raised - a.fundraising.raised
  )

  // Filter top 3 raises
  const topFundraises = sortedFundraises.slice(0, 3)

  // Sum of the rest of the raises
  const otherRaisesTotal = sortedFundraises
    .slice(3)
    // @ts-ignore
    .reduce((acc, curr) => acc + curr.fundraising.raised, 0)

  // Prepare chart data
  const chartData = {
    labels: topFundraises
      // @ts-ignore
      .map((f) => f.fundraising.title || f.event.title)
      .concat('Other'),
    datasets: [
      {
        data: topFundraises
          // @ts-ignore
          .map((f) => f.fundraising.raised)
          .concat(otherRaisesTotal),
        backgroundColor: [theme.tealColour, '#7BB1BE', '#ABCED8', '#B4CFFF'],
        borderWidth: 0,
      },
    ],
  }

  const totalRaised = (chartData.datasets?.[0]?.data ?? []).reduce(
    (acc, row) => {
      // @ts-ignore
      if (row) acc += row
      return acc
    },
    0
  )

  return (
    <Box className="w-full min-h-[300px] relative">
      <Box className="absolute w-full top-[140px]">
        <Box className="display-block -z-1">Total Raised</Box>
        <Box
          className="text-3xl font-bold"
          style={{ color: `${theme.tealColour}` }}
        >
          {currency}
          {roundAmount(totalRaised || 0)}
        </Box>
      </Box>
      <Box className="w-full min-h-[300px] relative">
        <Doughnut data={chartData} options={doughnutOptions} />
      </Box>
    </Box>
  )
}

export default DonationChartRaised
