import { playOnElement } from '@libs/Agora/util'
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng'
import React, { useEffect, useRef } from 'react'
import Box from './Box'

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined
  key: string
  fitType?: 'contain' | 'cover' | 'fill'
  className?: string
  children?: React.ReactNode
  mirror?: boolean
  style?: Object
  muteAudio?: boolean
}

const MediaPlayer = ({
  key,
  videoTrack,
  audioTrack,
  children,
  className = 'relative',
  fitType = 'contain',
  mirror = false,
  style = {},
  muteAudio = false,
}: VideoPlayerProps) => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return
    if (!!videoTrack?.play)
      return videoTrack?.play(container.current, {
        fit: fitType,
        mirror: mirror,
      })

    const teardown = playOnElement(
      videoTrack as unknown as MediaStream,
      container.current
    )

    return () => {
      if (videoTrack?.stop) videoTrack?.stop()
      if (teardown) teardown()
    }
  }, [container, fitType, mirror, videoTrack])

  useEffect(() => {
    if (audioTrack) {
      if (!muteAudio) {
        if (!!audioTrack.play) audioTrack.play()
      } else {
        if (!!audioTrack.stop) audioTrack.stop()
      }
    }
    return () => {
      if (!!audioTrack?.stop) audioTrack?.stop()
    }
  }, [audioTrack, muteAudio])

  return (
    <Box
      key={key}
      innerRef={container}
      className={`${className}`}
      style={style}
    >
      {children}
    </Box>
  )
}

export default MediaPlayer
