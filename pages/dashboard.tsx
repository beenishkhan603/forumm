import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Event } from '@graphql/__generated/graphql'
import { useAuth } from '@libs/useAuth'
import { useTheme } from '@libs/useTheme'
import { Variants } from 'framer-motion'
import { useRouter } from 'next/router'
import { useOrganisationProfile } from '@libs/useOrganisationProfile'
import { FileInput } from '@components/inputs/FileInput'
import NoEvents from '@public/images/NoEvents.svg'
import useFileUploader from '@libs/useFileUploader'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { Button } from '@components/inputs/Button'
import EventsView from '@components/event/EventsView'
import LoadingBar from '@components/base/LoadingBar'
import DashboardLayout from '@layouts/DashboardLayout'
import Text from '@components/base/Text'
import Box from '@components/base/Box'
import Skeleton from '@components/ui/Skeleton'
import OrganizationBannerEditPopup from '@components/inputs/OrganizationBannerEditPopup'
import FilterButton from '@components/dashboard/FilterButton'
import SearchEvent from '@components/dashboard/SearchEvent'
import StylingModal from '@components/dashboard/StylingModal'
import headerBackground from '@public/images/event-bg-4.jpg'
import ActionButtons from '@components/chat/ActionButtons'
import FooterUnauthenticated from '@components/page/FooterUnauthenticated'
import BecomeOrganiserBanner from '@components/become-organiser/BecomeOrganiserBanner'
import { GET_MY_EVENT_OVERVIEWS } from '@graphql/events/getMyEventOverviews'
import { GET_EVENTS_BY_COMPANY_OVERVIEWS } from '@graphql/events/getEventsByCompanyOverviews'
import { GET_ALL_EVENT_OVERVIEWS } from '@graphql/events/getAllEventOverviews'
import { GET_PAST_EVENTS } from '@graphql/events/getPastEvents'
import { UPDATE_ORGANISATION } from '@graphql/organisation/updateOrganisation'
import Link from 'next/link'
import { color } from 'd3-color'

