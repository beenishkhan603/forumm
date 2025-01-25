import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client'
import EventChatBox from '@components/chat/EventChatBox'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { Event, GetEventByIdQuery } from '@graphql/__generated/graphql'
import { GET_EVENT_BY_ID } from '@graphql/events/GetEventById'
import { useTheme } from '@libs/useTheme'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Wrapper from './Wrapper'
import { EventContext } from '@libs/useEvent'
import Box from '@components/base/Box'
import { GET_BREAKOUT_USER_COUNT } from '@graphql/events/getBreakoutUserCount'
import useForummRouter from '@libs/Router/useForummRouter'
import { useAuth } from '@libs/useAuth'
import Head from 'next/head'

const LiveEventLayout = ({
  children,
  requiresAuth = true,
}: {
  children: React.ReactNode
  requiresAuth: boolean
}) => {
  const { refreshTheme } = useTheme()
  const [data, setData] = useState<GetEventByIdQuery | undefined>()
  const { query, push, ...router } = useRouter()
  const [routerModal] = useForummRouter()
  const previewMode = query.preview === 'true'
  const client = useApolloClient()
  const event = data?.getEventById
  const { profile } = useAuth()

  const {
    data: updatedRoomData,
    loading,
    startPolling,
    stopPolling,
  } = useQuery(GET_BREAKOUT_USER_COUNT, {
    variables: {
      input: {
        eventId: query.eventId as string,
      },
    },
    skip: !profile,
    fetchPolicy: 'network-only',
  })

  const pathsToCheck = ['/agenda', '/stages', 'breakout-rooms', '/donate']
  const generalLeftContainerSpace = pathsToCheck.some((path) =>
    (window?.location?.pathname ?? '').endsWith(path)
  )
    ? 'ml-0'
    : 'ml-16 md:ml-24'

  const refreshBreakoutRooms = { startPolling, stopPolling }

  useEffect(() => {
    const roomData = updatedRoomData?.getEventById.breakoutRooms

    if (!roomData || roomData?.length < 1) return

    const newBreakouts = data?.getEventById.breakoutRooms?.map((br) => {
      const targetRoom = roomData?.find((f) => f.channelName === br.channelName)
      return !!targetRoom ? { ...br, totalUsers: targetRoom?.totalUsers } : br
    })

    setData(
      data
        ? {
            ...data,
            getEventById: {
              ...data.getEventById,
              breakoutRooms: newBreakouts,
            },
          }
        : undefined
    )
  }, [updatedRoomData])

  useEffect(() => {
    if (!query.eventId && window?.location.pathname.length < 32)
      push('/dashboard')
    async function getData() {
      const { data, errors, error } = await client.query({
        query: GET_EVENT_BY_ID,
        variables: {
          input: {
            eventId: query.eventId as string,
          },
        },
      })
      /* console.log({ data, errors, error, id: query.eventId }) */
      if (error || errors) push('/dashboard')
      setData(data)
    }
    if (query.eventId && !data) {
      getData()
    }
  }, [client, data, query.eventId]) // called once

  useEffect(() => {
    if (event) {
      refreshTheme(event as Event)
    }
  }, [event, refreshTheme])

  const pageUrl = `https://app.${process.env.NEXT_PUBLIC_DOMAIN as string}${router.asPath}`

  const ogData = (() => {
    const payload = {
      url: 'https://images-prod.forumm.to/user-content/f23a4ed7-44e0-4176-a7d0-93f4efae2caa/jpa.png',
      alt: 'Forumm',
      desc: 'Event and management and fundraising made simple.',
    }
    if (!event || !event.event) return payload
    if (!!event.event?.bannerImage) {
      payload.url = event.event.bannerImage
      payload.alt = event.event.shortDescription ?? event.event.title
    } else if (!!event.fundraising?.media?.[0]) {
      payload.url = event.fundraising.media[0].url
      payload.alt = event.fundraising.media[0].title
    }
    payload.desc = event.event.shortDescription ?? event.event.title
    return payload
  })()

  return (
    <>
      <Head>
        <meta property="og:title" content={event?.event?.title ?? 'Forumm'} />
        <meta property="og:description" content={ogData.desc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogData.url} />
        <meta property="og:image:alt" content={ogData.alt} />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:type" content="website" />
      </Head>
      <EventContext.Provider
        value={{
          event: event as Event,
          refreshBreakoutRooms,
        }}
      >
        <Wrapper
          className="h-screen"
          wrapperClasses="flex flex-col flex-1"
          title={event?.event?.title}
          showFooter={true}
          requireAuth={requiresAuth}
        >
          <AnimatePresence mode="wait">
            <Box className={`flex flex-1 ${generalLeftContainerSpace}`}>
              {routerModal}
              {event ? (
                children
              ) : (
                <Box className="flex flex-1 justify-center items-center">
                  <LoadingSpinner size="medium" />
                </Box>
              )}
              {!previewMode && (
                <EventChatBox
                  defaultChatId={event?.eventId}
                  defaultChatName={'Event Chat'}
                />
              )}
            </Box>
          </AnimatePresence>
        </Wrapper>
      </EventContext.Provider>
    </>
  )
}

export default LiveEventLayout

export const UnauthenticatedLiveEventLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <LiveEventLayout requiresAuth={false}>{children}</LiveEventLayout>
}
