import { Button } from '@components/inputs/Button'
import { EventStage } from '@graphql/__generated/graphql'
import { useEvent } from '@libs/useEvent'
import { useRouter } from 'next/router'
import React from 'react'
import Box from '../base/Box'

export const StagesCarousel = ({ stages }: { stages?: EventStage[] }) => {
  const { push } = useRouter()
  const { event } = useEvent()
  return (
    <Box className="flex flex-wrap" ignoreTheme>
      {stages?.map((s) => (
        <Box
          key={s.title}
          className="w-64 rounded-2xl bg-gray-700 text-center text-white p-6 flex flex-col mr-4 mt-4"
          ignoreTheme
        >
          <Box ignoreTheme>{s.title}</Box>
          <Box className="my-4" ignoreTheme>
            {s.description}
          </Box>
          {s.isLive && (
            <Box className="mb-4 flex items-center justify-center text-center space-x-2">
              <span className="inline-block w-4 h-4 bg-red-600 rounded-full animate-pulse border-2 border-solid border-white"></span>
              <span>Live</span>
            </Box>
          )}
          <Button
            size="auto"
            className="mt-auto"
            title="Watch Live"
            onClick={() =>
              push(
                `/event/${event?.eventId}/stages/${encodeURIComponent(s.title)}`
              )
            }
          />
        </Box>
      ))}
    </Box>
  )
}
