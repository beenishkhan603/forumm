import { uploadFile } from '@aws-amplify/ui'
import Modal from '@components/base/Modal'
import { getCroppedImg } from '@libs/imageUtils'
import { useAnimationFrame } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { Button } from './Button'
import { v4 } from 'uuid'
import Box from '@components/base/Box'

export interface CropperModalProps {
  originalImageSrc?: string
  setOriginalImageSrc: (src?: string, file?: File) => Promise<void>
  show: boolean
  setShow: (show: boolean) => void
  aspectRatio?: number
  cropShape?: 'rect' | 'round'
}

export const CropperModal = ({
  originalImageSrc,
  setOriginalImageSrc,
  show,
  setShow,
  aspectRatio = 1,
  cropShape = 'rect',
}: CropperModalProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedImage, setCroppedImage] = useState<{
    url: string
    blob: Blob | null
  } | null>()
  const [animating, setAnimating] = useState(true)

  const onCropComplete = useCallback(
    async (croppedArea: Area, croppedAreaPixels: Area) => {
      const croppedImage = await getCroppedImg(
        originalImageSrc!,
        croppedAreaPixels,
        0
      )
      setCroppedImage(croppedImage)
    },
    [originalImageSrc]
  )
  return (
    <Modal
      show={originalImageSrc != null && show}
      setShow={async () => {
        setShow(false)
        await setOriginalImageSrc()
      }}
      animating={(animating) => {
        setAnimating(animating)
      }}
    >
      <Box className="relative h-[60vh] w-full">
        {!animating && (
          // Started causing a build error out of the blue, works fine.
          // @ts-ignore
          <Cropper
            image={originalImageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{ containerClassName: 'z-50' }}
            cropShape={cropShape}
          />
        )}
      </Box>
      <Button
        title="Crop"
        className="w-full mt-4"
        onClick={async () => {
          if (croppedImage && croppedImage.blob) {
            const file = new File([croppedImage.blob], `${v4()}.jpg`, {
              type: 'image/jpeg',
            })
            await setOriginalImageSrc(croppedImage.url, file)
          } else {
            await setOriginalImageSrc(originalImageSrc)
          }
          setShow(false)
        }}
      />
    </Modal>
  )
}
