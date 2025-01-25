import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useRouter } from 'next/router'
import { useEvent } from '@libs/useEvent'
import Image from 'next/image'
import YouTube from 'react-youtube'
import {
  getMediaType,
  isSupportedVideoService,
  isYoutubeUrl,
  parseHoldingVideoURL,
} from '@libs/Utility/parsers'
import useStatistics from '@libs/useStatistics'
import { useEffect, useState } from 'react'

export default function OnDemand() {
  const _statisticId = useStatistics()
  const VideoContentType = ['mov', 'mp4']
  const ImageContentType = ['png', 'jpg', 'jpeg', 'avif']
  const { query, back } = useRouter()
  const [contentType, setContentType] = useState<string>()
  const { event } = useEvent()
  const content = event?.ondemandContent?.filter(
    (odc) => odc.id === query.contentId
  )[0]

  useEffect(() => {
    getMediaType(content?.url ?? '')
      .then((t) => {
        if (isSupportedVideoService(content?.url ?? '')) {
          if (isYoutubeUrl(content?.url ?? '')) return 'YOUTUBE'
          return 'VIDEO'
        }
        return t
      })
      .then((t) => setContentType(t))
  }, [content])

  // if (!contentType) back()
  console.log({ contentType, content })
  return (
    <AnimatedView>
      <Box className="p-8 h-full flex flex-col">
        <Text className="text-white text-2xl">
          {content?.title ?? 'Placeholder Title'}
        </Text>
        {/* {contentType?.trim().toLowerCase() === 'pdf' && ( */}
        {/*   <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"> */}
        {/*     <Viewer fileUrl={content?.url ?? ''} /> */}
        {/*   </Worker> */}
        {/* )} */}
        {contentType === 'VIDEO' && (
          <video
            src={content?.url}
            title="Forumm Media Player"
            className="mt-6 rounded w-full h-full"
            controls
          />
        )}
        {contentType === 'YOUTUBE' && (
          // @ts-ignore
          <YouTube
            videoId={content?.url}
            /* iframeClassName="pointer-events-none " */
            className="h-full"
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                version: 3,
                loop: 0,
                playlist: parseHoldingVideoURL(content?.url ?? ''),
                autoplay: 0,
                mute: 0,
                modestbranding: 1,
                showinfo: 0,
                controls: 1,
                enablejsapi: 1,
                rel: 0,
              },
            }}
          />
        )}
        {contentType === 'IMAGE' && (
          <Image
            src={content?.url ?? ''}
            title="Forumm Media Player"
            className="mt-6 rounded w-full h-full"
            layout="fill"
            objectFit="contain"
            alt={content?.title ?? 'Alt text fallback text'}
          />
        )}
      </Box>
      <ActionButtons />
    </AnimatedView>
  )
}

OnDemand.Layout = LiveEventLayout
