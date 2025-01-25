import { useState, useMemo } from 'react'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { TextInput } from '@components/inputs/TextInput'
import { useTheme } from '@libs/useTheme'
import type { Event, EventOndemandContent } from '@graphql/__generated/graphql'
import { v4 } from 'uuid'
import NoData from '@components/metrics/NoData'

const getFiltered = (
  contents: (EventOndemandContent | null | undefined)[],
  filter: string
) => {
  if (!filter || !contents) return contents
  const lowercasedSearchText = filter.toLowerCase()
  return (contents || []).filter(
    (content) =>
      content?.title?.toLowerCase().includes(lowercasedSearchText) ||
      content?.description?.toLowerCase().includes(lowercasedSearchText)
  )
}

const EventOnDemandTable = ({
  events,
  showEventColumn,
}: {
  events: Event[]
  showEventColumn: boolean
}) => {
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  const [filter, setFilter] = useState<string>('')

  const contentsWithEventTitles = (events || []).flatMap((event) =>
    (event?.ondemandContent || []).map((content: EventOndemandContent) => ({
      ...content,
      eventTitle: event?.event?.title ?? '',
      uniqueKey: `${content.id}-${event?.event?.title ?? ''}-${v4()}`,
    }))
  )

  const filteredData = useMemo(() => {
    const result = getFiltered([...contentsWithEventTitles], filter).sort(
      (a, b) => (a?.title ?? '').localeCompare(b?.title ?? '')
    )
    return result
  }, [contentsWithEventTitles, filter])

  const ellipsis = (str: string, len?: number) =>
    str && str.length > (len || 20) ? str.slice(0, len || 20) + '...' : str

  return (
    <Box
      color="foregroundColour"
      className="flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-3 sm:p-5"
    >
      <Box className="flex flex-row w-full justify-between items-center mb-8 min-h-10">
        <Text className="text-lg xl:text-xl min-w-[120px] translate-y-2">
          On-demand Content Access
        </Text>
        <Box className="max-h-[1rem] -translate-y-6 md:min-w-[300px]">
          <TextInput
            value={filter}
            className="w-full max-h-[10px]"
            placeholder="Enter your search terms"
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
          <Box className="flex-1 font-bold text-start text-sm ml-4">title</Box>
          {showEventColumn && (
            <Box className="flex-1 font-bold text-sm">Event</Box>
          )}
          <Box className="flex-1 font-bold text-sm">Description</Box>
          <Box className="flex-2 font-bold text-sm">URL</Box>
        </div>

        {(filteredData || []).map((row: any) => {
          return (
            <Box
              key={row.uniqueKey}
              className="flex flex-row items-center mb-4"
            >
              <Box className="flex-1 flex flex-row text-ellipsis justify-start text-sm ml-4">
                {row.title}
              </Box>
              {showEventColumn && (
                <Box className="flex-1 text-ellipsis text-sm">
                  {row.eventTitle}
                </Box>
              )}
              <Box className="flex-1 text-ellipsis text-sm">
                {row.description}
              </Box>
              <Box className="flex-2 text-ellipsis text-sm">
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue' }}
                >
                  {ellipsis(row.url, 30)}
                </a>
              </Box>
            </Box>
          )
        })}
        {filteredData.length === 0 && <NoData />}
      </Box>
    </Box>
  )
}

export default EventOnDemandTable
