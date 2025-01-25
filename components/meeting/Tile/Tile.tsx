import Box from '@components/base/Box'
import MediaPlayer from '@components/base/MediaPlayer'
import { IAgoraToForummUser } from '@type/Broadcasting/Agora.type'
import { ITileProps } from '@type/Broadcasting/Tile.type'
import { useEffect, useMemo, useState } from 'react'
import { BiMicrophoneOff } from 'react-icons/bi'
import ProfileImage from '@components/base/ProfileImage'
import { useAgoraContext } from '@libs/Agora/AgoraContext'
import { BsVolumeMuteFill } from 'react-icons/bs'
import { AnimatePresence, motion, MotionProps } from 'framer-motion'

const FALLBACK_USER: Partial<IAgoraToForummUser> = {
  fullName: '',
}

const AUDIO_SENSITIVITY: number = 35

export const Tile = ({
  key,
  mediaTracks,
  className,
  tileData,
  fit = 'contain',
  options,
  style = {},
}: ITileProps) => {
  const [showUserCard, setShowUserCard] = useState(true)
  const [muted, setMuted] = useState(false)

  const { user = FALLBACK_USER, isScreenshareOn, audioLevel } = tileData

  const agoraCtx = useAgoraContext()
  const localMuted = agoraCtx.localData?.isMuted
  const localVideoOn = agoraCtx.localData?.isVideoOn
  const isDeafened = agoraCtx.localData?.isDeafened

  const checkMedia = () => {
    if (user.isLocalTrack) {
      setShowUserCard(!localVideoOn ?? false)
      setMuted(localMuted ?? false)
      return
    }

    if (!!mediaTracks.video.screen) {
      const screenTrack = mediaTracks.video.screen.getMediaStreamTrack()
      setShowUserCard(!screenTrack.enabled)
    } else if (!!mediaTracks.video.camera) {
      const videoTrack = mediaTracks.video.camera.getMediaStreamTrack()
      setShowUserCard(!videoTrack.enabled || videoTrack.muted)
      // if (videoTrack.readyState !== 'live') return setShowUserCard(true)
    } else setShowUserCard(true)

    // Should show muted icon?
    if (!!mediaTracks.audio.camera) {
      const audioTrack = mediaTracks.audio.camera?.getMediaStreamTrack()
      setMuted(!audioTrack.enabled || audioTrack.muted)
    } else setMuted(true)
  }

  useEffect(() => {
    checkMedia()
  }, [mediaTracks, localMuted, localVideoOn])

  // Getters
  const getVideoTrack = () => {
    return mediaTracks.video.camera ?? mediaTracks.video.screen
  }

  const getAudioTrack = () => {
    return mediaTracks.audio.camera
  }

  const getTileName = useMemo(() => {
    if (user.isLocalScreen) return 'You'
    if (user.isScreen) return ''
    if (isScreenshareOn) return `${user.fullName}'s Screen`
    if (user.fullName === 'Deleted User') return ''
    return user.fullName!
  }, [user.fullName, user.isScreen, user.isLocalScreen, isScreenshareOn])

  // Templates

  const uiAnimation: MotionProps = {
    layout: true,
    animate: { y: 0 },
    initial: { y: 50, width: 'auto' },
    exit: { y: 50, width: 0 },
  }

  const content = (options: { hideName: boolean } = { hideName: false }) => {
    return (
      <>
        <Box className="!text-white absolute top-0 left-0 p-2 -mb-1 pb-0 z-40 flex items-center justify-between rounded-lg pr-2 pl-2 text-shadow-custom overflow-hidden whitespace-nowrap truncate">
          {getTileName && !options.hideName && (
            <div className="bg-gray-500 bg-opacity-50 rounded-md p-1 pl-2 pr-2">
              <p className="mb-0">{`${getTileName}`}</p>
            </div>
          )}
        </Box>
        <Box className="absolute bottom-0 w-full z-40 flex items-center justify-center">
          <AnimatePresence presenceAffectsLayout>
            {muted && (
              <motion.div {...uiAnimation}>
                <Box className="flex items-center justify-center bg-gradient-to-t from-white via-transparent via-20%">
                  <BiMicrophoneOff className="text-white m-2 size-6" />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDeafened && (
              <motion.div {...uiAnimation}>
                <Box className="flex items-center justify-center bg-gradient-to-t from-red-400 via-transparent via-20%">
                  <BsVolumeMuteFill className="text-red-400 m-2 size-6" />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </>
    )
  }

  const userCard = () => {
    return (
      <Box
        key={key}
        className={`size-full relative bg-midnight-light2 ${className ?? ''}`}
      >
        <Box className={`flex h-full items-center justify-center`}>
          <Box className="flex flex-col px-2 gap-2 items-center">
            <ProfileImage
              size="lg"
              className="mb-2"
              imageUrl={user.profileImageUrl}
              activityStatus={true}
            />

            <Box className="text-xl font-bold">{user.fullName}</Box>
          </Box>
        </Box>
        {content({ hideName: true })}
      </Box>
    )
  }

  const TilePayload = useMemo(() => {
    return (
      <MediaPlayer
        key={key}
        fitType={fit}
        className={`${className ?? ''}`}
        videoTrack={getVideoTrack()}
        audioTrack={getAudioTrack()}
        mirror={user.isLocalTrack || isScreenshareOn}
        style={style}
        muteAudio={isDeafened}
      >
        {!showUserCard ? content() : userCard()}
      </MediaPlayer>
    )
  }, [mediaTracks, tileData, showUserCard, muted, isDeafened])

  return TilePayload
}
