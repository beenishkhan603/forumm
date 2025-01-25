import { useMutation } from '@apollo/client'
import { EventSpeaker, Maybe } from '@graphql/__generated/graphql'
import { AgoraInstance } from '@type/Broadcasting/Agora.type'
import { createContext, useContext } from 'react'

export type AgoraLocalData = Omit<
  AgoraInstance,
  | 'remoteUsers'
  | 'join'
  | 'leave'
  | 'goLive'
  | 'updateChannelInfo'
  | 'isRemoteScreensharing'
>

export type AgoraRemoteData = Pick<
  AgoraInstance,
  'remoteUsers' | 'isRemoteScreensharing'
>

export type AgoraActions = Pick<
  AgoraInstance,
  'join' | 'leave' | 'goLive' | 'updateChannelInfo'
>

export interface ForummSessionData {
  speakers?: Maybe<EventSpeaker[]>
  totalUsers?: Maybe<Number>
}

export interface AgoraContextType {
  remoteData: AgoraRemoteData
  localData?: AgoraLocalData
  sessionData?: ForummSessionData
  actions?: AgoraActions
}

export const AgoraContext = createContext<AgoraContextType>({
  remoteData: {
    remoteUsers: [],
    isRemoteScreensharing: false,
  },
  localData: undefined,
  actions: undefined,
  sessionData: undefined,
})

export const useAgoraContext = () => {
  const agora = useContext<AgoraContextType>(AgoraContext)

  return { ...agora }
}

export type AgoraContextMapInput = AgoraInstance & ForummSessionData

export const mapAgoraToContext = (a: AgoraContextMapInput) => {
  const agoraLocalData: AgoraLocalData = {
    isLive: a.isLive,
    isInPreStage: a.isInPreStage,
    joinState: a.joinState,
    localMediaTracks: a.localMediaTracks,
    isMuted: a.isMuted,
    setMuted: a.setMuted,
    isRecording: a.isRecording,
    setRecording: a.setRecording,
    isScreenSharing: a.isScreenSharing,
    setScreenSharing: a.setScreenSharing,
    isVideoOn: a.isVideoOn,
    setVideo: a.setVideo,
    client: a.client,
    mediaDevices: a.mediaDevices,
    getDevices: a.getDevices,
    changeCamera: a.changeCamera,
    changeMicrophone: a.changeMicrophone,
    networkQuality: a.networkQuality,
    isDeafened: a.isDeafened,
    setDeafened: a.setDeafened,
  }

  const agoraRemoteData: AgoraRemoteData = {
    remoteUsers: a.remoteUsers,
    isRemoteScreensharing: a.isRemoteScreensharing,
  }

  const agoraActions: AgoraActions = {
    join: a.join,
    leave: a.leave,
    goLive: a.goLive,
    updateChannelInfo: a.updateChannelInfo,
  }

  const sessionData: ForummSessionData = {
    speakers: a.speakers,
    totalUsers: a.totalUsers,
  }

  return {
    localData: agoraLocalData,
    remoteData: agoraRemoteData,
    actions: agoraActions,
    sessionData,
  }
}
