import Box from '@components/base/Box'
import Text from '@components/base/Text'
import EventTableAttendees from '@components/metrics/EventTableAttendees'
import EventTableSpeakers from '@components/metrics/EventTableSpeakers'
import EventOnDemandTable from './EventOnDemadTable'
import EventTableRooms from '@components/metrics/EventTableRooms'
import EventChartFunnel from '@components/metrics/EventChartFunnel'
import EventOverall from '@components/metrics/EventOverall'
import type {
  Statistic,
  Event,
  EventOverviewFragment,
} from '@graphql/__generated/graphql'
import EventChartAttendance from '@components/metrics/EventChartAttendance'
import EventChartInteraction from '@components/metrics/EventChartInteraction'
import EventChartProfit from '@components/metrics/EventChartProfit'
import DonationMap from '@components/metrics/DonationMap'
import DonationChartUsers from '@components/metrics/DonationChartUsers'
import { EventTicket } from '@graphql/__generated/graphql'
import type { OptType } from '../../libs/Utility/util'
import TicketChart from './EventTicket'

const EventTab = ({
  metrics,
  events,
  loading,
  currency,
  fundraises,
  filterEvents,
}: {
  metrics: Statistic[]
  events: Event[]
  loading: boolean
  currency: string
  fundraises: EventOverviewFragment[]
  filterEvents: OptType
}) => {
  const showEventColumn = filterEvents.id === ''

  return (
    <Box className="w-full flex flex-col gap-6 mt-10">
      <Box className="flex flex-col 2xl:flex-row gap-6">
        <EventOverall
          loading={loading}
          events={events}
          filterEvents={filterEvents}
        />
        <Box
          color="foregroundColour"
          className="w-full max-w-[100%] flex-2 min-h-[300px] max-h-[500px] rounded-3xl border shadow-md border-forumm-menu-border p-5"
        >
          <Box className="text-left mb-5">
            <Text className="text-lg xl:text-xl">Event Engagement</Text>
          </Box>
          <EventChartFunnel events={events} />
        </Box>
      </Box>
      <Box className="flex flex-col 2xl:flex-row gap-6">
        <EventTableAttendees
          events={events}
          fundraises={fundraises}
          showEventColumn={showEventColumn}
        />
      </Box>
      <Box className="flex flex-col 2xl:flex-row gap-6">
        <Box
          color="foregroundColour"
          className="flex-1 min-h-[300px] rounded-3xl border shadow-md border-forumm-menu-border p-5"
        >
          <Box className="text-left mb-5">
            <Text className="text-lg xl:text-xl">
              Total Revenue from Tickets
            </Text>
          </Box>
          <EventChartProfit currency={currency} events={events} />
        </Box>
        <TicketChart events={events} />
      </Box>

      <Box className="flex flex-col 2xl:flex-row gap-6">
        <EventTableRooms events={events} metrics={metrics} />
        <Box
          color="foregroundColour"
          className="flex-1 min-h-[300px] rounded-3xl border shadow-md border-forumm-menu-border p-5"
        >
          <Box className="text-left mb-5">
            <Text className="text-lg xl:text-xl">Interaction Percentage</Text>
          </Box>
          <EventChartInteraction events={events} metrics={metrics} />
        </Box>
      </Box>

      <Box className="flex flex-col 2xl:flex-row gap-6">
        <EventOnDemandTable events={events} showEventColumn={showEventColumn} />
      </Box>
      <Box className="flex-1">
        <EventTableSpeakers events={events} showEventColumn={showEventColumn} />
      </Box>

      <Box className="flex flex-col 2xl:flex-row gap-6">
        <DonationChartUsers metrics={metrics} />
        <Box
          color="foregroundColour"
          className="flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-5"
        >
          <Box className="text-left mb-5">
            <Text className="text-lg xl:text-xl">Users by Country</Text>
          </Box>
          <DonationMap metrics={metrics} />
        </Box>
      </Box>
      <Box className="w-full flex flex-col 2xl:flex-row gap-6 mt-10">
        <EventTableSpeakers
          events={events}
          showEventColumn={filterEvents.id === ''}
        />
      </Box>
    </Box>
  )
}

export default EventTab
