/* eslint-disable react-hooks/rules-of-hooks */
import { getYoutubeVideoId, isYoutubeUrl } from '@libs/Utility/parsers'
import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube'

interface VideoModalProps {
  isOpen: boolean
  videoUrl: string
  onClose: () => void
  isImage?: boolean
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  videoUrl,
  onClose,
  isImage,
}) => {
  if (!isOpen) return null

  const [youtubeId, setYoutubeId] = useState('')

  useEffect(() => {
    setYoutubeId(getYoutubeVideoId(videoUrl))
  }, [videoUrl])

  const isYouTubeVideo = isYoutubeUrl(videoUrl)

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {isImage && (
          <img
            src={videoUrl}
            alt=""
            width={'100%'}
            height={'100%'}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        )}
        {isYouTubeVideo && (
          <YouTube
            videoId={youtubeId}
            iframeClassName="w-full h-full"
            style={{ height: '550px' }}
            className="flex w-full overflow-hidden"
            opts={{
              height: '100%',
              width: '100%',
            }}
          />
        )}
        {!isYouTubeVideo && !isImage && (
          <video src={videoUrl} controls autoPlay className="w-full h-full" />
        )}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full py-1 px-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700"
        >
          X
        </button>
      </div>
    </div>
  )
}

export default VideoModal
