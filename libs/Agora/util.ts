import { IAgoraToForummUser } from '@type/Broadcasting/Agora.type'
import { ProfileInfo } from '@type/Hooks/useAuth/Auth.type'
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'

export interface IAgoraRemoteSpeaker extends IAgoraRTCRemoteUser {
  volume?: number
}

export enum AgoraListeners {
  // 200
  'REMOTE_USERS_CHANGE' = 'remoteUsersChange',
  'LOCAL_VIDEO_TRACK' = 'localVideoTrack',
  'LOCAL_AUDIO_TRACK' = 'localAudioTrack',
  'LOCAL_SCREEN_TRACK' = 'localScreenTrack',
  'SCREENSHARE_TOGGLED' = 'screenShareToggled',
  'MICROPHONE_TOGGLED' = 'microphoneToggled',
  'CAMERA_TOGGLED' = 'cameraToggled',
  'TOKEN_RENEWED' = 'tokenRenewed',

  // 400
  // Screenshare Cancelled
  // @return bool indicating if the screenshare request has been cancelled.
  'SCREENSHARE_CANCELLED' = 'screenShareCancelled',
  'NETWORK_ISSUES' = 'networkIssues',
  'NETWORK_DISCONNECTED' = 'networkDisconnected',
  'LOGGER_REQUESTED' = 'loggerRequested',
}

export const SpeakerJoinedGreenRoomEvent = (data: {
  channel: string
  token?: string
  userId?: string
}) => {
  return new CustomEvent('speaker_joined_green_room', { detail: data })
}

export const AgoraInterfaceError = class extends Error {
  constructor(message: string) {
    super(message)
    this.message = message
    this.name = '[AgoraInterfaceError]'
  }
}

export const mapAgoraUserToForummUser = (
  user: IAgoraRTCRemoteUser,
  forummUsers: ProfileInfo[],
  localProfile?: ProfileInfo
): IAgoraToForummUser | undefined => {
  if (!user || !user.uid) return
  const mappedUser =
    forummUsers?.find((u) => {
      return u.userId === user.uid.toString().slice(0, 36)
    }) ?? {}

  const payload = {
    ...user,
    ...mappedUser,

    isLocalTrack: user.uid.toString() === localProfile?.userId?.toString(),
    isScreen:
      user.uid.toString().includes('>screen') ||
      user.uid.toString().includes('>local_screen'),
    isLocalScreen:
      user.uid.toString() === localProfile?.userId?.toString() ||
      user.uid.toString().includes('>local_screen'),
  }
  return payload
}

export const playOnElement = (stream: MediaStream, element: HTMLDivElement) => {
  const videoEl = document.createElement('video')
  videoEl.setAttribute('playsinline', '')
  videoEl.setAttribute('autoplay', '')
  videoEl.setAttribute('muted', '')

  if (!!stream) {
    videoEl.srcObject =
      (stream as unknown as { stream: MediaStream })?.stream ?? undefined

    element.appendChild(videoEl)
  }
  return () => {
    try {
      element.removeChild(videoEl)
    } catch (e) {
      console.error('PlayOnElement', e)
    }
  }
}