export default function OrganizerLaunchPage() {
  const { profile } = useAuth()
  const { theme } = useTheme()
  const uploadFile = useFileUploader()
  const [updateOrganisation] = useMutation(UPDATE_ORGANISATION)

  const [organisationBanner, setOrganisationBanner] = useState<
    string | File | undefined
  >()
  const [sectionTitle, setSectionTitle] = useState('Online')
  const [isReady, setIsReady] = useState<boolean>(false)
  const [term, setTerm] = useState('')
  const [filterTypes, setFilterTypes] = useState<string[]>([
    'ONLINE',
    'IN_PERSON',
    'FUNDRAISER',
  ])
  const [eventCounter, setEventCounter] = useState(0)
  const [pastCleaned, setPastCleaned] = useState<Event[]>([])
  const [companyCleaned, setCompanyCleaned] = useState<Event[]>([])
  const [myEventsCleaned, setMyEventsCleaned] = useState<Event[]>([])

  const isOrganizer = profile?.groups?.includes('organizer')
  const isAdmin = profile?.groups?.includes('forumm-admin')

  useEffect(() => {
    if (profile?.email) setIsReady(true)
  }, [profile])

  const { loading: myEventsLoading, data } = useQuery(GET_MY_EVENT_OVERVIEWS)
  const { loading: adminLoading, data: adminData } = useQuery(
    GET_ALL_EVENT_OVERVIEWS,
    { skip: !isAdmin }
  )
  const { loading: pastEventsLoading, data: pastEventsData } =
    useQuery(GET_PAST_EVENTS)

  const hasCompany = profile?.company || profile?.university
  const { loading: companyLoading, data: companyData } = useQuery(
    GET_EVENTS_BY_COMPANY_OVERVIEWS,
    {
      variables: {
        company: profile?.university ?? profile?.company!,
      },
      skip: !hasCompany,
    }
  )

  const {
    loading: organisationLoading,
    profile: organisationData,
    ready: organisationReady,
    refetchOrganisation,
  } = useOrganisationProfile(profile?.company ?? profile?.university!)

  let events = data?.getMyEvents as Event[]

  if (isAdmin) events = adminData?.getAllPublicEvents as Event[]

  const companyEvents = companyData?.getEventsByCompany as Event[]

  const pastEvents = pastEventsData?.getPastEvents as Event[]

  const filterEventsByType = (
    events: Event[],
    allowedTypes: string[]
  ): Event[] => {
    return events.filter((eventItem) =>
      allowedTypes.includes(eventItem?.event?.eventType ?? '')
    )
  }

  useEffect(() => {
    if (filterTypes) {
      let pastClean, companyClean, myEventClean

      if (pastEvents) {
        pastClean = filterEventsByType(pastEvents, filterTypes)
        setPastCleaned(pastClean)
      }

      if (companyEvents) {
        companyClean = filterEventsByType(companyEvents, filterTypes)
        setCompanyCleaned(companyClean)
      }

      if (events) {
        myEventClean = filterEventsByType(events, filterTypes)
        setMyEventsCleaned(myEventClean)
      }

      const totalEvents: number = [
        ...(pastClean ?? []),
        ...(companyClean ?? []),
        ...(myEventClean ?? []),
      ]
        .map((event) => event.eventId)
        .reduce(
          (acc, val) => (acc.includes(val) ? acc : [...acc, val]),
          [] as string[]
        ).length

      setEventCounter(totalEvents)
    }
  }, [filterTypes, pastEvents, companyEvents, events])

  const handleTitle = (value: string) => {
    setSectionTitle(value)
  }

  const router = useRouter()
  const slideIn: Variants = {
    hidden: {
      opacity: 0,
      x: '-100vw',
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  }
  const returnTitle = (value: string) => {
    switch (value) {
      case 'ONLINE':
        return 'Online'
      case 'IN_PERSON':
        return 'In-Person'
      case 'FUNDRAISER':
        return 'Donation'
      default:
        return 'All'
    }
  }

  useEffect(() => {
    if (filterTypes.length === 0 || filterTypes.length === 3) {
      setSectionTitle(`All ${profile?.university ?? profile?.company}'s`)
    }
    if (filterTypes.length === 1) {
      setSectionTitle(
        `${profile?.university ?? profile?.company}'s ${returnTitle(
          filterTypes[0]
        )}`
      )
    }
    if (filterTypes.length === 2) {
      setSectionTitle(
        `${profile?.university ?? profile?.company}'s ${returnTitle(
          filterTypes[0]
        )} and ${returnTitle(filterTypes[1])}`
      )
    }
  }, [filterTypes, profile?.company, profile?.university])

  const handleUpdateOrganisation = async ({
    bannerImage,
    headerTextOne,
    headerTextTwo,
  }: {
    bannerImage?: string
    headerTextOne?: string
    headerTextTwo?: string
  }) => {
    const companyName = organisationData?.name ?? profile?.company
    if (companyName) {
      let variables = {
        name: companyName,
      } as {
        name: string
        bannerImage?: string
        headerTextOne?: string
        headerTextTwo?: string
      }
      if (bannerImage) variables.bannerImage = bannerImage
      if (headerTextOne) variables.headerTextOne = headerTextOne
      if (headerTextTwo) variables.headerTextTwo = headerTextTwo
      await updateOrganisation({ variables })
      setTimeout(() => {
        refetchOrganisation()
      }, 500)
    }
  }

  const headerBanner =
    organisationBanner ?? organisationData?.bannerImage ?? headerBackground.src

  if (!profile) {
    return <LoadingBar />
  }
  if (!isReady || organisationLoading) {
    return (
      <Box className="flex-1 overflow-y-scroll h-[calc(100vh)] relative flex items-center flex-col">
        <LoadingBar />
      </Box>
    )
  }

  const isDarkTheme = theme.type === 'DARK'

  const headerTitle = organisationData?.headerTextOne ? (
    organisationData?.headerTextOne
  ) : (
    <>
      Welcome to your <br />
      {profile?.university ?? profile?.company} Space
    </>
  )

  const headerSubTitle = organisationData?.headerTextTwo ? (
    organisationData?.headerTextTwo
  ) : (
    <>
      Here, you{`'`}ll discover all the events and donation initiatives vital to
      our community. Lovingly created by the{' '}
      <Link
        href="/"
        className=" underline"
        style={{ color: theme.highlightColour }}
      >
        Forumm Team
      </Link>
      <br />
      If you spot any gremlins along the way, please don{`'`}t hesitate to let
      us know.
    </>
  )

  const totalAccountEvents =
    (events ?? []).length + (companyEvents ?? []).length

  return (
    <Box className="flex flex-1 -mt-[80px] pt-[80px] overflow-y-scroll overflow-x-hidden h-[calc(100vh)] items-center flex-col relative"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}>
      <Box
        className="relative sm:flex justify-center w-full md:min-h-[25rem]"
        style={{
          backgroundImage: `url(${headerBanner})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: theme.backgroundColour,
        }}
      >
        <Box className="lg:min-w-[57rem] z-999 relative w-full flex justify-center items-center">
          <Box show={isOrganizer} className="absolute cursor-pointer top-5 right-5 z-10">
            <FileInput
              uploadFile={uploadFile}
              crop={true}
              cropAspectRatio={4}
              cropShape={'rect'}
              value={organisationBanner}
              onChange={(data) => {
                setOrganisationBanner(data);
                if (typeof data === 'string' && data.length > 0) {
                  handleUpdateOrganisation({ bannerImage: data });
                }
              }}
              minified
            />
          </Box>

          <Box
            className={`rounded-2xl md:w-[85%] max-w-[1500px] flex p-10
            md:p-6 md:px-8 md:py-4 md:pt-6 md:pb-6 z-1000
            animate-text-focus-in bg-transparent`}
          >
            <Box className="px-6 lg:px-0 z-1000 relative w-full">
              {isOrganizer && (
                <OrganizationBannerEditPopup
                  headerTextOne={organisationData?.headerTextOne}
                  headerTextTwo={organisationData?.headerTextTwo}
                  onSave={(headerTextOne, headerTextTwo) => {
                    handleUpdateOrganisation({ headerTextOne, headerTextTwo });
                  }}
                />
              )}
              <Text
                className="text-4xl font-extrabold text-left leading-snug mt-2 px-12 sm:px-0 mb-2 uppercase"
                style={{
                  color: '#FFFFFF !important',
                  textShadow: '2px 2px 4px rgba(245, 242, 242, 0.6)',
                }}
              >
                {headerTitle}
              </Text>
              <Text
                className="text-lg font-medium text-left animate-text-focus-in text-white max-w-lg"
                style={{
                  marginLeft: 0,
                  paddingLeft: 0, 
                  textShadow: '1px 1px 2px rgba(244, 242, 242, 0.5)',
                }}
              >
                {headerSubTitle}
              </Text>
 

              {/** Optional button for organizers */}
              {isOrganizer && (
                <Box className="flex justify-start">
                  <Button
                    className="mt-4"
                    title="Create Event"
                    onClick={() => router.push('/create-event')}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box> 

      {profile && !isOrganizer && <BecomeOrganiserBanner />}
      {/* <Box className="md:w-[85%] max-w-[1500px] mb-2 mt-8 ml-4 text-xs sm:text-sm">
          <Text className={`${!(eventCounter > 0) && 'opacity-0'}`}>
            Explore <b>{eventCounter}</b>{' '}
            {eventCounter === 1 ? 'event' : 'events'}
          </Text>
        </Box> */}
      <Box className="pl-12 mt-6 sm:pl-0 sm:flex sm:flex-row-reverse justify-between md:w-[85%] max-w-[1500px] px-3 sm:p-0 ">
        <Box className="my-2 sm:my-0 ml-2 sm:ml-0">
        </Box>
        <Box className="flex gap-3 items-center mt-6 sm:mt-0 flex-wrap pl-1">
          <FilterButton
            buttonType={'ONLINE'}
            setTitle={handleTitle}
            title={'Online Events'}
            types={filterTypes}
            setTypes={(value: string[]) => setFilterTypes(value)}
          />
          <FilterButton
            buttonType={'IN_PERSON'}
            setTitle={handleTitle}
            title={'In-person Events'}
            types={filterTypes}
            setTypes={(value: string[]) => setFilterTypes(value)}
          />
          <FilterButton
            buttonType={'FUNDRAISER'}
            setTitle={handleTitle}
            title={'Donations'}
            types={filterTypes}
            setTypes={(value: string[]) => setFilterTypes(value)}
          />
        </Box>
      </Box>

      <Box className="pl-10 sm:pl-0 sm:flex sm:flex-row-reverse justify-between md:w-[85%] max-w-[1500px] px-3 sm:p-0">
        <Box className="text-white p-2 py-6 pt-0 w-full">
          <>
            <Text className="text-2xl font-medium -mb-2 my-2 mt-16 pl-5 sm:pl-0 ">
              My Space Events
            </Text>
            {!myEventsLoading &&
              myEventsCleaned &&
              myEventsCleaned.length > 0 ? (
              <EventsView
                events={myEventsCleaned}
                types={filterTypes}
                title={term}
                currency={organisationData.currency}
              />
            ) : (
              <Skeleton visible={myEventsLoading} />
            )}
            {!myEventsLoading && myEventsCleaned.length === 0 && (
              <Text className="pt-20 pb-20 text-base text-center">
                No events are currently available. Please check back later!
              </Text>
            )}
          </>
          {hasCompany && (
            <>
              {(companyLoading || companyCleaned.length > 0) && (
                <Text className="text-2xl font-medium mb-2 my-2 mt-16 pl-5 sm:pl-0 ">
                  {sectionTitle} Events
                </Text>
              )}
              {!companyLoading &&
                companyCleaned &&
                companyCleaned.length > 0 ? (
                <EventsView
                  events={companyCleaned}
                  types={filterTypes}
                  title={term}
                  currency={organisationData.currency}
                />
              ) : (
                <Skeleton visible={companyLoading} />
              )}
            </>
          )}
          {(pastEventsLoading || pastCleaned?.length > 0) && (
            <Text className="text-2xl font-medium -mb-2 mt-16 pl-5 sm:pl-0 ml-0">{`Past ${sectionTitle} Events`}</Text>
          )}
          <Skeleton visible={pastEventsLoading} />
          {!pastEventsLoading && pastCleaned && pastCleaned.length > 0 && (
            <EventsView
              events={pastCleaned}
              types={filterTypes}
              title={term}
              currency={organisationData.currency}
            />
          )}
        </Box>
      </Box>
      {isReady &&
        !organisationLoading &&
        !myEventsLoading &&
        !companyLoading &&
        !pastEventsLoading &&
        totalAccountEvents === 0 && (
          <>
            <Button
              type="secondary"
              size="large"
              title="Create your first event"
              className="mt-10 mb-20"
              onClick={() => router.push('/create-event')}
            ></Button>
          </>
        )}
      {isOrganizer && !organisationLoading && organisationReady && (
        <StylingModal organisationData={organisationData} />
      )}
      <FooterUnauthenticated transparent={false} />
    </Box>
  )
}

OrganizerLaunchPage.Layout = DashboardLayout
