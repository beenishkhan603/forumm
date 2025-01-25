import React, { useState } from 'react'
import UsersRegisteredGraph from '@components/dashboard/UsersRegisteredGraph'
import InfoGrids from '@components/dashboard/InfoGrids'
import EventList from '@components/dashboard/EventList'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { TimePeriod } from '@components/dashboard/TimePeriods'
import Box from '@components/base/Box'
import { GoArrowLeft } from 'react-icons/go'
import { useRouter } from 'next/router'
import { useDashboard } from '@libs/useDashboard'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { OrganizerDashboardTabs } from '@components/dashboard/ActivityTabs'
import { Button } from '@components/inputs/Button'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_MERCHANT } from '@graphql/users/createMerchant'
import { GET_IS_MERCHANT } from '@graphql/users/getMerchantAccount'
import { profile } from 'console'
import { ErrorType } from '@libs/ErrorHandler/error.type'

export default function OrganiserDashboard(): JSX.Element {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<
    TimePeriod | undefined
  >(TimePeriod.AllTimeInformation)
  const router = useRouter()
  const { usersLoading, eventsLoading, profile } = useDashboard()

  if (usersLoading || eventsLoading)
    return (
      <Box className="flex justify-center w-full py-24">
        <LoadingSpinner size="medium" />
      </Box>
    )
  return (
    <Box className="flex flex-col py-8 max-2xl mx-auto px-8 ">
      <Box
        className="flex items-center gap-2 cursor-pointer mb-3 "
        onClick={() => router.back()}
      >
        <GoArrowLeft />
        Back to Events
      </Box>

      <Box className="flex flex-col justify-between space-y-6 mb-3 sm:flex-row sm:space-y-0 sm:items-start">
        <Box className="text-2xl">Organiser Dashboard</Box>
        <DropdownInput
          value={selectedTimePeriod}
          onChange={(e) => setSelectedTimePeriod(e as TimePeriod)}
          options={Object.values(TimePeriod)}
          label="Select a View"
          className="w-full sm:w-1/2 lg:w-1/4 "
        />
      </Box>
      <Box className="flex flex-col space-y-6">
        <OrganizerDashboardTabs selectedOption={selectedTimePeriod} />
        <UsersRegisteredGraph selectedOption={selectedTimePeriod} />
        <EventList selectedOption={selectedTimePeriod} />
        <InfoGrids selectedOption={selectedTimePeriod} />
      </Box>
    </Box>
  )
}
