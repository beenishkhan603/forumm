import {
  rewriteURIForGET,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client'
import { Button } from '@components/inputs/Button'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { GET_EVENT_BY_ID } from '@graphql/events/GetEventById'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import AnnouncementIcon from '@public/images/AnnouncementIcon.svg'
import DefaultThumbnail from '@public/images/default-thumbnail.png'
import { MdEdit } from 'react-icons/md'
import { FaDonate } from 'react-icons/fa'
import { FaRegCalendarCheck } from 'react-icons/fa'
import { SessionList } from '@components/event/SessionList'
import { AttendeeList } from '@components/event/AttendeeList'
import {
  Event,
  EventSession,
  EventAttendee,
  EventType,
} from '@graphql/__generated/graphql'
import Link from 'next/link'
import { UnauthenticatedWrapperNoDefaults } from '@layouts/Wrapper'
import { useAuth } from '@libs/useAuth'
import { useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'
import TextLink from '@components/base/TextLink'
import { ME } from '@graphql/users/me'
import _, { parseInt } from 'lodash'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import { ADD_USER_DATA } from '@graphql/users/updateEvent'
import ProfileImage from '@components/base/ProfileImage'
// import Card from '@components/event/Card'
// import { isValidUrl, fixUrlProtocol } from '@libs/Utility/parsers'
import SpeakerModal from '@components/event/SpeakerModal'
import { GET_EVENT_BY_ID_FOR_UNREGISTERED_USER } from '@graphql/events/GetEventByIdForUnregisteredUser'
import useStatistics from '@libs/useStatistics'
import { getDynamicStyle } from '@libs/Utility/util'
// import Tooltip from '@components/tootilp/Tooltip'
import RichTextDisplay from '@components/base/RichTextDisplay'
import Carousel from '@components/carousel/Carousel'
import { Toaster, toast } from 'react-hot-toast'
import { GET_USERS_BY_IDS } from '@graphql/users/GetUsersByIds'
import FooterUnauthenticated from '@components/page/FooterUnauthenticated'
import Head from 'next/head'

const ERROR_ROUTE = `/`

export default function EventPage() {
  const router = useRouter()
  const _statisticId = useStatistics()
  const { profile, isLogged, isOrganizer, isAdmin, canEditEvent } = useAuth()
  const { data: me } = useQuery(ME)

  const [addUserData] = useMutation(ADD_USER_DATA)
  const [showFieldModal, setShowFieldModal] = useState(false)
  const [eventHasTicketsAvailable, setEventHasTicketsAvailable] =
    useState<boolean>(true)
  const [requiredInfo, setRequiredInfo] = useState<string[]>([])
  const [eventAttendees, setEventAttendees] = useState<EventAttendee[]>([])
  const [fieldVals, setFieldVals] = useState<any>()
  const [speakerModalTarget, setSpeakerModalTarget] = useState<any>(undefined)
  const [shareButtonText, setShareButtonText] = useState<string>('Share')
  const { theme, StaticColours, refreshTheme } = useTheme()
  const dynamicStyle = getDynamicStyle(theme.highlightColour)
  const [event, setEvent] = useState<Partial<Event> | undefined>(undefined)
  const [userRegistrationFields, setUserRegistrationFields] = useState<any[]>(
    []
  )

  let videoUrl =
    'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/video-background.mp4'

  if (event?.eventId === 'c987cfd9-3732-4d21-a586-293ed6d36784') {
    videoUrl =
      'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/video-background_CE.mp4'
  }
  const [usersData, setUsersData] = useState<any[]>([])

  const [getAttendeeMetadata] = useLazyQuery(GET_USERS_BY_IDS)

  useEffect(() => {
    if (!!event && !!event.attendees && event.attendees.length > 0) {
      const userIds: string[] = event.attendees
        .filter((a) => !!a.userId || !!a.email)
        .map((a) => a.userId ?? a.email)

      getAttendeeMetadata({
        variables: {
          input: {
            userIds,
          },
        },
        onCompleted: (data) => setUsersData(data.getUsersByIds.items ?? []),
      })
    }
  }, [event])

  const [getEventForUnregisteredUser] = useLazyQuery(
    GET_EVENT_BY_ID_FOR_UNREGISTERED_USER
  )

  const userData = router.query.ud

  const eventIdsMap: { [key: string]: string } = {
    'forumm-academy-webinar': 'be8be4ac-35ed-48c6-8d91-3303ef0dd157',
    'forumm-academy-alumni-engagement-round-table':
      'dbdacdf2-030f-4682-9788-9ece2f721359',
  }

  const [ctaLabel, setCtaLabel] = useState<{
    label: string
    enabled: boolean
    action: () => void
    show: boolean
  }>()

  const getCtaLabel = () => {
    const currentDate = new Date(Date.now())

    const startDate = moment(event?.event?.startDateTime).toDate()
    const endDate = moment(event?.event?.endDateTime).toDate()
    const fifteenMinutesBeforeStart = new Date(
      startDate.getTime() - 15 * 60 * 1000
    )
    const endDatePlus15Minutes = new Date(endDate.getTime() + 15 * 60 * 1000)

    let hasTicket = getTicketStatus()
    // let label = hasTicket ? 'Enter Event Hub' : eventId === 'c987cfd9-3732-4d21-a586-293ed6d36784' ? 'Buy Tickets' :'Register for Event'
    let label = hasTicket ? 'Enter Event Hub' : 'Register for Event'
    let enabled = true
    let show = true

    const requiredFieldNames =
      event?.registrationFields?.map((f) => f.name) ?? []

    //Participants with tickets should not be able to join the event until it has started
    if (hasTicket && currentDate < fifteenMinutesBeforeStart && !canViewEarly) {
      enabled = false
    }

    let action = () => {
      if (hasTicket && me) {
        const myFields = me.me.registrationFields ?? {}

        const myFieldNames: string[] = []

        Object.keys(myFields).forEach((key) => {
          Object.keys(myFields[key]).forEach((k) => {
            myFieldNames.push(k)
          })
        })

        const missingFieldNames = _.difference(requiredFieldNames, myFieldNames)

        if (missingFieldNames.length > 0 && !isAdmin) {
          setRequiredInfo(missingFieldNames)
          setShowFieldModal(true)
        } else {
          router.push(`/event/${event?.eventId}/agenda`)
        }
      } else {
        if (userData)
          router.push(`/event/${event?.eventId}/register?ud=${userData}`)
        router.push(`/event/${event?.eventId}/register`)
      }
    }

    if (currentDate < fifteenMinutesBeforeStart && hasTicket && !canViewEarly) {
      label = 'Event not started'
      enabled = false
    } else if (currentDate > endDatePlus15Minutes) {
      label = 'Event ended'
      enabled = false
    }
    if (!hasTicket && !eventHasTicketsAvailable) {
      label = 'Sold Out'
      enabled = false
    }
    if (!hasTicket && !canRegister) {
      label = 'Registration Closed'
      enabled = false
    }

    if (event?.event?.eventType === EventType.InPerson && hasTicket) {
      label = 'Registered'
      enabled = false
    }

    const payload = {
      label,
      enabled,
      action,
      show,
    }
    setCtaLabel(payload)
    return payload
  }

  useEffect(() => {
    if (!event || !event?.attendees || !event?.registrationFields || !usersData)
      return

    const currentAttendess = event?.attendees.map((at) => at.email ?? at.userId)

    if (event?.event?.organizationName) {
      const attendessMetadata = usersData?.filter(
        (item) =>
          (currentAttendess.includes(item?.email) ||
            currentAttendess.includes(item?.userId)) &&
          // @ts-ignore
          item?.registrationFields?.[event?.event?.organizationName] !==
            undefined
      )
      const registrationFields = currentAttendess.map((at) => {
        return {
          email: at,
          registrationFields:
            attendessMetadata.filter(
              (item) => {
                return item?.email === at || item?.userId === at
              }

              // @ts-ignore
            )?.[0]?.registrationFields?.[event?.event?.organizationName] ?? {},
        }
      })
      setUserRegistrationFields(registrationFields)
    }
  }, [usersData, event])

  const eventIdQuery =
    typeof router.query.eventId === 'string' ? router.query.eventId : undefined
  const eventId = eventIdQuery
    ? eventIdsMap[eventIdQuery] || eventIdQuery
    : undefined

  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(
    GET_EVENT_BY_ID,
    {
      variables: {
        input: {
          eventId: eventId as string,
        },
      },
      skip: !router.query.eventId,
      fetchPolicy: 'network-only',
      onCompleted: () => {
        getCtaLabel()
        console.log('Starting Polling')
        startPolling(2000)
        setTimeout(() => {
          console.log('Stopping Polling')
          stopPolling()
        }, 10000)
      },
    }
  )

  function reload() {
    refetch()
    setTimeout(() => {
      const url = new URL(window.location as unknown as string)
      url.searchParams.delete('ticketCode')
      window.history.pushState({}, '', url)
      window.location.reload()
    }, 1000)
  }

  useEffect(() => {
    if (event) {
      const cachedEvent = { ...event, stages: [], breakoutRooms: [] }
      const latestEvent = {
        ...data?.getEventById,
        stages: [],
        breakoutRooms: [],
      }
      const eventChaged =
        JSON.stringify(cachedEvent) !== JSON.stringify(latestEvent)
      if (!eventChaged) return
    }
    if (!!data?.getEventById) {
      return setEvent(data.getEventById as Event)
    }

    if (!loading && !data && eventId && userData && !profile) {
      getEventForUnregisteredUser({
        variables: {
          input: {
            eventId: eventId as string,
            userEmail: encodeURIComponent(userData as string),
          },
        },
      }).then((d) => {
        if (d.data?.getEventByIdForUnregisteredUser)
          setEvent(d.data?.getEventByIdForUnregisteredUser as Event)

        if (d.error) {
          console.error(d.error)
          router.push(ERROR_ROUTE)
        }
      })
    }
  }, [loading, data, userData])

  const canRegister = moment(event?.event?.registrationCloseDateTime).isAfter(
    moment()
  )

  const getTicketStatus = () => {
    if (isAdmin) return true

    if (
      isOrganizer &&
      (profile?.company === event?.event?.organizationName ||
        profile?.university === event?.event?.organizationName)
    )
      return true

    const userHasTicket = [
      ...(event?.attendees?.map((a) => a.email?.toLowerCase()) ?? []),
      ...(event?.speakers?.map((s) => s.email?.toLowerCase()) ?? []),
      event?.organizerId,
    ].some((id) => {
      if (!id) return false
      return (
        id === profile?.email?.toLowerCase() ||
        id === profile?.userId?.toLowerCase()
      )
    })

    return userHasTicket
  }

  useEffect(() => {
    if (event && event?.eventId) {
      getCtaLabel()
    }
  }, [event, profile])

  useEffect(() => {
    if (event && event?.eventId && !loading) {
      const params = new URLSearchParams(window.location.search)
      const registered = params.get('registered')
      if (registered !== null) {
        toast(`Successfully registered for the event!`, {
          icon: '🎉',
          duration: 10000,
        })
      }
    }
  }, [loading, event])

  useEffect(() => {
    if (!event) {
      if (!isLogged && !loading && error && !data && !userData)
        router.push(ERROR_ROUTE)
      if (isLogged && profile && !loading && error && !data)
        router.push(ERROR_ROUTE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data, profile, isLogged])

  useEffect(() => {
    const getTicketsAvailable = () => {
      let totalAvailable = 0
      event?.availableTickets?.tickets?.forEach((t) => {
        if (t && t.remaining && parseInt(t.remaining) > 0)
          totalAvailable += parseInt(t.remaining)
      })

      return totalAvailable > 0
    }
    if (event) {
      refreshTheme(event as Event)
      setEventHasTicketsAvailable(getTicketsAvailable())
    }
  }, [event, refreshTheme])

  useEffect(() => {
    if (event) {
      setEventAttendees(event?.attendees || [])
    }
  }, [event])

  if (loading || !event) {
    return (
      <Box className="w-full py-64 flex justify-center">
        <LoadingSpinner size="large" />
        <Toaster
          toastOptions={{
            className:
              'shadow-lg !rounded-full flex items-center border-2 !bg-forumm-white border-forumm-green !text-forumm-green mt-[80px]',
            duration: 4000,
          }}
        />
      </Box>
    )
  }

  const canViewEarly = ((): boolean => {
    const eventOrgName = event?.event?.organizationName
    if (isAdmin) return true
    if (isOrganizer) {
      if (eventOrgName === profile?.university) return true
      if (eventOrgName === profile?.company) return true
    }
    if (
      event?.speakers?.find(
        (s) => s.email?.toLowerCase() === profile?.email?.toLowerCase()
      )
    )
      return true
    return false
  })()

  const isDarkTheme = theme.type === 'DARK'
  const buttonDonate = isDarkTheme
    ? 'bg-forumm-light-blue-dark text-forumm-text-blue-dark'
    : 'bg-forumm-active-blue text-white'

  const eventImage =
    event?.event?.bannerImage ??
    'https://assets.tumblr.com/images/default_header/optica_pattern_11.png'

  const buttonTextColorClass = isDarkTheme
    ? 'text-forumm-light-blue-dark'
    : 'text-forumm-selected-menu-blue'

  const iconFillColor = isDarkTheme
    ? StaticColours.forumm_share_dark
    : StaticColours.v2.blue_share

  const addFieldModal = (
    <Modal
      show={showFieldModal}
      setShow={setShowFieldModal}
      title="Add Required information"
    >
      {requiredInfo.map((info, i) => (
        <TextInput
          key={i}
          validations={{
            minLength: {
              value: 1,
              message: 'Field name must be at least 1 character',
            },
            maxLength: {
              value: 70,
              message: 'Field name must be at most 70 characters',
            },
          }}
          required
          value={fieldVals ? fieldVals[info] : ''}
          onChange={(e) => setFieldVals({ ...fieldVals, [info]: e })}
          label={info}
          placeholder={`Enter ${info}`}
        />
      ))}
      <Button
        className="my-4"
        title={`Submit`}
        type="primary"
        buttonType="submit"
        onClick={async () => {
          const values = Object.keys(fieldVals).map((key) => ({
            name: key,
            value: fieldVals[key],
          }))
          if (
            values.length > 0 &&
            values.filter((v) => v.value === '').length === 0
          ) {
            await addUserData({
              variables: {
                input: {
                  company: event?.event?.organizationName ?? 'Unknown',
                  values: values,
                },
              },
            })
            router.push(`/event/${event?.eventId}/agenda`)
          }
        }}
      />
    </Modal>
  )

  const getSocialLink = (platform: string, fallbackURL?: string) => {
    return (
      event?.communications?.socials?.find(
        (s) => s.platform.toLowerCase() === platform.toLowerCase()
      )?.url ??
      fallbackURL ??
      false
    )
  }

  const noAnnouncements = !event?.communications?.announcements
  const announcements = noAnnouncements
    ? []
    : event?.communications?.announcements

  const pageUrl = `https://app.${process.env.NEXT_PUBLIC_DOMAIN as string}${
    router.asPath
  }`

  const ogData = (() => {
    const payload = {
      url: 'https://images-prod.forumm.to/user-content/f23a4ed7-44e0-4176-a7d0-93f4efae2caa/jpa.png',
      alt: 'Forumm',
      desc: 'Event management and fundraising made simple.',
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
        <meta property="og:title" content={event.event?.title ?? 'Forumm'} />
        <meta property="og:description" content={ogData.desc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogData.url} />
        <meta property="og:image:alt" content={ogData.alt} />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:type" content="website" />
      </Head>
      <Box
        className={`-mt-[80px] pt-[80px] overflow-x-hidden h-[calc(100vh)] relative`}
      >
        {addFieldModal}
        {
          <SpeakerModal
            show={!!speakerModalTarget}
            setShow={setSpeakerModalTarget}
            speaker={speakerModalTarget}
          />
        }
        {/* Background Image */}
        <Box
          color="foregroundColour"
          style={dynamicStyle as unknown as {}}
          className={`relative px-2 pt-9 pb-9 border-b border-forumm-menu-border`}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover select-none no-controls"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <Box className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0">
            <Box
              className={`rounded-2xl shadow-lg flex p-10 md:p-6 md:py-4 md:pt-6 md:pb-6 w-full md:w-[85%] max-w-[1500px] ${
                isDarkTheme ? '' : 'border border-forumm-menu-border'
              }`}
              color="backgroundColorBanner"
              style={{
                background: isDarkTheme
                  ? 'rgba(0, 0, 0, 0.6)'
                  : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
              }}
            >
              <Box className="flex flex-col items-center md:flex-row md:items-center">
                <Box className="flex ml-0 md:ml-3 items-center">
                  <Box className="md:h-[250px] md:w-[250px] w-[250px] h-[240px] md:rounded-2xl rounded-md overflow-hidden flex flex-col justify-start items-center mx-auto md:ml-2 mb-2 md:mb-0">
                    <Box
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${eventImage}')` }}
                    ></Box>
                  </Box>
                </Box>

                <Box className="md:w-full ml-2 md:ml-20 md:mr-10 ml-0 flex">
                  <Box>
                    <Box className="flex flex-row items-center mb-0">
                      <Image
                        alt="Thumbnail Image"
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                        width={30}
                        height={30}
                        src={event?.event?.thumbnailImage ?? DefaultThumbnail}
                      />
                      <Box className="flex items-center text-xs md:text-sm !text-gray-600">
                        {/* <Tooltip id="eventTitleDescription"> */}
                        {event?.event?.organizationName}
                        {/* </Tooltip> */}
                      </Box>
                    </Box>
                    <Box className="text-[20px] w-full font-bold overflow-hidden text-ellipsis whitespace-pre-wrap  ">
                      {event?.event?.title}
                    </Box>
                    <Box className="mb-6" style={{ whiteSpace: 'pre-wrap' }}>
                      <TextLink className="text-xs md:text-sm mt- mb-4 !text-gray-600">
                        {event?.event?.shortDescription}
                      </TextLink>
                    </Box>

                    <Box show={!!event.event?.eventLocation} className="mb-2">
                      <Box className={`text-md font-bold`}>Event Location</Box>
                      <TextLink className="text-xs md:text-sm mb-4 !text-gray-600">
                        {event?.event?.eventLocation}
                      </TextLink>
                    </Box>

                    {/* Event Dates */}
                    <Box className="flex mb-4">
                      <Box className="flex flex-col space-y-2 mr-4">
                        <Box className={`text-md font-bold !-mb-1`}>
                          Start Time/Date
                        </Box>
                        <Box className="text-xs md:text-sm !text-gray-600">
                          {moment(event?.event?.startDateTime).format(
                            'MMM DD, h:mm A'
                          )}
                        </Box>
                      </Box>
                      <Box className="flex flex-col space-y-2">
                        <Box className={`text-md font-bold !-mb-1`}>
                          End Time/Date
                        </Box>
                        <Box className="text-xs md:text-sm !text-gray-600">
                          {moment(event?.event?.endDateTime).format(
                            'MMM DD, h:mm A'
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Button Register to Event y Share */}
                    <Box className="flex items-center sm:mt-0 flex-wrap justify-between lg:justify-start">
                      <Button
                        show={ctaLabel?.show}
                        title={`${ctaLabel?.label ?? 'Register to Event'}`}
                        disabled={!ctaLabel?.enabled}
                        onClick={ctaLabel?.action}
                        icon={
                          <FaRegCalendarCheck
                            style={{ fill: '#fff', marginLeft: '5px' }}
                            fontSize="1em"
                          />
                        }
                        className={`mb-4 rounded-full min-w-48 text-[13px] mr-2 w-full md:w-auto md:max-w-xs flex items-center justify-center ${buttonDonate}`}
                      />
                      <Button
                        show={
                          ((!!event.fundraising?.title &&
                            event.fundraising.title.length > 0) ||
                            !!event.event?.donationUrl) &&
                          !!event?.fundraising?.enabled
                        }
                        className={`mb-4 rounded-full min-w-48 text-[13px] mr-2 w-full md:w-auto md:max-w-xs flex items-center justify-center ${buttonDonate}`}
                        title={`Donate`}
                        icon={
                          <FaDonate
                            style={{ fill: '#fff', marginLeft: '5px' }}
                            fontSize="1em"
                          />
                        }
                        onClick={() =>
                          router.push(`/event/${event.eventId}/donate`)
                        }
                      />
                      <Button
                        className={`mb-4 rounded-full min-w-48 text-[13px] mr-2 w-full md:w-auto md:max-w-xs flex items-center justify-center ${buttonDonate}`}
                        title={shareButtonText}
                        icon={
                          <svg
                            width="13"
                            height="16"
                            viewBox="0 0 13 16"
                            fill={'#fff'}
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1"
                          >
                            <path d="M11.375 0.601562H4.625C3.8 0.601562 3.125 1.27656 3.125 2.10156V11.1016C3.125 11.9266 3.8 12.6016 4.625 12.6016H11.375C12.2 12.6016 12.875 11.9266 12.875 11.1016V2.10156C12.875 1.27656 12.2 0.601562 11.375 0.601562ZM11.375 11.1016H4.625V2.10156H11.375V11.1016ZM0.125 10.3516V8.85156H1.625V10.3516H0.125ZM0.125 6.22656H1.625V7.72656H0.125V6.22656ZM5.375 14.1016H6.875V15.6016H5.375V14.1016ZM0.125 12.9766V11.4766H1.625V12.9766H0.125ZM1.625 15.6016C0.8 15.6016 0.125 14.9266 0.125 14.1016H1.625V15.6016ZM4.25 15.6016H2.75V14.1016H4.25V15.6016ZM8 15.6016V14.1016H9.5C9.5 14.9266 8.825 15.6016 8 15.6016ZM1.625 3.60156V5.10156H0.125C0.125 4.27656 0.8 3.60156 1.625 3.60156Z" />
                          </svg>
                        }
                        onClick={(e) => {
                          navigator.clipboard.writeText(
                            `https://${window.location.hostname}${router.asPath}`
                          )
                          setShareButtonText('Copied!')
                          setTimeout(() => {
                            setShareButtonText('Share')
                          }, 3000)
                          e.preventDefault()
                        }}
                      />
                      <Button
                        show={isOrganizer && canEditEvent(event as Event)}
                        className={`mb-4 rounded-full min-w-48 text-[13px] mr-2 w-full md:w-auto md:max-w-xs flex items-center justify-center ${buttonDonate}`}
                        title="Edit"
                        icon={
                          <MdEdit style={{ fill: '#fff' }} fontSize="1.5em" />
                        }
                        onClick={() => {
                          router.push(`/create-event?id=${event.eventId}`)
                        }}
                      />
                    </Box>
                    {!loading && !profile && (
                      <Box className="mt-4 text-xs md:text-sm">
                        Already registered?{' '}
                        <Link className="underline" href="/login?previous=true">
                          Log in here
                        </Link>
                        . Having trouble? Email{' '}
                        <a className="underline" href="mailto:hello@forumm.to">
                          hello@forumm.to
                        </a>
                        .
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={`sm:px-4 w-full flex justify-center `}>
          <Box className="w-full md:w-[85%] max-w-[1500px]">
            {/* Announcements */}
            <Box className="mt-8 mb-64">
              {announcements && announcements.length > 0 && (
                <Box
                  className="p-10 rounded-xl border border-forumm-menu-border"
                  color="foregroundColour"
                >
                  <Box className="text-2xl font-medium flex space-x-2">
                    <AnnouncementIcon
                      fill={theme.textColour}
                      className="w-8 h-8"
                    />
                    <span>Announcements</span>
                  </Box>
                  {!noAnnouncements ? (
                    <Box className="mt-8">
                      {announcements?.map((a) => {
                        return (
                          <Box key={a.title}>
                            <h3 className="text-lg mt-6 font-semibold">
                              {a.title}
                            </h3>
                            <p className="text-xs md:text-sm">{a.body}</p>
                          </Box>
                        )
                      })}
                    </Box>
                  ) : (
                    <Box className="mt-8 text-xs md:text-sm">
                      No Announcements
                    </Box>
                  )}
                </Box>
              )}

              {/*<Box className="mt-8 flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 w-full">
              <Box
                color="foregroundColour"
                className="rounded-2xl flex flex-col p-10 border border-forumm-menu-border flex-2"
              >
                <Box className="text-2xl font-medium">Program Title</Box>
                <Box className="mt-8 text-justify text-sm space-y-4 md:space-y-0">
                  <ReactMarkdown>
                    {event?.event?.shortDescription ?? ''}
                  </ReactMarkdown>
                </Box>
              </Box>
                </Box>*/}

              {/* <Box className="mt-8 flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 w-full"> */}
              {/* Description */}
              {/* <Box
                color="foregroundColour"
                className="rounded-2xl flex flex-col p-10 border border-forumm-menu-border flex-2"
              >
                <Box className="text-2xl font-medium">Description</Box>
                <Box className="mt-8 text-justify text-sm md:columns-2 columns-1 space-y-4 md:space-y-0">
                  {(window.location.href.includes('forumm-academy-webinar') ||
                    window.location.href.includes(
                      '61c0465c-9177-4ac0-8d4e-7347b58d2ad8'
                    )) && (
                    <Box>
                      <iframe
                        src="https://www.loom.com/embed/a57f9c5c676941ae950c37707242721e"
                        frameBorder="0"
                        allowFullScreen
                        style={{
                          width: '100%',
                          height: '300px',
                          border: 'none',
                        }}
                      ></iframe>
                      <Box className="h-[150px]" />
                    </Box>
                  )} */}
              {/* <ReactMarkdown> */}
              {/* {event?.event?.description ?? ''} */}
              {/* </ReactMarkdown> */}
              {/* </Box>
              </Box>
            </Box> */}
              <Box className="mt-8 flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 w-full">
                {/* Description Box */}
                <Box
                  color="foregroundColour"
                  className="rounded-2xl flex flex-col p-10 border border-forumm-menu-border flex-2"
                >
                  <Box className="text-2xl font-medium">Description</Box>
                  <Box className="my-6" style={{ whiteSpace: 'pre-wrap' }}>
                    {(window.location.href.includes('forumm-academy-webinar') ||
                      window.location.href.includes(
                        '61c0465c-9177-4ac0-8d4e-7347b58d2ad8'
                      )) && (
                      <Box>
                        <iframe
                          src="https://www.loom.com/embed/a57f9c5c676941ae950c37707242721e"
                          frameBorder="0"
                          allowFullScreen
                          style={{
                            width: '100%',
                            height: '350px',
                            border: 'none',
                          }}
                        ></iframe>
                        <Box className="h-[25px]" />
                      </Box>
                    )}
                    {/* Use RichTextDisplay to show descripción */}
                    {event?.event?.description ? (
                      <RichTextDisplay
                        descriptionJson={event.event.description}
                      />
                    ) : (
                      'No description provided.'
                    )}
                  </Box>
                </Box>
              </Box>

              <Box className="mt-8 flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 w-full">
                {/* Sessions */}
                <Box
                  show={!!event?.sessions && event?.sessions?.length > 0}
                  color="foregroundColour"
                  className="rounded-2xl flex flex-col p-8 border border-forumm-menu-border flex-1"
                >
                  <Box className="text-justify text-sm">
                    <SessionList
                      sessions={(event?.sessions as EventSession[]) ?? []}
                      eventId={event?.eventId!}
                    />
                  </Box>
                </Box>
              </Box>
              <Box className="mt-2 flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 w-full mt-9">
                <Box
                  show={!!event?.speakers && event?.speakers?.length > 0}
                  color="foregroundColour"
                  className="rounded-2xl flex flex-col p-8 border border-forumm-menu-border flex-2"
                >
                  <Box className="text-2xl font-medium">Speakers</Box>
                  <Box className="text-justify text-sm">
                    {/* Redudant code, this wont be loaded if there are no speakers. */}
                    {/* {(!event?.speakers || event?.speakers?.length === 0) && ( */}
                    {/*   <Box className="my-8"> */}
                    {/*     No speakers have been added for this event yet. Check back */}
                    {/*     soon! */}
                    {/*   </Box> */}
                    {/* )} */}

                    <Box className="flex flex-wrap mt-4 -mb-4 -mx-4 justify-center">
                      {event?.speakers?.map((s, index) => (
                        <Box
                          key={`${s.email}-${index}`}
                          className="p-4 flex-1 max-w-xs text-center cursor-pointer hover:animate-heartbeat min-w-[15rem]"
                          onClick={() => setSpeakerModalTarget(s)}
                        >
                          <Box
                            className="p-8 flex flex-col items-center rounded-lg border border-forumm-menu-border"
                            color="backgroundColourSecondary"
                          >
                            <ProfileImage
                              size="lg"
                              imageUrl={s?.profileImage}
                            />
                            <Box
                              className="mt-8 font-bold text-lg"
                              style={{ minHeight: '60px' }}
                            >
                              {s.name}
                            </Box>
                            <Box className="mt-2" style={{ minHeight: '40px' }}>
                              {s.position}
                            </Box>
                            <Box className="mt-2" style={{ minHeight: '40px' }}>
                              {s.organization}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box
                show={!!event?.sponsors && event?.sponsors?.length > 0}
                className="mt-8 flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 w-full"
              >
                {/* Sponsors */}
                <Box
                  color="foregroundColour"
                  className="rounded-2xl flex flex-col p-8 border border-forumm-menu-border flex-2 max-w-[100%] overflow-y-scroll scrollbar-hide"
                >
                  <Box className="text-2xl font-medium">Partners</Box>
                  {event?.sponsors && event?.sponsors.length > 0 && (
                    <Box className="text-xl">
                      <Box className="flex space-x-2 justify-evenly pb-10">
                        <Carousel
                          className={
                            'inline-block w-full justify-center items-center'
                          }
                          items={event.sponsors.map((s) => {
                            return {
                              url:
                                s.logoUrl ??
                                'https://assets.tumblr.com/images/default_header/optica_pattern_11.png',
                              title: s.title ?? '',
                              description: s.description ?? '',
                              onClick: () => {
                                if (
                                  (getTicketStatus() || isAdmin) &&
                                  s.websiteUrl
                                ) {
                                  window.open(s.websiteUrl, '_blank')
                                }
                              },
                            }
                          })}
                          fixedHeight={true}
                        />
                        {/* {event?.sponsors?.map((s, i) => { */}
                        {/*   return ( */}
                        {/*     <Card */}
                        {/*       className={`hidden sm:inline-block`} */}
                        {/*       key={i} */}
                        {/*       fixedWidth={true} */}
                        {/*       imgSrc={s.logoUrl ?? undefined} */}
                        {/*       onClick={() => { */}
                        {/*         if (s.websiteUrl && isValidUrl(s.websiteUrl)) */}
                        {/*           window.open( */}
                        {/*             fixUrlProtocol(s.websiteUrl), */}
                        {/*             '_blank' */}
                        {/*           ) */}
                        {/*         if (hasTicket || isAdmin) */}
                        {/*           router.push( */}
                        {/*             `/event/${event.eventId}/sponsors/${s.title}` */}
                        {/*           ) */}
                        {/*       }} */}
                        {/*     > */}
                        {/*       {s.title} */}
                        {/*     </Card> */}
                        {/*   ) */}
                        {/* })} */}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
              {(isAdmin || isOrganizer) &&
                eventAttendees &&
                eventAttendees.length > 0 && (
                  <Box className="mt-8 flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 w-full">
                    <Box
                      color="foregroundColour"
                      className="rounded-2xl flex flex-col p-2 md:p-8 border border-forumm-menu-border flex-2"
                    >
                      <Box className="text-2xl font-medium">Attendees</Box>
                      <Box className="mt-8 text-justify text-sm">
                        {event && (
                          <AttendeeList
                            refetchEvent={reload}
                            eventId={event.eventId!}
                            attendees={
                              (eventAttendees as EventAttendee[]) ?? []
                            }
                            isPublished={event?.isPublished}
                            registrationFields={event?.registrationFields ?? []}
                            userRegistrationFields={userRegistrationFields}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
            </Box>
          </Box>
        </Box>
        <Toaster
          toastOptions={{
            className:
              'shadow-lg !rounded-full flex items-center border-2 !bg-forumm-white border-forumm-green !text-forumm-green mt-[80px]',
            duration: 4000,
          }}
        />
        <FooterUnauthenticated transparent={false} />
      </Box>
    </>
  )
}

EventPage.Layout = UnauthenticatedWrapperNoDefaults
