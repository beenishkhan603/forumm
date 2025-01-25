import { toArray } from '@libs/Utility/util'
import { AgoraUserConfig, MediaTracks } from '@type/Broadcasting/Agora.type'
import {
  CameraVideoTrackInitConfig,
  IAgoraRTC,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  MicrophoneAudioTrackInitConfig,
  NetworkQuality,
} from 'agora-rtc-sdk-ng'
import moment from 'moment'
import { AgoraListeners } from './util'

type AgoraClientType = 'streamer' | 'meet' | 'viewer'

export interface AgoraInput {
  agora: IAgoraRTC
  type: AgoraClientType
  appId: string
  config?: AgoraUserConfig
}

export class AgoraClient {
  // Agora

  private agora: IAgoraRTC

  public client: IAgoraRTCClient

  public screenClient?: IAgoraRTCClient

  private appId: string

  private userConfig?: AgoraUserConfig

  private remoteUsers: IAgoraRTCRemoteUser[] = []

  private targetRoom?: {
    channel: string
    token?: string
    uid?: string | number | null
  }

  // Indicators

  public isConnected: boolean = false

  public type: AgoraClientType = 'meet'

  private audioEnabled: boolean

  private videoEnabled: boolean

  // Media Tracks

  private audioTrack?: ILocalAudioTrack

  private videoTrack?: ILocalVideoTrack

  private screenTrack?: [ILocalVideoTrack, ILocalAudioTrack | undefined]

  private listeners: Array<[AgoraListeners, (data: any) => void]> = []

  constructor({ agora, type, appId, config }: AgoraInput) {
    this.agora = agora
    this.type = type
    this.appId = appId
    this.client = this.createClient()
    this.userConfig = config
    this.videoEnabled = config?.isVideoOnByDefault ?? false
    this.audioEnabled = config?.isAudioOnByDefault ?? true
    this.initialise()
  }

  private notifyListeners(event: AgoraListeners, payload: any) {
    const cb = this.listeners.find((f) => f[0] === event)
    if (cb) {
      cb[1](payload)
    }
  }

  // Setup Methods

  private initialise() {}

  private createClient() {
    return this.agora.createClient({
      codec: 'h264',
      mode: this.type === 'streamer' || this.type === 'viewer' ? 'live' : 'rtc',
      role:
        this.type === 'streamer' || this.type === 'meet' ? 'host' : 'audience',
    })
  }

  setRemoteUsers(rmtUsers: IAgoraRTCRemoteUser[]) {
    this.remoteUsers = rmtUsers
    this.notifyListeners(AgoraListeners.REMOTE_USERS_CHANGE, this.remoteUsers)
  }

  async renewToken(token: string) {
    const oldtoken = this.targetRoom?.token
    console.log('Token Renewed > ', { oldtoken }, '>', { token })

    if (this.targetRoom) this.targetRoom.token = token
    this.client.renewToken(token)
  }

