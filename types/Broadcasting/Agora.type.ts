import { ProfileInfo } from '@type/Hooks/useAuth/Auth.type'
import {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  NetworkQuality,
} from 'agora-rtc-sdk-ng'

export interface IAgoraToForummUser
  extends Partial<ProfileInfo>,
    Partial<IAgoraRTCRemoteUser> {
  isScreen: boolean
  isLocalScreen: boolean
  isLocalTrack: boolean
}

export interface IAgoraMediaDevices {
  microphone?: MediaDeviceInfo
  camera?: MediaDeviceInfo
}

export interface MediaTracks {
  video: Record<'camera' | 'screen', ILocalVideoTrack | undefined>
  audio: Record<'camera' | 'screen', ILocalAudioTrack | undefined>
}

export interface RemoteMediaTracks {
  video: Record<'camera' | 'screen', IRemoteVideoTrack | undefined>
  audio: Record<'camera' | 'screen', IRemoteAudioTrack | undefined>
}

export interface AgoraUserConfig {
  defaultCamera?: MediaDeviceInfo
  defaultMicrophone?: MediaDeviceInfo
  isVideoOnByDefault?: boolean
  isAudioOnByDefault?: boolean
}

export interface AgoraJoinInput {
  joiningGreenroom?: boolean
  joinAsViewer?: boolean
}

export interface AgoraLeaveInput {
  leavePrestage?: boolean
  unpublishOnly?: boolean
}

export interface AgoraInstance {
  client: IAgoraRTCClient | undefined
  joinState: boolean
  remoteUsers: IAgoraRTCRemoteUser[]
  isMuted: boolean
  isRecording: boolean
  isScreenSharing: boolean
  isRemoteScreensharing: boolean
  isVideoOn: boolean
  isInPreStage: boolean
  isLive: boolean
  isDeafened: boolean
  setDeafened: (isUserDeafened?: boolean) => void
  goLive: () => void
  setMuted: (isUserMuted?: boolean) => void
  setVideo: (isUserSharingVideo?: boolean) => void
  setRecording: (isUserRecording?: boolean) => void
  setScreenSharing: (isUserScreenSharing?: boolean) => void
  updateChannelInfo: () => void
  join: (
    channel: string,
    token?: string,
    uid?: string | number | null,
    options?: AgoraJoinInput
  ) => Promise<void>
  leave: (options?: AgoraLeaveInput) => Promise<void>
  mediaDevices: IAgoraMediaDevices | undefined
  getDevices: () => Promise<MediaDeviceInfo[]>
  changeCamera: (cameraDevice: MediaDeviceInfo) => void
  changeMicrophone: (microphoneDevice: MediaDeviceInfo) => void
  localMediaTracks: MediaTracks
  networkQuality: NetworkQuality
}
