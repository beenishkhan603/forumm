import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useRouter } from 'next/router'
import { useEvent } from '@libs/useEvent'
/* import { Viewer, Worker } from '@react-pdf-viewer/core' */
/* import '@react-pdf-viewer/core/lib/styles/index.css' */
import Image from 'next/image'
import YouTube from 'react-youtube'
import { parseHoldingVideoURL } from '@libs/Utility/parsers'
import { motion } from 'framer-motion'
import { FaFacebook, FaLink, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Maybe } from 'graphql/jsutils/Maybe'

// Reusable SocialButton Component
type SocialButtonProps = {
  platformUrl: Maybe<string>
  fallbackUrl: string
  icon: React.ReactNode
  label: string
}

const SocialButton: React.FC<SocialButtonProps> = ({
  platformUrl,
  fallbackUrl,
  icon,
  label,
}) => {
  const getSocialLink = (platform: Maybe<string>, fallbackURL?: string) => {
    let link = undefined
    if (platform)
      link = platform
        .replace('https://', 'http://')
        .replace('http://', '')
        .replace('www.', '')
    return !!link ? `http://www.${link}` : fallbackURL ?? false
  }

  const socialLink = getSocialLink(platformUrl, fallbackUrl)

  return (
    <>
      {socialLink && (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Box
            className="p-4 flex-1 max-w-xs text-center cursor-pointer hover:animate-heartbeat"
            onClick={() => window.open(socialLink as string)}
          >
            <Box
              className="p-8 flex flex-col items-center rounded-lg border border-forumm-menu-border"
              color="backgroundColourSecondary"
            >
              {icon}
              <Box
                className="mt-8 font-bold text-lg"
                style={{ minHeight: '60px' }}
              >
                {label}
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}
    </>
  )
}

export default function OnDemand() {
  const VideoContentType = ['mov', 'mp4']
  const ImageContentType = ['png', 'jpg', 'jpeg', 'avif']
  const { query } = useRouter()
  const { event } = useEvent()

  const sponsor = event?.sponsors?.filter((s) => s.title === query.sponsorId)[0]
  const content = sponsor?.ondemandContent ?? []

  const noContent = !content || content.length < 1
  return (
    <AnimatedView>
      <Box className="p-8 h-full flex flex-col">
        <Text className="text-white text-2xl">
          {sponsor?.title ?? 'Event Partner'}
        </Text>
        {sponsor?.description && (
          <Text className="text-white text-base">{sponsor?.description}</Text>
        )}

        <Box
          color="foregroundColour"
          className="mt-4 rounded-2xl flex flex-col p-8 border border-forumm-menu-border flex-2 max-w-[100%] overflow-y-scroll scrollbar-hide"
        >
          {noContent && (
            <Text className="text-white text-xl">
              {sponsor?.title} has not uploaded any media content.
            </Text>
          )}

          <Box className="flex items-center justify-between space-x-16 flex-wrap mr-auto my-4">
            <SocialButton
              platformUrl={sponsor?.facebookUrl}
              fallbackUrl="https://www.facebook.com/448studio/"
              icon={<FaFacebook className="h-8 w-8 my-1 mr-2 cursor-pointer" />}
              label="Visit Facebook"
            />
            <SocialButton
              platformUrl={sponsor?.twitterUrl}
              fallbackUrl="https://www.twitter.com/448studio/"
              icon={<FaTwitter className="h-8 w-8 my-1 mr-2 cursor-pointer" />}
              label="Visit Twitter"
            />
            <SocialButton
              platformUrl={sponsor?.linkedinUrl}
              fallbackUrl="https://www.linkedin.com/company/448studio/"
              icon={<FaLinkedin className="h-8 w-8 my-1 mr-2 cursor-pointer" />}
              label="Visit LinkedIn"
            />
            <SocialButton
              platformUrl={sponsor?.websiteUrl}
              fallbackUrl=""
              icon={<FaLink className="h-8 w-8 my-1 mr-2 cursor-pointer" />}
              label="Visit Website"
            />
          </Box>

          {content.map(({ url, title, description }) => {
            let contentType = url.split('.').pop()?.toLowerCase()

            if (url.split('.')[1].toLowerCase() === 'youtube')
              contentType = 'YOUTUBE'

            if (VideoContentType.includes(contentType!)) {
              return (
                <>
                  <video
                    src={url}
                    title="Forumm Media Player"
                    className="mt-6 rounded w-full h-full"
                    controls
                  />
                  <Text className="mt-6 text-white text-xl">{title}</Text>
                  <Text className="text-white text-base">{description}</Text>
                </>
              )
            }

            if (contentType === 'YOUTUBE') {
              return (
                <>
                  {/* @ts-ignore */}
                  <YouTube
                    videoId={url}
                    iframeClassName="preserveRatio"
                    className=""
                    opts={{
                      height: '100%',
                      width: '100%',
                      playerVars: {
                        version: 3,
                        loop: 0,
                        playlist: parseHoldingVideoURL(url ?? ''),
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
                  <Text className="mt-6 text-white text-xl">{title}</Text>
                  <Text className="text-white text-base">{description}</Text>
                </>
              )
            }

            if (ImageContentType.includes(contentType!)) {
              return (
                <>
                  <Image
                    src={url ?? ''}
                    title="Forumm Media Player"
                    className="mt-6 rounded w-full h-full relative"
                    objectFit="contain"
                    width={300}
                    height={300}
                    alt={title ?? 'Alt text fallback text'}
                    style={{ position: 'relative' }}
                  />
                  <Text className="mt-6 text-white text-xl">{title}</Text>
                  <Text className="text-white text-base">{description}</Text>
                </>
              )
            }
          })}
        </Box>
      </Box>
      <ActionButtons />
    </AnimatedView>
  )
}

OnDemand.Layout = LiveEventLayout
