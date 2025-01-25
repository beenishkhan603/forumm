import { StaticImageData } from 'next/image'

export type ForummMediaSource = string | StaticImageData

export enum SUPPORTED_VIDEO_SERVICES {
  VIMEO = 'vimeo',
  YOUTUBE = 'youtube',
}

// ##### Video Source

export const isYoutubeUrl = (url: string): boolean => {
  if (!url) return false
  return (
    url
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .replace('youtu.be/', 'youtube.com')
      .slice(0, 11) === 'youtube.com'
  )
}

export const isVimeoUrl = (url: string): boolean => {
  if (!url) return false
  return (
    url
      .replace('http://', '')
      .replace('https://', '')
      .replace('www.', '')
      .slice(0, 9) === 'vimeo.com'
  )
}

export const isSupportedVideoService = (url: string): boolean => {
  if (!url) return false
  if (isYoutubeUrl(url)) return true
  if (isVimeoUrl(url)) return true
  return false
}

export const getVideoSource = (url: string) => {
  if (!url) throw new Error('A video url is required to determine the source.')
  if (!isSupportedVideoService(url))
    throw new Error(
      'Video is not provided by a supported service. [Vimeo/Youtube]'
    )
  if (isYoutubeUrl(url)) return SUPPORTED_VIDEO_SERVICES.YOUTUBE
  if (url.includes('vimeo')) return SUPPORTED_VIDEO_SERVICES.VIMEO
}

const parseFileType = (ext: string) => {
  switch (ext.toLowerCase()) {
    case '.png':
      return 'PNG'
    case '.jpg':
      return 'JPEG'
    case '.jpeg':
      return 'JPEG'
    case '.mp4':
      return 'MP4'
    case '.mov':
      return 'MOV'
    case '.pdf':
      return 'PDF'
    case '.zip':
      return 'ZIP'
    case '.avi':
      return 'AVI'
    case '.wav':
      return 'WAV'
    case '.wma':
      return 'WMA'
    case '.tif':
      return 'TIF'
    case '.mp3':
      return 'MP3'
    case '.bmp':
      return 'BMP'
    case '.gif':
      return 'GIF'
    case '.webp':
      return 'WEBP'
    case '.csv':
      return 'CSV'
    case '.doc':
      return 'DOC'
    case '.docx':
      return 'DOCX'
    case '.txt':
      return 'TXT'
    default:
      console.warn(`Unhandled file type: ${ext}`)
      return `Unhandled file type: ${ext}`
  }
}

export const getFileType = async (media: ForummMediaSource) => {
  const url = typeof media === 'string' ? media : media.src
  // Is local image
  if (url.includes('/_next/')) {
    const regex = /\.[^.\\/ :*?"<>&|\r\n]+/gi
    const match = url.match(regex)
    if (!match) return 'UNKW'

    return parseFileType(match.pop()!)
  }

  // Is remote image
  if (url.includes('http')) {
    return await fetchFileType(url)
    // return parseFileType(await fetchFileType(url))
  }

  return 'UNKW'
}

export const fetchFileType = async (url: string) => {
  if (!url) return 'UNKW'

  const payload: string = await new Promise((res, rej) => {
    try {
      const req = new XMLHttpRequest()
      if (url.includes('blob:http')) res('PNG')
      req.open('HEAD', url, true)
      req.onload = () => {
        if (req.status === 200) {
          const mime = req
            .getResponseHeader('Content-Type')
            ?.split('/')[1]
            .toUpperCase()
          if (!!mime) res(mime)
          else {
            const retry = getFileTypeFromS3URL(url)
            if (!!retry && retry !== 'UNKW' && retry.length <= 4) return retry
            else rej({ url, message: 'Unable to find file mimetype.' })
          }
        } else rej('An issue occured while parsing the file type.')
      }
      req.onerror = (err) => {
        rej(err)
      }
      // Debug
      // req.onloadstart = (e) => console.log({ loadStart: e })
      // req.onabort = (e) => console.log({ abort: e })
      // req.ontimeout = (e) => console.log({ timeOut: e })
      // req.onloadend = (e) => console.log({ loadEnd: e })
      // req.onreadystatechange = (e) => console.log({ readyStateChange: e })
      req.send()
    } catch (err) {
      rej(err)
    }
  })

  return payload
}

export const getFileTypeFromS3URL = (url: string) => {
  if (!url) return 'UNKW'

  const regex =
    /(?:https?:\/\/)?(?:user-content\/(?:[a-zA-Z-0-9])*\/)+(?:[a-zA-Z0-9-_])*(\.[^&?]{1,4})/

  const match = url.replaceAll(' ', '_').match(regex)

  if (!match) return 'UNKW'

  return parseFileType(match[1])
}

export const getMediaType = async (
  media: string | StaticImageData
): Promise<'IMAGE' | 'VIDEO' | undefined> => {
  const url = typeof media === 'string' ? media : media.src
  if (!url) return undefined
  if (isSupportedVideoService(url)) return 'VIDEO'

  const fileType = await getFileType(url)

  if (['PNG', 'JPEG'].includes(fileType)) return 'IMAGE'
  if (['MP4', 'MOV'].includes(fileType)) return 'VIDEO'

  return undefined
}

// ##### Thumbnails

const generateVideoThumbnail = (url: any, seekTo: number): Promise<string> => {
  url = typeof url === 'string' ? url : url.media
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')

    video.autoplay = true
    video.muted = true
    video.src = url
    video.crossOrigin = 'Anonymous'

    video.onloadeddata = () => {
      if (video.duration < seekTo) reject('Video too short.')

      setTimeout(() => {
        video.currentTime = seekTo
      }, 50)
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      let ctx = canvas.getContext('2d')

      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      video.pause()
      return resolve(canvas.toDataURL('image/png'))
    }
  })
}

