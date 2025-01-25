import { getContentThumbnail } from '@libs/Utility/parsers'
import { CSSProperties, MouseEvent, useEffect, useState } from 'react'
import ForummLogo from '@public/images/ForummLogo.svg'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { v4 } from 'uuid'
import { StaticImageData } from 'next/image'

interface MediaThumbnailProps {
  media?: string | StaticImageData | null
  key?: string
  className?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'any'
  timeout?: number
  onClick?: (e: MouseEvent) => void
  show?: boolean
  style?: CSSProperties
}

export const MediaThumbnail = ({
  show = true,
  style = {},
  media,
  key,
  size = 'sm',
  className = '',
  alt,
  timeout = 3000,
  onClick = (e) => {},
}: MediaThumbnailProps) => {
  const [thumbnail, setThumbnail] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const sizeClasses = {
    any: '',
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14',
  }

  useEffect(() => {
    ;(async () => {
      if (media) {
        setLoading(true)
        await getContentThumbnail(media)
          .then((data) => {
            setThumbnail(data)
            setLoading(false)
          })
          .catch((err) => {
            console.error(err)
            setLoading(false)
          })
      }
    })()
  }, [media])

  setTimeout(() => setLoading(false), timeout)

  if (!show) return <></>

  if (!thumbnail && loading)
    return <LoadingSpinner className={`${sizeClasses[size]} ${className}`} />

  if (!thumbnail)
    return <ForummLogo className={`${sizeClasses[size]} ${className}`} />

  return (
    <img
      style={style}
      onClick={(e) => onClick(e)}
      className={`${sizeClasses[size]} ${className} object-cover`}
      alt={alt ?? 'Media thumbnail'}
      key={key}
      src={thumbnail}
      draggable={false}
    />
  )
}