  private async subscribe() {
    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) => {
      await this.client.subscribe(user, mediaType)
      this.setRemoteUsers(Array.from(this.client.remoteUsers))
      // console.log('userPublished > ', { user, mediaType })
    }

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      this.setRemoteUsers(Array.from(this.client.remoteUsers))
      // console.log('userUnpublished > ', { user })
    }

    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      this.setRemoteUsers(Array.from(this.client.remoteUsers))
      // console.log('userJoined > ', { user })
    }

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      this.setRemoteUsers(Array.from(this.client.remoteUsers))
      // console.log('userLeft > ', { user })
    }

    const handleNetworkQuality = (stats: NetworkQuality) => {
      // console.log('NetQuality > ', { stats })
      this.notifyListeners(AgoraListeners.NETWORK_ISSUES, stats)
    }

    const handleAgoraLogging = (data: any, event: string) => {
      // console.log('AgoraLogger > ', { data })
      this.notifyListeners(AgoraListeners.LOGGER_REQUESTED, {
        event,
        data,
        datetime: moment(),
      })
    }

    // const handleUserSpeak = (volumes: { uid: string; level: number }[]) => {
    //   const usersWithVolumes: Record<string, number> = {}
    //   volumes.forEach((vol: { uid: string; level: number }) => {
    //     usersWithVolumes[vol.uid] = Math.floor(vol.level)
    //   })
    //   setUserAudioLevels(usersWithVolumes)
    //   this.remoteUsers = Array.from(this.client.remoteUsers).map((user) => {
    //       return {
    //         ...user,
    //         hasAudio: user.hasAudio,
    //         hasVideo: user.hasVideo,
    //         videoTrack: user.videoTrack,
    //         audioTrack: user.audioTrack,
    //         volume: usersWithVolumes[user.uid] ?? 0,
    //       }
    //     })
    //   )
    // }
    // this.client.enableAudioVolumeIndicator()

    this.client.on('user-published', handleUserPublished)
    this.client.on('user-unpublished', handleUserUnpublished)
    this.client.on('user-joined', handleUserJoined)
    this.client.on('user-left', handleUserLeft)

    this.client.on('network-quality', handleNetworkQuality)

    this.client.on('live-streaming-error', (e: any) =>
      handleAgoraLogging(e, 'live-streaming-error')
    )

    this.client.on('token-privilege-will-expire', () =>
      this.notifyListeners(AgoraListeners.TOKEN_RENEWED, true)
    )

    this.client.on('token-privilege-did-expire', (e: any) =>
      handleAgoraLogging(e, 'token-privilege-did-expire')
    )

    this.client.on('connection-state-change', (e: any) =>
      handleAgoraLogging(e, 'connection-state-change')
    )

    this.client.on('exception', (e: any) => handleAgoraLogging(e, 'exception'))

    this.client.on('media-reconnect-start', (e: any) =>
      handleAgoraLogging(e, 'media-reconnect-start')
    )

    this.client.on('live-streaming-warning', (e: any) =>
      handleAgoraLogging(e, 'live-streaming-warning')
    )

    this.client.on('channel-media-relay-state', (e: any) =>
      handleAgoraLogging(e, 'channel-media-relay-state')
    )

    // this.client.on('volume-indicator', handleUserSpeak)
  }

  async createVideoTrack(
    config?: CameraVideoTrackInitConfig,
    options: { overwrite?: boolean } = { overwrite: true }
  ) {
    if (this.videoTrack && !options.overwrite) return this

    const userDefault = this.userConfig?.defaultCamera?.deviceId
      ? { cameraId: this.userConfig.defaultCamera.deviceId }
      : undefined

    await this.agora
      .createCameraVideoTrack(config ?? userDefault)
      .then((videoTrack) => {
        videoTrack.setEncoderConfiguration(
          this.type === 'meet' ? '240p_1' : '480p_1'
        )
        return videoTrack
      })
      .then((videoTrack) => (this.videoTrack = videoTrack))
      .then(() =>
        this.notifyListeners(AgoraListeners.LOCAL_VIDEO_TRACK, this.videoTrack)
      )
    return this
  }

  async createAudioTrack(
    config?: MicrophoneAudioTrackInitConfig,
    options: { overwrite?: boolean } = { overwrite: true }
  ) {
    if (this.audioTrack && !options.overwrite) return this

    const userDefault = this.userConfig?.defaultMicrophone?.deviceId
      ? { microphoneId: this.userConfig.defaultMicrophone.deviceId }
      : undefined

    await this.agora
      .createMicrophoneAudioTrack(config ?? userDefault)
      .then((audioTrack) => (this.audioTrack = audioTrack))
      .then(() =>
        this.notifyListeners(AgoraListeners.LOCAL_AUDIO_TRACK, this.audioTrack)
      )
    return this
  }

  async createScreenTracks() {
    await this.agora
      .createScreenVideoTrack({ optimizationMode: 'detail' }, 'auto')
      .then((screenTrack) => {
        toArray(screenTrack).forEach((track) => {
          ;(track as ILocalVideoTrack).on('track-ended', () =>
            this.teardownScreenshare()
          )
        })

        return screenTrack
      })
      .then((screenTrack) => {
        this.screenTrack = Array.isArray(screenTrack)
          ? screenTrack
          : [screenTrack, undefined]

        return screenTrack
      })
      .then(() =>
        this.notifyListeners(
          AgoraListeners.LOCAL_SCREEN_TRACK,
          this.screenTrack
        )
      )
    return this
  }

  async setupScreenshare() {
    if (!this.client || !this.targetRoom) return this
    if (!this.screenClient) this.screenClient = this.createClient()
    if (!this.screenTrack) {
      try {
        const { channel, token, uid } = this.targetRoom!
        const payload: Array<ILocalAudioTrack | ILocalVideoTrack> = []

        await this.screenClient!.join(
          this.appId,
          channel,
          token ?? null,
          `${uid}>screen`
        ).then(async () => {
          await this.createScreenTracks()
            .then(async (a) => {
              await a.screenClient!.unpublish()
              return a
            })
            .then(async (a) => {
              a.screenTrack!.forEach((track) => {
                if (track) payload.push(track)
              })
              if (payload.length > 0)
                await a
                  .screenClient!.publish(payload)
                  .then(() =>
                    this.notifyListeners(
                      AgoraListeners.SCREENSHARE_TOGGLED,
                      true
                    )
                  )
              return a
            })
          return this
        })
      } catch (e) {
        console.error(e)
        this.notifyListeners(AgoraListeners.SCREENSHARE_CANCELLED, true)
        this.teardownScreenshare()
        return this
      }
    }

    return this
  }

  async teardownScreenshare() {
    if (
      this.screenClient &&
      this.screenClient.connectionState === 'CONNECTED'
    ) {
      await this.screenClient.unpublish()
      await this.screenClient.leave()

      // Release local screen tracks
      if (this.screenTrack) {
        this.screenTrack.forEach((track) => {
          track?.stop()
          track?.close()
        })
        this.screenTrack = undefined
      }

      // Teardown screenshare client
      if (this.screenTrack) this.screenClient = undefined
      this.notifyListeners(AgoraListeners.SCREENSHARE_TOGGLED, false)
    }
  }

  async join(channel: string, token?: string, uid?: string | number | null) {
    if (['CONNECTING', 'RECONNECTING'].includes(this.client.connectionState))
      return this

    this.targetRoom = { channel, token, uid }

    this.setRemoteUsers([])

    await this.client
      .join(this.appId, channel, token ?? null, uid)
      .then((data) => {
        if (data) this.isConnected = true
        this.subscribe()
      })
    return this
  }

  getLocalMediaTracks(): MediaTracks {
    let payload: MediaTracks = {
      audio: {
        camera: undefined,
        screen: undefined,
      },
      video: {
        camera: undefined,
        screen: undefined,
      },
    }

    if (this.videoTrack) {
      payload.video.camera = this.videoTrack
    }

    if (this.audioTrack) {
      payload.audio.camera = this.audioTrack
    }

    if (this.screenTrack) {
      payload.video.screen = this.screenTrack[0]
      payload.audio.screen = this.screenTrack[1]
    }
    return payload
  }

  async leave(options: { destroyMedia?: boolean } = { destroyMedia: true }) {
    await this.teardownScreenshare()
    await this.unpublish().then(() => {
      if (options.destroyMedia) {
        if (this.videoTrack) {
          this.videoTrack.stop()
          this.videoTrack.close()
          this.videoTrack = undefined
        }

        if (this.audioTrack) {
          this.audioTrack.stop()
          this.audioTrack.close()
          this.audioTrack = undefined
        }
      }
    })

    await this.client.leave().then(() => {
      this.remoteUsers = []
    })
  }

  async unpublish() {
    if (this.client.connectionState === 'CONNECTED')
      try {
        await this.client.unpublish()
      } catch (e) {
        console.warn(e)
      }
    return this
  }

  async publish() {
    await this.unpublish()
    const tracksToPublish = []
    if (this.audioTrack) tracksToPublish.push(this.audioTrack)
    if (this.videoTrack) tracksToPublish.push(this.videoTrack)

    if (
      this.client.connectionState === 'CONNECTED' &&
      tracksToPublish.length > 0
    ) {
      this.client.publish(tracksToPublish).then(() => this.handlePostPublish())
    }
    return this
  }

  // Need to publish tracks to show as a remote user in peer's video container.
  // We can mute the track afterwards
  private handlePostPublish = async () => {
    if (this.videoTrack) this.toggleVideo(this.videoEnabled)
    // TODO: Implement audio track default state.
    // this.audioTrack?.setMuted(!this.audioEnabled)
  }

  async toggleAudio(val?: boolean) {
    if (this.audioTrack) {
      const isMuted = val === undefined ? this.audioEnabled : val
      this.audioTrack.setMuted(isMuted)
      this.audioEnabled = !isMuted
      // Notify will return a bool value that indicated if the mic is enabled/unmuted
      this.notifyListeners(AgoraListeners.MICROPHONE_TOGGLED, !isMuted)
      this.notifyListeners(AgoraListeners.LOCAL_AUDIO_TRACK, this.audioTrack)
    }
  }

  // True === Mute, False !== Mute
  async toggleVideo(val?: boolean) {
    if (this.videoTrack) {
      const isMuted = val ?? !this.videoEnabled
      this.videoTrack.setMuted(!isMuted)
      this.videoEnabled = isMuted
      this.notifyListeners(AgoraListeners.CAMERA_TOGGLED, isMuted)
      this.notifyListeners(AgoraListeners.LOCAL_VIDEO_TRACK, this.videoTrack)
    }
  }

  on(event: AgoraListeners, callback?: (data: any) => void): void {
    if (!event || !callback) return
    this.listeners.push([event, callback])
  }
}
