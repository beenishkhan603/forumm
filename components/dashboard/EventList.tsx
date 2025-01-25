import React from 'react'
import moment from 'moment'
import Box from '@components/base/Box'
import TicketTypes from './TicketTypes'
import { AiOutlineMail } from 'react-icons/ai'
import { useDashboard } from '@libs/useDashboard'
import { useRouter } from 'next/router'

export default function EventList({
  selectedOption,
}: {
  selectedOption: string | undefined
}): JSX.Element {
  const router = useRouter()

  const { events, eventsByYear, eventsByMonth, profile, attendees } =
    useDashboard()
  const isAdmin = profile?.groups?.includes('forumm-admin')
  let filteredEvents

  if (selectedOption === 'All Time Information') {
    filteredEvents = events
  } else if (selectedOption === 'Current Year') {
    filteredEvents = eventsByYear?.filter(
      (e) => e.organizerId === profile?.userId,
    )
  } else if (selectedOption === 'Current Month') {
    filteredEvents = eventsByMonth?.filter(
      (e) => e.organizerId === profile?.userId,
    )
  }

  return (
    <Box className="grid lg:grid-cols-3 gap-4">
      <Box
        color="foregroundColour"
        className="px-6 py-4 lg:col-span-2 h-96 overflow-y-scroll"
      >
        <Box className="text-white text-md py-4 font-bold ">Event List</Box>

        <Box
          className={`grid grid-cols-2 sm:grid-cols-6 gap-4 py-2 px-2 rounded`}
          color="backgroundColour"
        >
          <Box className="text-white text-xs ">Title</Box>
          {isAdmin ? <Box className="text-white text-xs ">Owner</Box> : ''}
          <Box className="text-white text-xs ">Date & Time</Box>
          <Box className="text-white text-xs hidden sm:block">Attendees</Box>
          <Box className="text-white text-xs hidden sm:block">Speakers</Box>
          {!isAdmin ? (
            <Box className="text-white text-xs hidden sm:block">Stages</Box>
          ) : (
            ''
          )}
          <Box className="text-white text-xs text-center hidden sm:block">
            Actions
          </Box>
        </Box>
        {events?.length === 0 ? (
          <Box className="text-white text-md py-4 ">No Events</Box>
        ) : (
          filteredEvents?.map((e) => (
            <Box
              key={e.eventId}
              onClick={() => {
                router.push(`/organiser-dashboard/${e.eventId}`)
              }}
              className="grid grid-cols-2 sm:grid-cols-6 gap-4 py-2 px-2 items-center rounded hover:border cursor-pointer hover:scale-100 transition duration-300 ease-in-out"
            >
              <Box className="text-white text-xs sm:block ">
                {e.event?.title === undefined ? 'No Title' : e.event?.title}
              </Box>
              {isAdmin ? (
                <Box className="text-white text-xs ">
                  {e.event?.organizationName ?? 'Unknown'}
                </Box>
              ) : (
                ''
              )}
              <Box className="text-white text-xs sm:block">
                {e.event?.startDateTime === undefined
                  ? 'No Date set yet'
                  : moment(e.event?.startDateTime).format('DD MMM YYYY, HH:mm')}
              </Box>
              <Box className="text-white text-xs text-left hidden sm:block">
                {e.attendees?.length === undefined
                  ? 'No attendees added yet'
                  : e.attendees?.length}
              </Box>
              <Box className="text-white text-xs hidden sm:block">
                {e.speakers?.length === undefined
                  ? 'No speakers added  yet'
                  : e.speakers?.map((s) => s.name).join(', ')}
              </Box>
              {!isAdmin ? (
                <Box className="text-white text-xs hidden sm:block">
                  {e.stages?.length === undefined
                    ? 'No stages added yet'
                    : e.stages?.length}
                </Box>
              ) : (
                ''
              )}
              <Box className="sm:flex justify-center hidden">
                <AiOutlineMail className="text-white text-lg margin-auto cursor-pointer" />
              </Box>
            </Box>
          ))
        )}
      </Box>
      <TicketTypes selectedOption={selectedOption} />
    </Box>
  )
}
