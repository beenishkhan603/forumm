import Box from '@components/base/Box'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { Doughnut } from 'react-chartjs-2'
import { useTheme } from '@libs/useTheme'
import { roundAmount } from '@libs/Utility/util'
import type { EventOverviewFragment } from '@graphql/__generated/graphql'

ChartJS.register(ArcElement, Tooltip, Legend)

const DonationChartTarget = ({
  fundraises,
  currency,
  loading,
}: {
  fundraises: EventOverviewFragment[]
  loading: boolean
  currency?: string
}) => {
  const { theme } = useTheme()

  if (!fundraises || loading)
    return (
      <Box className="w-full flex h-[200px] justify-center items-center text-center">
        <LoadingSpinner size="medium" />
      </Box>
    )

  const raised = fundraises?.[0]?.fundraising?.raised ?? 0
  const goal = fundraises?.[0]?.fundraising?.goal ?? 0

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
            let value = context.label === 'Goal' ? goal : context.parsed
            if (label) {
              label += ': '
            }
            if (context.parsed !== null) {
              label += currency + roundAmount(value)
            }
            return label
          },
        },
      },
    },
  }

  const total = goal === 0 ? 100 : roundAmount((raised / goal) * 100 || 0)
  const remains = raised > goal ? 0 : goal - raised

  const chartData = {
    labels: ['Total Raised', 'Goal'],
    datasets: [
      {
        data: [raised, remains],
        backgroundColor: [theme.tealColour, '#b9eaff'],
        borderWidth: 0,
      },
    ],
  }

  return (
    <Box className="w-full min-h-[300px] relative">
      <Box className="absolute w-full top-[140px]">
        <Box className="display-block -z-1">Total Raised</Box>
        <Box
          className="text-3xl font-bold"
          style={{ color: `${theme.tealColour}` }}
        >
          {total}%
        </Box>
      </Box>
      <Box className="w-full min-h-[300px] relative">
        <Doughnut data={chartData} options={doughnutOptions} />
      </Box>
    </Box>
  )
}

export default DonationChartTarget
