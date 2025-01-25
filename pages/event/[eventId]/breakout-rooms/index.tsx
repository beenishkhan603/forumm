import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import Box from '@components/base/Box'
import { RoomsCarousel } from '@components/event/RoomsCarousel'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useEvent } from '@libs/useEvent'
import { useTheme } from '@libs/useTheme'
import { getDynamicStyle } from '@libs/Utility/util'

const Stages = () => {
  const { event } = useEvent()
  const { theme } = useTheme()
  const dynamicStyle = getDynamicStyle(theme.highlightColour)
  const isDarkTheme = theme.type === 'DARK'

  return (
    <AnimatedView
      className={`-mt-[80px] pt-[80px] overflow-x-hidden h-[calc(100vh)] relative`}
    >
      <Box
        color="foregroundColour"
        style={dynamicStyle as unknown as {}}
        className={`pb-9 border-b border-forumm-menu-border relative`}
      >
        <Box className="absolute w-full h-[420px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover select-none no-controls"
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
                Breakout Rooms
              </Box>
              <Box className="flex items-center mt-8 flex-wrap">
                <Box className="pb-8">
                  <RoomsCarousel breakoutRooms={event!.breakoutRooms!} />
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
