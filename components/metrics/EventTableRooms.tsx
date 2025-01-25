import { useState, useMemo } from 'react'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { TextInput } from '@components/inputs/TextInput'
import { useTheme } from '@libs/useTheme'
import BreakoutRoomModal from '@components/event/BreakOutRoomModal'
import type {
  Event,
  EventBreakoutRoom,
  Statistic,
} from '@graphql/__generated/graphql'

const getFiltered = (
  breakoutRooms: (EventBreakoutRoom | null | undefined)[],
  filter: string
): EventBreakoutRoom[] => {
  if (!filter)
    return breakoutRooms.filter(
      (room): room is EventBreakoutRoom => room !== null && room !== undefined
    )
  const lowercasedSearchText = filter.toLowerCase()
  return (breakoutRooms || []).filter((room): room is EventBreakoutRoom => {
    return (
      room !== null &&
      room !== undefined &&
      room.title?.toLowerCase().includes(lowercasedSearchText)
    )
  })
}

const EventTableRooms = ({
  events,
  metrics,
}: {
  events: Event[]
  metrics: Statistic[]
}) => {
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  const [filter, setFilter] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedRoom, setSelectedRoom] = useState<
    EventBreakoutRoom | undefined
  >()

  const calculateMetricsUser = (eventId: string, title: string) => {
    const encodedTitle = encodeURIComponent(title)
    const urlPattern = `${eventId}/breakout-rooms/${encodedTitle}`
    const uniqueUsers = new Set()
    metrics.forEach((metric: Statistic) => {
      if (metric.url && metric.url.includes(urlPattern) && metric.anonymousId) {
        uniqueUsers.add(metric.anonymousId)
      }
    })
    return uniqueUsers.size
  }

  const breakoutRooms = events.flatMap((row) =>
    row.breakoutRooms
      ? row.breakoutRooms.map((breakoutRoom) => ({
          ...breakoutRoom,
          eventId: row.eventId,
          metricUsers: calculateMetricsUser(row.eventId, breakoutRoom.title),
        }))
      : []
  )

  const filteredData = useMemo(() => {
    return getFiltered(breakoutRooms, filter).sort((a, b) =>
      (a?.title ?? '').localeCompare(b?.title ?? '')
    )
  }, [breakoutRooms, filter])

  const ellipsis = (str: string, len?: number) =>
    str && str.length > (len || 20) ? str.slice(0, len || 20) + '...' : str

  const handlePressRoom = (room: EventBreakoutRoom) => {
    setSelectedRoom(room)
    setShowModal(true)
  }

  return (
    <Box
      color="foregroundColour"
      className="flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-3 sm:p-5 h-full"
    >
      <Box className="flex flex-col h-full">
        <Box className="flex flex-row w-full justify-between items-center mb-8 min-h-10">
          <Text className="text-lg xl:text-xl min-w-[150px] translate-y-2">
            Breakout Rooms
          </Text>
          <Box className="max-h-[1rem] -translate-y-7 md:min-w-[300px]">
            <TextInput
              value={filter}
              className="w-full max-h-[10px]"
              placeholder="Enter your search terms"
              onChange={setFilter}
            />
          </Box>
        </Box>
        <Box
          className="flex-1 overflow-y-scroll scrollbar-hide"
          style={{ maxHeight: 'calc(100vh - 420px)' }}
        >
          <Box
            className={`w-full flex flex-row ${
              isDarkTheme ? 'bg-dark' : 'bg-forumm-light-gray'
            } rounded-t-xl py-2 mb-5 sticky top-0 z-10`}
          >
            <Box className="flex-1 font-bold text-start text-sm ml-4">
              Room Name
            </Box>
            <Box className="flex-1 font-bold text-sm">Total Users</Box>
          </Box>
          {(filteredData || []).map((at: EventBreakoutRoom) => {
            return (
              <Box
                key={`${at.channelName}-${at.title}`}
                className="flex flex-row items-center mb-4 cursor-pointer"
                onClick={() => handlePressRoom(at)}
              >
                <Box className="flex-1 flex flex-row justify-start text-sm ml-4">
                  <Box
                    className="w-[30px] h-[30px] rounded-full translate-y-[-4px] mr-2 bg-cover"
                    style={{
                      backgroundImage: `url(${
                        at.thumbnailImage
                          ? at.thumbnailImage
                          : 'https://assets.tumblr.com/images/default_header/optica_pattern_11.png'
                      })`,
                    }}
                  />{' '}
                  {ellipsis(at.title)}
                </Box>
                <Box className="flex-1 text-sm">
                  {at.totalUsers}/{at.maxAttendees}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
      <BreakoutRoomModal
        show={showModal}
        setShow={setShowModal}
        room={selectedRoom}
      />{' '}
    </Box>
  )
}

export default EventTableRooms
