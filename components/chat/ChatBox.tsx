import { useMutation, useQuery } from '@apollo/client'
import { CREATE_MESSAGE_FOR_CHAT_ID } from '@graphql/messages/createMessageForChatId'
import { GET_MESSAGES_FOR_CHAT_ID } from '@graphql/messages/getMessagesForChatId'
import { MESSAGE_CHANGED } from '@graphql/messages/messageChanged'
import React, { useEffect, useRef, useState } from 'react'
import { TextAreaInput } from '../inputs/TextAreaInput'
import { TextInput } from '../inputs/TextInput'
import { BsArrowRightShort } from 'react-icons/bs'
import { Message } from '@graphql/__generated/graphql'
import { MessageView } from './MessageView'
import Box from '@components/base/Box'
import { isArray } from 'lodash'
import { useTheme } from '@libs/useTheme'
import LoadingSpinner from '@components/base/LoadingSpinner'

const MessageInput = ({ chatId }: { chatId: string }) => {
  const [sendMessage] = useMutation(CREATE_MESSAGE_FOR_CHAT_ID)
  const [message, setMessage] = useState('')
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  return (
    <Box className="flex w-full p-3 space-x-1 items-center">
      <TextAreaInput
        className="flex-1 mt-0"
        border="border-none"
        placeholder="Type to write a message..."
        label={undefined}
        value={message}
        onChange={(e) => setMessage(e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (e.shiftKey) {
              return
            }
            e.preventDefault()
            if (message.trim() !== '') {
              sendMessage({
                variables: {
                  input: { chatId: chatId, message: message },
                },
              })
              setMessage('')
            }
          }
        }}
        dynamicResize={true}
        rows={1}
        preventResize={true}
        preventBorder={true}
      />
      <span>
        <BsArrowRightShort
          className={`text-2xl cursor-pointer ${
            isDarkTheme ? 'text-white' : 'text-black'
          }`}
          onClick={() => {
            if (message.trim() !== '') {
              sendMessage({
                variables: {
                  input: { chatId: chatId, message: message },
                },
              })
              setMessage('')
            }
          }}
        />
      </span>
    </Box>
  )
}

const ChatBox = ({ chatId }: { chatId: string }) => {
  const messagesView = useRef<any>(null)

  const { data, subscribeToMore, loading } = useQuery(
    GET_MESSAGES_FOR_CHAT_ID,
    {
      variables: { input: { chatId } },
      fetchPolicy: 'cache-and-network',
      skip: !chatId,
    }
  )

  const scrollToBottom = () => {
    messagesView.current?.scroll({
      top: messagesView.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: MESSAGE_CHANGED,
      variables: {
        input: chatId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        const newMessage = subscriptionData.data.messageChanged
        const newMessages = isArray(prev?.getMessagesForChatId)
          ? [...prev.getMessagesForChatId]
          : []
        const foundIndex = newMessages.findIndex(
          (m) => m.messageId === newMessage.messageId
        )
        if (foundIndex === -1) {
          newMessages.push(newMessage)
          setTimeout(() => {
            scrollToBottom()
          }, 100)
        } else {
          newMessages[foundIndex] = newMessage
        }

        return {
          getMessagesForChatId: newMessages,
        }
      },
    })
    return () => unsubscribe()
  }, [chatId, subscribeToMore])

  useEffect(() => {
    if (!loading) {
      scrollToBottom()
    }
  }, [loading, data])

  const messages = data?.getMessagesForChatId

  return (
    <Box className="relative w-full h-full flex flex-col">
      <Box
        className="flex-1 flex flex-col overflow-y-auto pt-4 pb-2"
        innerRef={messagesView}
        loading={loading && messages == null}
      >
        {messages?.map((m) => (
          <MessageView message={m as Message} key={m?.messageId} />
        ))}
      </Box>
      <Box className="border-t border-gray-300" />
      <Box className="flex-end w-full">
        <MessageInput chatId={chatId} />
      </Box>
    </Box>
  )
}

export default ChatBox
