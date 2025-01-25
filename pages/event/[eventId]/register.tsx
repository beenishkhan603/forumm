import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Button } from '@components/inputs/Button'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { GET_EVENT_BY_ID } from '@graphql/events/GetEventById'
import DefaultThumbnail from '@public/images/default-thumbnail.png'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  AvailableTicketInfo,
  Event,
  EventAttendee,
  EventType,
  TicketPurchaseInput,
  EventDetails,
  EventFundraising,
  FundraisingProgram,
} from '@graphql/__generated/graphql'
import { UnauthenticatedWrapper } from '@layouts/Wrapper'
import { useAuth } from '@libs/useAuth'
import { useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'
import TextLink from '@components/base/TextLink'
import _, { isArray } from 'lodash'
import { TextInput } from '@components/inputs/TextInput'
import { Form } from '@components/inputs/Form'
import { Tab, Tabs } from '@components/base/Tabs'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { MdOutlineQuiz, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { PURCHASE_TICKETS } from '@graphql/events/purchaseTickets'
import currencies from '@libs/currencies'
import { GET_EVENT_BY_ID_FOR_UNREGISTERED_USER } from '@graphql/events/GetEventByIdForUnregisteredUser'
import { GET_EVENT_BY_DONATION_URL } from '@graphql/events/GetEventByDonationUrl'
import RichTextDisplay from '@components/base/RichTextDisplay'
import { getDynamicStyle, openInSameTab } from '@libs/Utility/util'
import { CountInput } from '@components/inputs/CountInput'
import { CheckboxInput } from '@components/inputs/CheckboxInput'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import DonationForm from '@components/donation/DonationForm'
import { NoPaymentDonation } from '@components/donation/NoPaymentDonationForm'
import { useOrganisationProfile } from '@libs/useOrganisationProfile'
import MiniNav, { MiniNavInput } from '@components/base/MiniNav'

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
const stripePromise = loadStripe(stripePublicKey)

export type RegistrationDonation = Partial<NoPaymentDonation> & {
  enabled: boolean
}

export default function EventRegister() {
  const router = useRouter()
  const userData = isArray(router.query.ud)
    ? (router.query.ud[0] ?? '').trim().replace(' ', '+')
    : (router?.query?.ud ?? '').trim().replace(' ', '+')
  const { signInWithEmail, profile } = useAuth()
  const [purchaseTickets] = useMutation(PURCHASE_TICKETS)

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [name, setName] = useState<string>()

  // Flag: indicates if the user already has an account.
  const [hasAccount, setHasAccount] = useState<boolean>(false)

  // Flag: indicates if the user is using the quick registration flow (In Person Only)
  const [isQuickRegistration, setIsQuickRegistration] = useState<boolean>(false)

  const [isNewLogin, setIsNewLogin] = useState<boolean | undefined>()
  const [ticketData, setTicketData] = useState<{
    requiresAdditional: boolean
    ticketName?: string
    additionalTickets: TicketPurchaseInput[]
    totalPrice?: number
  }>({ requiresAdditional: false, additionalTickets: [] })
  const [fieldVals, setFieldVals] = useState<any[]>([])
  const [errorMSg, setErrorMsg] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [signedIn, setSignedIn] = useState<boolean>(false)
  const [tab, setTab] = useState('prompt')
  const [registrationFieldTab, setRegistrationFieldTab] = useState<number>(0)
  const [alreadyJoined, setAlreadyJoined] = useState<boolean>(false)
  const [event, setEvent] = useState<Partial<Event> | undefined>(undefined)
  const [shareButtonText, setShareButtonText] = useState<string>('Share')
  const [redirectionUrl, setRedirectionUrl] = useState<string | undefined>(
    undefined
  )
  const [showPassword, setShowPassword] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [regFieldSelectedAttendee, setRegFieldSelectedAttendee] =
    useState<MiniNavInput>()

  const [getEventForUnregisteredUser] = useLazyQuery(
    GET_EVENT_BY_ID_FOR_UNREGISTERED_USER
  )

  const {
    data: fundraiseData,
    loading: fundraiseLoading,
    error: fundraiseError,
  } = useQuery(GET_EVENT_BY_DONATION_URL, {
    variables: {
      input: {
        donationUrl: event?.event?.donationUrl as string,
      },
    },
    skip: !event?.event?.donationUrl,
  })

  const fundraiseId = fundraiseData?.getEventByDonationUrl?.eventId
  const fundraise = fundraiseData?.getEventByDonationUrl?.event as EventDetails
  const fundraiseDetails = fundraiseData?.getEventByDonationUrl
    ?.fundraising as EventFundraising

  const programmes = fundraise
    ? [
        {
          description: fundraise.description,
          goal: fundraiseDetails.goal,
          media: fundraiseDetails?.media?.[0],
          title: fundraiseDetails.title ?? `Main Fund`,
        } as FundraisingProgram,
        ...(fundraiseDetails?.programs ?? []),
      ]
    : []

  const [donationData, setDonationData] = useState<RegistrationDonation>({
    enabled: false,
  })

  const eventId = router.query.eventId

  const { loading, data } = useQuery(GET_EVENT_BY_ID, {
    variables: {
      input: {
        eventId: eventId as string,
      },
    },
    skip: !router.query.eventId || (!!userData && !profile),
  })

  useEffect(() => {
    const isInPerson = event?.event?.eventType === EventType.InPerson
    if (isInPerson) {
      // For inPerson events the screen defaults to quick register
      setIsNewLogin(true)
      setIsQuickRegistration(true)
    }
  }, [event?.event?.eventType])

  useEffect(() => {
    setSignedIn(!!profile)
    if (tab === 'prompt' && (signedIn || !!profile)) setTab('Register')
  }, [profile, hasAccount, isNewLogin])

  useEffect(() => {
    if (event) return
    if (!!data?.getEventById) return setEvent(data.getEventById as Event)

    if (!data && eventId && userData && !profile) {
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

        if (d.error) router.push(`/`)
      })
    }
  }, [data, eventId, userData])

  const currency = currencies[event?.event?.currency?.toUpperCase() ?? 'GBP']
  const { refreshTheme, theme, StaticColours } = useTheme()

  const { profile: organisationProfile } = useOrganisationProfile(
    event?.event?.organizationName || ''
  )

  const getAvailableTickets = () => {
    const payload: AvailableTicketInfo[] = []
    try {
      event?.availableTickets?.tickets?.forEach((t) => {
        if (t && t.remaining && parseInt(t.remaining) > 0) payload.push(t)
      })
    } catch (err) {
      console.warn(err)
    }
    return payload
  }

  const availableTickets = getAvailableTickets()

  const foundTicket = event?.tickets?.find(
    (t) => t.title.toUpperCase() === ticketData?.ticketName
  )

  useEffect(() => {
    const quantity = 1 + ticketData.additionalTickets.length
    const price = foundTicket?.price!
    const donationAmount = 0
    setTicketData((prevTicketData) => ({
      ...prevTicketData,
      totalPrice: donationAmount + price * quantity,
    }))
  }, [ticketData.additionalTickets, ticketData.ticketName, donationData.amount])

  useEffect(() => {
    if (
      availableTickets.length === 1 &&
      ticketData.ticketName !== availableTickets[0].ticketTitle?.toUpperCase()
    ) {
      setTicketData((prevTicketData) => ({
        ...prevTicketData,
        ticketName: availableTickets[0].ticketTitle!.toUpperCase(),
      }))
    }
  }, [availableTickets, ticketData.ticketName])

  useEffect(() => {
    if (
      event?.availableTickets?.tickets &&
      event?.availableTickets?.tickets.length === 1
    ) {
      setTicketData({
        ...ticketData,
        ticketName: (
          event?.availableTickets?.tickets[0]?.ticketTitle ?? ''
        ).toUpperCase(),
      })
    }
  }, [event?.availableTickets?.tickets])

  useEffect(() => {
    if (!!errorMSg && errorMSg.length > 1) {
      setTab('Register')
    }
  }, [errorMSg])

  const getEmail = (isAttendee?: EventAttendee | undefined) => {
    if (profile && profile.email) return profile.email
    if (isAttendee && isAttendee.email) return isAttendee.email
    if (email !== '' && email !== undefined) return email
    return null
  }

  const submitTabEventDetails = async (donation?: RegistrationDonation) => {
    // If user has been added as an attendee, bypass stripe.
    if (!event) return
    if (saving) return
    setErrorMsg('')
    setSaving(true)
    let redirectionUrl: any
    const isAttendee = event?.attendees?.find(
      (a) => a.email.toLowerCase() === email?.toLowerCase()!
    )
    const isSpeaker = event?.speakers?.find(
      (s) => s.email?.toLowerCase() === email?.toLowerCase()!
    )

    // @ts-ignore

    const userData = (
      fieldVals && Array.isArray(fieldVals) ? fieldVals : [...fieldVals]
    )?.map((fv) => {
      return Object.keys(fv).map((key) => ({
        name: key,
        // @ts-ignore
        value: fv[key],
      }))
    })

    if (isNewLogin && !isQuickRegistration && !signedIn) {
      await signInWithEmail(email!, password!)
      setSaving(false)
      window.location.href = `/event/${router.query.eventId}/register`
      return
    }

    const parsedTickets = () => {
      const mainTicket = {
        title:
          isAttendee && isAttendee.ticketTitle
            ? isAttendee.ticketTitle
            : isSpeaker
            ? 'SPEAKER'
            : event?.event?.eventType === EventType.Fundraiser
            ? 'FUNDRAISER_TICKET'
            : ticketData.ticketName!,
        email: getEmail(isAttendee),
        fullName: profile?.fullName ?? name!,
      }

      const additionalTickets: TicketPurchaseInput[] =
        ticketData.additionalTickets.map((t, i) => {
          return {
            title: t.title,
            email: t.email,
            fullName: t.fullName,
            registrationFields: userData?.[i + 1],
          }
        })
      return [mainTicket, ...additionalTickets]
    }

    setCheckoutLoading(true)
    const additionalFields = userData?.[0] || []
    redirectionUrl = await purchaseTickets({
      variables: {
        input: {
          hasBalance: !isAttendee,
          accountToCreate: signedIn
            ? undefined
            : {
                email: isAttendee ? isAttendee.email : email!,
                fullName: name!,
                password: password,
              },
          eventId: eventId as string,
          tickets: parsedTickets(),
          userData: additionalFields,
        },
        ...(!!donation && donationData?.enabled
          ? {
              donation: {
                amount: donation.amount!,
                firstName: firstName,
                email: getEmail(isAttendee) as string,
                organizationName: event?.event?.organizationName!,
                eventId: fundraiseId as string,
                giftAid: !!donation.payment?.giftAid,
                eventName: event?.event?.title!,
                currency: donation.currency,
                lastName: lastName,
                message: donation.message ?? '',
                selectedProgram: donation.program ?? '',
                statisticId: donation.statisticId!,
              },
            }
          : {}),
      },
    })

    const handleErrors = (res: string) => {
      if (res.includes('payment_error')) {
        // Unhandled Error
        if (!res.includes('error=')) {
          setErrorMsg(
            'An unexpected error has occured, please contact the site admin.'
          )
        }
        const errorCode = res.split('error=')[1]

        // User Exists
        if (errorCode === 'UserExists') {
          setErrorMsg('The email is already registered. Please try to log in.')
        }

        // User Exists
        if (errorCode === 'InvalidSetup') {
          setErrorMsg('There was an issue with the event organiser.')
        }

        setCheckoutLoading(false)
        setSaving(false)
        return
      }
    }

    if (redirectionUrl?.data?.purchaseTickets?.userAlreadyExist) {
      setCheckoutLoading(false)
      setSaving(false)
      setTab('complete')
      return
    }

    handleErrors(redirectionUrl?.data?.purchaseTickets.checkoutUrl)

    if (!signedIn && !!redirectionUrl?.data?.purchaseTickets?.user) {
      await signInWithEmail(
        email!,
        password ?? JSON.parse(redirectionUrl.data.purchaseTickets.user).pass
      )
    }

    // setRedirectionUrl(redirectionUrl.data?.purchaseTickets.checkoutUrl)

    if (redirectionUrl.data?.purchaseTickets.checkoutUrl) {
      openInSameTab(redirectionUrl.data?.purchaseTickets.checkoutUrl!)
    }

    // TODO: add event type restriction if applicable.
    // if (event?.fundraising?.enabled) setTab('donation')
    // else router.push(`/event/${router.query.eventId}?registered`)

    setCheckoutLoading(false)
    setSaving(false)
  }

  useEffect(() => {
    if (event) {
      refreshTheme(event as Event)
    }
    if (userData) setEmail(userData)
  }, [event, refreshTheme, userData])

  useEffect(() => {
    if (profile?.userId) {
      setHasAccount(true)
    }
  }, [profile])

  useEffect(() => {
    if (profile && event?.attendees) {
      const hasJoined =
        event?.attendees.filter((at) => {
          return at.registered && at.email === profile?.email
        }).length > 0
      setAlreadyJoined(hasJoined)
    }
  }, [profile, event])

  useEffect(() => {
    if (!donationData.enabled) return
    // TODO: implement donation handling
  }, [donationData])

  if (loading) {
    return (
      <Box className="w-full py-64 flex justify-center">
        <LoadingSpinner size="large" />
      </Box>
    )
  }

  const dynamicStyle = getDynamicStyle(theme.highlightColour)
  const isDarkTheme = theme.type === 'DARK'
  const eventImage =
    event?.event?.bannerImage ??
    'https://assets.tumblr.com/images/default_header/optica_pattern_11.png'

  const iconFillColor = isDarkTheme
    ? StaticColours.forumm_share_dark
    : StaticColours.v2.blue_share

  const [firstName, ...rest] = (name ?? profile?.fullName ?? '').split(' ')
  const lastName = rest.join(' ')

  const organisationTrxFee =
    organisationProfile?.percentage !== undefined
      ? organisationProfile.percentage / 100
      : 0.1

  const handleAdditionalTickets = (val: number) => {
    const nAdditionalTickets = ticketData.additionalTickets.length
    const additionalTicketsEnabled = ticketData.requiresAdditional

    const defaultTicketInfo = availableTickets[0]

    let payload = ticketData.additionalTickets

    if (additionalTicketsEnabled) {
      if (nAdditionalTickets > val) payload = payload.slice(0, val)
      if (nAdditionalTickets < val) {
        while (payload.length < val) {
          payload = [
            ...payload,
            {
              title: ticketData.ticketName ?? defaultTicketInfo.ticketTitle!,
              fullName: '',
            },
          ]
        }
      }
    } else payload = []

    setTicketData({
      ...ticketData,
      additionalTickets: payload,
    })
  }

  const getAttendeesToGetRegFields = (): TicketPurchaseInput[] => {
    const payload = [
      {
        email: getEmail(),
        title: ticketData.ticketName!,
        fullName: profile?.fullName ?? name!,
      },
      ...ticketData.additionalTickets,
    ]
    const user = payload[0]

    const id = `${payload[0].fullName}::${payload[0].email}`
      .trim()
      .toLowerCase()
      .replaceAll(' ', '_')

    const isValid = (() => {
      const currentStage = regFieldSelectedAttendee?.stage.toString()
      const allowedStages = payload.map((p) =>
        `${p.fullName}::${p.email}`.trim().toLowerCase().replaceAll(' ', '_')
      )

      if (!currentStage) return false
      return allowedStages.includes(currentStage)
    })()

    if (
      (!!user.fullName &&
        !!user.email &&
        (!regFieldSelectedAttendee ||
          regFieldSelectedAttendee.stage.toString().includes('undefined'))) ||
      !isValid
    )
      setRegFieldSelectedAttendee({ stage: id })

    return payload
  }

  let videoUrl =
    'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/video-background.mp4'

  if (event?.eventId === 'c987cfd9-3732-4d21-a586-293ed6d36784') {
    videoUrl =
      'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/video-background_CE.mp4'
  }

  return (
    <Box
      className="overflow-y-scroll overflow-x-hidden h-[calc(100vh)] -mt-[80px] pt-[80px] relative event-register-root"
      id="event-register-root"
    >
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
            <Box className="hidden md:flex flex ml-2 items-center">
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
                    src={event?.event?.thumbnailImage ?? DefaultThumbnail}
                  />
                  <Box className="flex items-center text-[14px]">
                    {/* <Tooltip id="eventTitleDescription"> */}
                    {event?.event?.organizationName}
                    {/* </Tooltip> */}
                  </Box>
                </Box>
                <Box className="text-[36px] w-full">{event?.event?.title}</Box>
                <Box className="mb-6" style={{ whiteSpace: 'pre-wrap' }}>
                  <TextLink className="text-[16px] md:text-[16px] mt-4 mb-4">
                    {event?.event?.shortDescription}
                  </TextLink>
                </Box>

                {/* Event Dates */}
                <Box className="flex mb-4">
                  <Box className="flex flex-col space-y-2 mr-4">
                    <Box className={`text-md font-medium`}>Start Time/Date</Box>
                    <Box className="text-xs md:text-sm">
                      {moment(event?.event?.startDateTime).format(
                        'MMM DD, h:mm A'
                      )}
                    </Box>
                  </Box>
                  <Box className="flex flex-col space-y-2">
                    <Box className={`text-md font-medium`}>End Time/Date</Box>
                    <Box className="text-xs md:text-sm">
                      {moment(event?.event?.endDateTime).format(
                        'MMM DD, h:mm A'
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box className="mt-4 text-xs md:text-sm">
                  Having trouble? Email{' '}
                  <a className="underline" href="mailto:hello@forumm.to">
                    hello@forumm.to
                  </a>
                  .
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className={`w-full flex justify-center`}>
        <Box className="w-full md:w-[85%] max-w-[1500px]">
          <Box className="">
            <Box
              id="donation-box"
              color="foregroundColour"
              className="mt-8 sm:my-8 rounded-2xl flex flex-col sm:flex-row text-white pt-8 px-2 sm:py-8 min-h-[400px] mb-6 border border-forumm-menu-border"
            >
              <Box className="w-full flex flex-col sm:flex-row">
                {/* Left container */}
                <Box className="w-full sm:w-1/2">
                  <Tabs activeTitle={tab}>
                    <Tab title="prompt">
                      <>
                        <Box className="mb-2 text-2xl flex justify-center items-center">
                          Already have an account with Forumm?
                        </Box>
                        <Box className="flex flex-row justify-center items-center mt-8 mb-8 flex-wrap">
                          <Button
                            title="Yes"
                            type="tertiary"
                            size="auto"
                            onClick={() => {
                              setIsNewLogin(true)
                              setHasAccount(true)
                              setIsQuickRegistration(false)
                              setTab('Register')
                            }}
                            className="whitespace-nowrap mr-1 mb-1"
                          />
                          <Button
                            title="No"
                            type="tertiary"
                            size="auto"
                            onClick={() => {
                              setIsNewLogin(false)
                              setHasAccount(false)
                              setTab('Register')
                            }}
                            className="whitespace-nowrap ml-1 mb-1"
                          />
                        </Box>
                      </>
                    </Tab>
                    <Tab title="Register">
                      {hasAccount === undefined && (
                        <>
                          <Box className="mb-2 text-2xl flex justify-center items-center">
                            Already have an account?
                          </Box>
                          <Box className="flex flex-row justify-center items-center mt-8 mb-8 flex-wrap">
                            <Button
                              title="Yes"
                              type="tertiary"
                              size="auto"
                              onClick={() => {
                                setIsNewLogin(true)
                                setHasAccount(true)
                              }}
                              className="whitespace-nowrap mr-1 mb-1"
                            />
                            <Button
                              title="No"
                              type="tertiary"
                              size="auto"
                              onClick={() => setHasAccount(false)}
                              className="whitespace-nowrap ml-1 mb-1"
                            />
                          </Box>
                        </>
                      )}

                      {hasAccount !== undefined && alreadyJoined && (
                        <>
                          <Box className="mb-2 text-2xl block">
                            Already Joined for This Event
                          </Box>
                          <Box className="text-xs pt-2 block">
                            You have already joined this event. If you wish, you
                            can go back and check the event`s front page for
                            more details.
                          </Box>
                        </>
                      )}

                      {hasAccount !== undefined && !alreadyJoined && (
                        <>
                          <Box className="flex mb-2 justify-center items-center text-2xl">
                            {hasAccount
                              ? isNewLogin
                                ? `Sign-in with your account`
                                : `Kindly confirm your attendance to this event:`
                              : `Register Below`}
                          </Box>
                          {!hasAccount && !isNewLogin && (
                            <Box className="flex mb-2 justify-center items-center text-center">
                              {isQuickRegistration ? (
                                <>
                                  We promise it{`'`}s painless! Our quick
                                  registration will give you full access to the
                                  event.
                                </>
                              ) : (
                                <>
                                  We promise it{`'`}s painless! Creating a
                                  password will give you full access to the
                                  event
                                </>
                              )}
                            </Box>
                          )}
                          <Form
                            initialFormData={{ email: userData ?? '' }}
                            onSubmit={async () => {
                              if (
                                !signedIn &&
                                hasAccount &&
                                !!email &&
                                !!password
                              ) {
                                try {
                                  await signInWithEmail(email!, password!)
                                  setSaving(false)
                                  window.location.href = `/event/${router.query.eventId}/register`
                                  return
                                } catch (_ex) {
                                  setSaving(false)
                                  setErrorMsg(
                                    'Incorrect email or password, please try again.'
                                  )
                                  return
                                }
                              }

                              if (ticketData.requiresAdditional)
                                return setTab('Attendee Information')
                              if (
                                (event?.registrationFields?.length ?? 0) > 0 ||
                                fieldVals
                              )
                                return setTab('Event Details')

                              if (event?.fundraising?.enabled)
                                return setTab('donation')

                              return submitTabEventDetails()
                            }}
                          >
                            <Box
                              show={!signedIn}
                              textColour="textColour"
                              ignoreTheme
                            >
                              {!hasAccount ? (
                                <>
                                  <TextInput
                                    required={!signedIn}
                                    validations={{
                                      minLength: {
                                        value: 2,
                                        message:
                                          'Full Name must be at least 2 characters',
                                      },
                                      maxLength: {
                                        value: 70,
                                        message:
                                          'Full Name must be less than 70 characters',
                                      },
                                      pattern: {
                                        value: /^[a-z ,.'-]+$/i,
                                        message:
                                          'Name must consist of letters only',
                                      },
                                    }}
                                    onChange={(e) => setName(e)}
                                    label="Full Name"
                                    placeholder="John Doe"
                                    textColour={theme.textColour}
                                    labelBgColour={theme.foregroundColour}
                                  />
                                </>
                              ) : (
                                <></>
                              )}
                              <TextInput
                                validations={{
                                  minLength: {
                                    value: 7,
                                    message:
                                      'Email must be at least 7 characters',
                                  },
                                  maxLength: {
                                    value: 70,
                                    message:
                                      'Email must be less than 70 characters',
                                  },
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email must be valid',
                                  },
                                }}
                                onChange={(e) => setEmail(e)}
                                required={!signedIn}
                                label="Email"
                                type="email"
                                placeholder="your@email.com"
                                textColour={theme.textColour}
                                labelBgColour={theme.foregroundColour}
                              />
                              <div className="relative">
                                <TextInput
                                  placeholder={
                                    showPassword
                                      ? 'Enter your password'
                                      : '*******'
                                  }
                                  type={showPassword ? 'text' : 'password'}
                                  show={!isQuickRegistration}
                                  validations={{
                                    minLength: {
                                      value: 8,
                                      message: 'Password is too short',
                                    },
                                    maxLength: {
                                      value: 50,
                                      message: 'Password is too long',
                                    },
                                    pattern: {
                                      value:
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^\$\*\.\[\]\{\}\(\)\?\"\!@#%&\/\\,><\':;\|_~\`\=\+\-])[A-Za-z\d\^\$\*\.\[\]\{\}\(\)\?\"\!@#%&\/\\,><\':;\|_~\`\=\+\-]{8,50}$/,
                                      message:
                                        'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character.',
                                    },
                                  }}
                                  onChange={(e) => setPassword(e)}
                                  required={!signedIn}
                                  label={
                                    hasAccount
                                      ? 'Password'
                                      : 'Create a password'
                                  }
                                  textColour={theme.textColour}
                                  labelBgColour={theme.foregroundColour}
                                />
                                {!isQuickRegistration && (
                                  <button
                                    type="button"
                                    className="absolute right-2 top-[25px] -translate-y-[50%] text-xl items-center pr-3 cursor-pointer"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    {showPassword ? (
                                      <MdVisibility />
                                    ) : (
                                      <MdVisibilityOff />
                                    )}
                                  </button>
                                )}
                              </div>
                            </Box>

                            {/* Tickets */}
                            <DropdownInput
                              show={availableTickets.length > 1 && !userData}
                              label="Ticket"
                              placeholder="Select a Ticket"
                              options={
                                availableTickets && availableTickets.length > 0
                                  ? availableTickets.map((t) => {
                                      return {
                                        label: t.ticketTitle!,
                                        value: t.ticketTitle!.toUpperCase(),
                                      }
                                    })
                                  : []
                              }
                              onChange={(val) =>
                                setTicketData({
                                  ...ticketData,
                                  ticketName: val,
                                })
                              }
                              required={!!userData}
                              labelBgColour={theme.foregroundColour}
                              id={'ticket-dropdown'}
                              value={ticketData?.ticketName}
                              selected={ticketData?.ticketName}
                            />
                            <CheckboxInput
                              value={ticketData.requiresAdditional}
                              onChange={(val) => {
                                setTicketData({
                                  ...ticketData,
                                  requiresAdditional: val,
                                })
                              }}
                              className="bg-transparent rounded text-sm border-box -mt-1 flex-"
                              border=""
                              label="Additional Tickets"
                              isProtected
                              // required
                            >
                              <span className="mt-2">
                                I require additional tickets.
                              </span>
                            </CheckboxInput>

                            <Box className="flex flex-col">
                              <CountInput
                                className=""
                                label="How many additional tickets?"
                                show={ticketData.requiresAdditional}
                                maxValue={4}
                                onChange={(val) => {
                                  handleAdditionalTickets(val)
                                }}
                              />
                            </Box>

                            {hasAccount && !isNewLogin ? (
                              <span className="text-xs pt-2">
                                Before continuing, please make sure to carefully
                                check the event details, including its location
                                and scheduled time
                              </span>
                            ) : (
                              <></>
                            )}
                            {errorMSg ? (
                              <Box
                                ignoreTheme
                                className="mt-4 text-center text-red-500 text-xs"
                              >
                                {errorMSg}
                                <span
                                  className="pt-2 text-forumm-blue underline cursor-pointer"
                                  onClick={() => {
                                    setIsNewLogin(true)
                                    setErrorMsg('')
                                    setHasAccount(true)
                                  }}
                                >
                                  Log in with your account
                                </span>
                              </Box>
                            ) : (
                              <></>
                            )}
                            <Button
                              title={
                                hasAccount && !isNewLogin
                                  ? 'Confirm'
                                  : 'Continue'
                              }
                              className="w-full mt-4"
                              buttonType="submit"
                              loading={saving}
                            />

                            <Box
                              show={
                                !isQuickRegistration &&
                                event?.event?.eventType === EventType.InPerson
                              }
                              className="flex justify-center items-center mt-2"
                            >
                              Enter the event now?
                              <Link
                                onClick={() => {
                                  setIsNewLogin(true)
                                  setHasAccount(false)
                                  setIsQuickRegistration(true)
                                }}
                                href="#"
                                className="underline cursor-pointer text-forumm-blue ml-2"
                              >
                                Register without an account
                              </Link>
                            </Box>

                            <Box
                              show={hasAccount || isQuickRegistration}
                              className="flex justify-center items-center mt-2"
                            >
                              Joining with new account?
                              <Link
                                onClick={() => {
                                  setHasAccount(false)
                                  setIsNewLogin(false)
                                  setIsQuickRegistration(false)
                                }}
                                href="#"
                                className="underline cursor-pointer text-forumm-blue ml-2"
                              >
                                Register here
                              </Link>
                            </Box>

                            <Box
                              show={!hasAccount}
                              className="flex justify-center items-center mt-2"
                            >
                              Already have an account?
                              <Link
                                onClick={() => {
                                  setIsQuickRegistration(false)
                                  setIsNewLogin(true)
                                  setHasAccount(true)
                                }}
                                href="#"
                                className="underline cursor-pointer text-forumm-blue ml-2"
                              >
                                Log In here
                              </Link>
                            </Box>
                          </Form>
                        </>
                      )}
                    </Tab>

                    <Tab title="Attendee Information">
                      <Box className="mb-2 text-lg">
                        <MdOutlineQuiz className="inline-block w-8 h-8 mr-1" />{' '}
                        Attendee Information
                      </Box>
                      {ticketData.additionalTickets?.map((at, i) => {
                        return (
                          <Box
                            key={`additional_ticket_info_${i + 1}`}
                            className={`mb-2`}
                          >
                            <Box className="mt-1 mb-2">{`Additional Attendee ${
                              i + 1
                            }`}</Box>
                            <TextInput
                              key={i}
                              validations={{
                                minLength: {
                                  value: 1,
                                  message:
                                    'Field name must be at least 1 character',
                                },
                                maxLength: {
                                  value: 70,
                                  message:
                                    'Field name must be at most 70 characters',
                                },
                              }}
                              required
                              value={at.fullName}
                              onChange={(val) => {
                                let payload = ticketData.additionalTickets
                                payload[i].fullName = val
                                setTicketData({
                                  ...ticketData,
                                  additionalTickets: payload,
                                })
                              }}
                              label={`Full Name`}
                              placeholder={`Enter additional attendee ${
                                i + 1
                              }'s full name`}
                            />

                            <TextInput
                              validations={{
                                minLength: {
                                  value: 7,
                                  message:
                                    'Email must be at least 7 characters',
                                },
                                maxLength: {
                                  value: 70,
                                  message:
                                    'Email must be less than 70 characters',
                                },
                                pattern: {
                                  value:
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Email must be valid',
                                },
                              }}
                              onChange={(val) => {
                                let payload = ticketData.additionalTickets
                                payload[i].email = val
                                setTicketData({
                                  ...ticketData,
                                  additionalTickets: payload,
                                })
                              }}
                              required
                              value={at.email}
                              type="email"
                              label={`Email`}
                              placeholder={`Enter additional attendee ${
                                i + 1
                              }'s email`}
                              textColour={theme.textColour}
                              labelBgColour={theme.foregroundColour}
                            />
                          </Box>
                        )
                      })}
                      <Box className="flex w-full mt-4">
                        <Button
                          title="Back"
                          className="flex-2 mr-2"
                          buttonType="submit"
                          onClick={() => setTab('Register')}
                          // show={!!errorMSg}
                        />
                        <Button
                          title="Continue"
                          className="flex-[8]"
                          buttonType="submit"
                          onClick={() => {
                            if (
                              (event?.registrationFields?.length ?? 0) > 0 ||
                              fieldVals
                            )
                              getAttendeesToGetRegFields()
                            return setTab('Event Details')

                            if (event?.fundraising?.enabled)
                              return setTab('donation')

                            return submitTabEventDetails()
                          }}
                          loading={saving}
                        />
                      </Box>
                    </Tab>

                    <Tab title="Event Details">
                      <Box className="relative">
                        <Box className="mb-2 text-lg">
                          <MdOutlineQuiz className="inline-block w-8 h-8 mr-1" />{' '}
                          Ticket Holder Information
                          {hasAccount && alreadyJoined && (
                            <span className="text-xs pt-2 block">
                              You have already joined this event. If you wish,
                              you can go back and check the event`s front page
                              for more details.
                            </span>
                          )}
                        </Box>
                        <Box className="size-full">
                          <MiniNav
                            className="w-full sm:px-6 mb-6"
                            stage={regFieldSelectedAttendee}
                            setStage={(data) => {
                              setRegFieldSelectedAttendee({
                                ...regFieldSelectedAttendee!,
                                ...data,
                              })
                            }}
                            navItems={getAttendeesToGetRegFields().map((a) => ({
                              label: a.fullName,
                              targetStage: `${a.fullName}::${a.email}`
                                .trim()
                                .toLowerCase()
                                .replaceAll(' ', '_'),
                            }))}
                          />
                          {getAttendeesToGetRegFields().map(
                            (att, att_i, all_att) => {
                              const id = (offset: number = 0) =>
                                `${all_att[att_i + offset].fullName}::${
                                  all_att[att_i + offset].email
                                }`
                                  .trim()
                                  .toLowerCase()
                                  .replaceAll(' ', '_')
                              const content = event?.registrationFields?.map(
                                (field, i) => {
                                  return (
                                    <Box
                                      show={
                                        (att_i === 0 &&
                                          !regFieldSelectedAttendee) ||
                                        regFieldSelectedAttendee?.stage === id()
                                      }
                                      key={`registration_field_${
                                        i + 1
                                      }_attendee_${att_i + 1}`}
                                    >
                                      <TextInput
                                        key={i}
                                        validations={{
                                          minLength: {
                                            value: 1,
                                            message:
                                              'Field name must be at least 1 character',
                                          },
                                          maxLength: {
                                            value: 70,
                                            message:
                                              'Field name must be at most 70 characters',
                                          },
                                        }}
                                        value={
                                          fieldVals && fieldVals[att_i]
                                            ? fieldVals[att_i][field.name]
                                            : ''
                                        }
                                        onChange={(e) => {
                                          const payload = [...fieldVals]
                                          payload[att_i] = {
                                            ...payload[att_i],
                                            [field.name]: e,
                                          }
                                          setFieldVals(payload)
                                        }}
                                        label={field.name}
                                        placeholder={`Enter ${field.name}`}
                                      />

                                      <Box className="flex w-full justify-between items-center mt-4 mb-10">
                                        <Button
                                          className="mr-auto"
                                          show={att_i > 0}
                                          type="square"
                                          title="Previous"
                                          onClick={() => {
                                            if (att_i > 0)
                                              setRegFieldSelectedAttendee({
                                                stage: id(-1),
                                              })
                                          }}
                                        />
                                        <Button
                                          className="ml-auto"
                                          show={att_i < all_att.length - 1}
                                          type="square"
                                          title="Next"
                                          onClick={() => {
                                            if (att_i < all_att.length - 1)
                                              setRegFieldSelectedAttendee({
                                                stage: id(+1),
                                              })
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  )
                                }
                              )

                              return content
                            }
                          )}
                        </Box>

                        <Box className="flex w-full mt-4">
                          <Button
                            title="Back"
                            className="flex-2 mr-2"
                            buttonType="submit"
                            onClick={() =>
                              setTab(
                                ticketData.requiresAdditional
                                  ? 'Attendee Information'
                                  : 'Register'
                              )
                            }
                            // show={!!errorMSg}
                          />
                          <Button
                            title="Continue"
                            className="flex-[8]"
                            buttonType="submit"
                            onClick={() => {
                              if (event?.fundraising?.enabled)
                                return setTab('donation')
                              return submitTabEventDetails()
                            }}
                            loading={saving}
                          />
                        </Box>
                      </Box>
                    </Tab>

                    {/* donation tab */}
                    <Tab title="donation">
                      <Box className="mb-2 font-bold text-2xl text-center">
                        Almost there!
                      </Box>
                      <Box className="mb-4 font-bold text-lg text-center">
                        We’re delighted to have you join us for the event!
                      </Box>
                      <Box
                        className="mb-2 -mt-2 text-sm text-center"
                        id="donation-form-sticky"
                      >
                        We truly appreciate your support and would be incredibly
                        grateful if you could consider making a donation to
                        support our cause. Thank you for your kindness and
                        generosity.
                      </Box>

                      <CheckboxInput
                        value={donationData.enabled}
                        onChange={(val) => {
                          setDonationData({
                            ...donationData,
                            enabled: val,
                          })
                        }}
                        className="bg-transparent rounded text-sm border-box mt-8 mb-2 flex-"
                        border=""
                        label="I wish to make a donation along with my registration"
                        isProtected
                        // required
                      >
                        <span className="mt-2">
                          I wish to make a donation along with my registration
                        </span>
                      </CheckboxInput>

                      {donationData.enabled && fundraise && (
                        <Elements stripe={stripePromise}>
                          <DonationForm
                            formCTA="Donate"
                            eventId={fundraiseId!}
                            eventDetails={fundraise}
                            programs={programmes}
                            isOpen={donationData.enabled}
                            setIsOpen={() => {
                              setDonationData((prevDonationData) => ({
                                ...prevDonationData,
                                enabled: false,
                              }))
                            }}
                            organisationCurrency={organisationProfile.currency}
                            platformFee={organisationTrxFee}
                            refetchDonations={() => {}}
                            initialValue={{}}
                            onComplete={(data) => {
                              setDonationData({
                                ...donationData,
                                ...data,
                              })
                              return submitTabEventDetails({
                                ...donationData,
                                ...data,
                              })
                            }}
                            disablePayment
                          />
                        </Elements>
                      )}

                      <Button
                        show={!donationData.enabled}
                        title={'Continue'}
                        className="flex-[8] mx-auto mt-4"
                        buttonType="submit"
                        onClick={() => {
                          return submitTabEventDetails()
                        }}
                        loading={saving}
                      />
                    </Tab>

                    <Tab title="complete">
                      <Box className="mb-4 font-bold text-2xl text-center">
                        Event Booked!
                      </Box>
                      <Box className="mb-4 font-bold text-lg text-center">
                        We’re delighted to have you join us for the event!
                      </Box>
                      <Box className="mb-4 text-sm text-center">
                        An email with all the event details and instructions to
                        join has been sent to you.
                      </Box>
                    </Tab>
                  </Tabs>
                  <Box className="flex justify-center items-center mb-20 mt-4">
                    <Link
                      href={`/event/${router.query.eventId}${
                        router.query.ud ? `?ud=${router.query.ud}` : ''
                      }`}
                      className="underline cursor-pointer"
                    >
                      {tab === 'complete' ? 'View Event Now!' : 'Back to Event'}
                    </Link>
                  </Box>
                </Box>
                {/* Right container */}
                <Box className="w-full sm:w-1/2 px-6 flex flex-col">
                  <Box className="text-3xl font-bold">
                    {event?.event?.title}
                  </Box>
                  <Box className="flex items-center space-x-2 mt-2">
                    <Image
                      alt="Thumbnail Image"
                      className="h-8 w-8 rounded-lg block object-cover"
                      width={96}
                      height={96}
                      src={event?.event?.thumbnailImage ?? DefaultThumbnail}
                    />
                    <Box className="text-lg">
                      {event?.event?.organizationName}
                    </Box>
                  </Box>
                  <Box className="mt-4 line-clamp-8 text-sm">
                    <RichTextDisplay
                      descriptionJson={event?.event?.description || ''}
                    />
                  </Box>
                  <Box
                    show={!!event?.event?.eventLocation}
                    className="flex flex-col space-y-2 mt-6"
                  >
                    <Box className="w-full flex flex-col space-y-2">
                      <Box className={`text-md font-medium`}>
                        Event Location
                      </Box>
                      <Box
                        className="text-xs md:text-sm"
                        style={{ wordWrap: 'break-word' }}
                      >
                        <TextLink>{event?.event?.eventLocation || ''}</TextLink>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="flex my-4 space-x-6 mt-10">
                    <Box className=" flex flex-col space-y-2">
                      <Box className={`text-md font-medium`}>
                        Start Date & Time
                      </Box>
                      <Box className="text-xs md:text-sm">
                        {moment(event?.event?.startDateTime).format(
                          'MMM DD, h:mmA'
                        )}
                      </Box>
                    </Box>
                    <Box className="flex flex-col space-y-2">
                      <Box className={`text-md font-medium`}>
                        End Date & Time
                      </Box>
                      <Box className="text-xs md:text-sm">
                        {moment(event?.event?.endDateTime).format(
                          'MMM DD, h:mmA'
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    className="flex text-right flex-col mt-10"
                    show={foundTicket != null}
                  >
                    <Box className="text-xl">Ticket Cost</Box>
                    <Box className="text-2xl">
                      {foundTicket?.price === 0 ? (
                        'FREE'
                      ) : (
                        <>
                          <span className="text-xs mr-2 text-gray-400">
                            Price includes tax.
                          </span>
                          {`${currency.symbol}${ticketData.totalPrice?.toFixed(
                            2
                          )}`}{' '}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

EventRegister.Layout = UnauthenticatedWrapper
