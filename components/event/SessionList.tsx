import React from 'react'

import ProfileImage from '@components/base/ProfileImage'
import { EventSession } from '@graphql/__generated/graphql'
import { useAuth } from '@libs/useAuth'
import moment from 'moment'
import { useRouter } from 'next/router'
import { TbPodium } from 'react-icons/tb'
import Box from '../base/Box'
import DefaultThumbnail from '@public/images/default-thumbnail.png'
import { v4 } from 'uuid'

export const SessionList = ({
  sessions,
  eventId,
}: {
  sessions: EventSession[]
  eventId: string
}) => {
  const { profile } = useAuth()
  const isAdmin = profile?.groups?.includes('forumm-admin')
  const { push } = useRouter()

  return (
    <Box className="my-4 w-full">
      {/* headers */}
      <Box className="min-w-max">
        <Box className="grid grid-cols-[1fr_2fr_1fr] sm:grid-cols-[1fr_2fr_1fr_1fr] md:grid-cols-[1fr_2fr_2fr_1fr_1fr] font-medium text-md gap-1">
          <Box className="text-left overflow-hidden">When</Box>
          <Box className="text-left overflow-hidden">Title</Box>
          <Box className="text-left overflow-auto hidden md:inline-block">
            Description
          </Box>
          <Box className="text-left overflow-hidden">Stage</Box>
          <Box className="text-left overflow-hidden hidden sm:inline-block">
            Speakers
          </Box>
        </Box>
      </Box>
      {/* rows */}
      {sessions &&
        sessions.map((s, i) => {
          const hasEventStarted =
            moment().isBefore(s.endDateTime) &&
            moment().add(5, 'minutes').isAfter(s.startDateTime)

          const handleClick = () => {
            if (s.stage?.title && !s.isBreak && hasEventStarted)
              push(
                `/event/${eventId}/stages/${encodeURIComponent(s.stage.title)}`
              )
          }

          return (
            <Box
              className={`grid grid-cols-[1fr_2fr_1fr] sm:grid-cols-[1fr_2fr_1fr_1fr] md:grid-cols-[1fr_2fr_2fr_1fr_1fr] pt-4 mb-4 gap-1 p-1 border-t ${hasEventStarted ? 'cursor-pointer' : ''}`}
              key={i}
              data-testid={`sessionList__item_${i}`}
              onClick={handleClick}
            >
              <Box
                className={`text-left overflow-hidden ${
                  s.isBreak ? 'border-l-orange-200' : 'border-l-blue-500'
                }`}
              >
                {moment(s.startDateTime).format('MMM DD, h:mmA')} - <br />
                {moment(s.endDateTime).format('MMM DD, h:mmA')}
              </Box>
              <Box className="text-left overflow-hidden">{s.title}</Box>
              <Box className="text-left overflow-auto hidden md:inline-block">
                {s.description}
              </Box>
              <Box className="text-left items-center justify-center overflow-hidden">
                {!s.isBreak && (
                  <>
                    <TbPodium className="w-5 h-5 mr-2 inline" />
                    <span>{s.stage?.title}</span>
                  </>
                )}
              </Box>
              <Box className="text-left hidden sm:inline-block">
                {s.speakers && s.speakers.length > 0 ? (
                  <Box className="flex">
                    {s.speakers.map((speaker, index) => (
                      <ProfileImage
                        className={`${index > 0 ? '-ml-5' : ''}`}
                        key={speaker?.email ?? v4()}
                        imageUrl={speaker?.profileImage || DefaultThumbnail.src}
                        tooltip={[
                          speaker?.name,
                          speaker?.position,
                          speaker?.organization,
                        ]}
                      />
                    ))}
                  </Box>
                ) : (
                  'No speakers available'
                )}
              </Box>
            </Box>
          )
        })}
    </Box>
  )
}
