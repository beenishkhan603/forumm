import React from 'react'
import Image from 'next/image'
import moment from 'moment'
import { EventDetails } from '@graphql/__generated/graphql'

const EventDonationComponent = ({
  eventDetails,
}: {
  eventDetails: EventDetails
}) => {
  if (!eventDetails) return null
  const formattedStart = moment(eventDetails.startDateTime).format(
    'MMM DD, h:mmA'
  )
  const formattedEnd = moment(eventDetails.endDateTime).format('MMM DD, h:mmA')
  return (
    <div className="p-4">
      <h1 className="text-3xl mt-4 font-bold">{eventDetails.title}</h1>
      <div className="flex items-center mt-4">
        <div className="relative w-16 h-16">
          <Image
            src={eventDetails?.thumbnailImage ?? ''}
            alt={eventDetails.organizationName}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="ml-4">
          <span className="text-lg font-semibold">
            {eventDetails.organizationName}
          </span>
          <div className="text-sm">
            {formattedStart} to {formattedEnd}
          </div>
        </div>
      </div>
      <p className="mt-4">{eventDetails.shortDescription}</p>
    </div>
  )
}

export default EventDonationComponent
