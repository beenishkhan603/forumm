import { useMemo } from 'react'
import Box from '@components/base/Box'
import { Doughnut } from 'react-chartjs-2'
import { useTheme } from '@libs/useTheme'
import { roundAmount } from '@libs/Utility/util'
import type { Event } from '@graphql/__generated/graphql'
import { getTicketInfo } from '@libs/Utility/util'

const EventChartProfit = ({
  events,
  currency = '£',
}: {
  events: Event[]
  currency?: string
}) => {
  const { theme } = useTheme()

  const ticketInfo = useMemo(() => getTicketInfo(events), [events])
  const paidTicketInfo = ticketInfo.filter((ticket) => ticket.ticketPrice > 0)
  const totalRevenue = ticketInfo.reduce(
    (acc, { totalRevenue }) => acc + totalRevenue,
    0
  )

  const chartData = {
    labels: paidTicketInfo.map((info) => info.ticketType),
    datasets: [
      {
        data: paidTicketInfo.map((info) => info.totalRevenue),
        backgroundColor: [
          theme.tealColour,
          '#7BB1BE',
          '#ABCED8',
          '#B4CFFF',
          '#FFD700',
          '#FF6347',
          '#ADFF2F',
        ],
        borderWidth: 1,
      },
    ],
  }

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
            let label = context.label || ''
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

  return (
    <div className="w-full min-h-[300px] relative">
      <Box className="absolute w-full top-[140px]">
        <Box className="text-xl font-bold display-block">Total Revenue</Box>
        <Box
          className="text-3xl font-bold"
          style={{ color: `${theme.tealColour}` }}
        >
          {currency}
          {roundAmount(totalRevenue || 0)}
        </Box>
      </Box>
      <Box className="w-full min-h-[300px] relative">
        <Doughnut data={chartData} options={doughnutOptions} />
      </Box>
    </div>
  )
}

export default EventChartProfit
