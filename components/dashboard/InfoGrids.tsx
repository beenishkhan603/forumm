import React from 'react'
import Image from 'next/image'
import UserIcon from '@public/images/user-icon.png'
import BreakoutRoom from '@public/images/breakout-room.png'
import Box from '@components/base/Box'
import { EventBreakoutRoom, EventSpeaker } from '@graphql/__generated/graphql'
import { useDashboard } from '@libs/useDashboard'
import AllUsers from './AllUsers'
import AllOrganizers from './AllOrganizers'

const SpeakerList = ({
  speakers,
}: {
  speakers: {
    speaker: EventSpeaker | undefined
    title: string | null | undefined
  }[]
}) => {
  const filteredSpeakers = (speakers || []).filter((s) => s?.title !== undefined)
  return (
    <Box color="foregroundColour" className="px-6 py-4 h-96 overflow-y-scroll">
      <Box className="text-white text-md py-4 font-bold ">Speakers</Box>
      {filteredSpeakers?.length === 0 ? (
        <Box className="text-white">No Speakers</Box>
      ) : (
        filteredSpeakers?.map((s, i) => (
          <Box
            key={`${s?.title}-${s?.speaker?.email}`}
            className="grid grid-cols-5 gap-4 items-center py-2 "
          >
            <Image
              src={s?.speaker?.profileImage || UserIcon}
              alt="user"
              className="w-10 h-10 object-cover rounded"
              width={40}
              height={40}
            />
            <Box className="text-white text-sm col-span-2">
              <Box>{s?.speaker?.name}</Box>
              <Box className="text-xs text-gray-400">Event: {s?.title}</Box>
            </Box>

            <Box className="text-white text-xs col-span-2 text-center">
              10 mins ago
            </Box>
          </Box>
        ))
      )}
    </Box>
  )
}

const BreakoutRoomsList = ({
  breakoutRooms,
}: {
  breakoutRooms: {
    breakoutRoom: EventBreakoutRoom | undefined
    title: string | null
  }[]
}) => {
  const filteredBreakoutRooms = (breakoutRooms || []).filter((br) => br !== undefined)
  return (
    <Box color="foregroundColour" className="px-6 py-4 h-96 overflow-y-scroll">
      <Box className="text-white text-md py-4 font-bold ">Breakout Rooms</Box>

      {filteredBreakoutRooms?.length === 0 ? (
        <Box className="text-white">No Breakout Rooms</Box>
      ) : (
        filteredBreakoutRooms?.map((b) => (
          <Box
            key={b?.breakoutRoom?.title}
            className="grid grid-cols-5 gap-4 items-center py-2 "
          >
            <Image
              src={b?.breakoutRoom?.thumbnailImage || BreakoutRoom}
              alt="user"
              className="w-10 h-10 object-cover rounded"
              width={40}
              height={40}
            />
            <Box className="text-white text-sm col-span-2">
              <Box>{b?.breakoutRoom?.title}</Box>
              <Box className="text-xs text-gray-400">Event: {b?.title} </Box>
            </Box>
            <Box className="text-white text-xs col-span-2 text-center">
              {b?.breakoutRoom?.totalUsers}/{b?.breakoutRoom?.maxAttendees}{' '}
              members
            </Box>
          </Box>
        ))
      )}
    </Box>
  )
}

export default function InfoGrids({
  selectedOption,
}: {
  selectedOption: string | undefined
}): JSX.Element {
  const {
    users,
    usersByYear,
    usersByMonth,
    allSpeakers,
    allSpeakersByYear,
    allSpeakersByMonth,
    allBreakoutRooms,
    allBreakoutRoomsByYear,
    allBreakoutRoomsByMonth,
    isAdmin,
  } = useDashboard()

  return (
    <Box className="grid lg:grid-cols-3 gap-4">
      {isAdmin ? (
        <AllOrganizers />
      ) : (
        <AllUsers selectedOption={selectedOption} />
      )}
      <SpeakerList
        speakers={
          selectedOption === 'All Time Information'
            ? (allSpeakers as any)
            : selectedOption === 'Current Month'
            ? allSpeakersByMonth
            : selectedOption === 'Current Year'
            ? allSpeakersByYear
            : allSpeakers
        }
      />
      <BreakoutRoomsList
        breakoutRooms={
          selectedOption === 'All Time Information'
            ? (allBreakoutRooms as any)
            : selectedOption === 'Current Month'
            ? allBreakoutRoomsByMonth
            : selectedOption === 'Current Year'
            ? allBreakoutRoomsByYear
            : allBreakoutRooms
        }
      />
    </Box>
  )
}
