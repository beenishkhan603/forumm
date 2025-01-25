import Box from '@components/base/Box'
import {
  BiVideoOff,
  BiVideo,
  BiMicrophoneOff,
  BiMicrophone,
  BiExit,
  BiDevices,
} from 'react-icons/bi'
import {
  BsFullscreenExit,
  BsVolumeMuteFill,
  BsVolumeUpFill,
} from 'react-icons/bs'

import { TbScreenShareOff, TbScreenShare } from 'react-icons/tb'
import { Button } from '../inputs/Button'
import { AgoraLeaveInput } from '@type/Broadcasting/Agora.type'
import { useEffect, useMemo, useState } from 'react'
import Modal from '@components/base/Modal'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { useAgoraContext } from '@libs/Agora/AgoraContext'
import Tooltip from '@components/tootilp/Tooltip'
import {
  MdOutlineQuestionMark,
  MdOutlineSignalCellularAlt,
  MdOutlineSignalCellularAlt1Bar,
  MdOutlineSignalCellularAlt2Bar,
  MdPeople,
} from 'react-icons/md'
import { useAuth } from '@libs/useAuth'
import { IoClose } from 'react-icons/io5'

const VideoControls = ({
  setFullscreen,
  fullscreen,
  leave,
  type = 'meet',
  isInPreStage,
}: {
  setFullscreen: (show: boolean) => void
  fullscreen: boolean
  leave: (arg0?: AgoraLeaveInput) => void | Promise<void>
  type?: 'streamer' | 'meet' | 'viewer'
  isInPreStage: boolean
}) => {
  const { localData, sessionData, actions } = useAgoraContext()
  const {
    setRecording,
    isRecording,
    setScreenSharing,
    isScreenSharing,
    setVideo,
    setMuted,
    isMuted,
    isVideoOn,
    mediaDevices,
    getDevices,
    changeCamera,
    changeMicrophone,
    networkQuality,
    setDeafened,
    isDeafened,
  } = localData!

  const { totalUsers } = sessionData!
  const { updateChannelInfo } = actions!
  const { isAdmin } = useAuth()

  const [deviceModalOpen, setDeviceModalOpen] = useState<boolean>(false)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>()
  const [networkReport, setNetworkReport] = useState<{
    label: string
    code: number
  }>({ label: 'Checking', code: 0 })
  const [camera, setCamera] = useState<MediaDeviceInfo | undefined>(
    mediaDevices?.camera
  )
  const [microphone, setMicrophone] = useState<MediaDeviceInfo | undefined>(
    mediaDevices?.microphone
  )

  const hasControls =
    (type !== 'viewer' || isAdmin) && (isInPreStage || type === 'meet')

  const openDeviceManager = async () => {
    await getDevices()
      .then((d) => setDevices(d))
      .then(() => setDeviceModalOpen(true))
  }

  const audioDevices = devices?.reduce(
    (acc: MediaDeviceInfo[], val) =>
      val.kind === 'audioinput' ? [...acc, val] : [...acc],
    []
  )

  const videoDevices = devices?.reduce(
    (acc: MediaDeviceInfo[], val) =>
      val.kind === 'videoinput' ? [...acc, val] : [...acc],
    []
  )

  useEffect(() => {
    const net = Math.max(
      networkQuality.downlinkNetworkQuality,
      networkQuality.uplinkNetworkQuality
    )

    // 0: The quality is unknown.
    // 1: The quality is excellent.
    // 2: The quality is good, but the bitrate is less than optimal.
    // 3: Users experience slightly impaired communication.
    // 4: Users can communicate with each other, but not very smoothly.
    // 5: The quality is so poor that users can barely communicate.
    // 6: The network is disconnected and users cannot communicate.

    let report = 'Unknown'
    if (net === 1) report = 'Great'
    if (net >= 2 && net <= 4) report = 'Poor'
    if (net === 5) report = 'Bad'
    if (net === 6) report = 'Lost'

    setNetworkReport({ label: report, code: net })
  }, [networkQuality])

  const deviceModal = useMemo(() => {
    return (
      <Modal
        show={deviceModalOpen}
        setShow={setDeviceModalOpen}
        title={`Manage Devices`}
      >
        <DropdownInput
          label="Audio Devices"
          value={microphone}
          options={
            audioDevices && audioDevices.length > 0
              ? audioDevices?.map((d) => {
                  return {
                    label: d.label,
                    value: JSON.stringify(d),
                  }
                })
              : []
          }
          onChange={(d) => {
            setMicrophone(d)
            changeMicrophone(JSON.parse(d))
          }}
        />

        <DropdownInput
          label="Video Devices"
          value={camera}
          options={
            videoDevices && videoDevices.length > 0
              ? videoDevices?.map((d) => {
                  return {
                    label: d.label,
                    value: JSON.stringify(d),
                  }
                })
              : []
          }
          onChange={(d) => {
            setCamera(d)
            changeCamera(JSON.parse(d))
          }}
        />
        <Button
          className="my-4"
          title={`Close`}
          type="primary"
          onClick={() => {
            setDeviceModalOpen(false)
          }}
        />
      </Modal>
    )
  }, [videoDevices, audioDevices, microphone, camera, deviceModalOpen])

  const streamerControls = (
    <>
      {deviceModal}
      {/* <Box */}
      {/*   className="w-12 h-12 sm:mx-2 bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer hidden sm:flex items-center justify-center" */}
      {/*   onClick={() => { */}
      {/*     setRecording(!recording) */}
      {/*   }} */}
      {/* > */}
      {/*   {recording ? ( */}
      {/*     <BsRecordCircle className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" /> */}
      {/*   ) : ( */}
      {/*     <BsRecordCircle className="sm:w-8 sm:h-8 w-6 h-6 text-white" /> */}
      {/*   )} */}
      {/* </Box> */}

      <Tooltip
        className="w-12 h-12 sm:mx-2 bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer hidden sm:flex items-center justify-center"
        tooltip={`${isScreenSharing ? 'Stop' : 'Start'} Screen share`}
        onClick={() => {
          setScreenSharing(!isScreenSharing)
        }}
      >
        {isScreenSharing ? (
          <TbScreenShareOff className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" />
        ) : (
          <TbScreenShare className="sm:w-8 sm:h-8 w-6 h-6 text-white " />
        )}
      </Tooltip>
      <Tooltip
        tooltip={`${isVideoOn ? 'Stop' : 'Start'} Video`}
        className="w-12 h-12 sm:mx-2 bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer flex items-center justify-center"
        onClick={() => setVideo(!isVideoOn)}
      >
        {isVideoOn ? (
          <BiVideo className="sm:w-8 sm:h-8 w-6 h-6 text-white" />
        ) : (
          <BiVideoOff className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" />
        )}
      </Tooltip>
      <Tooltip
        tooltip={`${isMuted ? 'Unmute' : 'Mute'} Microphone`}
        className="w-12 h-12 sm:mx-2 bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer flex items-center justify-center"
        onClick={() => {
          setMuted(!isMuted)
        }}
      >
        {isMuted ? (
          <BiMicrophoneOff className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" />
        ) : (
          <BiMicrophone className="sm:w-8 sm:h-8 w-6 h-6 text-white " />
        )}
      </Tooltip>

      <Tooltip
        tooltip={`Device Settings`}
        className="w-12 h-12 sm:mx-2 bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer flex items-center justify-center"
        onClick={() => openDeviceManager()}
      >
        <BiDevices className="sm:w-8 sm:h-8 w-6 h-6 text-white" />
      </Tooltip>
    </>
  )

  return (
    <Box className="flex justify-start items-center py-4 px-8 border-t border-t-panel-gray flex-wrap min-h-14">
      {hasControls && streamerControls}

      <Tooltip
        tooltip={`${isDeafened ? 'Unmute' : 'Mute'} Incoming Audio`}
        className="w-12 h-12 sm:mx-2  bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer hidden sm:flex items-center justify-center"
        onClick={() => {
          setDeafened(!isDeafened)
        }}
      >
        {isDeafened ? (
          <BsVolumeMuteFill className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" />
        ) : (
          <BsVolumeUpFill className="sm:w-8 sm:h-8 w-6 h-6 text-white " />
        )}
      </Tooltip>

      {document.fullscreenEnabled && (
        <Tooltip
          tooltip={`${fullscreen ? 'Exit' : 'Open in'} Fullscreen`}
          className="w-12 h-12 sm:mx-2  bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer hidden sm:flex items-center justify-center"
          onClick={() => {
            setFullscreen(!fullscreen)
          }}
        >
          {fullscreen ? (
            <BsFullscreenExit className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" />
          ) : (
            <BsFullscreenExit className="sm:w-8 sm:h-8 w-6 h-6 text-white " />
          )}
        </Tooltip>
      )}

      <Tooltip
        tooltip={`${networkReport.label} Connection`}
        className="w-12 h-12 sm:mx-2  bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer hidden sm:flex items-center justify-center"
        onClick={() => {
          // setFullscreen(!fullscreen)
        }}
      >
        {networkReport.code == 1 ? (
          <MdOutlineSignalCellularAlt className="sm:w-8 sm:h-8 w-6 h-6 text-lime-400" />
        ) : networkReport.code > 1 && networkReport.code < 5 ? (
          <MdOutlineSignalCellularAlt2Bar className="sm:w-8 sm:h-8 w-6 h-6 text-yellow-400" />
        ) : networkReport.code == 5 ? (
          <MdOutlineSignalCellularAlt1Bar className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" />
        ) : networkReport.code == 6 ? (
          <IoClose className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" />
        ) : (
          <MdOutlineQuestionMark className="sm:w-8 sm:h-8 w-6 h-6 text-red-400" />
        )}
      </Tooltip>

      <Tooltip
        tooltip={`${totalUsers ?? 0} User${totalUsers ?? 0 > 1 ? 's' : ''} Connected`}
        className="w-12 h-12 sm:mx-2 bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer hidden sm:flex items-center justify-center"
        onClick={() => {
          // setFullscreen(!fullscreen)
        }}
      >
        <>
          <Box className="text-white text-xs pr-1" ignoreTheme>
            {(totalUsers ?? 0).toString()}
          </Box>
          <MdPeople className="size-6 sm:size-8 text-white" />
        </>
      </Tooltip>

      {hasControls && (
        <>
          <Button
            className="whitespace-nowrap hidden sm:flex sm:mx-2"
            title={'Leave Room'}
            onClick={() => {
              updateChannelInfo()
              leave({ leavePrestage: true })
            }}
          />
          <Tooltip
            tooltip={`Leave ${type === 'meet' ? 'Room' : 'Stage'}`}
            className="w-12 h-12 sm:mx-2 bg-midnight-sky hover:bg-midnight-gray rounded-sm p-3 cursor-pointer flex items-center justify-center sm:hidden"
            onClick={() => {
              updateChannelInfo()
              leave({ leavePrestage: true })
            }}
          >
            <BiExit className="sm:w-8 sm:h-8 w-6 h-6 text-red-500" />
          </Tooltip>
        </>
      )}
      {/* <ActionButtons show={!fullscreen} className="ml-auto" /> */}
    </Box>
  )
}

export default VideoControls
