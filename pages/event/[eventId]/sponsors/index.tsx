import ActionButtons from '@components/chat/ActionButtons'
import Image from 'next/image'
import AnimatedView from '@components/event/AnimatedView'
import Box from '@components/base/Box'
import LiveEventLayout from '@layouts/LiveEventLayout'
import { useEvent } from '@libs/useEvent'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { BiVideo } from 'react-icons/bi'
import { useTheme } from '@libs/useTheme'
import MediaCard from '@components/landing/Media'
import DefaultThumbnail from '@public/images/default-thumbnail.png'

export default function Sponsors() {
  const { theme } = useTheme()
  const { push } = useRouter()
  const { event } = useEvent()

  if (!event) return
  const { sponsors, eventId } = event
  const content =
    event?.sponsors?.map((s) => (s.ondemandContent ? s.ondemandContent : [])) ??
    []

  return (
    <AnimatedView>
      <Box className="p-8">
        <Box className="text-white text-2xl">Event Partners</Box>
        <Box className="flex flex-row flex-wrap mt-4 text-white justify-evenly">
          {sponsors && sponsors.length > 0 ? (
            sponsors.map(({ title, description, logoUrl }) => {
              const url = `/event/${eventId}/sponsors/${encodeURIComponent(
                title ?? ''
              )}`
              return (
                <MediaCard
                  className={`min-w-[200px] size-full`}
                  key={encodeURIComponent(title)}
                  eventId={eventId}
                  url={url}
                  title={title}
                  description={description ?? ''}
                  image={logoUrl ?? DefaultThumbnail.src}
                  banner={logoUrl ?? DefaultThumbnail.src}
                  organization={title}
                  type="PARTNER"
                />
                // <motion.div
                //   whileHover={{ scale: 1.01 }}
                //   className="p-4 rounded flex items-center cursor-pointer flex-wrap"
                //   style={{ backgroundColor: theme.foregroundColour }}
                //   key={`sponsor_${title}`}
                //   onClick={() =>
                //     push(
                //       `/event/${event?.eventId}/sponsors/${encodeURIComponent(
                //         title ?? '',
                //       )}`,
                //     )
                //   }
                // >
                //   {logoUrl ? (
                //     <Image
                //       src={logoUrl}
                //       alt={`${title}'s Logo`}
                //       width={100}
                //       height={100}
                //       className="h-14 w-14 rounded-md object-cover mr-2"
                //     />
                //   ) : (
                //     <BiVideo className="mr-2" />
                //   )}
                //   <span>{title}</span>
                //   <Box className="w-full mt-2">{description}</Box>
                // </motion.div>
              )
            })
          ) : (
            <Box>This event is not partnered.</Box>
          )}
        </Box>
      </Box>
      <ActionButtons />
    </AnimatedView>
  )
}

Sponsors.Layout = LiveEventLayout
