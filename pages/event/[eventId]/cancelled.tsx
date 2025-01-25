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
import ReactMarkdown from 'react-markdown'
import _ from 'lodash'
import RichTextDisplay from '@components/base/RichTextDisplay'

export default function Cancelled() {
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
          <Box className="w-full flex">
            <Box className="w-1/2">
              <Box>
                <div className="text-xl">
                  Your ticket purchase was cancelled.
                </div>

                <div className="mt-4">
                  Click below to try again, or return to the dashboard.
                </div>

                <Box className="flex mt-5 space-x-4">
                  <Button
                    className="flex-1"
                    title="Try Again"
                    onClick={() =>
                      router.push(`/event/${event?.eventId}/register`)
                    }
                  />
                  <Button
                    className="flex-1"
                    title="Back to Dashboard"
                    onClick={() => router.push('/dashboard')}
                  />
                </Box>
              </Box>
            </Box>
            <Box className="w-1/2 px-6 flex flex-col">
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
              <Box className="flex my-4 text-xs md:text-sm space-x-6">
                <Box className=" flex flex-col space-y-2">
                  <Box>Start Date & Time</Box>
                  <Box>
                    {moment(event?.event?.startDateTime).format(
                      'MMM DD, h:mmA'
                    )}
                  </Box>
                </Box>
                <Box className="flex flex-col space-y-2">
                  <Box>End Date & Time</Box>
                  <Box>
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

Cancelled.Layout = UnauthenticatedWrapper
