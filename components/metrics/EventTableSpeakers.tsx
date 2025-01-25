import { useState, useMemo } from 'react'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { TextInput } from '@components/inputs/TextInput'
import { useTheme } from '@libs/useTheme'
import type { Event, EventSpeaker } from '@graphql/__generated/graphql'
import { v4 } from 'uuid'
import SpeakerModal from '@components/event/SpeakerModal'

const getFiltered = (
  speakers: (EventSpeaker | null | undefined)[],
  filter: string
) => {
  if (!filter || !speakers) return speakers
  const lowercasedSearchText = filter.toLowerCase()
  return (speakers || []).filter(
    (speaker) =>
      speaker?.name?.toLowerCase().includes(lowercasedSearchText) ||
      speaker?.email?.toLowerCase().includes(lowercasedSearchText)
  )
}

const EventTableSpeakers = ({
  events,
  showEventColumn,
}: {
  events: Event[]
  showEventColumn: boolean
}) => {
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  const [filter, setFilter] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedSpeaker, setSelectedSpeaker] = useState<
    EventSpeaker | undefined
  >()

  const speakersWithEventTitles = (events || []).flatMap((event) =>
    (event?.speakers || []).map((speaker: EventSpeaker) => ({
      ...speaker,
      eventTitle: event?.event?.title ?? '',
      uniqueKey: `${speaker.email}-${event?.event?.title ?? ''}-${v4()}`,
    }))
  )

  const filteredData = useMemo(() => {
    const result = getFiltered([...speakersWithEventTitles], filter).sort(
      (a, b) => (a?.name ?? '').localeCompare(b?.name ?? '')
    )
    return result
  }, [speakersWithEventTitles, filter])

  const ellipsis = (str: string, len?: number) =>
    str && str.length > (len || 11) ? str.slice(0, len || 11) + '...' : str

  const handlePressSpeaker = (speaker: EventSpeaker) => {
    setSelectedSpeaker(speaker)
    setShowModal(true)
  }

  return (
    <Box
      color="foregroundColour"
      className="flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-3 sm:p-5"
    >
      <Box className="flex flex-row w-full justify-between items-center mb-8 min-h-10">
        <Text className="text-lg xl:text-xl min-w-[120px] translate-y-2">
          All Speakers
        </Text>
        <Text className="text-sm min-w-[120px] translate-y-2">
          Total Speakers: {filteredData.length}
        </Text>
        <Box className="max-h-[1rem] -translate-y-7 md:min-w-[300px]">
          <TextInput
            value={filter}
            className="w-full max-h-[10px]"
            placeholder="Search for Speaker"
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
            Speaker
          </Box>
          {showEventColumn && (
            <Box className="flex-1 font-bold text-sm">Event</Box>
          )}
          <Box className="flex-1 font-bold text-sm">Position</Box>
          <Box className="flex-1 font-bold text-sm">Organization</Box>
        </div>

        {(filteredData || []).map((row: any) => {
          return (
            <Box
              key={row.uniqueKey}
              className="flex flex-row items-center mb-4 cursor-pointer mt-4"
              onClick={() => handlePressSpeaker(row)}
            >
              <Box className="flex-1 flex flex-row text-start justify-start text-sm ml-4">
                {row?.name}
              </Box>
              {showEventColumn && (
                <Box className="flex-1 text-sm">{row.eventTitle}</Box>
              )}

              <Box className="flex-1 text-ellipsis text-sm">
                {row?.position}
              </Box>
              <Box className="flex-1 text-sm">{row?.organization}</Box>
            </Box>
          )
        })}
      </Box>
      <SpeakerModal
        key={selectedSpeaker?.email}
        show={showModal}
        setShow={setShowModal}
        speaker={selectedSpeaker}
      />
    </Box>
  )
}

export default EventTableSpeakers
