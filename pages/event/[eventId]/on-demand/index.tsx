import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import Box from '@components/base/Box'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useEvent } from '@libs/useEvent'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { BiVideo } from 'react-icons/bi'
import { useTheme } from '@libs/useTheme'
import useStatistics from '@libs/useStatistics'
import MediaCard from '@components/landing/Media'
import DefaultThumbnail from '@public/images/default-thumbnail.png'

export default function OnDemand() {
  const { theme } = useTheme()
  const { push } = useRouter()
  const { event } = useEvent()
  const _statisticId = useStatistics()
  /* let content = [ */
  /*   ['Demo Video', 'Demo of the Forumm App'], */
  /*   ['448 Studio Introduction', 'Introduction to 448 Studio'], */
  const content = event?.ondemandContent ?? []
  return (
    <AnimatedView
      className={`-mt-[80px] pt-[80px] overflow-x-hidden h-[calc(100vh)] relative`}
    >
      <Box className="p-8">
        <Box className="text-white text-2xl">On Demand Content</Box>
        <Box className="flex flex-row mt-4 space-y-2 text-white">
          {content.map(({ title, description, id, url }, i) => (
            <MediaCard
              className={`min-w-[200px] size-full !my-0`}
              key={event?.eventId}
              eventId={event?.eventId}
              url={`/event/${event?.eventId}/on-demand/${encodeURIComponent(
                id ?? ''
              )}`}
              title={title ?? ''}
              organization={title ?? ''}
              description={description ?? ''}
              image={url ?? DefaultThumbnail.src}
              banner={url ?? DefaultThumbnail.src}
              type="CONTENT"
            />
            // <motion.div
            //   whileHover={{ scale: 1.01 }}
            //   className="p-4 rounded flex items-center cursor-pointer flex-wrap"
            //   style={{ backgroundColor: theme.foregroundColour }}
            //   key={i}
            //   onClick={() =>
            //     push(
            //       `/event/${event?.eventId}/on-demand/${encodeURIComponent(
            //         id ?? ''
            //       )}`
            //     )
            //   }
            // >
            //   <BiVideo className="mr-2" />
            //   <span>{title}</span>
            //   <Box className="w-full mt-2">{description}</Box>
            // </motion.div>
          ))}
        </Box>
      </Box>
      <ActionButtons />
    </AnimatedView>
  )
}

OnDemand.Layout = LiveEventLayout
