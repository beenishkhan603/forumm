import React, { useEffect, useState } from 'react'
import { MdMessage, MdPeople } from 'react-icons/md'
import ChatBox from './ChatBox'
import { Tabs, Tab } from '../base/Tabs'
import EventPeopleTab from './EventPeopleTab'
import MessagesTab from './MessagesTab'
import { useChat } from '@libs/useChat'
import { useEvent } from '@libs/useEvent'
import { useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'

export interface EventChatBoxProps {
  showEventPeopleTab?: boolean
  defaultChatName?: string
  defaultChatId?: string
  showUniversityUsers?: boolean
}

export default function EventChatBox({
  showEventPeopleTab = true,
  defaultChatName,
  defaultChatId,
  showUniversityUsers = false,
}: EventChatBoxProps) {
  const [open, setOpen] = useState(false)
  const { event } = useEvent()
  const { theme } = useTheme()
  const { eventChats, chatTab, setChatTab, showDefaultChat } = useChat()

  const allChats = !!showDefaultChat
    ? [
        {
          chatId: defaultChatId,
          title: defaultChatName,
        },
        ...eventChats,
      ]
    : [...eventChats]

  const [currentChatId, setCurrentChatId] = useState<string | undefined>(
    event?.eventId!
  )

  useEffect(() => {
    if (currentChatId == undefined && event?.eventId) {
      setCurrentChatId(event.eventId)
    } else if (currentChatId !== defaultChatId && event?.eventId == null) {
      setCurrentChatId(defaultChatId)
    }
  }, [currentChatId, defaultChatId, event?.eventId])

  useEffect(() => {
    // Tab Switching Logic
    if (eventChats.length >= 1) {
      setCurrentChatId(eventChats.at(-1)?.chatId)
    } else if (
      currentChatId &&
      eventChats.map((c) => c.chatId).includes(currentChatId) === false
    ) {
      setCurrentChatId(event?.eventId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.eventId, eventChats])

  useEffect(() => {
    const toggleChatbox = (): void => {
      setOpen(!open)
    }
    document.addEventListener('toggle-chatbox', toggleChatbox)
    return () => {
      document.removeEventListener('toggle-chatbox', toggleChatbox)
    }
  }, [open])

  return (
    <Box
      className={`${
        open ? ' w-1/2 sm:w-1/3 min-w-full sm:min-w-[400px]' : 'w-0'
      } border-l border-panel-gray transition-all flex flex-col overflow-x-hidden h-[calc(100vh_-_81px)]`}
    >
      <Box className="flex justify-evenly items-center border-b border-panel-gray text-center">
        {allChats.map((o, i) => (
          <Box
            key={o.chatId ?? i}
            className={`text-md font-medium py-4 flex-1 cursor-pointer select-none whitespace-nowrap`}
            style={{
              backgroundColor:
                o.chatId === currentChatId && chatTab === 'Chat'
                  ? theme?.highlightColour
                  : theme.backgroundColour,
              color:
                o.chatId === currentChatId && chatTab === 'Chat'
                  ? 'white'
                  : theme.textColour,
            }}
            onClick={() => {
              setCurrentChatId(o.chatId)
              setChatTab?.('Chat')
            }}
          >
            {o.title}
          </Box>
        ))}
        <Box
          className={`text-white text-sm py-4 px-6 cursor-pointer select-none flex items-center space-x-2 justify-center`}
          style={{
            backgroundColor:
              chatTab === 'Messages'
                ? theme?.highlightColour
                : theme.backgroundColour,
          }}
          onClick={() => {
            setChatTab?.('Messages')
          }}
        >
          <MdMessage
            fill={
              chatTab !== 'Messages'
                ? theme.textColour
                : theme.type === 'DARK'
                ? theme.textColour
                : theme.backgroundColour
            }
            className="w-5 h-6"
          />
        </Box>
        <Box
          show={showEventPeopleTab}
          className={`text-white text-sm py-4 px-6 cursor-pointer select-none flex items-center space-x-2 justify-center`}
          style={{
            backgroundColor:
              chatTab === 'People'
                ? theme?.highlightColour
                : theme.backgroundColour,
          }}
          onClick={() => {
            setChatTab?.('People')
          }}
        >
          <MdPeople
            fill={
              chatTab !== 'People'
                ? theme.textColour
                : theme.type === 'DARK'
                ? theme.textColour
                : theme.backgroundColour
            }
            className="w-5 h-6"
          />
        </Box>
      </Box>
      <Box className="flex flex-col h-full overflow-y-auto">
        <Tabs activeTitle={chatTab ?? 'Chat'}>
          <Tab title="Chat">
            <ChatBox chatId={currentChatId!} />
          </Tab>
          <Tab title="Messages">
            <MessagesTab />
          </Tab>
          {showEventPeopleTab && (
            <Tab title="People">
              <EventPeopleTab universityUsers={showUniversityUsers} />
            </Tab>
          )}
        </Tabs>
      </Box>
    </Box>
  )
}
