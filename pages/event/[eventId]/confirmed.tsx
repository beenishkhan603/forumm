import { useMutation, useQuery } from '@apollo/client'
import { Button } from '@components/inputs/Button'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { GET_EVENT_BY_ID } from '@graphql/events/GetEventById'
import DefaultThumbnail from '@public/images/default-thumbnail.png'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Event } from '@graphql/__generated/graphql'
import { UnauthenticatedWrapper } from '@layouts/Wrapper'
import { useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'
import TextLink from '@components/base/TextLink'
import _ from 'lodash'
import ReactMarkdown from 'react-markdown'
import RichTextDisplay from '@components/base/RichTextDisplay'

export default function Confirmed() {
  const router = useRouter()

  const { loading, error, data } = useQuery(GET_EVENT_BY_ID, {
    variables: {
      input: {
        eventId: router.query.eventId as string,
      },
    },
  })
  const { getEventById: event } = data || { getMyEvents: null }
  const { refreshTheme } = useTheme()
  useEffect(() => {
    if (event) {
      refreshTheme(event as Event)
    }
  }, [event, refreshTheme])

  if (loading) {
    return (
      <Box className="w-full py-64 flex justify-center">
        <LoadingSpinner size="large" />
      </Box>
    )
  }

  return (
    <>
      <Box
        className="h-[500px] w-full bg-cover bg-center-top flex flex-col justify-start items-center"
        style={{ backgroundImage: `url('${event?.event?.bannerImage}')` }}
      ></Box>
      <Box className="sm:px-4 xl:px-16">
        <Box
          color="foregroundColour"
          className=" -mt-32 rounded-2xl flex flex-col sm:flex-row text-white p-8 min-h-[400px] mb-6"
        >
          <Box className="flex flex-col sm:flex-row w-full">
            <Box className="w-full sm:w-1/2 mb-20 px-0">
              <Box>
                <div className="font-bold">
                  Tickets successfully booked for <b>{event?.event?.title}!</b>
                </div>

                <div className="mt-4 text-sm">
                  You have been sent an email with your ticket details.
                </div>
                <div className="mt-4 text-sm">
                  Please be sure to check your spam folder if you do not see it
                  in your inbox.
                </div>
              </Box>
            </Box>
            <Box className="w-full sm:w-1/2 px-6">
              <Box className="text-3xl font-bold">{event?.event?.title}</Box>
              <Box className="flex items-center space-x-2 mt-2">
                <Image
                  alt="Thumbnail Image"
                  className="h-8 w-8 rounded-lg block object-cover"
                  width={96}
                  height={96}
                  src={event?.event?.thumbnailImage ?? DefaultThumbnail}
                />
                <Box className="text-lg">{event?.event?.organizationName}</Box>
              </Box>
              <Box className="mt-4 line-clamp-8">
                <RichTextDisplay
                  descriptionJson={event?.event?.description || ''}
                />
              </Box>
              <Box
                show={!!event?.event?.eventLocation}
                className="flex flex-col space-y-2 mt-6"
              >
                <Box className="w-full flex flex-col space-y-2">
                  <Box className={`text-md font-medium`}>Event Location</Box>
                  <Box style={{ wordWrap: 'break-word' }}>
                    <TextLink className="text-xs md:text-sm">
                      {event?.event?.eventLocation || ''}
                    </TextLink>
                  </Box>
                </Box>
              </Box>
              <Box className="flex my-4 mt-10 space-x-6">
                <Box className=" flex flex-col space-y-2">
                  <Box className={`text-md font-medium`}>Start Date & Time</Box>
                  <Box className="text-xs md:text-sm">
                    {moment(event?.event?.startDateTime).format(
                      'MMM DD, h:mmA'
                    )}
                  </Box>
                </Box>
                <Box className="flex flex-col space-y-2">
                  <Box className={`text-md font-medium`}>End Date & Time</Box>
                  <Box className="text-xs md:text-sm">
                    {moment(event?.event?.endDateTime).format('MMM DD, h:mmA')}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

Confirmed.Layout = UnauthenticatedWrapper
