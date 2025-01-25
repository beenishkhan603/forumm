import React, { useState } from 'react'
import { TimePeriod } from '@components/dashboard/TimePeriods'
import Box from '@components/base/Box'
import { GET_EVENT_BY_ID } from '@graphql/events/GetEventById'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import EventGraph from '@components/dashboard/EventGraph'
import { GoArrowLeft } from 'react-icons/go'
import { EventDashboardTabs } from '@components/dashboard/ActivityTabs'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { useAuth } from '@libs/useAuth'

export default function EventDashboard(): JSX.Element {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<
    TimePeriod | undefined
  >(TimePeriod.AllTimeInformation)

  const { query, back, push } = useRouter()
  const { isOrganizer, isAdmin } = useAuth()

  const { data, loading } = useQuery(GET_EVENT_BY_ID, {
    variables: { input: { eventId: query.eventId as string } },
  })

  return (
    <Box className="flex flex-col space-y-6 py-8 max-2xl mx-auto px-8">
      <Box
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => back()}
      >
        <GoArrowLeft />
        Back to Organiser Dashboard
      </Box>
      <Box
        className={`text-2xl ${isOrganizer || isAdmin ? 'cursor-pointer' : ''}`}
        onClick={(e) => {
          e.preventDefault()
          if (isOrganizer || isAdmin)
            push(`/event/${data?.getEventById?.eventId}`)
        }}
      >
        Event Dashboard for {data?.getEventById.event?.title}
      </Box>
      <DropdownInput
        value={selectedTimePeriod}
        onChange={(e) => setSelectedTimePeriod(e as TimePeriod)}
        options={Object.values(TimePeriod)}
        label="Select a View"
        className="w-1/2 lg:w-1/4"
      />
      <EventDashboardTabs />
      <EventGraph selectedOption={selectedTimePeriod} />
      {/* <UsersRegisteredGraph selectedOption={selectedTimePeriod} />
      <InfoGrids selectedOption={selectedTimePeriod} />
      <EventList selectedOption={selectedTimePeriod} /> */}
    </Box>
  )
}
