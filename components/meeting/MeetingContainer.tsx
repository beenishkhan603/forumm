import ActionButtons from '@components/chat/ActionButtons'
import Box from '@components/base/Box'
import useAgora from '@libs/Agora/useAgora'
import { useAuth } from '@libs/useAuth'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import VideoGrid from './VideoContainer'
import VideoControls from './VideoControls'
import { AgoraInstance } from '@type/Broadcasting/Agora.type'
import { AgoraContext, mapAgoraToContext } from '@libs/Agora/AgoraContext'
import { useSubscription } from '@apollo/client'
import { CHANNEL_INFO_CHANGED } from '@graphql/events/channelInfoChanged'

const MeetingContainer = ({
  className,
  channel,
  token,
  title,
  autoJoin = false,
  leftCall,
}: {
  className?: string
  channel: string
  token: string
  title?: string
  autoJoin?: boolean
  leftCall?: () => void
}) => {
  const [fullscreen, setFullscreen] = useState(false)
  const meetingContainer = useRef<HTMLDivElement>(null)

  const { profile } = useAuth()
  const router = useRouter()
  const Agora: AgoraInstance = useAgora()

  const { leave, join, joinState } = Agora

  const { data, loading } = useSubscription(CHANNEL_INFO_CHANGED, {
    variables: { channelName: channel },
  })

  let agoraContext = mapAgoraToContext({
    ...Agora,
    totalUsers: data?.ChannelInfoChanged.totalUsers,
  })

  const leaveCall = async () => {
    leftCall?.()
    await leave()
  }

  useEffect(() => {
    const handleRouteChange = async (event: any) => {
      if (event === 'BreakoutLeaveConfirmed') {
        if (joinState) {
          await leave()
        }
      }
    }

    router?.events?.on('routeChangeStart', handleRouteChange)

    return () => {
      router?.events?.off('routeChangeStart', handleRouteChange)
    }
  }, [joinState, leave, router.events, leftCall])

  const scrollIntoView = () => {
    window.scrollTo({
      top: 65,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handleRouteChange = (event: any) => {
      if (event === 'BreakoutLeaveConfirmed') {
        if (joinState) {
          leave()
        }
      }
    }

    router?.events?.on('routeChangeStart', handleRouteChange)

    return () => {
      router?.events?.off('routeChangeStart', handleRouteChange)
    }
  }, [joinState, leave, router.events])

  useEffect(() => {
    if (fullscreen) {
      meetingContainer.current
        ?.requestFullscreen()
        .catch((e) => console.error(e))
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch((e) => console.error(e))
    }
  })

  if (!joinState && !autoJoin) {
    return (
      <Box className={`bg-midnight-sky rounded ${className ?? ''}`}>
        <Box className="flex mb-8">
          <Box
            className="w-full flex items-center justify-center cursor-pointer text-white text-2xl animate-pulse flex-col text-center"
            style={{ height: 'calc(100vh - 90px)' }}
            title={!joinState ? 'Join Event' : 'Leave'}
            onClick={() => {
              if (joinState === false) join(channel, token, profile?.userId)
            }}
          >
            <Box ignoreTheme className={'text-white'}>
              Click to Join {title}
            </Box>
            <Box ignoreTheme className="text-sm text-white">
              Note: You may need to allow your browser to access video &
              microphone access
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <AgoraContext.Provider value={agoraContext}>
      <Box
        className={`bg-midnight-sky rounded flex flex-col flex-1 !max-h-full ${
          className ?? ''
        }`}
        onClick={() => {
          scrollIntoView()
        }}
      >
        <Box
          className="flex !max-h-full flex-col flex-1 bg-midnight-dark"
          innerRef={meetingContainer}
        >
          <VideoGrid isInPreStage={false} isBreakout={true} />
          <VideoControls
            setFullscreen={setFullscreen}
            fullscreen={fullscreen}
            leave={leaveCall}
            isInPreStage={false}
          />
        </Box>
      </Box>
    </AgoraContext.Provider>
  )
}

export default MeetingContainer
