import { Button } from '@components/inputs/Button'
import { EventBreakoutRoom } from '@graphql/__generated/graphql'
import { useEvent } from '@libs/useEvent'
import { useTheme } from '@libs/useTheme'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DefaultThumbnail from '@public/images/default-thumbnail.png'
import Box from '../base/Box'
import BreakoutRoomModal from './BreakOutRoomModal'

export const RoomsCarousel = ({
  breakoutRooms,
}: {
  breakoutRooms?: EventBreakoutRoom[]
}) => {
  const { theme } = useTheme()
  const { push } = useRouter()
  const {
    event,
    refreshBreakoutRooms: { startPolling, stopPolling },
  } = useEvent()

  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedRoom, setSelectedRoom] = useState<
    EventBreakoutRoom | undefined
  >()

  useEffect(() => {
    if (startPolling) startPolling(5000)
    return () => {
      if (stopPolling) stopPolling()
    }
  }, [startPolling, stopPolling])

  const handleRoomClick = (room: EventBreakoutRoom) => {
    setSelectedRoom(room)
    setShowModal(true)
  }

  return (
    <Box className="flex flex-wrap">
      {breakoutRooms?.map((s) => (
        <Box
          key={s.title}
          className="w-64 rounded-xl text-center text-white p-6 flex flex-col mr-4 mt-4 relative overflow-clip border border-forumm-menu-border"
          style={{ backgroundColor: theme.foregroundColour }}
          onClick={() => handleRoomClick(s)}
        >
          <Image
            alt="Thumbnail"
            src={s.thumbnailImage ?? DefaultThumbnail}
            width={500}
            height={500}
            className="absolute left-0 top-0 rounded-top h-64 w-64 object-cover"
          />
          <Box className="bg-black z-10 mt-64 p-1 bg-opacity-60 !text-white">
            {s.title}
          </Box>
          <Box className="mb-4 mt-6">{s.description}</Box>
          <Box className="mb-4 flex items-center justify-center text-center space-x-2">
            {s.totalUsers !== 0 && (
              <span className="inline-block w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
            )}
            <span>
              {/* Agora Screenshare requires 2 clients per user */}
              {s.totalUsers}/{s.maxAttendees / 2} users
            </span>
          </Box>
          <Button
            className="mt-auto"
            title={s.totalUsers < s.maxAttendees ? 'Join Room' : 'Room Full'}
            type={s.totalUsers < s.maxAttendees ? 'primary' : 'tertiary'}
            onClick={() => {
              if (s.totalUsers < s.maxAttendees) {
                push(
                  `/event/${event?.eventId}/breakout-rooms/${encodeURIComponent(
                    s.title
                  )}`
                )
              }
            }}
          />
        </Box>
      ))}
      <BreakoutRoomModal
        show={showModal}
        setShow={setShowModal}
        room={selectedRoom}
      />
    </Box>
  )
}

export default RoomsCarousel
