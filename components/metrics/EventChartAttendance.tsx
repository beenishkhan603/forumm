import { useMemo } from 'react'
import Box from '@components/base/Box'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { Doughnut } from 'react-chartjs-2'
import { useTheme } from '@libs/useTheme'
import { roundAmount } from '@libs/Utility/util'
import type { Event } from '@graphql/__generated/graphql'
import { over } from 'lodash'

ChartJS.register(ArcElement, Tooltip, Legend)

const EventChartAttendance = ({
  events,
  loading,
}: {
  events: Event[]
  loading: boolean
  currency?: string
}) => {
  const { theme, StaticColours } = useTheme()

  const overallData = useMemo(() => {
    if (events) {
      const attendees = events.flatMap((row) => row.attendees)
      return {
        all: attendees.length,
        joined: attendees.filter(
          (at) =>
            at?.checkInStatus !== 'absent' &&
            (at?.checkInStatus == 'present' || !!at?.registered)
        ).length,
        absent: attendees.filter((at) => at?.checkInStatus === 'absent').length,
      }
    }
    return {
      absent: 0,
      all: 0,
      joined: 0,
    }
  }, [events])

  if (!events)
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
              label += roundAmount(context.parsed)
            }
            return label
          },
        },
      },
    },
  }

  const chartData = {
    labels: ['Joined an event', 'Absent (no-show)', 'Pending'],
    datasets: [
      {
        data: [
          overallData.joined,
          overallData.absent,
          overallData.all - overallData.joined - overallData.absent,
        ],
        backgroundColor: [theme.tealColour, StaticColours.forumm_red, '#eee'],
        borderColor: [theme.tealColour, StaticColours.forumm_red, '#ccc'],
        borderWidth: 1,
      },
    ],
  }

  const attendancePercenge =
    overallData.joined > 0
      ? Math.round((overallData.joined / overallData.all) * 100)
      : 0

  return (
    <div className="w-full min-h-[300px] relative">
      <Box className="absolute w-full top-[140px]">
        <Box className="text-xl font-bold display-block">Attendance</Box>
        <Box
          className="text-3xl font-bold"
          style={{ color: `${theme.tealColour}` }}
        >
          {attendancePercenge}%
        </Box>
      </Box>
      <Box className="w-full min-h-[300px] relative">
        <Doughnut data={chartData} options={doughnutOptions} />
      </Box>
    </div>
  )
}

export default EventChartAttendance
