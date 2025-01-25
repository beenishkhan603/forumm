import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import LiveStreamContainer from '@components/meeting/LiveStreamContainer'
import { EventStage, StageType } from '@graphql/__generated/graphql'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useAuth } from '@libs/useAuth'
import { useChat } from '@libs/useChat'
import { useEvent } from '@libs/useEvent'
import Mute from '@public/images/Mute.svg'
import Unmute from '@public/images/Unmute.svg'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import YouTube from 'react-youtube'
import { useTheme } from '@libs/useTheme'
import { SpeakerJoinedGreenRoomEvent } from '@libs/Agora/util'
import useStatistics from '@libs/useStatistics'

import {
  getVideoSource,
  parseHoldingVideoURL,
  SUPPORTED_VIDEO_SERVICES,
} from '@libs/Utility/parsers'

const StageView = () => {
  const { event } = useEvent()
  const { eventChats, setEventChats, setShowDefaultChat } = useChat()
  const { profile, isAdmin } = useAuth()
  const _statisticId = useStatistics()

  const streamerRequirements = [
    event?.organizerId === profile?.userId,
    event?.speakers?.some(
      (s) => s.email?.toLowerCase() === profile?.email?.toLowerCase()
    ),
    isAdmin,
  ]
  const streamType: 'streamer' | 'viewer' = streamerRequirements.includes(true)
    ? 'streamer'
    : 'viewer'

  const [isStageLive, setStageLive] = useState(false)
  const [streaming, setStreaming] = useState(
    streamType === 'viewer' ? true : false
  )
  const isOrganizer = profile?.groups?.includes('organizer')
  const { query, push } = useRouter()
  const stage = event?.stages?.find(
    (s) => s.title == query.stageId
  ) as EventStage

  const holdingVideoRef = useRef<YouTube>(null)
  const [muted, setMuted] = useState(true)
  const [isInPreStage, setIsInPreStage] = useState(false)

  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  const toggleMute = () => {
    setMuted((state) => !state)
  }

  const scrollIntoView = () => {
    window.scrollTo({
      top: 65,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (muted) {
      holdingVideoRef?.current?.internalPlayer?.mute()
    } else {
      holdingVideoRef?.current?.internalPlayer?.unMute()
    }
  }, [muted])

  useEffect(() => {
    scrollIntoView()
  }, [])

  useEffect(() => {
    // Only swap to stage chat if there are multiple stages
    if (!!event?.stages && event.stages.length > 1) {
      setShowDefaultChat(false)
      setEventChats?.([
        {
          chatId: stage.channelName,
          title: stage.title,
        },
      ])
    }

    return () => {
      setShowDefaultChat(true)
      setEventChats?.([])
    }
  }, [setEventChats, stage?.channelName, stage?.title])

  const setUpListeners = () => {
    const handleSpeakerJoinedGreenRoom = () => {
      setIsInPreStage(true)
    }

    window.addEventListener(
      'speaker_joined_green_room',
      handleSpeakerJoinedGreenRoom
    )

    return () => {
      window.removeEventListener(
        'speaker_joined_green_room',
        handleSpeakerJoinedGreenRoom
      )
    }
  }

  useEffect(() => {
    const teardownListeners = setUpListeners()

    return () => {
      teardownListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const videoHandler = () => {
    // console.log({
    //   isStageLive,
    //   streamType,
    //   isInPreStage,
    //   isAdmin,
    //   streamerRequirements,
    // })
    if (!stage.holdingVideoUrl) return
    if (isStageLive) return
    if (streamType === 'streamer' && isInPreStage) return

    const videoService = getVideoSource(stage.holdingVideoUrl)
    const videoId = parseHoldingVideoURL(stage.holdingVideoUrl)

    if (videoService === SUPPORTED_VIDEO_SERVICES.VIMEO)
      return (
        <iframe
          src={videoId}
          frameBorder={0}
          allow={'autoplay; fullscreen'}
          allowFullScreen
          className={`h-full pb-32`}
        ></iframe>
      )

    if (videoService === SUPPORTED_VIDEO_SERVICES.YOUTUBE)
      return (
        /* @ts-ignore */
        <YouTube
          videoId={videoId}
          ref={holdingVideoRef}
          iframeClassName={`${stage.class === StageType.Internal ? 'pointer-events-none' : ''}`}
          className="h-full"
          onReady={() => {}}
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              version: 3,
              loop: 1,
              playlist: videoId,
              autoplay: 1,
              mute: 1,
              modestbranding: 1,
              showinfo: 0,
              controls: stage.class === StageType.External ? 1 : 0,
              enablejsapi: 1,
              rel: 0,
            },
          }}
        />
      )
  }

  return (
    <AnimatedView
      className="relative flex-col"
      onClick={() => {
        scrollIntoView()
      }}
    >
      <Box className="w-full mt-0 z-0">
        <LiveStreamContainer
          channel={stage.channelName}
          token={stage.token}
          grToken={stage.grToken}
          autoJoin={true}
          streamEndedHandler={() => setStreaming(false)}
          streamStartedHandler={() => setStreaming(true)}
          leavePreStageHandler={() => {
            setIsInPreStage(false)
          }}
          setStageLive={(stageLiveStatus: boolean) =>
            setStageLive(stageLiveStatus)
          }
          type={streamType}
        />
      </Box>
      {!streaming && !isInPreStage && (
        <>
          <Box className="flex items-center justify-center absolute bottom-0 w-full sm:w-[60%] sm:mx-[20%] mx-auto space-x-8 py-4">
            <Box
              show={stage.class === StageType.Internal}
              onClick={toggleMute}
              className="flex items-center justify-center bg-white rounded-full h-10 w-10 cursor-pointer"
            >
              {muted ? <Unmute /> : <Mute />}
            </Box>

            {(streamType === 'streamer' || isAdmin) && (
              <Button
                title={`Enter Green Room${
                  isAdmin && !streamerRequirements.includes(true)
                    ? ' as Admin'
                    : ''
                }`}
                size="auto"
                onClick={() => {
                  window.dispatchEvent(
                    SpeakerJoinedGreenRoomEvent({
                      channel: stage.channelName,
                      token: stage.grToken,
                      userId: profile?.userId,
                    })
                  )
                  setStreaming(true)
                  setEventChats?.([
                    ...(!!event?.stages && event.stages.length > 1
                      ? [
                          {
                            chatId: stage.channelName,
                            title: stage.title,
                          },
                        ]
                      : []),
                    {
                      chatId: `${stage.channelName}-green-room`,
                      title: `Green Room`,
                    },
                  ])
                }}
              />
            )}
          </Box>
        </>
      )}
      {videoHandler()}
      <ActionButtons className="absolute bottom-0 text-white p-8 flex space-x-4 w-full justify-end items-end z-30 pointer-events-none translate-x-2" />
      <Box
        className={`absolute top-0 left-0 p-1 ${
          streaming ? '!text-white' : '!text-[#3763e9]'
        }  text-xl font-medium select-none w-full text-center z-100 text-shadow-custom pt-4`}
      >
        {/* Welcome to the Event Hub */}
        {stage.title}
        <Box className="absolute top-4 right-4 z-100 flex flex-row">
          {/* {profile && isOrganizer && <AudioVideoCheck />} */}
          {/* <Button */}
          {/*   size="auto" */}
          {/*   icon={<MdExitToApp />} */}
          {/*   iconColor="white" */}
          {/*   iconPos="end" */}
          {/*   title="Exit" */}
          {/*   className="cursor-pointer max-w-40 inline-block z-100 ml-2" */}
          {/*   onClick={() => { */}
          {/*     push('/dashboard') */}
          {/*   }} */}
          {/* /> */}
        </Box>
      </Box>
      {/* <Box */}
      {/*   className={`absolute top-9 left-0 p-1 ${ */}
      {/*     streaming ? '!text-white' : '!text-[#3763e9]' */}
      {/*   } text-base select-none w-full text-center z-41 text-shadow-custom`} */}
      {/* > */}
      {/*   {stage.title} */}
      {/* </Box> */}
    </AnimatedView>
  )
}

StageView.Layout = LiveEventLayout

export default StageView
