import { useState, useMemo } from 'react'
import Box from '@components/base/Box'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { DateTimeInput } from '@components/inputs/DateTimeInput'
import Text from '@components/base/Text'
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
import moment from 'moment'
import { useTheme } from '@libs/useTheme'
import type { Statistic } from '@graphql/__generated/graphql'
import { getUniqueUsersDonation, getTotalUsersDonation } from '@libs/Utility/util'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const DonationChartUsers = ({ metrics }: { metrics: Statistic[] }) => {
  const { theme } = useTheme()
  const filterOptions = [
    'All time',
    'Last Six Months',
    'Last Month',
    'Last Week',
    'Last 3 days',
    'Custom',
  ]
  const [filter, setFilter] = useState<string>(filterOptions[0])
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const processedData = useMemo(() => {
    const now = moment()
    let filteredMetrics = metrics;
    switch (filter) {
      case 'Last Six Months':
        filteredMetrics = metrics.filter((metric) => moment(metric.datetime).isAfter(now.clone().subtract(6, 'months')))
        break
      case 'Last Month':
        filteredMetrics = metrics.filter((metric) => moment(metric.datetime).isAfter(now.clone().subtract(1, 'month')))
        break
      case 'Last Week':
        filteredMetrics = metrics.filter((metric) => moment(metric.datetime).isAfter(now.clone().subtract(1, 'week')))
        break
      case 'Last 3 days':
        filteredMetrics = metrics.filter((metric) => moment(metric.datetime).isAfter(now.clone().subtract(3, 'days')))
        break
      case 'Custom':
        if (startDate) {
          const startMoment = moment(startDate).startOf('day')
          filteredMetrics = filteredMetrics.filter((metric) => moment(metric.datetime).isSameOrAfter(startMoment))
        }
        if (endDate) {
          const endMoment = moment(endDate).endOf('day')
          filteredMetrics = filteredMetrics.filter((metric) => moment(metric.datetime).isSameOrBefore(endMoment))
        }
        break
      default:
        break
    }

    const uniqueUsersList = getUniqueUsersDonation(filteredMetrics, filter)
    const totalUsersList = getTotalUsersDonation(filteredMetrics, filter)

    return {
      uniqueUsersList,
      totalUsersList,
    };
  }, [metrics, filter, startDate, endDate]);

  const totalUniqueUsers = processedData.uniqueUsersList.length;
  const totalUsersPerDay = processedData.totalUsersList.reduce((acc, { datetime, userId }) => {
    const date = moment(datetime).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = new Set();
    }
    acc[date].add(userId);
    return acc;
  }, {} as { [key: string]: Set<string> });

  const sortedDates = Object.keys(totalUsersPerDay).sort();
  const userData = sortedDates.map((date) => totalUsersPerDay[date].size);
  const userLabels = sortedDates.map((date) => moment(date).format('Do MMM'));

  const chartData = {
    labels: userLabels,
    datasets: [
      {
        label: 'Unique users per day',
        data: userData,
        backgroundColor: theme.tealColour,
        borderColor: theme.tealColour,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.textColour,
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        ticks: {
          color: theme.textColour,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Unique users per day',
        color: theme.textColour,
      },
    },
  };

  return (
    <Box
      color="foregroundColour"
      className="relative flex-1 rounded-3xl border shadow-md border-forumm-menu-border p-5 pb-12"
    >
      <Box className="absolute flex-row w-full justify-between mb-4 z-10 flex pr-10">
        <Text className="text-lg xl:text-xl">User Traffic</Text>
        <Box className="max-h-[1rem] -translate-y-5 flex">
          {filter === 'Custom' && (
            <div className="translate-y-7 flex">
              <DateTimeInput
                id={'metrics-date-start'}
                value={startDate}
                onChange={(data) => setStartDate(data)}
                className="mr-2"
                inputClass="h-10 rounded-md max-w-[140px] text-xs"
                placeholderText="From"
                clickIdOnChange="metrics-date-end"
                dateOnly={true}
                required
              />
              <DateTimeInput
                id={'metrics-date-end'}
                value={endDate}
                onChange={(data) => setEndDate(data)}
                inputClass="h-10 rounded-md max-w-[140px] text-xs"
                placeholderText="To"
                dateOnly={true}
                required
              />
            </div>
          )}
          <DropdownInput
            className="w-[8rem] border-none"
            options={filterOptions}
            onChange={(data) => {
              setFilter(data)
            }}
            value={filter}
            noBorder
          />
        </Box>
      </Box>
      <div className="w-full min-h-[300px] max-h-[300px] relative pt-16">
        <Box
          className="relative text-3xl font-bold text-start"
          style={{ color: `${theme.tealColour}` }}
        >
        </Box>
        <Bar data={chartData} options={options} />
      </div>
    </Box>
  )
}

export default DonationChartUsers
