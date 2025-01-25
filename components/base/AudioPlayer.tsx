import { ILocalAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng'
import React, { useEffect } from 'react'

export interface AudioPlayerProps {
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined
}

const AudioPlayer = ({ audioTrack }: AudioPlayerProps) => {
  useEffect(() => {
    if (audioTrack) {
      audioTrack?.play()
    }
    return () => {
      audioTrack?.stop()
    }
  }, [audioTrack])

  return <></>
}

export default AudioPlayer
