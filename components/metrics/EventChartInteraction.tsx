import { useMemo, useState } from 'react'
import Box from '@components/base/Box'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { Doughnut } from 'react-chartjs-2'
import { useTheme } from '@libs/useTheme'
import { roundAmount } from '@libs/Utility/util'
import type { Event, Statistic } from '@graphql/__generated/graphql'
import { uniqBy, sortBy } from 'lodash'

ChartJS.register(ArcElement, Tooltip, Legend)

type ViewOption =
  | 'interactions'
  | 'viewedContent'
  | 'viewedAgenda'
  | 'joinedRoom'

const labelMapping: { [key in ViewOption]: string } = {
  interactions: 'Joined',
  viewedContent: 'Viewed on Demand Content',
  viewedAgenda: 'Viewed Agenda',
  joinedRoom: 'Joined Breakout Room',
}

const absentLabelMapping: { [key in ViewOption]: string } = {
  interactions: 'Absent',
  viewedContent: "Didn't View Content",
  viewedAgenda: "Didn't View Agenda",
  joinedRoom: "Didn't Join Room",
}

const EventChartInteraction = ({
  events,
  metrics,
}: {
  events: Event[]
  metrics: Statistic[]
}) => {
  const { theme } = useTheme()
  const [selectedView, setSelectedView] = useState<ViewOption>('interactions')

  const overallData = useMemo(() => {
    if (events && metrics) {
      const attendees = events.flatMap((row) => row.attendees)
      const present = metrics.filter((log) =>
        (log?.url ?? '').includes('event')
      )
      const agendaViews = sortBy(
        uniqBy(
          metrics.filter((log) => (log?.url ?? '').includes('breakout-rooms')),
          'name'
        ),
        'anonymousId'
      )
      const onDemandviews = sortBy(
        uniqBy(
          metrics.filter((log) => (log?.url ?? '').includes('on-demand')),
          'name'
        ),
        'anonymousId'
      )
      const breakOutViews = sortBy(
        uniqBy(
          metrics.filter((log) => (log?.url ?? '').includes('breakout-rooms')),
          'name'
        ),
        'anonymousId'
      )

      const allInteractions = [
        ...breakOutViews,
        ...onDemandviews,
        ...agendaViews,
      ]
      const unique = sortBy(uniqBy(present, 'name'), 'anonymousId')

      return {
        all: attendees.length,
        interactions: unique.length,
        viewedContent: onDemandviews.length,
        joinedRoom: breakOutViews.length,
        viewedAgenda: agendaViews.length,
      }
    }
    return {
      all: 0,
      interactions: 0,
      viewedContent: 0,
      joinedRoom: 0,
      viewedAgenda: 0,
    }
  }, [events, metrics])

  if (overallData.interactions > overallData.all)
    overallData.interactions = overallData.all

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
          generateLabels: (chart: any) => {
            return chart.data.labels.map((label: string, index: number) => ({
              text: label,
              fillStyle: chart.data.datasets[0].backgroundColor[index],
              hidden: false,
              index,
            }))
          },
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
    labels: [
      `${overallData[selectedView as keyof typeof overallData]} ${
        labelMapping[selectedView]
      }`,
      `${
        overallData.all - overallData[selectedView as keyof typeof overallData]
      } ${absentLabelMapping[selectedView]}`,
    ],
    datasets: [
      {
        data: [
          overallData[selectedView as keyof typeof overallData],
          overallData.all -
            overallData[selectedView as keyof typeof overallData],
        ],
        backgroundColor: [theme.tealColour, '#eee'],
        borderColor: [theme.tealColour, '#ccc'],
        borderWidth: 1,
      },
    ],
  }

  const attendancePercenge =
    overallData[selectedView as keyof typeof overallData] > 0
      ? Math.round(
          (overallData[selectedView as keyof typeof overallData] /
            overallData.all) *
            100
        )
      : 0

  return (
    <div className="w-full min-h-[400px] relative">
      <Box className="w-full flex justify-center mt-4 mb-8">
        <select
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value as ViewOption)}
          className="border p-2 rounded"
        >
          {Object.keys(labelMapping).map((key) => (
            <option key={key} value={key}>
              {labelMapping[key as ViewOption]}
            </option>
          ))}
        </select>
      </Box>
      <Box className="w-full min-h-[300px] relative">
        <Doughnut data={chartData} options={doughnutOptions} />
        <Box className="absolute inset-0 flex flex-col items-center justify-center">
          <Box className="text-xl font-bold display-block">
            {labelMapping[selectedView]}
          </Box>
          <Box
            className="text-3xl font-bold"
            style={{ color: `${theme.tealColour}` }}
          >
            {overallData.all > 0 ? `${attendancePercenge}%` : `0%`}
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default EventChartInteraction
