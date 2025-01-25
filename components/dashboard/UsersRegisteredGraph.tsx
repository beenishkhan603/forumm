import React from 'react'
import { Bar } from 'react-chartjs-2'
import { useDashboard } from '@libs/useDashboard'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import moment from 'moment'
import AllUsers from './AllUsers'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

export default function UsersRegisteredGraph({
  selectedOption,
}: {
  selectedOption: string | undefined
}) {
  const { theme } = useTheme()
  const { dataAllYears, dataMonthsCurrentYear, currentYear, dataMonth } =
    useDashboard()

  return (
    <Box className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <Box
        color="foregroundColour"
        className="px-6 py-8 lg:col-span-7 h-96 sm:h-96 "
      >
        <Box className="text-md font-bold" style={{ color: theme.textColour }}>
          {selectedOption === 'All Time Information'
            ? 'Registered Users For All Years'
            : selectedOption === 'Current Year'
            ? `Registered Users For ${currentYear}`
            : selectedOption === 'Current Month'
            ? `Registered Users For ${moment().format('MMMM YYYY')}`
            : 'All Registered Users '}
        </Box>

        <Bar
          options={options as any}
          data={
            selectedOption === 'All Time Information'
              ? dataAllYears
              : selectedOption === 'Current Year'
              ? (dataMonthsCurrentYear as any)
              : selectedOption === 'Current Month'
              ? dataMonth === null || dataMonth === undefined
                ? 'No Data'
                : dataMonth
              : dataAllYears
          }
        />
      </Box>
      <Box className="lg:col-span-5 h-full md:h-96">
        <AllUsers selectedOption={selectedOption} />
      </Box>
    </Box>
  )
}
