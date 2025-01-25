import DefaultThumbnail from '@public/images/default-thumbnail.png'
import { useAuth } from '@libs/useAuth'
import { Event } from '@graphql/__generated/graphql'
import Box from '../base/Box'
import MediaCard from '@components/landing/Media'
import { useState } from 'react'
import { Button } from '@components/inputs/Button'

const EventsView = ({
  events,
  types,
  title,
  currency,
  justify,
}: {
  events: Event[]
  types: string[]
  title: string
  currency: string
  justify?: string
}) => {
  const { profile, isOrganizer, isAdmin } = useAuth()
  const userId = profile?.userId
  const [viewAll, setViewAll] = useState<boolean>(false)

  const canEditEvent = (event: Event): boolean => {
    if (isAdmin) return true
    if (isOrganizer) {
      if (event.organizerId === userId && isOrganizer) return true
      if (
        event.event?.organizationName === profile?.company ??
        event.event?.organizationName === profile?.university
      )
        return true
    }
    return false
  }

  const isSpeaker = (event: Event): boolean => {
    if (!event || !profile) return false
    return !!event.speakers?.find((f) => f.email === profile?.email)
  }

  // TODO: Define types correctly
  const renderEventCard = (e: any) => {
    if (!e) return <></>
    return (
      <MediaCard
        key={e.eventId}
        eventId={e.eventId}
        url={
          e?.event?.eventType === 'FUNDRAISER'
            ? `/donation/${e.event.donationUrl}`
            : `/event/${e.eventId}`
        }
        type={e.event.eventType}
        title={e.event?.title}
        description={e.event?.shortDescription}
        image={e.event?.bannerImage ?? DefaultThumbnail}
        banner={e.event?.thumbnailImage ?? DefaultThumbnail}
        organization={e?.event?.organizationName}
        startTime={e.event?.startDateTime}
        endTime={e.event?.endDateTime}
        canEdit={canEditEvent(e)}
        isSpeaker={isSpeaker(e)}
        isPublished={e.isPublished}
        attendees={e.attendees?.length}
        donors={e.fundraising?.donors}
        goal={e.fundraising?.goal}
        raised={e.fundraising?.raised}
        currency={currency ?? 'GBP'}
      />
    )
  }

  // TODO: Define types correctly
  const renderEvents = (data: any) => {
    // TODO: Define types correctly
    return data.map((e: any) => {
      if (e.event?.eventType == null) {
        return null
      }
      if (!types.includes(e.event?.eventType)) {
        return null
      }
      if (
        title.length > 0 &&
        !e.event.title.toLowerCase().includes(title.toLowerCase())
      ) {
        return null
      }
      return renderEventCard(e)
    })
  }

  const justifyClass =
    justify === 'center' ? '' : ' sm:justify-start sm:items-start'

  return (
    <Box
      className={`flex sm:-mx-4 md:w-[110%] max-w-[1530px] flex-wrap justify-center items-center ${justifyClass}`}
    >
      {viewAll ? renderEvents(events) : renderEvents(events?.slice(0, 8))}
      {events.length <= 8 ? (
        <></>
      ) : (
        !viewAll && (
          <Box className="w-full justify-center flex mt-3">
            <Button
              className="sm:min-w-[15rem] text-xs sm:text-sm"
              title="View All"
              type="primary"
              textColor="white"
              onClick={() => setViewAll(true)}
            />
          </Box>
        )
      )}
    </Box>
  )
}

export default EventsView
