import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import Box from '@components/base/Box'
import { StagesCarousel } from '@components/event/StagesCarousel'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useEvent } from '@libs/useEvent'
import { useTheme } from '@libs/useTheme'
import { getDynamicStyle } from '@libs/Utility/util'
import useStatistics from '@libs/useStatistics'
import React, { useCallback } from 'react'
import _debounce from 'lodash/debounce'
import { getGeolocation } from '@libs/Utility/geoip'
import { ADD_STATISTIC } from '@graphql/statistic/addStatistic'
import { useMutation } from '@apollo/client'
import { useEffect } from 'react'

const Stages = () => {
  const { event } = useEvent()
  const { theme } = useTheme()
  const dynamicStyle = getDynamicStyle(theme.highlightColour)
  const isDarkTheme = theme.type === 'DARK'
  const _statisticId = useStatistics()
  const [addStatistic] = useMutation(ADD_STATISTIC)

  const debouncedOnReady = useCallback(
    _debounce(async () => {
      try {
        if (
          typeof window === 'undefined' ||
          typeof getGeolocation !== 'function'
        )
          return

        const currentFullUrl = window.location.href
        const browser = window.navigator.userAgent
        const { address, ip } = await getGeolocation()

        await addStatistic({
          variables: {
            anonymousId: _statisticId,
            url: currentFullUrl,
            country: address,
            browser,
            ip,
          },
        })
      } catch (error) {
        console.warn('Failed to send statistics:', (error as Error).message)
      }
    }, 500), // 500ms debounce delay
    [_statisticId, addStatistic]
  )

  useEffect(() => {
    debouncedOnReady()
  }, [debouncedOnReady])

  return (
    <AnimatedView>
      <Box
        color="foregroundColour"
        style={dynamicStyle as unknown as {}}
        className={`pb-9 border-b border-forumm-menu-border`}
      >
        <Box className="absolute w-full h-[420px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover select-none"
          >
            <source
              src="https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/video-background.mp4"
              type="video/mp4"
            />
          </video>
        </Box>
        <Box className="flex flex-col items-center justify-center">
          <Box className="mt-10 mb-64 z-10 w-full md:w-[85%] max-w-[1500px]">
            <Box
              className={`rounded-2xl shadow-lg flex flex-col p-4 md:p-6 md:px-8 md:py-4 md:pt-6 ${
                isDarkTheme
                  ? 'border border-forumm-menu-border'
                  : 'border border-forumm-menu-border'
              }`}
              style={{
                background: isDarkTheme
                  ? 'rgba(42, 42, 42, 0.6)'
                  : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
              }}
            >
              <Box className="text-white text-3xl md:text-4xl font-bold">
                Stages
              </Box>
              <Box className="flex items-center mt-8 flex-wrap">
                <Box className="pb-8">
                  <StagesCarousel stages={event!.stages!} />
                </Box>
              </Box>
            </Box>
          </Box>
          <ActionButtons />
        </Box>
      </Box>
    </AnimatedView>
  )
}

Stages.Layout = LiveEventLayout

export default Stages
