import { useState, useEffect, ReactNode } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@libs/useAuth'
import { useOrganisationProfile } from '@libs/useOrganisationProfile'
import { useRouter } from 'next/router'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import LoadingBar from '@components/base/LoadingBar'
import { UnauthenticatedWrapper } from '@layouts/Wrapper'
import FooterUnauthenticated from '@components/page/FooterUnauthenticated'
import { ToggleInput } from '@components/inputs/ToggleInput'
import { DropdownInput } from '@components/inputs/DropdownInput'
import DonationTab from '@components/metrics/DonationTab'
import EventTab from '@components/metrics/EventTab'
import { GET_ALL_EVENTS_BY_COMPANY } from '@graphql/events/getAllEventsByCompany'
import { GET_ALL_STATISTICS_FOR_ORGANISER } from '@graphql/statistic/getAllStatisticsForOrganiser'
import currencies from '@libs/currencies'
import type {
  Event as GraphQLEvent,
  Statistic,
  Event,
  EventTicket,
  TicketType,
} from '@graphql/__generated/graphql'

type OptType = {
  id: string
  title: string
  donationUrl: string
}

const tabs = ['Events', 'Donations']
const defaultOpt = { id: '', title: 'All', donationUrl: '' }

export default function Metrics() {
  const router = useRouter()
  const { profile, isLogged } = useAuth()
  const { loading: organisationLoading, profile: organisationProfile } =
    useOrganisationProfile(profile?.company ?? profile?.university!)

  const hasCompany = profile?.company || profile?.university
  const currency = currencies[organisationProfile?.currency ?? 'GBP'].symbol

  const [tab, setTab] = useState<string>(tabs[0])
  const [optionsFundraises, setOptionsFundraises] = useState<OptType[]>([
    defaultOpt,
  ])
  const [filterFundraises, setFilterFundRaises] = useState<OptType>(defaultOpt)
  const [optionsEvents, setOptionsEvents] = useState<OptType[]>([defaultOpt])
  const [filterEvents, setFilterEvents] = useState<OptType>(defaultOpt)

  const { loading, data } = useQuery(GET_ALL_EVENTS_BY_COMPANY, {
    variables: {
      company: profile?.university ?? profile?.company!,
    },
    skip: !hasCompany,
  })

  const { loading: _loadingMetrics, data: metricsData } = useQuery(
    GET_ALL_STATISTICS_FOR_ORGANISER,
    {
      skip: !hasCompany,
    }
  )

  const filterById = filterFundraises.id || filterEvents.id
  const filterByUrl = filterFundraises.donationUrl || filterEvents.donationUrl

  const fundraises = data?.getAllEventsByCompany?.filter(
    (ev: GraphQLEvent) =>
      ev?.event?.eventType === 'FUNDRAISER' &&
      (!filterFundraises.id || ev?.eventId === filterFundraises.id)
  )

  const events = data?.getAllEventsByCompany?.filter((ev: GraphQLEvent) => {
    if (ev?.event?.eventType === 'FUNDRAISER') {
      return false
    }
    return filterEvents.id ? ev?.eventId === filterEvents.id : true
  })

  const metrics = (metricsData?.getAllStatisticsForOrganiser ?? []).filter(
    (metric: Statistic) => {
      if (tab === 'Donations') {
        if (filterFundraises.id) {
          const matches =
            metric.url?.includes(filterFundraises.donationUrl) ||
            metric.url?.includes(filterFundraises.id)
          return matches
        }
        return true
      } else if (tab === 'Events') {
        if (filterEvents.id) {
          const matches =
            metric.url?.includes(filterEvents.donationUrl) ||
            metric.url?.includes(filterEvents.id)
          return matches
        }
        return true
      }
      return true
    }
  )

  useEffect(() => {
    if (data) {
      const optionsFund = data?.getAllEventsByCompany
        ?.filter((ev: GraphQLEvent) => ev?.event?.eventType === 'FUNDRAISER')
        .map((row: GraphQLEvent) => ({
          id: row.eventId,
          title: row.fundraising?.title ?? row.event?.title ?? '-',
          donationUrl: row?.event?.donationUrl ?? '-',
        }))
      const optionsEvent = data?.getAllEventsByCompany
        ?.filter((ev: GraphQLEvent) => ev?.event?.eventType !== 'FUNDRAISER')
        .map((row: GraphQLEvent) => ({
          id: row.eventId,
          title: row.event?.title ?? '-',
          donationUrl: row?.event?.donationUrl ?? '-',
        }))
      setOptionsFundraises([...[defaultOpt], ...optionsFund])
      setOptionsEvents([...[defaultOpt], ...optionsEvent])
    }
  }, [data])

  const isOrganizer = profile?.groups?.includes('organizer')
  if (!profile || !isLogged || (profile && !isOrganizer)) {
    if (!isLogged || (profile && !isOrganizer))
      router.push('/login?previous=true')
    if (profile && !isOrganizer) router.push('/')
    return (
      <Box className="overflow-y-scroll scrollbar-hide relative">
        {(loading || organisationLoading) && <LoadingBar />}
      </Box>
    )
  }

  const tickets: EventTicket[] =
    data?.getAllEventsByCompany?.flatMap(
      (event: { availableTickets: { tickets: any } }) =>
        (event.availableTickets.tickets ?? []).map(
          (ticket: {
            price: any
            totalQuantity: any
            remaining: any
            ticketType: TicketType
            ticketTitle: any
          }) => ({
            __typename: 'EventTicket',
            adminFee: parseFloat(ticket.price ?? '0'),
            price: parseFloat(ticket.price ?? '0'),
            quantity: parseFloat(ticket.totalQuantity ?? '0'),
            remaining: parseFloat(ticket.remaining ?? '0'),
            ticketType: ticket.ticketType as TicketType,
            title: ticket.ticketTitle ?? 'Unknown',
          })
        )
    ) ?? []

  return (
    <Box className="overflow-y-scroll relative overflow-x-hidden h-[calc(100vh)] -mt-[80px] pt-[80px]">
      {(loading || organisationLoading) && <LoadingBar />}
      <Box className="flex flex-col w-full p-10 md:p-20 text-center justify-center items-center">
        <Box className="w-full sm:w-2/3 max-w-[1200px] flex flex-col sm:flex-row justify-between items-center">
          <Text className="text-sm mt-2">
            Metrics / <b>{tab}</b> /
            <Box className="inline-block ml-3">
              {tab === tabs[1] && (
                <DropdownInput
                  className="max-h-[1rem] -translate-y-10 w-auto"
                  options={optionsFundraises.map((row) => row.title)}
                  onChange={(_data, _isValid, index) => {
                    setFilterFundRaises(optionsFundraises[index ?? 0])
                  }}
                  value={filterFundraises.title}
                  overrideFullLabelClass="no-space"
                  autoWidth
                  noBorder
                />
              )}
              {tab === tabs[0] && (
                <DropdownInput
                  className="max-h-[1rem] -translate-y-10 w-auto"
                  options={optionsEvents.map((row) => row.title)}
                  onChange={(_data, _isValid, index) => {
                    setFilterEvents(optionsEvents[index ?? 0])
                  }}
                  value={filterEvents.title}
                  overrideFullLabelClass="no-space"
                  autoWidth
                  noBorder
                />
              )}
            </Box>
          </Text>
          <Box className="flex w-full max-w-[400px]">
            <ToggleInput
              selected={tab === tabs[0] ? 0 : 1}
              centerText
              testid={'cover-fee-input'}
              options={tabs}
              className={`w-full mt-4`}
              callback={(data) => {
                setFilterFundRaises(defaultOpt)
                setFilterEvents(defaultOpt)
                setTab(data)
              }}
            />
          </Box>
        </Box>
        <Box className="f-full md:w-4/5 max-w-[1200px]">
          {tab === tabs[1] ? (
            <DonationTab
              fundraiserId={filterFundraises?.id}
              metrics={metrics}
              fundraises={fundraises || []}
              loading={loading}
              organisationLoading={organisationLoading}
              currency={currency || 'GBP'}
            />
          ) : (
            <EventTab
              metrics={metrics}
              events={(events || []) as GraphQLEvent[]}
              loading={loading || organisationLoading}
              currency={currency || 'GBP'}
              fundraises={fundraises || []}
              filterEvents={filterEvents}
            />
          )}
        </Box>
      </Box>
      <FooterUnauthenticated transparent={false} />
    </Box>
  )
}

Metrics.Layout = function Layout({ children }: { children: ReactNode }) {
  return (
    <UnauthenticatedWrapper showFooter={false}>
      {children}
    </UnauthenticatedWrapper>
  )
}
