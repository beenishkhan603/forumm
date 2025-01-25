import React, { useCallback, useEffect, useState, ReactNode } from 'react'
import { roundAmount } from '@libs/Utility/util'
import Image from 'next/image'
import { useRouter } from 'next/router'
import DefaultThumbnail from '@public/images/default-thumbnail.png'
import { useLazyQuery, useQuery } from '@apollo/client'
import { UnauthenticatedWrapper } from '@layouts/Wrapper'
import { loadStripe } from '@stripe/stripe-js'
import { GET_EVENT_BY_DONATION_URL } from '@graphql/events/GetEventByDonationUrl'
import {
  Event,
  EventDetails,
  EventFundraising,
  FundraisingProgram,
  PaymentType,
} from '@graphql/__generated/graphql'
import Box from '@components/base/Box'
import moment from 'moment'
import { Button } from '@components/inputs/Button'
import TextLink from '@components/base/TextLink'
import {
  DonationProgressWheel,
  DONATION_WHEEL_CONFIG,
} from '@components/donation/DonationProgressWheel'
import currencies from '@libs/currencies'
import { getDynamicStyle, truncateString } from '@libs/Utility/util'
import { useOrganisationProfile } from '@libs/useOrganisationProfile'
import { DonationWall } from '@components/donation/DonationWall'
import LoadingBar from '@components/base/LoadingBar'
import { useTheme } from '@libs/useTheme'
import { Elements } from '@stripe/react-stripe-js'
import DonationForm from '@components/donation/DonationForm'
import { EVENT_DONATON_LIST_TRANSACTIONS } from '@graphql/events/eventDonationListTransactions'
import { useAuth } from '@libs/useAuth'
import { MdEdit, MdOutlineArrowBackIos } from 'react-icons/md'
import Carousel from '@components/carousel/Carousel'
import { prepareCarouselItems } from '@components/carousel/prepareCarouselItems'
import RichTextDisplay from '@components/base/RichTextDisplay'
import Card from '@components/event/Card'
import DonationGrid from '@components/donation/DonationGrid'
import FooterUnauthenticated from '@components/page/FooterUnauthenticated'
import Head from 'next/head'

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
const stripePromise = loadStripe(stripePublicKey)

export interface Donation {
  currency: string
  amount: number
  donator: {
    dob: string
    title: string
    firstName: string
    lastName: string
    email: string
  }
  message: string
  donatedAt: string
  program: string
  payment: {
    method: string
    isRecurring: boolean
    coverTrxFee: boolean
    coverPlatformFee: boolean
    giftAid: any
    giftAidConfirm: any
    card_details: {
      number: string
      exp_date: string
      CVC: string
      post_code: string
      address: string
    }
  }
  selectedRecurrency?: string
  homeAddress?: string
  paymentType?: PaymentType
  visibility?: string
  allowEmailContact?: boolean
  allowTelephoneContact?: boolean
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressPostalCode?: string
  addressCity?: string
  addressCountry?: string
  addressPhone?: string
  directDebit: {
    name: string
    number: string
    sort: string
    confirmDirectDebit?: boolean
  }
}

export interface Transaction {
  amount: number
  firstName: string
  lastName?: string
  currency: string
  message?: string
  created?: number
  datetime?: string
  address?: string
  coverFee?: string
  donation?: string
  fee?: string
  giftAid?: string
  selectedProgram?: string
  email?: string
  avatarUrl?: string | null
  visibility?: string
  paymentType?: PaymentType
  donorDob?: string | null
}

