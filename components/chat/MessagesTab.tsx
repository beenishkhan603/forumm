import { useQuery } from '@apollo/client'
import Box from '@components/base/Box'
import ProfileImage from '@components/base/ProfileImage'
import { GET_CHATS } from '@graphql/messages/getChats'
import { GET_USERS_IN_EVENT } from '@graphql/users/getUsersInEvent'
import { useChat } from '@libs/useChat'
import { useEvent } from '@libs/useEvent'
import moment from 'moment'
import Image from 'next/image'
import { useEffect } from 'react'
import { MdArrowBackIos, MdPeople } from 'react-icons/md'
import ChatBox from './ChatBox'
import React from 'react'

const MessagesTab = () => {
  const { event } = useEvent()
  const { setModalUser, dmChat, setDmChat } = useChat()
  const { data } = useQuery(GET_USERS_IN_EVENT, {
    variables: { input: event?.eventId! },
    fetchPolicy: 'cache-and-network',
  })

  const { data: chatsData, refetch } = useQuery(GET_CHATS)

  const allUsers = data?.getUsersInEvent.items
  const allChats = chatsData?.getChats

  useEffect(() => {
    if (!dmChat) {
      refetch()
    }
  }, [refetch, dmChat])

  if (dmChat) {
    return (
      <Box className="flex flex-col h-full">
        <Box className="text-white border-b-midnight-sky border-b p-4 flex items-center">
          <MdArrowBackIos
            className="mr-2 w-5 h-5 cursor-pointer"
            onClick={() => setDmChat?.(undefined)}
          />
          <ProfileImage
            activityStatus={
              dmChat?.user?.isAnonymous === 'true'
                ? false
                : dmChat?.user?.isActive
            }
            imageUrl={dmChat?.user?.profileImage}
            className="cursor-pointer mr-4"
          />
          <Box>
            <Box>{dmChat?.user?.name}</Box>
            {dmChat?.user?.userId === event?.organizerId && (
              <Box className="bg-blue-500 rounded-xl text-xs inline-block p-1 px-2">
                <text className="text-white">Organizer</text>
              </Box>
            )}
          </Box>
        </Box>
        <Box className="flex-1 overflow-y-auto">
          <ChatBox chatId={dmChat?.chatId} />
        </Box>
      </Box>
    )
  }

  return (
    <Box className="text-white flex flex-col space-y-2 p-2 ">
      {allChats?.length === 0 && (
        <Box>
          <Box className="text-center mt-[20px] text-xl">
            No direct messages yet!
          </Box>
          <Box className="flex flex-col items-center justify-center mt-[20px] gap-[5px]">
            <Box className="text-gray-400 text-s whitespace-nowrap inline-block">
              To start a conversation, click on the
            </Box>
            <Box className="flex items-center gap-[5px]">
              <MdPeople className="w-5 h-5 inline-block" />
              <Box className="text-gray-400 text-s whitespace-nowrap">
                tab and choose a participant.
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {allChats?.map((c, index) => (
        <React.Fragment key={c?.user?.userId}>
          <Box
            className="flex items-center p-2 cursor-pointer relative hover:bg-gray-100 transition-all pl-4 pt-1 rounded-md"
            onClick={() => setDmChat?.({ chatId: c.chatId, user: c.user })}
          >
            <ProfileImage
              activityStatus={
                c?.user?.isAnonymous === 'true' ? false : c?.user?.isActive
              }
              imageUrl={c?.user?.profileImage}
              size="md"
            />
            <Box className="ml-4">
              <Box className="text-white text-sm font-bold">
                {c?.user?.name}
              </Box>
              <Box className="text-sm text-gray-400 truncate w-64">
                {c?.lastMessage}
              </Box>
            </Box>
            <Box className="text-xs absolute right-0 top-0 p-2">
              {moment(c?.dateCreated).format('ddd hh:mm')}
            </Box>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  )
}

export default MessagesTab
