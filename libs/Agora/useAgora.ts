import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_AGORA_TOKEN } from '@graphql/events/getAgoraToken'
import { UPDATE_CHANNEL_INFO } from '@graphql/events/updateChannelInfo'
import useLocalStorage from '@libs/useLocalStorage'
import {
  AgoraJoinInput,
  AgoraLeaveInput,
  AgoraUserConfig,
  IAgoraMediaDevices,
  MediaTracks,
  AgoraInstance,
} from '@type/Broadcasting/Agora.type'
import { IAgoraRTC, NetworkQuality } from 'agora-rtc-sdk-ng'
import { useEffect, useMemo, useState } from 'react'
import { setUserLive } from '../Router/useForummRouter'
import { AgoraClient } from './Agora'
import { AgoraListeners, IAgoraRemoteSpeaker } from './util'

export default function useAgora(
  type: 'streamer' | 'meet' | 'viewer' = 'meet',
  channel?: string,
  token?: string
): AgoraInstance {
  const appId = '58c4f0f9fd214f2689591f2bc96368fe'
  const [joinState, setJoinState] = useState<boolean>(false)

  const [userConfig, setUserConfig] = useLocalStorage<AgoraUserConfig>(
    'Forumm_user_media_settings',
    {}
  )

  const [agoraLogs, setAgoraLogs] = useLocalStorage<string>(
    'Forumm_agora_logs',
    ''
  )

  // If the speaker is in the pre-stage lobby.
  const [isInPreStage, setIsInPreStage] = useState<boolean>(false)

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRemoteSpeaker[]>([])
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isDeafened, setIsDeafened] = useState<boolean>(false)
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>({
    uplinkNetworkQuality: 0,
    downlinkNetworkQuality: 0,
  })
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false)
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false)
  const [isLive, setIsLive] = useState<boolean>(false)
  const [isRemoteScreensharing, setRemoteScreensharing] =
    useState<boolean>(false)
  const [userAudioLevels, setUserAudioLevels] = useState<
    Record<string, number>
  >({})

  const [refreshToken] = useLazyQuery(GET_AGORA_TOKEN)

  const [updateChannel] = useMutation(UPDATE_CHANNEL_INFO)

  const [mediaDevices, setMediaDevices] = useState<
    IAgoraMediaDevices | undefined
  >(undefined)

  const getAgora = () => {
    const AgoraRTC = require('agora-rtc-sdk-ng')
    return AgoraRTC
  }

  const agora: IAgoraRTC | undefined = useMemo(() => getAgora(), [])
  const client: AgoraClient = useMemo(
    () => new AgoraClient({ agora: agora!, type, appId, config: userConfig }),
    [type]
  )

  agora?.setLogLevel(3)

  const setDeafened = async (isUserDeafened?: boolean) => {
    setIsDeafened((state) => {
      if (isUserDeafened ?? !state) setMuted(true)
      return isUserDeafened ?? !state
    })
  }

  const setMuted = async (isUserMuted?: boolean) => {
    await client.toggleAudio(isUserMuted)
  }

  const setVideo = async (isUserSharingVideo?: boolean) => {
    await client.toggleVideo()
  }

  const setRecording = (isUserRecording?: boolean) => {
    // setIsRecording(isUserRecording ?? isRecording)
  }

  const setScreenSharing = async (isUserScreenSharing?: boolean) => {
    const isEnabled = isUserScreenSharing ?? !isScreenSharing

    isEnabled
      ? await client.setupScreenshare()
      : await client.teardownScreenshare()

    setIsScreenSharing(isEnabled)
  }

  const handleRemoteScreenshare = (rUsers: IAgoraRemoteSpeaker[]) => {
    // If any user in the stage/breakout is screensharing then = true
    const roomIsScreensharing = !!rUsers.find((user) => {
      if (!user.uid.toString().includes('>screen')) return false
      if (!user.hasVideo) return false
      return true
    })
    setRemoteScreensharing(roomIsScreensharing)
  }

  const setupListeners = (agoraClient: AgoraClient) => {
    //Listen for changes to remote users store.
    agoraClient.on(AgoraListeners.REMOTE_USERS_CHANGE, (data) => {
      handleRemoteScreenshare(data)
      setRemoteUsers(data)
      if (remoteUsers.length === data.length) updateChannelInfo()
    })

    //Listen for changes to local audio track.
    agoraClient.on(AgoraListeners.LOCAL_AUDIO_TRACK, (data) =>
      setLocalMediaTracks((state) => ({
        ...state,
        audio: { ...state.audio, camera: data },
      }))
    )

    //Listen for changes to local video track.
    agoraClient.on(AgoraListeners.LOCAL_VIDEO_TRACK, (data) =>
      setLocalMediaTracks((state) => ({
        ...state,
        video: { ...state.video, camera: data },
      }))
    )

    //Listen for changes to local screen tracks.
    agoraClient.on(AgoraListeners.LOCAL_SCREEN_TRACK, (data) => {
      setLocalMediaTracks((state) => {
        const payload = state
        if (data[0]) payload.video.screen = data[0]
        if (data[1]) payload.audio.screen = data[1]

        return payload
      })
    })

    //Listen for changes to local video track.
    agoraClient.on(AgoraListeners.SCREENSHARE_TOGGLED, (data) =>
      setIsScreenSharing(data)
    )

    agoraClient.on(AgoraListeners.SCREENSHARE_CANCELLED, (isCancelled) => {
      if (isCancelled) setIsScreenSharing(false)
    })

    //Listen for when the user's camera is enabled/disabled.
    agoraClient.on(AgoraListeners.CAMERA_TOGGLED, (data) => {
      setIsVideoOn(data)
    })

    //Listen for when the user's microphone is enabled/disabled.
    agoraClient.on(AgoraListeners.MICROPHONE_TOGGLED, (data) =>
      setIsMuted(!data)
    )

    //Listen for when the user's microphone is enabled/disabled.
    agoraClient.on(AgoraListeners.NETWORK_ISSUES, (data) => {
      setNetworkQuality(data)
    })

    agoraClient.on(AgoraListeners.LOGGER_REQUESTED, (data) => {
      let prevLogs: any[]
      let payload: any[] | string
      prevLogs = JSON.parse(agoraLogs)
      prevLogs.push(data)
      payload = prevLogs
      setAgoraLogs(JSON.stringify(payload))
    })

    agoraClient.on(AgoraListeners.TOKEN_RENEWED, (data) => {
      if (!client.client.channelName) return

      refreshToken({
        variables: { channelName: client.client.channelName },
      })
        .then((res) => res.data?.getAgoraToken)
        .then((token) => client.client.renewToken(token!))
    })
  }

  const setupEvents = () => {
    const handleSpeakerJoinedGreenRoom = async (e: any) => {
      if (!!e.detail) {
        const { channel, token, userId } = e.detail
        join(`${channel}-greenroom`, token, userId ?? null, {
          joiningGreenroom: true,
        })
          .then(() => setIsInPreStage(true))
          .then(() => updateChannelInfo())
      }
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

  const goLive = () => {
    if (!joinState) return
    // TODO: update agora UI to decouple greenroom flags from stage logic.
    // setIsInPreStage(false)
    setIsLive(true)
    setUserLive(true)
  }

  const getDevices = async () => {
    const devices = await agora?.getDevices()
    return [...(devices ?? [])]
  }

  const changeMicrophone = (device: MediaDeviceInfo) => {
    setMediaDevices((state) => ({
      microphone: device,
      camera: state?.camera,
    }))
  }

  const changeCamera = (device: MediaDeviceInfo) => {
    setMediaDevices((state) => ({
      microphone: state?.microphone,
      camera: device,
    }))
  }

  const handleDeviceChange = async (device: MediaDeviceInfo) => {
    let audioConfig, videoConfig

    if (device.kind === 'videoinput') {
      if (localMediaTracks.video.camera) {
        localMediaTracks.video.camera.stop()
        localMediaTracks.video.camera.close()
      }

      videoConfig = {
        cameraId: device.deviceId,
      }

      if (userConfig.defaultCamera?.deviceId !== device.deviceId) {
        console.log(
          `Updating Default Camera: ${userConfig.defaultMicrophone?.deviceId} > ${device.deviceId}`
        )
        setUserConfig((state) => ({ ...state, defaultCamera: device }))
      }
    }

    if (device.kind === 'audioinput') {
      if (localMediaTracks.audio.camera) {
        localMediaTracks.audio.camera.stop()
        localMediaTracks.audio.camera.close()
      }

      audioConfig = {
        microphoneId: device.deviceId,
      }

      if (userConfig.defaultMicrophone?.deviceId !== device.deviceId) {
        console.log(
          `Updating Default Microphone: ${userConfig.defaultMicrophone?.deviceId} > ${device.deviceId}`
        )
        setUserConfig((state) => ({ ...state, defaultMicrophone: device }))
      }
    }

    await client.unpublish()
    await client.createVideoTrack(videoConfig)
    await client.createAudioTrack(audioConfig)
    await client.publish()
  }

  useEffect(() => {
    if (mediaDevices) {
      if (mediaDevices.camera) {
        handleDeviceChange(mediaDevices.camera)
      }
      if (mediaDevices.microphone) {
        handleDeviceChange(mediaDevices.microphone)
      }
    }
  }, [mediaDevices])

  const [localMediaTracks, setLocalMediaTracks] = useState<MediaTracks>({
    audio: {
      camera: undefined,
      screen: undefined,
    },
    video: {
      camera: undefined,
      screen: undefined,
    },
  })

  const join = async (
    channel: string,
    token?: string,
    uid?: string | number | null,
    options: AgoraJoinInput = { joiningGreenroom: false, joinAsViewer: false }
  ) => {
    await client.leave({ destroyMedia: false }).then(async () => {
      setJoinState(false)
      await client
        .join(channel, token, `${uid}${options.joinAsViewer ? ':v:' : ''}`)
        .then((c) => {
          setupListeners(c)
          return c
        })
        .then(async (c) => {
          if (
            c.type === 'meet' ||
            (isInPreStage && !options.joinAsViewer) ||
            options.joiningGreenroom
          ) {
            await c.unpublish()
            await c.createAudioTrack(undefined, { overwrite: false })
            await c.createVideoTrack(undefined, { overwrite: false })
            await c.publish()
          }
          return c
        })
        .then(() => setJoinState(true))
        .then(() => updateChannel({ variables: { channelName: channel } }))
    })
  }

  const leave = async (options?: AgoraLeaveInput) => {
    setUserLive(false)
    if (options?.unpublishOnly) {
      await client
        .unpublish()
        .then(async () => {
          if (options?.leavePrestage) setIsInPreStage(false)
        })
        .then(async () => {
          await client.teardownScreenshare()
        })
        .then(async () => setIsLive(false))
      return
    }

    await client
      .leave()
      .then(() => {
        if (options?.leavePrestage) setIsInPreStage(false)
      })
      .then(() => setJoinState(false))
      .then(() => setIsLive(false))
      .then(() => setRemoteUsers([]))
      .then(() => {
        if (client.client.channelName)
          updateChannel({
            variables: { channelName: client.client.channelName },
          })
      })
  }

  useEffect(() => {
    const teardownListeners = setupEvents()

    return () => {
      teardownListeners()
      if (client.client.channelName)
        updateChannel({
          variables: { channelName: client.client.channelName },
        })
      client.leave()
    }
  }, [])

  const updateChannelInfo = () => {
    try {
      if (client?.client?.channelName) {
        setTimeout(() => {
          updateChannel({
            variables: { channelName: client.client.channelName! },
          })
        }, 3000)
      }
    } catch (err) {
      console.error('update channel failed', err)
    }
  }

  return {
    joinState,
    leave,
    join,
    remoteUsers,
    isMuted,
    setMuted,
    isRecording,
    setRecording,
    isVideoOn,
    setVideo,
    isScreenSharing,
    setScreenSharing,
    client: client.client,
    isInPreStage,
    isLive,
    goLive,
    mediaDevices,
    getDevices,
    changeCamera,
    changeMicrophone,
    localMediaTracks,
    networkQuality,
    updateChannelInfo,
    isRemoteScreensharing,
    isDeafened,
    setDeafened,
  }
}
