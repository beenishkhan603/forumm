import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import { useEffect, useRef } from 'react'
// @ts-ignore
import video from '@public/packages-animation.webm'

function Header() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.play()
  }, [])

  return (
    <Box className="relative sm:flex justify-center min-h-[411px] sm:mt-20 mb-20 items-start">
      <Box className="min-h-[411px] flex z-1000 relative w-full justify-center">
        <Box className={`w-full flex border-0`}>
          <Box className="min-h-[411px] flex w-full justify-center items-center">
            <Box className="flex w-full max-w-[1500px] flex-col sm:flex-row">
              <Box className="w-full sm:w-4/5 justify-center p-12 pb-0 sm:p-16 sm:pb-16 sm:pl-32 items-center z-40">
                <Text
                  className={`text-4xl md:text-5xl xl:text-6xl pb-4 pl-10 sm:pl-0 -ml-4 sm:ml-0 sm:mt-4 !font-poppins font-semibold text-center sm:text-start !text-midnight-light`}
                >
                  From Explorer <br /> to Visionary <br />
                </Text>
                <Text className="!text-forumm-blue text-3xl sm:text-4xl font-medium text-center sm:text-start mt-4 sm:mt-0 mb-6 sm:mb-2">
                  Plans that support you
                </Text>
                <Text className="text-xl pb-6 pl-10 sm:pl-0 leading-relaxed -ml-4 sm:ml-0 !text-midnight-light font-medium !text-black">
                  Event management, alumni data and giving pages all at your
                  finger tips.
                </Text>
                <Box className="flex pl-0 space-x-2 justify-center sm:justify-start ml-6 sm:ml-0">
                  <Button
                    size="auto"
                    title="Get Started for Free!"
                    className="border-2 border-forumm-blue"
                    onClick={() => {
                      const joinFormArea = document.getElementById(
                        'organiser-join-form'
                      )
                      if (joinFormArea) {
                        joinFormArea.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box className="relative flex w-full items-center justify-center px-8 pb-8 z-40 mt-14 sm:mt-0">
                <Box className="flex w-full mt-6 ">
                  <video
                    ref={videoRef}
                    muted
                    className="h-96 w-full -mt-2 -mb-4"
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
