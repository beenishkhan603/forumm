import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import { Button } from '@components/inputs/Button'
import { useAuth } from '@libs/useAuth'
import useAgora from '@libs/Agora/useAgora'
import { useTheme } from '@libs/useTheme'
import useTimers from '@libs/Utility/useTimers'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import VideoGrid from './VideoContainer'
import VideoControls from './VideoControls'
import { SpeakerJoinedGreenRoomEvent } from '@libs/Agora/util'
import { AgoraContext, mapAgoraToContext } from '@libs/Agora/AgoraContext'
import { useEvent } from '@libs/useEvent'
import { useLazyQuery, useSubscription } from '@apollo/client'
import { GET_USERS_BY_IDS } from '@graphql/users/GetUsersByIds'
import { CHANNEL_INFO_CHANGED } from '@graphql/events/channelInfoChanged'

const LiveStreamContainer = ({
  className,
  channel,
  token,
  grToken,
  autoJoin = false,
  type = 'meet',
  streamEndedHandler,
  streamStartedHandler,
  setStageLive,
  leavePreStageHandler,
}: {
  className?: string
  channel: string
  token: string
  grToken: string
  autoJoin?: boolean
  type?: 'streamer' | 'meet' | 'viewer'
  streamEndedHandler?: () => void
  streamStartedHandler?: () => void
  setStageLive?: (val: boolean) => void
  leavePreStageHandler?: () => void
}) => {
  const DEFAULT_COUNTDOWN_TIME = 5
  const { profile } = useAuth()
  const [fullscreen, setFullscreen] = useState(false)
  const [participants, setParticipants] = useState(false)
  const meetingContainer = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)
  const [countdown, setCountdown] = useState<{
    id: string
    remainingTime: number
  }>()
  const { theme } = useTheme()

  const Agora = useAgora(type, channel, token)
  const router = useRouter()

  const { event } = useEvent()

  const {
    leave,
    join,
    joinState,
    remoteUsers,
    client,
    isInPreStage,
    isLive,
    goLive,
  } = Agora

  useEffect(() => {
    if (remoteUsers.length >= 1 && type === 'viewer') {
      streamStartedHandler?.()
    } else if (
      (type === 'viewer' || !isInPreStage) &&
      remoteUsers.length === 0
    ) {
      streamEndedHandler?.()
    }
  }, [remoteUsers, streamEndedHandler, streamStartedHandler, type])

  const { data } = useSubscription(CHANNEL_INFO_CHANGED, {
    variables: { channelName: channel },
  })

  let agoraContext = mapAgoraToContext({
    ...Agora,
    speakers: event?.speakers,
    totalUsers: data?.ChannelInfoChanged.totalUsers,
  })

  const leaveMeeting = async () => {
    await leave({ leavePrestage: true })
      .then(async () => {
        streamEndedHandler?.()
        leavePreStageHandler?.()
      })
      .then(async () => {
        if (autoJoin && client) {
          await join(channel, token, profile?.userId ?? null, {
            joinAsViewer: true,
          })
        }
      })
  }

  //
  // Route Handler

  useEffect(() => {
    const handleRouteChange = (event: any) => {
      if (event === 'SpeakerLeaveConfirmed') {
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

  //
  //Go Live Modal

  const { addCountdown, deleteCountdown } = useTimers()

  const cancelStreamCountdown = () => {
    if (!countdown) return
    deleteCountdown(countdown.id)
  }

  const startStreamCountdown = () => {
    setShowModal(true)
    const cd = addCountdown(
      DEFAULT_COUNTDOWN_TIME,
      1000,
      () =>
        setCountdown((prevValue) => {
          return {
            ...prevValue,
            id: prevValue?.id ?? cd?.id!,
            remainingTime:
              (prevValue?.remainingTime ?? DEFAULT_COUNTDOWN_TIME) - 1,
          }
        }),
      () => {
        setShowModal(false)
        if (!joinState || isInPreStage) {
          join(channel, token, profile?.userId ?? null)
        }
        if (!isLive) {
          goLive()
        }
      },
      () => setShowModal(false)
    )
    setCountdown({ id: cd!.id, remainingTime: DEFAULT_COUNTDOWN_TIME })
  }

  const returnToGreenroom = async () => {
    streamEndedHandler?.()
    await leave().then(() => {
      window.dispatchEvent(
        SpeakerJoinedGreenRoomEvent({
          channel: channel,
          token: grToken,
          userId: profile?.userId,
        })
      )
    })
  }

  const scrollIntoView = () => {
    window.scrollTo({
      top: 65,
      behavior: 'smooth',
    })
  }
  useEffect(() => {
    scrollIntoView()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (client && joinState) await leave()

      if (autoJoin && client) {
        await join(channel, token, profile?.userId ?? null, {
          joinAsViewer: true,
        })
      }
    })()
  }, [client])

  const remoteUsersWithActiveMedia = remoteUsers.filter(
    (user) =>
      user.hasAudio ||
      user.hasVideo ||
      agoraContext.sessionData.speakers?.find(
        (s) => s.userId === user.uid.toString()
      )
  )

  useEffect(() => {
    if (fullscreen) {
      meetingContainer.current
        ?.requestFullscreen()
        .catch((e) => console.error(e))
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch((e) => console.error(e))
    }

    const handleFullscreen = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreen)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreen)
    }
  }, [fullscreen])

  const modal = (
    <Modal
      show={showModal}
      setShow={setShowModal}
      closeButton={false}
      title="Ready?"
    >
      <Box className="flex flex-col items-center justify-center">
        <Box className="text-2xl font-bold mb-6">
          {countdown?.remainingTime}
        </Box>
        <Button
          title="Cancel"
          onClick={() => {
            cancelStreamCountdown()
          }}
        ></Button>
      </Box>
    </Modal>
  )

  if (remoteUsersWithActiveMedia.length > 0) setStageLive!(true)
  if (remoteUsersWithActiveMedia.length < 1 && !isInPreStage) {
    setStageLive!(false)
    return <></>
  }

  return (
    <AgoraContext.Provider value={agoraContext}>
      <Box
        className={`bg-midnight-sky rounded ${className}`}
        onClick={() => {
          scrollIntoView()
        }}
      >
        <Box
          className="flex flex-col bg-midnight-dark"
          style={{ height: 'calc(100vh - 90px)' }}
          innerRef={meetingContainer}
        >
          <VideoGrid type={type} isInPreStage={isInPreStage} />

          {modal}
          <VideoControls
            setFullscreen={setFullscreen}
            fullscreen={fullscreen}
            leave={leaveMeeting}
            type={type}
            isInPreStage={isInPreStage}
          />
          {type === 'streamer' && isInPreStage && (
            <Button
              title={joinState && isLive ? 'Return to Green Room' : 'Go Live'}
              onClick={() => {
                if (!isLive) {
                  startStreamCountdown()
                }

                if (isLive) {
                  returnToGreenroom()
                }
              }}
              className={`m-2 mx-8`}
              type={joinState && isLive ? 'secondary' : 'tertiary'}
            />
          )}
        </Box>
      </Box>
    </AgoraContext.Provider>
  )
}

export default LiveStreamContainer