export const getVimeoThumbnail = async (videoId: string) => {
  if (!videoId) return undefined

  const res = await fetch(
    `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoId)}`
  )
    .then((d) => d.json())
    .then((d) => d.thumbnail_url)

  return res
}

export const getYoutubeThumbnail = (videoId: string) => {
  if (!videoId) return undefined
  return `https://img.youtube.com/vi/${videoId}/0.jpg`
}

export const getContentThumbnail = async (media: string | StaticImageData) => {
  const url = typeof media === 'string' ? media : media.src
  if (!url) return undefined

  if (isSupportedVideoService(url)) {
    if (isYoutubeUrl(url)) return getYoutubeThumbnail(getYoutubeVideoId(url))
    return await getVimeoThumbnail(url)
  }
  const ft = await getFileType(url).then((fileType) => {
    if (['JPEG', 'JPG', 'PNG'].includes(fileType)) return url
  })

  if (!!ft) return ft

  if (url) return await generateVideoThumbnail(url, 3)
}

// ##### Video Ids

export const getVimeoVideoId = (url: string) => {
  if (!url) return ''
  if (typeof url !== 'string') return ''

  const regex = /(?:https?:\/\/)?(?:vimeo\.com\/)+(?:event\/)?([0-9]+)/

  const match = url.match(regex)
  if (match) {
    if (url.includes('event'))
      return `https://vimeo.com/event/${match[1]}/embed`
    return match[1]
  }

  return ''
}

export const getYoutubeVideoId = (url: string) => {
  if (!url) return ''
  if (typeof url !== 'string') return ''

  const pattern =
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|watch\/|shorts\/|e\/|live\/|attribution_link\?.*v%3D)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([0-9A-Za-z_-]{11})/
  const match = decodeURIComponent(url).match(pattern)
  if (match) {
    if (match.length === 2) return match[1]
    if (match.length > 2)
      return match.reduce((acc, cur) => {
        if (cur.length > acc.length) acc = cur
        return acc
      }, match[1])
  }

  if (url.includes('shorts/')) {
    const regex = /shorts\/([^&?]+)/
    const match = url.match(regex)
    if (match) return match[1]
  }

  if (url.includes('watch?v=')) {
    return url.split('=')[1]
  }

  if (url.includes('embed')) {
    const regex = /(?:https?:\/\/)?(?:embed\/)([^&?]+)/
    const match = url.match(regex)
    if (match) return match[1]
  }

  if (url.includes('youtu.be')) {
    const regex = /(?:https?:\/\/)?(?:youtu\.be\/|watch\?v=)([^&?]+)/
    const match = url.match(regex)
    if (match) return match[1]
  }

  return ''
}

// ##### Misc

export const parseHoldingVideoURL = (url: string): string => {
  if (!url) return ''
  if (typeof url !== 'string') return ''

  if (isYoutubeUrl(url)) return getYoutubeVideoId(url)
  if (isVimeoUrl(url)) return getVimeoVideoId(url)

  return url
}

export const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // validate fragment locator
  return !!urlPattern.test(urlString)
}

export const fixUrlProtocol = (urlString: string): string => {
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    return 'https://' + urlString
  }
  return urlString
}

export const parseTextWithLink = (inputText: string) => {
  if (!inputText) throw new Error('A text string is required to convert.')

  let link, pattern1, pattern2

  //URLs starting with http://, https://, or ftp://
  pattern1 =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  pattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim
  ;('$1<a href="http://$2" target="_blank">$2</a>')

  link = inputText.match(pattern1)

  if (!link) link = inputText.match(pattern2)

  if (!link) return inputText

  const textParts = inputText.replace(link[0], '::MARK::').split('::MARK::')

  return (
    <span>
      {textParts[0] ?? ''}
      <a href={link[0]} target="_blank" rel="noreferrer">
        {link[0]}
      </a>
      {textParts[1] ?? ''}
    </span>
  )
}
