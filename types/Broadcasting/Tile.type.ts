import { IAgoraRemoteSpeaker } from '@libs/Agora/util'
import {
  IAgoraToForummUser,
  MediaTracks,
  RemoteMediaTracks,
} from './Agora.type'

export interface ITileData {
  user: IAgoraToForummUser | undefined
  isScreenshareOn?: boolean
  audioLevel?: number
}

export interface ITileProps {
  key: string
  className?: string
  mediaTracks: MediaTracks | RemoteMediaTracks
  tileData: ITileData
  fit?: 'cover' | 'contain'
  style?: Object
  options?: {
    useAudioIndicator: boolean
  }
}

export interface TileLayout {
  screens: IAgoraRemoteSpeaker[]
  users: IAgoraRemoteSpeaker[]
}

export interface TileMap {
  screen: JSX.Element[]
  user: JSX.Element[]
}
