import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import { useTheme } from '@libs/useTheme'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
// @ts-ignore
import video from '@public/home-animation.webm'

// import forummLogo from '@public/forumm-logo.png'
// import blackbaudLogo from '@public/blackbaud-logo.png'
// @ts-ignore
import case50Logo from '@public/case-50-logo.png'
// @ts-ignore
import blackbaudNetworkLogo from '@public/blackbaud-network-partner-logo.png'

function Header() {
  const { theme } = useTheme()
  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.play()
  }, [])

  return (
    <Box className="relative sm:flex justify-center sm:min-h-[411px] items-start">
      <Box className="sm:min-h-[411px] flex z-1000 pt-20 relative w-full justify-center">
        <Box className={`w-full flex border-0`}>
          <Box className="sm:min-h-[411px] flex w-full justify-center items-center">
            <Box className="flex w-full max-w-[1500px] flex-col sm:flex-row">
              <Box className="w-full sm:w-4/5 justify-center p-0 sm:p-12 -mt-2 !pr-0 pb-0 sm:p-16 sm:pb-16 sm:pl-32 items-center z-40">
                <Text className="text-4xl md:text-5xl xl:text-6xl pb-4 pl-0 sm:pl-0 leading-1 sm:ml-0 sm:mt-6 !font-poppins font-semibold !text-midnight-light text-center sm:text-start">
                  Personalise Alumni Engagement
                  <br />
                </Text>
                <Text className="!text-forumm-blue text-3xl sm:text-4xl font-medium text-center sm:text-start mt-4 sm:mt-0 mb-6 sm:mb-2">
                  Drive Meaningful Giving
                </Text>

                <Text className="text-xl mt-4 pb-6 pl-10 sm:pl-0 w-full !text-midnight-light text-center sm:text-start -ml-4 sm:ml-0 font-medium">
                  Manage your events, fundraisers and data all in one place.
                </Text>
                <Box className="flex pl-0 mt-2 space-x-2 justify-center sm:justify-start">
                  <Button
                    size="auto"
                    title="Create Your First Event"
                    className="border-2 border-forumm-blue"
                    onClick={() => router.push('/pricing#pricing-bottom-area')}
                  />
                  <Button
                    size="auto"
                    type="tertiary"
                    backgroundColor="transparent"
                    className="border-2 border-forumm-blue"
                    textColor="#3763e9"
                    title="Let&rsquo;s Chat"
                    onClick={() => {
                      const joinFormArea =
                        document.getElementById('landing-join-form')
                      if (joinFormArea) {
                        joinFormArea.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }
                    }}
                  />
                </Box>
                <Box className="flex items-center justify-center md:justify-start space-x-6 mt-4 w-full p-2 sm:p-0">
                  <Image
                    src={case50Logo}
                    alt="Webinar Promo"
                    className="w-[100px]"
                  />
                  <Image
                    src={blackbaudNetworkLogo}
                    alt="Webinar Promo"
                    className="w-[155px] mt-[2px]"
                  />
                </Box>
              </Box>
              <Box className="relative hidden md:block flex w-full items-center justify-center px-8 pb-8 z-40 mt-18 sm:mt-0">
                <Box className="flex w-full mt-6 ">
                  <video
                    ref={videoRef}
                    muted
                    className="h-96 w-full -mt-2 -mb-4"
                    playsInline
                  >
                    <source src={video} type="video/webm" />
                  </video>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
