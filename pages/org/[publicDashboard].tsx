import EventsView from '@components/event/EventsView'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import Text from '@components/base/Text'
import { UnauthenticatedWrapperNoFooter } from '@layouts/Wrapper'
import { GET_PUBLIC_EVENTS_BY_ORGANISATION_URL } from '@graphql/events/getPublicEventsByOrganisationUrl'
import { useOrganisationProfile } from '@libs/useOrganisationProfile'
import headerBackground from '@public/header-background.png'
import LoadingSpinner from '@components/base/LoadingSpinner'
import LoadingBar from '@components/base/LoadingBar'
import Link from 'next/link'

export default function PublicDashboard() {
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'
  const router = useRouter()
  const { publicDashboard } = router.query

  const { loading, data } = useQuery(GET_PUBLIC_EVENTS_BY_ORGANISATION_URL, {
    variables: { url: publicDashboard as string },
    skip: !publicDashboard,
  })

  const {
    loading: organisationLoading,
    profile: organisationData,
    ready: organisationReady,
  } = useOrganisationProfile(publicDashboard as string)

  const headerBanner = organisationData?.bannerImage ?? headerBackground.src

  const headerTitle = organisationData?.headerTextOne ? (
    organisationData?.headerTextOne
  ) : (
    <> {organisationData?.name} Space</>
  )

  if (!organisationReady || organisationLoading) {
    return (
      <Box className="flex-1 overflow-y-scroll mt-20 scrollbar-hide h-[calc(100vh_-_81px)] relative flex items-center flex-col">
        <LoadingBar />
      </Box>
    )
  }

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

  let events = [...(data?.getPublicEventsByOrganisationUrl || [])].sort(
    (a, b) => {
      const dateA = a.event?.startDateTime
        ? new Date(a.event.startDateTime)
        : null
      const dateB = b.event?.startDateTime
        ? new Date(b.event.startDateTime)
        : null

      if (!dateA && !dateB) return 0 // Both dates are null or undefined
      if (!dateA) return 1 // dateA is null or undefined, so it should come after dateB
      if (!dateB) return -1 // dateB is null or undefined, so dateA should come before dateB

      return dateA.getTime() - dateB.getTime()
    }
  )

  return (
    <Box className="flex-1 overflow-y-scroll overflow-x-hidden scrollbar-hide h-[calc(100vh_-_81px)] relative flex items-center flex-col pb-10">
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
        <Box className="lg:min-w-[57rem] z-999 relative w-full flex justify-center items-center ">
          <Box
            className={`rounded-2xl shadow-lg md:w-[85%] max-w-[1500px] flex p-10 md:p-6 md:px-8 md:py-4 md:pt-6 md:pb-6 z-1000 animate-text-focus-in ${
              isDarkTheme ? '' : 'border border-forumm-menu-border'
            }`}
            color="backgroundColorBanner"
            style={{
              background: isDarkTheme
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
            }}
          >
            <Box className="px-6 lg:px-0 z-1000 relative w-full">
              <Text className="text-4xl pb-4 text-center leading-snug mt-2 px-12 sm:px-0 mb-2">
                {headerTitle}
              </Text>
              <Box
                className="animate-text-focus-in"
                style={{ animationDelay: '0.8s' }}
              >
                <Text className="text-base text-center px-12 sm:px-6 animate-text-focus-in">
                  {headerSubTitle}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="w-3/4 flex-col max-w-[1400px]">
        {events && (
          <Text className="text-2xl mb-2 mt-8 pl-5 sm:pl-0 ml-[8%]">
            Public Events
          </Text>
        )}
        <Box className="items-center flex flex-row">
          {!loading && events && (
            <EventsView
              events={events as any}
              types={['ONLINE', 'IN_PERSON', 'FUNDRAISER']}
              title={''}
              currency={'GBP'}
              justify="center"
            />
          )}
          {loading && (
            <Box className="flex justify-center w-full py-32">
              <LoadingSpinner size="medium" />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

PublicDashboard.Layout = UnauthenticatedWrapperNoFooter
