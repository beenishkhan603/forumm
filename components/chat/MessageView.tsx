import { Message } from '@graphql/__generated/graphql'
import { useAuth } from '@libs/useAuth'
import { MessageWrapper } from './MessageWrapper'
import ProfileImage from '@components/base/ProfileImage'
import { useChat } from '@libs/useChat'
import Box from '@components/base/Box'
import { darken, useTheme } from '@libs/useTheme'
import TextLink from '@components/base/TextLink'

export const MessageView = ({ message }: { message: Message }) => {
  const { profile } = useAuth()
  const { setModalUser } = useChat()
  const { theme } = useTheme()
  const isLight = theme.type === 'LIGHT'
  const textColor = isLight ? 'white' : theme.textColour

  if (
    message.message &&
    message.message.startsWith('https://app.sli.do/event/')
  ) {
    const slidoId = message.message.split('https://app.sli.do/event/').at(-1)
    return (
      <MessageWrapper message={message}>
        <iframe
          src={`https://app.sli.do/event/${slidoId}`}
          height="85%"
          width="100%"
          style={{ minHeight: 520 }}
          title="Slido"
          className="rounded-xl"
        ></iframe>
      </MessageWrapper>
    )
  }

  return <MessageWrapper message={message} />
}
