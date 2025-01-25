import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { useDashboard } from '@libs/useDashboard'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { User } from '@graphql/__generated/graphql'
import Box from '@components/base/Box'
import AllUsers from './AllUsers'

ChartJS.register(ArcElement, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

export default function EventGraph({
  selectedOption,
}: {
  selectedOption: string | undefined
}) {
  const { users, attendeeData } = useDashboard()

  return (
    <Box className="grid grid-cols-1 lg:grid-cols-4 gap-4 justify-center">
      <Box
        color="foregroundColour"
        className="px-6 py-8 flex md:block lg:col-span-2 h-full md:h-96 "
      >
        <Box className="text-white text-md ">Attendee Information</Box>

        <Doughnut
          options={options as any}
          data={attendeeData}
          width="400"
          className="mx-auto "
        />
      </Box>
      <Box className="lg:col-span-2  ">
        <AllUsers selectedOption={selectedOption} />
      </Box>
    </Box>
  )
}
