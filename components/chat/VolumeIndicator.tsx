import { useTheme } from '@libs/useTheme'
import React, { useEffect, useRef, useState } from 'react'

const VolumeIndicator = ({
  audioSrc,
  className,
}: {
  audioSrc: MediaStream
  className: string
}) => {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>()
  const [audioStream, setAudioStream] = useState<MediaStream>(audioSrc)

  useEffect(() => {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d')
      if (!!canvasCtx) setCanvasCtx(canvasCtx)
    }
  }, [canvasRef])

  useEffect(() => {
    if (canvasCtx) {
      handleLogic(canvasCtx)
    }
  }, [audioStream, canvasCtx, audioSrc])

  const handleLogic = (canvasCtx: CanvasRenderingContext2D) => {
    if (canvasCtx && audioStream) {
      try {
        const canvas = canvasRef.current ?? { width: 0, height: 0 }
        const audioCtx = new AudioContext()
        const mic = audioCtx.createMediaStreamSource(audioStream)
        const worker = audioCtx.createScriptProcessor(1024, 1, 1)

        let maxL = 0
        let oldL = 0

        mic.connect(worker)
        worker.connect(audioCtx.destination)
        worker.onaudioprocess = (e) => {
          let inputL = e.inputBuffer.getChannelData(0)
          let instantL = 0.0
          let sumL = 0.0

          inputL.forEach((i) => (sumL += i * i))

          instantL = Math.sqrt(sumL / inputL.length)

          maxL = Math.max(maxL, instantL)

          instantL = Math.max(instantL, oldL - 0.008)

          oldL = instantL

          canvasCtx!.clearRect(0, 0, canvas.width, canvas.height)
          canvasCtx!.fillStyle = 'green'
          canvasCtx!.fillRect(
            10,
            10,
            (canvas.width - 20) * (instantL / maxL),
            canvas.height - 20
          ) // x,y,w,h
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <canvas
      className={className}
      ref={canvasRef}
      width="600px"
      height="60px"
      id="test"
      style={{
        background: theme.foregroundColour,
        display: 'inline-block',
        borderRadius: '0.25rem',
        boxShadow: '3px 5px 13px -12px rgba(0, 0, 0, 0.3)',
      }}
    ></canvas>
  )
}

export default VolumeIndicator
