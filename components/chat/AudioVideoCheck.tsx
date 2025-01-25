import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@components/inputs/Button'
import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import { MdOutlineMic } from 'react-icons/md'
import { MdVideocamOff } from 'react-icons/md'
import { MdVideocam } from 'react-icons/md'
import { MdRepeat } from 'react-icons/md'
import VolumeIndicator from './VolumeIndicator'
import { Tile } from '@components/meeting/Tile/Tile'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng'

const VideoRecorder: React.FC = () => {
  const [open, setOpen] = useState<any>()
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const [stream, setMediaStream] = useState<MediaStream>()

  const startRecording = () => {
    // const stream = webcamRef.current?.stream
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        setVideoBlob(blob)
        setVideoUrl(URL.createObjectURL(blob))
        setVideoReady(true)
      }

      mediaRecorder.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  useEffect(() => {
    // let media: MediaStream | undefined = undefined
    // if (open) {
    //   let constraints = { audio: true, video: true }
    //   media = navigator.mediaDevices
    //     .getUserMedia(constraints)
    //     .then((stream) => {
    //       setMediaStream(stream)
    //       return stream
    //     })
    // } else {
    //   if (!!media)
    //     media.getTracks().forEach((t) => {
    //       t.stop()
    //     })
    // }
  }, [open])

  if (!stream) return <LoadingSpinner />

  return (
    <Box className="inline max-w-44">
      <Modal show={open} setShow={setOpen} title={`Check your Webcam and Mic`}>
        <div>
          {!videoReady && (
            <Box className="flex flex-col">
              {/* <Webcam ref={webcamRef} audio={false} /> */}
              <Tile
                key={''}
                tileData={{ user: undefined }}
                className={`rounded relative inline-block align-middle overflow-hidden self-center flex-[9]`}
                style={{}}
                fit={`cover`}
                mediaTracks={{
                  video: {
                    camera: {
                      getMediaStreamTrack: () => stream.getVideoTracks()[0],
                      stream,
                    } as unknown as ILocalVideoTrack,
                    screen: undefined,
                  },
                  audio: {
                    camera: {
                      getMediaStreamTrack: () => stream.getAudioTracks()[0],
                      stream,
                    } as unknown as ILocalAudioTrack,
                    screen: undefined,
                  },
                }}
              />

              <Box className="mt-4 ">
                <Box className="font-medium text-sm">Volume Levels</Box>
                <VolumeIndicator
                  className={'my-2 w-full max-h-10'}
                  audioSrc={stream}
                />
              </Box>
              <div>
                {isRecording ? (
                  <Button
                    icon={<MdVideocamOff />}
                    iconColor="white"
                    iconPos="end"
                    size="auto"
                    title="Stop Recording"
                    onClick={stopRecording}
                    className="mt-4"
                  ></Button>
                ) : (
                  <Button
                    icon={<MdVideocam />}
                    iconColor="white"
                    iconPos="end"
                    size="auto"
                    title="Start Recording"
                    onClick={startRecording}
                    className="mt-4"
                  ></Button>
                )}
              </div>
            </Box>
          )}
          {videoUrl && (
            <div>
              <video controls src={videoUrl} />
              <Button
                size="auto"
                title="Try again"
                icon={<MdRepeat />}
                iconColor="white"
                iconPos="end"
                onClick={() => {
                  setVideoReady(false)
                  setVideoUrl(null)
                }}
                className="mt-4"
              ></Button>
            </div>
          )}
        </div>
      </Modal>
      <Button
        size="auto"
        icon={<MdOutlineMic />}
        iconColor="white"
        iconPos="end"
        title="Audio/Video-Check"
        className="cursor-pointer text-red-400 max-w-44 inline"
        onClick={() => {
          setOpen(true)
        }}
      />
    </Box>
  )
}

export default VideoRecorder