export default function DonationPage({
  eventDonationUrl,
}: {
  eventDonationUrl?: string
}) {
  const router = useRouter()
  const donationUrl = eventDonationUrl || (router.query.donationUrl as string)
  const { profile, isAdmin, isOrganizer, isLogged, canEditEvent } = useAuth()
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const forceUSD = ['sussex-hardship-appeal-us'].includes(donationUrl)

  const {
    data,
    loading: eventLoading,
    error: eventError,
  } = useQuery(GET_EVENT_BY_DONATION_URL, {
    variables: {
      input: {
        donationUrl: donationUrl as string,
      },
    },
    skip: !donationUrl,
  })

  const organizer = data?.getEventByDonationUrl.event?.organizationName
  const { profile: organisationProfile } = useOrganisationProfile(
    organizer || ''
  )

  const selectedCurrency = forceUSD ? 'USD' : organisationProfile.currency
  const currencyInfo = currencies[selectedCurrency.toUpperCase()]

  const platformFee =
    organisationProfile?.percentage !== undefined
      ? organisationProfile.percentage
      : 10
  const { theme } = useTheme()
  const dynamicStyle = getDynamicStyle(theme.highlightColour)

  const [isDonationModalOpen, setDonationModalOpen] = useState(false)
  const [generalLoading, setGeneralLoading] = useState(false)
  const [hideDonationWheel, setHideDonationWheel] = useState(true)
  const [canGoBack, setCanGoBack] = useState<boolean>(false)
  const [fetchDonations, { loading }] = useLazyQuery(
    EVENT_DONATON_LIST_TRANSACTIONS,
    { fetchPolicy: 'network-only' }
  )

  const [donationFormInitialValue, setDonationFormInitialValue] = useState({})

  const [donationData, setDonationData] = useState<Transaction[] | undefined>()
  const [programmeData, setProgrammeData] = useState<Record<string, number>>()

  useEffect(() => {
    if (window && window.history && window.history.length > 2) {
      setCanGoBack(true)
    }
  }, [])

  const eventId = data?.getEventByDonationUrl.eventId
  const fundraisingData = data?.getEventByDonationUrl
    ?.fundraising as EventFundraising
  const eventDetails = data?.getEventByDonationUrl?.event as EventDetails

  const getDonations = useCallback(() => {
    if (eventId && !DONATION_WHEEL_CONFIG.disabled.includes(eventId)) {
      setHideDonationWheel(false)
    }

    fetchDonations({
      variables: {
        eventId: eventId,
        donationUrl: donationUrl,
      },
    }).then((d) => {
      const payload: Transaction[] =
        d?.data?.eventDonationListTransactions.transactions.map(
          (tx): Transaction => {
            return {
              amount:
                typeof tx?.amount === 'number'
                  ? tx?.amount
                  : parseInt(tx.amount),
              firstName: tx.firstName ?? 'Anonymous',
              lastName: tx.lastName ?? '',
              currency: tx.currency ?? selectedCurrency,
              message: tx.message ?? undefined,
              created: tx?.created,
              datetime: tx?.created
                ? moment(tx.created * 1000).format('DD/MM/YYYY HH:mm:ss')
                : '',
              address: tx?.address ?? undefined,
              coverFee: tx?.coverFee ?? undefined,
              donation:
                typeof tx?.donation === 'string'
                  ? tx?.donation
                  : tx?.donation?.toString(),
              fee: typeof tx?.fee === 'string' ? tx?.fee : tx?.fee?.toString(),
              giftAid: tx?.giftAid ?? undefined,
              selectedProgram: tx?.selectedProgram ?? undefined,
              email: tx?.email ?? undefined,
              visibility: tx?.visibility ?? 'Name & amount',
              donorDob: tx?.donorDob,
              avatarUrl:
                'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/heart-and-hand-donation-icon.png',
            }
          }
        ) ?? []
      setGeneralLoading(false)

      const programmePayload = payload
        .filter((p) => !!p.selectedProgram)
        .map((tx) => ({ programme: tx.selectedProgram, amount: tx.amount }))
        .reduce((acc, tx) => {
          if (tx.programme && tx.amount) {
            const prevVal =
              // @ts-ignore
              acc[tx.programme.toUpperCase().trim().replaceAll(' ', '_')] ?? 0
            // @ts-ignore
            acc[tx.programme.toUpperCase().trim().replaceAll(' ', '_')] =
              prevVal + tx.amount / 100
          }
          return acc
        }, {})

      // @ts-ignore
      setProgrammeData(programmePayload)
      setDonationData(payload)
    })
  }, [donationUrl, eventId, fetchDonations])

  useEffect(() => {
    getDonations()
  }, [getDonations])

  const isDarkTheme = theme.type === 'DARK'

  const eventImage =
    eventDetails?.bannerImage ??
    'https://assets.tumblr.com/images/default_header/optica_pattern_11.png'

  const eventData = data?.getEventByDonationUrl

  const carouselItemsPrepare = prepareCarouselItems({
    media: data?.getEventByDonationUrl?.fundraising?.media || [],
    options: {
      coverImage: eventImage,
      title: data?.getEventByDonationUrl?.fundraising?.title,
      description: data?.getEventByDonationUrl?.fundraising?.description,
    },
  })

  const checkAuth = (isPublished: boolean) => {
    if (!isLogged) router.push('/')

    if (!isOrganizer && !isAdmin && !isPublished) router.push('/')

    if (
      !isAdmin &&
      isOrganizer &&
      eventData?.event?.organizationName !== profile?.university &&
      eventData?.event?.organizationName !== profile?.company
    )
      router.push('/')

    if (
      !isAdmin &&
      !isOrganizer &&
      eventData?.event?.organizationName !== profile?.university &&
      eventData?.event?.organizationName !== profile?.company
    )
      router.push('/')
  }

  useEffect(() => {
    if (isLogged && (eventData || eventError) && profile) setIsMounted(true)
    if (!isLogged && (eventData || eventError)) setIsMounted(true)
  }, [profile, eventData, isLogged, eventError])

  useEffect(() => {
    if (eventError && !eventData && isMounted) {
      router.push(`/`)
    }
  }, [eventError, router, eventData, isMounted])

  useEffect(() => {
    if (!!eventData && !eventLoading) {
      if (eventData.isPublished !== true) checkAuth(false)
      if (eventData.event?.publiclyListed !== true)
        checkAuth(eventData.isPublished === true)
    }
  }, [isMounted])

  if (!eventData?.eventId) {
    return <LoadingBar />
  }

  const programmes = [
    {
      description: eventDetails.description,
      goal: fundraisingData.goal,
      media: eventDetails.bannerImage,
      title: fundraisingData.title ?? `Main Fund`,
    } as FundraisingProgram,
    ...(fundraisingData?.programs ?? []),
  ]

  const pageUrl = `https://app.${process.env.NEXT_PUBLIC_DOMAIN as string}${
    router.asPath
  }`

  const ogData = (() => {
    const payload = {
      url: 'https://images-prod.forumm.to/user-content/f23a4ed7-44e0-4176-a7d0-93f4efae2caa/jpa.png',
      alt: 'Forumm',
      desc: 'Event management and fundraising made simple.',
    }
    if (!eventData || !eventData.event) return payload
    if (!!eventData.event.bannerImage) {
      payload.url = eventData.event.bannerImage
      payload.alt = eventData.event.shortDescription ?? eventData.event.title
    } else if (!!eventData.fundraising?.media?.[0]) {
      payload.url = eventData.fundraising.media[0].url
      payload.alt = eventData.fundraising.media[0].title
    }
    payload.desc = eventData.event.shortDescription ?? eventData.event.title
    return payload
  })()

  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={eventData.event?.title ?? 'Forumm'}
        />
        <meta property="og:description" content={ogData.desc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogData.url} />
        <meta property="og:image:alt" content={ogData.alt} />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:type" content="website" />
      </Head>
      <Box
        className={`overflow-y-scroll overflow-x-hidden h-[calc(100vh)] -mt-[80px] pt-[80px] relative`}
      >
        <Elements stripe={stripePromise}>
          <DonationForm
            eventDetails={eventDetails}
            programs={programmes}
            eventId={eventId!}
            isOpen={isDonationModalOpen}
            setIsOpen={setDonationModalOpen}
            organisationCurrency={selectedCurrency}
            platformFee={platformFee}
            refetchDonations={() => {
              setGeneralLoading(true)
              setTimeout(() => {
                getDonations()
              }, 8000)
            }}
            initialValue={donationFormInitialValue}
          />
        </Elements>
        {/* Background Image */}
        <Box
          color="foregroundColour"
          style={dynamicStyle as unknown as {}}
          className="relative px-2 pt-9 pb-9 border-b border-forumm-menu-border"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover select-none no-controls"
          >
            <source
              src="https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/video-background.mp4"
              type="video/mp4"
            />
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
              <Box className="hidden md:flex ml-2 items-center">
                <Box className="md:h-[250px] md:w-[250px] w-[250px] h-[240px] md:rounded-2xl rounded-md overflow-hidden flex flex-col justify-start items-center mx-auto md:ml-2">
                  <Box
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${eventImage}')` }}
                  ></Box>
                </Box>
              </Box>

              <Box className="md:w-full ml-2 md:ml-20 md:mr-10 ml-0 flex">
                <Box>
                  <Box className="flex flex-row items-center mb-2">
                    <Image
                      alt="Thumbnail Image"
                      className="h-10 w-10 rounded-full mr-4 object-cover"
                      width={30}
                      height={30}
                      src={eventDetails?.thumbnailImage ?? DefaultThumbnail}
                    />
                    <Box className="flex items-center text-[14px]">
                      {/* <Tooltip id="eventTitleDescription"> */}
                      {eventDetails?.organizationName}
                      {/* </Tooltip> */}
                    </Box>
                  </Box>
                  <Box className="text-[36px] w-full">
                    {eventDetails?.title}
                  </Box>
                  <Box className="mb-6" style={{ whiteSpace: 'pre-wrap' }}>
                    <TextLink className="text-[16px] md:text-[16px] mt-4 mb-4">
                      {eventDetails?.shortDescription}
                    </TextLink>
                  </Box>
                  <Box className="mt-10 flex items-center space-x-4">
                    <Button
                      title="Donate"
                      onClick={() => {
                        setDonationModalOpen(true)
                      }}
                      type="primary"
                      className={`rounded-full text-[14px] h-[40px] flex items-center justify-center self-end sm:self-center mr-8`}
                    />
                    <Box
                      show={canGoBack}
                      className="cursor-pointer hover:underline ${isDarkTheme ? '!text-forumm-active-blue' : '!text-forumm-white'} text-center text-sm flex justify-center items-center hover:animate-heartbeat"
                      onClick={() => router.back()}
                    >
                      <MdOutlineArrowBackIos /> Go Back
                    </Box>
                    <Button
                      show={isOrganizer && canEditEvent(eventData as Event)}
                      className={`border-none text-xs flex items-center justify-center hover:underline hover:animate-heartbeat !ml-4`}
                      title="Edit"
                      icon={<MdEdit fontSize="1.5em" />}
                      type="tertiary"
                      size="small"
                      onClick={() => {
                        router.push(`/create-event?id=${eventId}`)
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Main Container */}
        <Box
          className={`px-2 mt-[70px] mx-auto w-full md:w-[85%] max-w-[1500px]`}
        >
          {/* First Row */}
          <Box className="flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0">
            {/* Main Info */}
            <Box
              color="foregroundColour"
              className="rounded-2xl flex flex-col sm:flex-row border border-forumm-menu-border flex-2 w-full sm:w-auto lg:w-[90%] xl:w-[85%] max-h-[90vh] overflow-y-auto"
            >
              <Box className="sm:w-2/5 flex flex-col flex-1 justify-start relative p-6 sm:p-10 md:p-12 lg:p-10 ml-6 md:ml-0 min-h-[64px]">
                <Box className="flex flex-row items-center w-full mb-4">
                  <Image
                    alt="Thumbnail Image"
                    className="h-16 w-16 rounded-full mr-4 block object-cover hover:animate-heartbeat"
                    width={96}
                    height={96}
                    src={eventDetails?.thumbnailImage ?? DefaultThumbnail}
                  />
                  <Box className="text-[22px] w-full">
                    {eventDetails?.organizationName}
                  </Box>
                </Box>
                <Box className="text-[36px] w-full mt-4">
                  {fundraisingData?.title}
                </Box>
                <Box className="my-6" style={{ whiteSpace: 'pre-wrap' }}>
                  {fundraisingData?.description ? (
                    <RichTextDisplay
                      descriptionJson={fundraisingData?.description}
                    />
                  ) : (
                    'No description provided.'
                  )}
                </Box>
              </Box>
            </Box>
            {/* Progress Wheel & CTA */}
            <Box className="flex flex-col flex-1 w-full sm:w-auto">
              {/* Donation Progress Wheel */}
              {!hideDonationWheel && (
                <Box
                  color="foregroundColour"
                  className="rounded-2xl flex flex-col p-2 border border-forumm-menu-border w-full mb-4"
                >
                  <DonationProgressWheel
                    currentAmount={
                      donationData?.reduce((acc, val) => {
                        const amount =
                          val?.coverFee === 'no' || !val?.coverFee
                            ? val?.amount
                            : parseInt(val?.donation!)
                        return amount / 100 + acc
                      }, 0) ?? 0
                    }
                    donationGoal={
                      data?.getEventByDonationUrl?.fundraising?.goal ?? 0
                    }
                    numberOfDonators={donationData?.length ?? 0}
                    currency={currencyInfo}
                    isLoading={loading || !data || generalLoading}
                    donationAction={() => setDonationModalOpen(true)}
                  />
                </Box>
              )}

              {/* Donation Wall */}
              <Box
                color="foregroundColour"
                className="rounded-2xl flex flex-col flex-grow p-2 border border-forumm-menu-border w-full"
              >
                <DonationWall
                  donations={donationData ?? []}
                  customClassName={hideDonationWheel ? '' : 'max-h-[300px]'}
                  donationAction={() => setDonationModalOpen(true)}
                />
              </Box>
            </Box>
          </Box>
          {/* Second Row */}
          <Box className="flex flex-col md:flex-row space-y-6 md:space-x-6 md:space-y-0 mt-6 mb-8 h-full">
            {/* Video */}
            {carouselItemsPrepare.length > 0 && (
              <Box
                color="foregroundColour"
                className="flex flex-2 flex-col size-full lg:w-[90%] xl:w-[85%] relative rounded-2xl overflow-hidden border border-forumm-menu-border py-6"
              >
                <Carousel
                  show={carouselItemsPrepare.length > 0}
                  items={carouselItemsPrepare}
                />
              </Box>
            )}
          </Box>
          <Box
            show={(fundraisingData?.programs ?? []).length > 0}
            className="flex items-stretch justify-between flex-wrap gap-4"
          >
            {fundraisingData?.programs?.map((program) => {
              const raised = roundAmount(
                programmeData?.[
                  program.title.toUpperCase().trim().replaceAll(' ', '_')
                ] ?? 0
              )
              const currencySymbol = forceUSD
                ? 'USD'
                : currencies[eventData.event?.currency ?? 'GBP'].symbol

              const percentage = (Number(raised) / Number(program.goal)) * 100

              return (
                <Card
                  className="!rounded-2xl mb-4 max-w-[100%] sm:max-w-[30%] w-full overflow-hidden border border-forumm-menu-border min-h-[300px]"
                  imgSrc={program.media?.url ?? DefaultThumbnail.src}
                  key={`${program.title.trim().replaceAll(' ', '_')}`}
                  fixedWidth={false}
                  ratio="aspect-auto"
                  onClick={() => {
                    setDonationFormInitialValue({
                      ...donationFormInitialValue,
                      selectedProgram: program.title.toUpperCase(),
                    })
                    setDonationModalOpen(true)
                  }}
                >
                  <Box className="flex size-full flex-col justify-between">
                    <Box className={`flex justify-center flex-col`}>
                      <span className="text-2xl">{program.title}</span>
                      <span className="text-sm text-left mt-1">
                        {truncateString(program?.description ?? '', 150)}
                      </span>
                    </Box>
                    <Box>
                      <Box
                        className={`my-2`}
                        style={{
                          opacity: program.goal || raised ? 1 : 0,
                        }}
                      >
                        <Box className="flex justify-between text-sm">
                          <span className={``}>
                            <b>{`${currencySymbol}${raised}`}</b> Raised
                          </span>
                          <span className={``}>
                            <b>{`${currencySymbol}${program.goal}`}</b>
                          </span>
                        </Box>
                        <Box
                          className={`mt-1 bg-forumm-white ${
                            isDarkTheme
                              ? ''
                              : 'border border-forumm-menu-border'
                          } rounded-xl`}
                        >
                          <Box
                            className={`h-2 rounded-xl bg-forumm-blue-light`}
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          ></Box>
                        </Box>
                      </Box>
                      <Box className="flex justify-end gap-2 cursor-pointer w-full mt-2 hover:underline text-xs">
                        <Button
                          title="Donate"
                          size="full"
                          onClick={() => {
                            setDonationFormInitialValue({
                              ...donationFormInitialValue,
                              selectedProgram: program.title.toUpperCase(),
                            })
                            setDonationModalOpen(true)
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Card>
              )
            })}
          </Box>
          {eventData && canEditEvent(eventData as Event) && (
            <Box
              color="foregroundColour"
              className="rounded-2xl flex flex-col sm:flex-row p-2 border border-forumm-menu-border w-full flex-1"
            >
              <DonationGrid
                donations={donationData?.filter((tx) => tx?.created) ?? []}
                eventId={eventId ?? eventData.eventId}
              />
            </Box>
          )}
        </Box>
        <Box
          className={`text-center mb-10 mt-10 cursor-pointer ${
            isDarkTheme ? '!text-forumm-active-blue' : '!text-forumm-white'
          } hover:underline flex justify-center items-center hover:animate-heartbeat ${
            window.self !== window.top ? 'hidden' : ''
          }`}
          onClick={() => router.back()}
        >
          <MdOutlineArrowBackIos /> Back to Dashboard
        </Box>
        <FooterUnauthenticated transparent={false} />
      </Box>
    </>
  )
}

DonationPage.Layout = function Layout({ children }: { children: ReactNode }) {
  return (
    <UnauthenticatedWrapper showFooter={false}>
      {children}
    </UnauthenticatedWrapper>
  )
}
