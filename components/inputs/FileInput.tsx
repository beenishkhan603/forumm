import AddImage from '@components/event/AddImage'
import { MdEdit } from 'react-icons/md'
import LoadingSpinner from '@components/base/LoadingSpinner'
import React, { useState, useEffect } from 'react'
import { BaseInputProps } from './BaseInputProps'
import { Button } from './Button'
import Cropper, { Point } from 'react-easy-crop'
import { Area } from 'react-easy-crop/types'
import { CropperModal } from './CropperModal'
import Box from '@components/base/Box'
import { getYoutubeThumbnail, isYoutubeUrl } from '@libs/Utility/parsers'
import { useTheme } from '@libs/useTheme'
import { getContrastColor } from '@libs/Utility/util'
import { MediaThumbnail } from '@components/ui/MediaThumbnail'

export interface FileInputProps
  extends Omit<BaseInputProps, 'onChange' | 'value'> {
  /**
   * Error message to display.
   */
  errorMessage?: string
  /**
   * Callback with value when the input value changes.
   */
  onChange?: (value?: File | string) => void

  uploadFile?: (value: File) => Promise<string>

  value?: File | string

  crop?: boolean
  cropAspectRatio?: number
  cropShape?: 'rect' | 'round'
  showProgress?: boolean
  minified?: boolean
  hintPosition?: 'top' | 'bottom'
  type?: string
}

/**
 * Primary UI component for text input
 */
export const FileInput = ({
  label,
  placeholder,
  onChange,
  className,
  errorMessage,
  hint,
  required,
  value,
  uploadFile,
  crop,
  cropAspectRatio = 1,
  cropShape = 'rect',
  showProgress = false,
  minified = false,
  hintPosition = 'top',
  type = 'media',
}: FileInputProps) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null)
  const MIN_FILE_SIZE = 1
  const MAX_FILE_SIZE = 200 * 1024 * 1024
  const VIDEO_FORMATS = ['mov', 'mp4']
  const IMAGE_FORMATS = ['png', 'jpg', 'jpeg']
  const ALLOWED_FORMATS = [...VIDEO_FORMATS, ...IMAGE_FORMATS]
  const [uploadStatus, setUploadStatus] = useState('')
  const [initialValue, setInitialValue] = useState<string>('')

  if (type === 'csv') ALLOWED_FORMATS.push('csv')

  useEffect(() => {
    if (typeof value === 'string') {
      setInitialValue(value)
    }
  }, [value])

  const validateFile = (file: File): { error: { msg: string } | undefined } => {
    if (!file)
      return {
        error: { msg: 'No file selected.' },
      }
    if (!ALLOWED_FORMATS.includes(file.type.split('/')[1]))
      return {
        error: { msg: 'File type not supported.' },
      }

    if (type !== 'csv' && file.size < MIN_FILE_SIZE)
      return {
        error: { msg: 'File too small.' },
      }

    if (file.size > MAX_FILE_SIZE)
      return {
        error: { msg: 'File too large.' },
      }

    return {
      error: undefined,
    }
  }

  const openUploadFile = () => {
    hiddenFileInput.current?.click()
  }

  const hasUploadedImage = () => {
    return value != null && value !== ''
  }

  const getSrc = () => {
    if (value) {
      if (typeof value === 'string') {
        if (isYoutubeUrl(value)) return getYoutubeThumbnail(value)
        return value
      }
      return URL.createObjectURL(value)
    }
  }

  const getMediaElement = () => {
    if (!value) return <></>
    return (
      <MediaThumbnail
        size="xl"
        key={getSrc()?.toString().slice(-10, 0)}
        media={getSrc()?.toString()}
      />
    )
  }

  const [loading, setLoading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const { theme } = useTheme()
  const contrastColor = getContrastColor(theme.highlightColour)

  return (
    <label
      htmlFor="formFile"
      className={['flex flex-col space-y-1', className].join(' ')}
    >
      <CropperModal
        show={showCropper}
        setShow={setShowCropper}
        originalImageSrc={getSrc()}
        aspectRatio={cropAspectRatio}
        cropShape={cropShape}
        setOriginalImageSrc={async (src?: string, file?: File) => {
          if (file) {
            await uploadFile?.(file).then((uploadedCrop) => {
              setUploadStatus(
                uploadedCrop !== '' ? 'Upload Complete' : 'Upload Failed'
              )
              onChange?.(uploadedCrop!)
              setLoading(false)
            })
          } else {
            // This action is called on close, it reset the fileInput too use the initialValue.
            onChange?.(src || initialValue)
          }
        }}
      />
      {!minified &&
        (errorMessage || label || hint) &&
        hintPosition === 'top' && (
          <span
            className={`transition-all text-sm ${
              errorMessage ? 'text-red-500' : ''
            }`}
          >
            {errorMessage ?? label}
            {hint && <span className="ml-2 text-xs">{hint}</span>}
          </span>
        )}
      {!minified && (
        <Box
          className={`flex ${
            hintPosition === 'bottom' ? 'flex-col' : ''
          } items-center space-x-4 mr-12 `}
        >
          {loading ? (
            <LoadingSpinner className="w-20 ml-4" />
          ) : hasUploadedImage() ? (
            getMediaElement()
          ) : (
            <AddImage
              className={`w-20 h-20 rounded object-contain top-0 ml-4 ${
                hintPosition === 'top'
                  ? ''
                  : 'cursor-pointer hover:animate-heartbeat'
              }`}
              onClick={hintPosition === 'bottom' ? openUploadFile : undefined}
            />
          )}

          {(label || errorMessage || hint) && hintPosition === 'bottom' && (
            <span
              className={`flex flex-col items-center transition-all text-sm ${
                errorMessage ? 'text-red-500' : ''
              }`}
            >
              {errorMessage}
              {hint && <span className="ml-2 text-xs">{hint}</span>}
            </span>
          )}
          <Button
            // show={hintPosition === 'top'}
            onClick={openUploadFile}
            size="small"
            title={value ? 'Change Media' : 'Upload Media'}
            className="mt-1 mb-2"
          />
          {uploadStatus !== '' && (
            <Box className={'mx-auto mb-2'}>{uploadStatus}</Box>
          )}
        </Box>
      )}
      {minified && (
        <Box
          onClick={openUploadFile}
          className=" text-white rounded-full p-2 flex items-center cursor-pointer hover:animate-heartbeat"
          style={{
            backgroundColor: theme.highlightColour,
          }}
        >
          <MdEdit
            className="h-4 w-4 inline-block"
            style={{ color: contrastColor }}
          />
        </Box>
      )}
      <input
        required={required}
        className="hidden"
        accept="image/*,.mp4"
        type="file"
        ref={hiddenFileInput}
        onChange={async (e) => {
          if (e.target.files) {
            const { error } = validateFile(e.target.files[0])
            if (error) {
              setUploadStatus(`Upload Failed: ${error.msg}`)
              return false
            }
            if (onChange && crop) {
              onChange(e.target.files[0])
              e.target.value = ''
              setShowCropper(true)
            } else if (onChange) {
              if (uploadFile) {
                setLoading(true)
                const uploadedUrl = await uploadFile(e.target.files[0])
                setUploadStatus(
                  uploadedUrl !== '' ? 'Upload Complete' : 'Upload Failed'
                )
                onChange(uploadedUrl)
                setLoading(false)
              } else {
                onChange(e.target.files[0])
              }
            }
          }
        }}
      />
    </label>
  )
}
