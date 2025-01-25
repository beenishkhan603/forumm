import Box from '@components/base/Box'

import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import MeetingContainer from '@components/meeting/MeetingContainer'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useChat } from '@libs/useChat'
import { useEvent } from '@libs/useEvent'
import { useRouter } from 'next/router'
import useStatistics from '@libs/useStatistics'
import { useEffect } from 'react'

const BreakoutRoomsView = () => {
  const _statisticId = useStatistics()
  const { event } = useEvent()
  const { eventChats, setEventChats, setShowDefaultChat } = useChat()
  const { query, push } = useRouter()
  const breakoutRoom = event?.breakoutRooms?.find(
    (b) => b.title === query.roomId
  )!
  const token = breakoutRoom.token
  const channel = breakoutRoom.channelName

  useEffect(() => {
    setShowDefaultChat(false)
    setEventChats?.([
      {
        chatId: channel,
        title: breakoutRoom.title,
      },
    ])

    return () => {
      setShowDefaultChat(true)
      setEventChats?.([])
    }
  }, [breakoutRoom.title, channel, setEventChats])

  return (
    <Box className="size-full flex flex-col relative">
      <AnimatedView className="flex-col">
        <MeetingContainer
          channel={channel}
          token={token}
          title={'Breakout Room'}
          leftCall={() => push(`/event/${event?.eventId}/breakout-rooms`)}
        />
      </AnimatedView>
      <ActionButtons className="absolute bottom-0 text-white p-8 flex space-x-4 w-full justify-end items-end z-30 pointer-events-none translate-x-2" />
    </Box>
  )
}

BreakoutRoomsView.Layout = LiveEventLayout

export default BreakoutRoomsView
