import { useState, useMemo } from 'react'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { TextInput } from '@components/inputs/TextInput'
import { useTheme } from '@libs/useTheme'
import type { Event } from '@graphql/__generated/graphql'
import { getTicketInfo, TicketInfo } from '@libs/Utility/util'

const getFiltered = (tickets: TicketInfo[], filter: string) => {
  if (!filter || !tickets) return tickets
  const lowercasedSearchText = filter.toLowerCase()
  return tickets.filter(
    (ticket) =>
      ticket.ticketType.toLowerCase().includes(lowercasedSearchText) ||
      ticket.eventName.toLowerCase().includes(lowercasedSearchText)
  )
}

const TicketTable = ({ events }: { events: Event[] }) => {
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  const [filter, setFilter] = useState<string>('')

  const ticketInfo = useMemo(() => getTicketInfo(events), [events])

  const filteredData = useMemo(() => {
    const result = getFiltered(ticketInfo, filter).sort((a, b) =>
      a.ticketType.localeCompare(b.ticketType)
    )
    return result
  }, [ticketInfo, filter])

  const isJSON = (str: any) => {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }

  return (
    <Box
      color="foregroundColour"
      className="flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-3 sm:p-5"
    >
      <Box className="flex flex-row w-full justify-between items-center mb-8 min-h-10">
        <Text className="text-lg xl:text-xl min-w-[120px] translate-y-2">
          Tickets Data
        </Text>
        <Box className="max-h-[1rem] -translate-y-6 md:min-w-[300px]">
          <TextInput
            value={filter}
            className="w-full max-h-[10px]"
            placeholder="Search for Ticket"
            onChange={setFilter}
          />
        </Box>
      </Box>
      <Box className="max-h-[300px] overflow-y-scroll scrollbar-hide">
        <div
          className={`w-full flex flex-row ${
            isDarkTheme ? 'bg-dark' : 'bg-forumm-light-gray'
          } rounded-t-xl py-2 mb-5 sticky top-0 z-10`}
        >
          <Box className="flex-1 font-bold text-start text-sm ml-4">
            Ticket Name
          </Box>
          <Box className="flex-1 font-bold text-sm">Event</Box>
          <Box className="flex-1 font-bold text-sm">Tickets Sold</Box>
          <Box className="flex-1 font-bold text-sm">Ticket Price</Box>
          <Box className="flex-1 font-bold text-sm">Revenue</Box>
        </div>

        {filteredData.map((row: TicketInfo) => {
          return (
            <Box
              key={`${row.eventName}-${row.ticketType}`}
              className="flex flex-row items-center mb-4"
            >
              <Box className="flex-1 flex flex-row text-start justify-start text-sm ml-4">
                {isJSON(row.ticketType)
                  ? JSON.parse(row.ticketType).ticketTitle
                  : row.ticketType}
              </Box>
              <Box className="flex-1 text-sm">{row.eventName}</Box>
              <Box className="flex-1 text-sm">{row.ticketsSold}</Box>
              <Box className="flex-1 text-sm">
                £{row.ticketPrice.toFixed(2)}
              </Box>
              <Box className="flex-1 text-sm">
                £{row.totalRevenue.toFixed(2)}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default TicketTable
