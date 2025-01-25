import { useMutation } from '@apollo/client'
import { REACT_TO_MESSAGE } from '@graphql/messages/reactToMessage'
import { Message } from '@graphql/__generated/graphql'
import { useAuth } from '@libs/useAuth'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import moment from 'moment'
import { ReactNode, useState, useRef, useEffect } from 'react'
import { BiSmile, BiReply } from 'react-icons/bi'
import Text from '@components/base/Text'
import { useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'
import { useChat } from '@libs/useChat'
import { useEvent } from '@libs/useEvent'
import ProfileImage from '@components/base/ProfileImage'
import TextLink from '@components/base/TextLink'

export const MessageWrapper = ({
  message,
  children,
}: { message: Message } & { children?: ReactNode }) => {
  const [showPicker, setShowPicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [react] = useMutation(REACT_TO_MESSAGE)
  const { profile } = useAuth()
  const { theme } = useTheme()
  const { setModalUser } = useChat()
  const { event } = useEvent()

  const handleClickOutside = (e: any) => {
    if (!containerRef?.current?.contains(e.target)) {
      setShowEmojiPicker(false)
      setShowPicker(false)
    }
  }

  const speakers = (event?.speakers ?? []).map((user) => user.email) ?? []
  const isSpeaker = speakers.indexOf(message?.user?.email) > -1

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      emojiPickerRef.current?.scrollIntoView()
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmojiPicker])

  return (
    <Box
      className="flex flex-row relative hover:bg-gray-100 transition-all rounded-md gap-3 p-2 m-1 ml-2 mr-2"
      innerRef={containerRef}
      onMouseEnter={() => setShowPicker(true)}
      onMouseLeave={() => setShowPicker(false)}
    >
      {showEmojiPicker && (
        <Box
          innerRef={emojiPickerRef}
          className="absolute right-[16px] top-[20px] z-50 pb-16"
        >
          <EmojiPicker
            previewConfig={{ showPreview: false }}
            height={300}
            theme={Theme.DARK}
            onEmojiClick={async (emoji) => {
              setShowEmojiPicker(false)
              setShowPicker(false)
              await react({
                variables: {
                  emoji: emoji.emoji,
                  chatId: message.chatId,
                  messageId: message.messageId,
                  messageUserId: message.user.userId,
                },
              })
            }}
          />
        </Box>
      )}
      {(showPicker || showEmojiPicker) && (
        <Box
          className="shadow-md hover:shadow-lg border-gray-400 hover:border-gray-600 transition-all flex items-center rounded-md border border-solid border-gray-900 absolute top-[-16px] right-[16px] text-white"
          style={{ backgroundColor: theme.foregroundColour }}
        >
          <button
            className="h-[32px] w-[32px] flex items-center justify-center text-neutral-content border-solid border-gray-900 transition-all relative"
            aria-expanded="false"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <BiSmile
              fill={theme.textColour}
              className="w-full h-full p-2 left-0"
            />
          </button>
          <button className="h-[32px] w-[32px] flex items-center justify-center text-neutral-content border-solid border-gray-900 transition-all hidden">
            <BiReply className="w-full h-full p-2" />
          </button>
        </Box>
      )}
      <Box>
        <ProfileImage
          imageUrl={message?.user?.profileImage}
          size="md"
          onClick={() => setModalUser?.(message.user)}
          activityStatus={
            message?.user?.isAnonymous === 'true'
              ? false
              : message?.user?.isActive
          }
        />
      </Box>

      <Box className="flex flex-col overflow-x-auto">
        <Box
          className="flex w-full "
          onClick={() => setModalUser?.(message?.user)}
        >
          <Text className="text-white text-sm font-bold cursor-pointer">
            {message?.user?.name}
            {isSpeaker ? ' (Speaker)' : ''}
          </Text>
          <span className="text-gray-400 text-xs ml-3 mt-[2px] cursor-pointer ">
            {moment(message.dateCreated).calendar()}
          </span>
        </Box>
        <Box className="flex flex-col overflow-x-auto gap-1">
          <TextLink
            ignoreTheme
            className="relative w-full text-sm overflow-x-auto"
          >
            {message?.message}
          </TextLink>

          {children}

          {(message?.reactions?.length ?? 0) > 0 && (
            <Box className="flex flex-wrap">
              {message.reactions?.map((r) => (
                <Box
                  className={`h-8 px-2 text-sm flex items-center rounded-md border border-solid border-gray-400 hover:border-gray-600 cursor-pointer border-opacity-70 transition-all relative space-x-2 mr-1 hover:shadow-md`}
                  style={{
                    backgroundColor: r.users.find(
                      (u) => u.userId === profile?.userId
                    )
                      ? theme.foregroundColour
                      : theme.backgroundColour,
                    color: theme.textColour,
                  }}
                  key={r.emoji}
                  onClick={async () => {
                    await react({
                      variables: {
                        emoji: r.emoji,
                        chatId: message.chatId,
                        messageId: message.messageId,
                        messageUserId: message.user.userId,
                      },
                    })
                  }}
                >
                  <span>{r.emoji}</span>
                  <span>{r.users.length}</span>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
