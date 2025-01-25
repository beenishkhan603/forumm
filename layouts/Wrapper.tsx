import { Header } from '@components/page/Header'
import { useAuth, useAuthLoader } from '@libs/useAuth'
import { useTheme, useThemeLoader } from '@libs/useTheme'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CallModal from '@components/chat/CallModal'
import ProfileModal from '@components/chat/ProfileModal'
import { User } from '@graphql/__generated/graphql'
import { ChatContext } from '@libs/useChat'
import Box from '@components/base/Box'
import { AnimatePresence } from 'framer-motion'

import FloatingMenu from '@components/FloatingMenu/FloatingMenu'
import FooterUnauthenticated from '@components/page/FooterUnauthenticated'

declare global {
  interface Window {
    ForummLogs: { [key: string]: any[] }
    ApplePaySession?: any
    ForummUtil: {
      changeOrg: (newOrg: string) => void
    }
  }
}

export interface WrapperProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  wrapperClasses?: string
  title?: string
  className?: string
  requireAuth?: boolean
  requireChat?: boolean
}

const Wrapper = ({
  children,
  showHeader = true,
  showFooter = true,
  wrapperClasses = 'flex-1 transition-all',
  className = '',
  title,
  requireAuth = true,
  requireChat = true,
}: WrapperProps) => {
  useThemeLoader()
  useAuthLoader()
  const { profile, currentUser, setUserActivity } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const [eventChats, setEventChats] = useState<
    { chatId: string; title: string }[]
  >([])
  const [modalUser, setModalUser] = useState<User | undefined>()

  const [chatTab, setChatTab] = useState<string>('Chat')
  const [showDefaultChat, setShowDefaultChat] = useState<boolean>(true)
  const [callingUser, setCallingUser] = useState<User | undefined>()

  const [dmChat, setDmChat] = useState<
    | {
        chatId: string
        user: User
      }
    | undefined
  >()
  const { foregroundColour, textColour, backgroundColour } = theme

  const isOrganizer = profile?.groups?.includes('organizer')

  useEffect(() => {
    if (!currentUser && requireAuth) {
      router.push('/login?previous=true')
    }
  }, [currentUser, requireAuth, router])

  const DURATION = 10000
  const throttle = (function () {
    let timeout: NodeJS.Timeout | undefined
    return function throttle(callback: () => void) {
      if (timeout === undefined) {
        callback()
        timeout = setTimeout(() => {
          timeout = undefined
        }, DURATION)
      }
    }
  })()

  function throttlify(callback: (arg0: any) => void) {
    return function throttlified(event: any) {
      throttle(() => {
        callback(event)
      })
    }
  }

  useEffect(() => {
    const saveMousePosition = throttlify(async (event): Promise<void> => {
      try {
        await setUserActivity()
      } catch (e) {
        console.log(e)
      }
    })

    const setUserOffline = (): void => {
      try {
        setUserActivity(false)
      } catch (e) {
        console.log(e)
      }
    }

    document.addEventListener('mousemove', saveMousePosition)
    window?.addEventListener('beforeunload', setUserOffline)
    return () => {
      document.removeEventListener('mousemove', saveMousePosition)
      window?.removeEventListener('beforeunload', setUserOffline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!requireChat) {
    return (
      <Box
        className={`overflow-hidden min-h-screen flex flex-col  ${className}`}
      >
        {showHeader && <Header title={title} requireAuth={requireAuth} />}
        {currentUser && <FloatingMenu />}
        <Box className={wrapperClasses}>{children}</Box>
        {showFooter && <FooterUnauthenticated transparent={false} />}
        <ProfileModal />
        <CallModal />
      </Box>
    )
  }

  return (
    <ChatContext.Provider
      value={{
        eventChats,
        setEventChats,
        setChatTab,
        chatTab,
        setModalUser,
        modalUser,
        setDmChat,
        dmChat,
        call: setCallingUser,
        callingUser,
        showDefaultChat,
        setShowDefaultChat,
      }}
    >
      <Box
        className={`overflow-hidden min-h-screen flex flex-col ${className}`}
      >
        {showHeader && <Header title={title} requireAuth={requireAuth} />}
        {currentUser && <FloatingMenu />}
        <Box className={wrapperClasses}>{children}</Box>
        {showFooter && <FooterUnauthenticated transparent={false} />}
        <ProfileModal />
        <CallModal />
      </Box>
    </ChatContext.Provider>
  )
}

/*
export const UnauthenticatedWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <Wrapper requireAuth={false}>{children}</Wrapper>
}
*/

export const UnauthenticatedWrapper = ({
  children,
  showFooter = true,
}: {
  children: React.ReactNode
  showFooter?: boolean
}) => {
  return (
    <Wrapper
      requireAuth={false}
      showFooter={showFooter}
      className="h-full"
      wrapperClasses="flex flex-col flex-1"
    >
      {children}
    </Wrapper>
  )
}

export const UnauthenticatedWrapperNoDefaults = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Wrapper requireAuth={false} showFooter={false}>
      {children}
    </Wrapper>
  )
}

export const UnauthenticatedWrapperNoFooter = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Wrapper
      requireAuth={false}
      showFooter={false}
      requireChat={false}
      wrapperClasses="flex flex-col flex-1"
    >
      {children}
    </Wrapper>
  )
}

export default Wrapper
