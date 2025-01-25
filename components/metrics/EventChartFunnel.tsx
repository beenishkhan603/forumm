import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { Event, EventAttendee } from '@graphql/__generated/graphql'
import { useTheme } from '@libs/useTheme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const getStatus = (attendee: EventAttendee) => {
  if (attendee.checkInStatus) {
    return attendee.checkInStatus
  }
  if (attendee.registered && !attendee.checkInStatus) {
    return 'Registered'
  }
  return 'Pending'
}

const EventChartFunnel = ({ events }: { events: Event[] }) => {
  const { theme } = useTheme()

  const overallData = useMemo(() => {
    if (events) {
      const attendees = events.flatMap((row) => row.attendees ?? [])
      return {
        all: attendees.length,
        invited: attendees.filter((at) => at && getStatus(at) === 'Pending')
          .length,
        joined: attendees.filter((at) => at && getStatus(at) === 'present')
          .length,
        registered: attendees.filter(
          (at) =>
            (at && getStatus(at) === 'Registered') ||
            getStatus(at) === 'present'
        ).length,
      }
    }
    return undefined
  }, [events])

  const data = {
    labels: [
      `Attendees Invited (${overallData?.all ?? 0})`,
      `Attendees Registered (${overallData?.registered ?? 0})`,
      `Attendees Attended (${overallData?.joined ?? 0})`,
    ],
    datasets: [
      {
        label: 'Conversion',
        data: [
          overallData?.all ?? 0,
          overallData?.registered ?? 0,
          overallData?.joined ?? 0,
        ],
        backgroundColor: ['#b9eaff', '#49d9ff', '#0097bf'],
        barThickness: 60,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
        barThickness: 'flex',
        categoryPercentage: 1.0,
        barPercentage: 1.0,
        ticks: {
          color: theme.textColour,
          font: {
            size: 14,
          },
        },
      },
    },
  }

  return (
    <div className="w-full min-h-[300px] max-h-[300px] relative">
      {/* @ts-ignore */}
      <Bar data={data} options={options} />
    </div>
  )
}

export default EventChartFunnel
