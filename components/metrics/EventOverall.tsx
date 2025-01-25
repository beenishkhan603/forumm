import Box from '@components/base/Box'
import { useMemo } from 'react'
import LoadingSpinner from '@components/base/LoadingSpinner'
import Text from '@components/base/Text'
import { useTheme } from '@libs/useTheme'
import type { Event, EventAttendee } from '@graphql/__generated/graphql'
import { getTicketInfo } from '@libs/Utility/util'
import { OptType } from '@libs/Utility/util'

const getStatus = (attendee: EventAttendee) => {
  if (attendee.checkInStatus) {
    return attendee.checkInStatus
  }
  if (attendee.registered && !attendee.checkInStatus) {
    return 'Registered'
  }
  return 'Pending'
}

const EventsOverall = ({
  events,
  loading,
  filterEvents,
}: {
  events: Event[]
  loading: boolean
  filterEvents: OptType
}) => {
  const { theme } = useTheme()

  const overallData = useMemo(() => {
    if (events) {
      const attendees = events.flatMap((event) => event.attendees ?? [])
      const tickets = attendees.map((attendee) => attendee.ticketTitle)
      const ticketCounts = tickets.reduce<{ [key: string]: number }>(
        (acc, ticket) => {
          acc[ticket] = (acc[ticket] || 0) + 1
          return acc
        },
        {}
      )

      const ticketInfo = getTicketInfo(events)
      const totalTicketRevenue = ticketInfo.reduce(
        (acc, { totalRevenue }) => acc + totalRevenue,
        0
      )

      const totalSpeakers = events.reduce(
        (acc, event) => acc + (event.speakers?.length ?? 0),
        0
      )

      const mostAttendedEvent = events.reduce((maxEvent, event) => {
        const joinedCount =
          event.attendees?.filter((at) => at && getStatus(at) === 'present')
            .length ?? 0
        const maxJoinedCount =
          maxEvent.attendees?.filter((at) => at && getStatus(at) === 'present')
            .length ?? 0
        return joinedCount > maxJoinedCount ? event : maxEvent
      }, events[0])

      const percentAttended =
        attendees.length > 0
          ? (
              (attendees.filter((at) => at && getStatus(at) === 'present')
                .length /
                attendees.length) *
              100
            ).toFixed(2)
          : 0

      const mostSoldTicketType =
        Object.keys(ticketCounts).length > 0
          ? Object.keys(ticketCounts).reduce((a, b) =>
              ticketCounts[a] > ticketCounts[b] ? a : b
            )
          : 'None'

      return {
        totalEvents: events.length,
        mostAttendedEvent: mostAttendedEvent?.event?.title,
        percentAttended,
        totalTickets: tickets.length,
        mostSoldTicketType,
        totalTicketRevenue,
        totalSpeakers,
      }
    }
    return undefined
  }, [events])

  if (!events || loading || !overallData)
    return (
      <Box
        color="foregroundColour"
        className="flex-1 min-h-[300px] max-h-[500px] rounded-3xl border shadow-md border-forumm-menu-border p-5"
      >
        <Box className="w-full flex h-[325px] justify-center items-center text-center">
          <LoadingSpinner size="medium" />
        </Box>
      </Box>
    )

  const isAllEventsSelected = filterEvents.id === ''

  return (
    <Box
      color="foregroundColour"
      className="flex-1 min-h-[300px] max-h-[500px] rounded-3xl border shadow-md border-forumm-menu-border p-5 overflow-y-scroll"
    >
      <Box className="text-left mb-5">
        <Text className="mb-5 text-lg xl:text-xl">Overall Performance</Text>

        {isAllEventsSelected && (
          <>
            <Box className="w-full flex flex-row justify-between items-center mb-5">
              <Box className="relative text-start text-sm">Total Event(s)</Box>
              <Box
                className="relative font-bold text-end"
                style={{ color: `${theme.tealColour}` }}
              >
                {overallData.totalEvents}
              </Box>
            </Box>

            <Box className="w-full flex flex-row justify-between items-center mb-5">
              <Box className="relative text-start text-sm">
                Most Attended Event
              </Box>
              <Box
                className="relative font-bold text-end text-sm"
                style={{ color: `${theme.tealColour}` }}
              >
                {overallData.mostAttendedEvent}
              </Box>
            </Box>
          </>
        )}

        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">
            Percent of Attendees That Joined
          </Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {overallData.percentAttended}%
          </Box>
        </Box>

        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">Tickets Sold</Box>
          <Box
            className="relative font-bold text-end  text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {overallData.totalTickets}
          </Box>
        </Box>

        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">Most Sold Ticket</Box>
          <Box
            className="relative font-bold text-end  text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {overallData.mostSoldTicketType}
          </Box>
        </Box>

        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">
            Total Ticket Revenue
          </Box>
          <Box
            className="relative font-bold text-end  text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            ${overallData.totalTicketRevenue.toFixed(2)}
          </Box>
        </Box>

        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">Number of Speakers</Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {overallData.totalSpeakers}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default EventsOverall
