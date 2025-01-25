import { useMutation } from '@apollo/client'
import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import Accordion from '@components/event/Accordion'
import Card from '@components/event/Card'
import { Button } from '@components/inputs/Button'
import { DateTimeInput } from '@components/inputs/DateTimeInput'
import { FileInput } from '@components/inputs/FileInput'
import { RadioFieldInput } from '@components/inputs/RadioFieldInput'
import { CiWarning } from 'react-icons/ci'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import { TextInput } from '@components/inputs/TextInput'
import { CREATE_EVENT } from '@graphql/events/createEvent'
import { UPDATE_EVENT } from '@graphql/events/updateEvent'
import {
  CreateEventInput,
  EventDetails,
  EventFundraising,
  EventType,
  UpdateEventInput,
} from '@graphql/__generated/graphql'
import CreateEventLayout, { CreateEventStage } from '@layouts/CreateEventLayout'
import { CreateEventContext, EventCreation } from '@libs/CreateEventContext'
import { useAuth } from '@libs/useAuth'
import useFileUploader from '@libs/useFileUploader'
import { debounce, getTimezones, parseTime } from '@libs/Utility/util'
import {
  CreateEventSection,
  isFieldRequired,
  shouldShowField,
} from '@libs/Utility/validation'
import { useOrganisationProfile } from '@libs/useOrganisationProfile'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import AttendeesForm from './attendees'
import BreakoutRoomsForm from './breakout-rooms'
import CommunicationsForm from './communications'
import FundraisingForm from './fundraising'
import FundraisingPickerForm from './fundraisingPicker'
import OndemandContantForm from './on-demand'
import TicketsForm from './registration'
import SessionsForm from './sessions'
import SpeakersForm from './speakers'
import SponsorsForm from './sponsors'
import StagesForm from './stages'
import RichTextEditor from '@components/inputs/RichTextEditor'
import { useTheme } from '@libs/useTheme'
import Text from '@components/base/Text'
import { FaArrowRight, FaRegCheckCircle } from 'react-icons/fa'
import { CheckboxInput } from '@components/inputs/CheckboxInput'
import { DropdownInput } from '@components/inputs/DropdownInput'

export default function CreateEventPage() {
  const {
    formData,
    setFormData,
    createEventStage,
    setCreateEventStage,
    errors,
    setErrors,
    validationRules,
  } = useContext(CreateEventContext)
  const { profile, getPermission, isAdmin } = useAuth()
  const { profile: organisationProfile } = useOrganisationProfile(
    profile?.company ?? profile?.university!
  )
  const { theme, StaticColours } = useTheme()
  const router = useRouter()
  const [createEvent] = useMutation(CREATE_EVENT)
  const [updateEvent] = useMutation(UPDATE_EVENT)
  const [completeSections, setCompleteSections] = useState<{
    details: boolean
    registration: boolean
    speakers: boolean
    fundraising: boolean
    stages: boolean
    sessions: boolean
    attendees: boolean
    sponsors: boolean
    onDemand: boolean
    communications: boolean
    breakoutRooms: boolean
  }>({
    details: false,
    registration: false,
    speakers: false,
    fundraising: false,
    stages: false,
    sessions: false,
    attendees: false,
    sponsors: false,
    onDemand: false,
    communications: false,
    breakoutRooms: false,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [saved, setSaved] = useState(false)
  const uploadFile = useFileUploader()
  const [eventDetailsData, setEventDetailsData] = useState<
    | Partial<
      EventDetails & {
        fundraising?: Partial<EventFundraising>
      }
    >
    | undefined
  >({
    ...({ ...formData?.event, fundraising: formData?.fundraising ?? {} } ?? {}),
  })

  // Key for `validationRules`.
  // True = field is shown and required.
  // False = field is shown and not required.
  // Null = field is hidden and not required.
  // Rule Structure: [field, key]

  // Key for `validationRules`.
  // True = field is shown and required.
  // False = field is shown and not required.
  // Null = field is hidden and not required.
  // Rule Structure: [field, key]

  useEffect(() => {
    if (saved) {
      setTimeout(() => {
        setSaved(false)
      }, 30000)
    }
  }, [saved])

  const urlEventId = new URLSearchParams(window.location.search).get('id')

  const generateEventId = async (eventType?: EventType) => {
    const payload: CreateEventInput = {
      event: {
        title: '',
        shortDescription: '',
        description: '',
        startDateTime: moment().add(1, 'd').toISOString(),
        endDateTime: moment().add(5, 'd').toISOString(),
        organizationName: profile?.university ?? profile?.company ?? '',
        publiclyListed: true,
        eventType: eventType ?? EventType.Online,
      },
    }

    const createdEvent = await createEvent({
      variables: {
        input: payload,
      },
    })

    window.history.replaceState(
      '',
      'Create Event',
      `?id=${createdEvent.data?.createEvent?.eventId}`
    )

    return createdEvent.data?.createEvent?.eventId
  }

  const getFormStateFromEventData = (event?: Partial<EventCreation>) => {
    const payload = {
      details: true,
      registration: false,
      fundraising: false,
      speakers: false,
      stages: false,
      sessions: false,
      attendees: false,
      sponsors: false,
      onDemand: false,
      communications: false,
      breakoutRooms: false,
    }

    return payload
  }

  const formState = getFormStateFromEventData(formData)

  const saveChanges = useCallback(
    async ({ event, ...data }: Partial<EventCreation>) => {
      let { organizationName } = event || {}

      if (
        !organizationName ||
        organizationName === 'Unknown' ||
        organizationName === 'Default Event Organization'
      ) {
        organizationName =
          profile?.university ??
          profile?.company ??
          profile?.fullName ??
          'Default Event Organization'
      }

      // Generate eventId & payload
      const eventId =
        data.eventId ??
        formData?.eventId ??
        urlEventId ??
        (router.query.id as string)

      if (organizationName && event) {
        event.organizationName = organizationName
      }

      if (formData?.event?.eventType === EventType.Fundraiser) {
        event = {
          ...event,
          startDateTime:
            event?.startDateTime ??
            formData.event.startDateTime ??
            moment().toISOString(),
          registrationCloseDateTime:
            event?.registrationCloseDateTime ??
            formData.event.registrationCloseDateTime ??
            moment().add(14, 'd').toISOString(),
          endDateTime:
            event?.endDateTime ??
            formData.event.endDateTime ??
            moment().add(1, 'M').toISOString(),
        } as EventDetails
      }

      event = {
        ...event,
        publiclyListed:
          event?.publiclyListed ?? formData?.event?.publiclyListed ?? true,
      } as EventDetails

      const payload: UpdateEventInput = {
        eventId,
        ...{ event: { ...formData?.event, ...event } ?? {} },
        ...{ attendees: formData?.attendees ?? [] },
        ...{ tickets: formData?.tickets ?? [] },
        ...{ registrationFields: formData?.registrationFields ?? [] },
        ...{ speakers: formData?.speakers ?? [] },
        ...{ stages: formData?.stages ?? [] },
        ...{ sessions: formData?.sessions ?? [] },
        ...{ sponsors: formData?.sponsors ?? [] },
        ...{ ondemandContent: formData?.ondemandContent ?? [] },
        ...{ communications: formData?.communications ?? [] },
        ...{ breakoutRooms: formData?.breakoutRooms ?? [] },
        ...{
          fundraising: { ...formData?.fundraising, ...data.fundraising } ?? {},
        },
      } as UpdateEventInput

      /* This validations are meant to avoid auto updating during action such as cropping */
      const isCroppingBanner =
        typeof payload?.event?.bannerImage !== 'string' &&
        !!payload?.event?.bannerImage
      const isCroppingThumb =
        typeof payload?.event?.thumbnailImage !== 'string' &&
        !!payload?.event?.thumbnailImage
      const updateExeption = isCroppingBanner || isCroppingThumb

      if (
        !updateExeption &&
        eventId &&
        payload?.event?.title &&
        payload.event.title.length > 0
      ) {
        setIsLoading(true)
        const updatedEvent = await updateEvent({
          variables: {
            input: payload,
          },
        }).then((data) => {
          setSaved(true)
          return data
        })
        setIsLoading(false)
        return updatedEvent.data?.updateEvent?.eventId
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, formData]
  )

  useEffect(() => {
    if (errors?.message && errors?.step) setShowErrorModal(true)
  }, [errors])

  const handleNext = async (e: any) => {
    saveChanges({ ...formData })

    e.preventDefault()

    const { eventType } = formData?.event!

    const pushToEvent = () =>
      router.push(
        `event/${formData?.eventId}${eventType === EventType.Fundraiser ? '/donate' : ''
        }`
      )

    let nextStage = CreateEventStage.Details

    if (!formData?.event?.eventType) nextStage = CreateEventStage.Type

    if (createEventStage?.stage === CreateEventStage.Type)
      nextStage = CreateEventStage.Details

    if (createEventStage?.stage === CreateEventStage.Details)
      if (eventType === EventType.Fundraiser) {
        if (createEventStage.skipPreview) pushToEvent()
        else nextStage = CreateEventStage.Preview
      } else nextStage = CreateEventStage.Communications

    if (createEventStage?.stage === CreateEventStage.Communications) {
      if (createEventStage.skipPreview) pushToEvent()
      else nextStage = CreateEventStage.Preview
    }

    if (createEventStage?.stage === CreateEventStage.Preview) pushToEvent()

    setCreateEventStage({ stage: nextStage })
  }

  const handleDateTimeChange = ({
    tz,
    startDate = eventDetailsData?.startDateTime,
    endDate = eventDetailsData?.endDateTime,
  }: {
    tz?: string
    startDate?: string | null
    endDate?: string | null
  }) => {
    const tzOffset = parseInt(
      (tz ?? eventDetailsData?.timeZone ?? formData?.event?.timeZone)?.split(
        '::'
      )[0] ?? '0'
    )

    const payload = {
      ...formData?.event,
      ...(eventDetailsData ?? {}),
      ...(!!tz ? { timeZone: tz } : {}),
      ...(!!startDate || !!tz
        ? {
          startDateTime: parseTime(
            startDate ?? moment().toISOString(),
            tzOffset
          ),
        }
        : {}),
      ...(!!endDate || !!tz
        ? {
          endDateTime: parseTime(endDate ?? moment().toISOString(), tzOffset),
        }
        : {}),
    }

    setEventDetailsData(payload)
  }

  const debouncedSave = useCallback(
    debounce((data: any) => {
      // const hasBasicEventDataAnd =
      //   !!data?.formData?.eventId &&
      //   !!data?.formData?.event?.eventType &&
      //   !!data?.formData?.event?.title &&
      //   !!data?.formData?.event?.description &&
      //   !!data?.formData?.event?.startDateTime &&
      //   !!data?.formData?.event?.endDateTime
      // if (hasBasicEventDataAnd) {
      // }
      saveChanges({
        ...data.formData,
      })
    }, 1000),
    [saveChanges]
  )

  // Handle Save Reminders
  useEffect(() => {
    debouncedSave({ formData })
    const payload = { ...completeSections }

    if (formData?.event?.title || eventDetailsData?.title)
      payload.details = true

    if (formData?.tickets && formData?.tickets?.length > 0)
      payload.registration = true

    if (formData?.speakers && formData?.speakers?.length > 0)
      payload.speakers = true

    if (formData?.fundraising && formData?.fundraising?.goal)
      payload.fundraising = true

    if (formData?.stages && formData?.stages?.length > 0) payload.stages = true

    if (formData?.sessions && formData.sessions.length > 0)
      payload.sessions = true

    if (formData?.attendees && formData.attendees.length > 0)
      payload.attendees = true

    if (formData?.sponsors && formData.sponsors.length > 0)
      payload.sponsors = true

    if (formData?.breakoutRooms && formData.breakoutRooms.length > 0)
      payload.breakoutRooms = true

    if (formData?.ondemandContent && formData.ondemandContent.length > 0)
      payload.onDemand = true

    setCompleteSections({ ...completeSections, ...payload })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  useEffect(() => {
    if (!!eventDetailsData) {
      delete eventDetailsData.eventType
      const { fundraising, ...eventData } = eventDetailsData
      const payload = {
        ...formData,
        event: { ...formData?.event, ...eventData } as EventDetails,
        ...(fundraising
          ? {
            fundraising: {
              ...formData?.fundraising,
              ...fundraising,
            },
          }
          : {}),
      }
      //@ts-ignore
      if (payload?.title || payload?.event?.title) {
        setFormData(payload)
      }
    }
  }, [eventDetailsData])

  const handleSelectEventType = async (eventType: EventType) => {
    let payload = {
      ...formData,
      event: {
        ...formData?.event,
        eventType,
      } as EventDetails,
    }
    if (!formData?.eventId && !urlEventId && !router.query.id) {
      const eventId = await generateEventId(eventType)
      payload.eventId = eventId
    }
    setFormData(payload)
  }

  const perms = getPermission('EVENT::TYPE::*')

  const toggleFundraising = (val: boolean) =>
    setFormData({
      ...formData,
      fundraising: {
        ...formData?.fundraising,
        enabled: val,
      },
    })

  if (
    createEventStage?.stage === CreateEventStage.Type ||
    (!urlEventId &&
      !formData?.eventId &&
      formData?.event?.eventType === undefined)
  ) {
    return (
      <Box
        className={`flex flex-col items-center mx-auto`}
        style={{ width: '90%' }}
      >
        <Text className={`text-2xl my-2`}>Select your event type</Text>
        <Box
          className={`flex flex-row justify-evenly space-x-2 overflow-x-auto`}
        >
          <Card
            selected={formData?.event?.eventType === EventType.Online}
            imgSrc={'/images/onlineEvent.svg'}
            imgWidth={200}
            imgHeight={200}
            onClick={() => handleSelectEventType(EventType.Online)}
            text="Create online events and engage with your audience all around the world."
            // disabled={!isAdmin && !perms.find((p) => p === 'ONLINE')}
            title={'Online Event'}
          >
            <CheckboxInput
              isProtected
              value={formData?.fundraising?.enabled}
              onChange={(val) => {
                toggleFundraising(val)
              }}
              show={
                (isAdmin || !!perms.find((p) => p === 'FUNDRAISER')) &&
                formData?.event?.eventType === EventType.Online
              }
              className="bg-transparent rounded text-sm border-box -mt-1"
              border=""
              label="Additional Tickets"
            >
              <span className="mt-2">Enable Fundraising</span>
            </CheckboxInput>
            <Button
              show={formData?.event?.eventType === EventType.Online}
              className="mx-auto mt-4"
              icon={<FaArrowRight />}
              iconColor={'white'}
              backgroundColor={StaticColours.forumm_blue}
              onClick={() =>
                setCreateEventStage({ stage: CreateEventStage.Details })
              }
            />
          </Card>
          <Card
            selected={formData?.event?.eventType === EventType.InPerson}
            imgSrc={'/images/inpersonEvent.svg'}
            imgWidth={200}
            imgHeight={200}
            onClick={() => handleSelectEventType(EventType.InPerson)}
            text="Connect with your audience and engage in person."
            title={'In-Person Event'}
          >
            <CheckboxInput
              isProtected
              value={formData?.fundraising?.enabled}
              onChange={(val) => {
                toggleFundraising(val)
              }}
              show={
                (isAdmin || !!perms.find((p) => p === 'FUNDRAISER')) &&
                formData?.event?.eventType === EventType.InPerson
              }
              className="bg-transparent rounded text-sm border-box -mt-1 flex-"
              border=""
              label="Additional Tickets"
            >
              <span className="mt-2">Enable Fundraising</span>
            </CheckboxInput>
            <Button
              show={formData?.event?.eventType === EventType.InPerson}
              className="mx-auto mt-4"
              icon={<FaArrowRight />}
              iconColor={'white'}
              backgroundColor={StaticColours.forumm_blue}
              onClick={() =>
                setCreateEventStage({ stage: CreateEventStage.Details })
              }
            />
          </Card>
          <Card
            selected={formData?.event?.eventType === EventType.Fundraiser}
            imgSrc={'/images/fundraisingOnly.svg'}
            imgWidth={200}
            imgHeight={200}
            onClick={() => handleSelectEventType(EventType.Fundraiser)}
            text="Create fundraisers and achieve your goals"
            // disabled={!isAdmin && !perms.find((p) => p === 'FUNDRAISER')}
            title={'Fundraising Only'}
          >
            <Button
              show={formData?.event?.eventType === EventType.Fundraiser}
              className="mx-auto mt-4"
              icon={<FaArrowRight />}
              iconColor={'white'}
              backgroundColor={StaticColours.forumm_blue}
              onClick={() =>
                setCreateEventStage({ stage: CreateEventStage.Details })
              }
            />
          </Card>
        </Box>
      </Box>
    )
  }

  const EventForm = (
    <Box className="flex w-full space-x-12">
      <Box className="w-full">
        <Box className="flex flex-row items-start w-full gap-2">
          <TextInput
            tooltip="Event title is required to publish"
            labelBgColour={theme.backgroundColourSecondary}
            testid="name-input"
            validations={{
              maxLength: {
                value: 150,
                message: 'Title must be 150 characters or less',
              },
            }}
            required={isFieldRequired(
              validationRules.find((f) =>
                f[0].includes(
                  formData?.event?.eventType === EventType.Fundraiser
                    ? 'fundraising_title'
                    : 'event_title'
                )
              )
            )}
            hint="(Maximum of 150 characters)"
            label="Title"
            placeholder={
              formData?.event?.eventType === EventType.Fundraiser
                ? 'Fundraiser Name'
                : 'Event Name'
            }
            className="flex-1"
            value={
              formData?.event?.eventType === EventType.Fundraiser
                ? eventDetailsData?.fundraising?.title
                : eventDetailsData?.title
            }
            onChange={(data) => {
              const payload = {
                ...formData?.event,
                ...(eventDetailsData ?? {}),
                ...(formData?.event?.eventType === EventType.Fundraiser
                  ? {
                    title: data,
                    fundraising: { ...formData?.fundraising, title: data },
                  }
                  : { title: data }),
              }
              setEventDetailsData(payload)
            }}
          />

          <TextInput
            tooltip="A short event description is required to publish"
            labelBgColour={theme.backgroundColourSecondary}
            testid="short-description-input"
            validations={{
              maxLength: {
                value: 300,
                message: 'Description must be 300 characters or less',
              },
            }}
            required={isFieldRequired(
              validationRules.find((f) => f[0].includes('event_shortDescription'))
            )}
            hint="(Maximum of 300 characters)"
            label="Short Description"
            placeholder={`Write a short description of your ${formData?.event?.eventType === EventType.Fundraiser
              ? 'fundraiser'
              : 'event'
              }`}
            className="flex-1"
            value={eventDetailsData?.shortDescription}
            onChange={(data) => {
              setEventDetailsData({
                ...formData?.event,
                ...(eventDetailsData ?? {}),
                shortDescription: data,
              })
            }}
          />
        </Box>


        <RichTextEditor
          tooltip="A full event description is required to publish"
          testid="description-input"
          validations={{
            maxLength: {
              value: 1500,
              message: 'Description must be 1500 characters or less',
            },
          }}
          className="mt-2"
          required={isFieldRequired(
            validationRules.find((f) =>
              f[0].includes(
                formData?.event?.eventType === EventType.Fundraiser
                  ? 'fundraising_description'
                  : 'event_description'
              )
            )
          )}
          hint="(Maximum of 1500 characters)"
          label="Description"
          placeholder={`Write all of the details of your ${formData?.event?.eventType === EventType.Fundraiser
            ? 'fundraiser'
            : 'event'
            }...`}
          value={eventDetailsData?.description}
          onChange={(jsonString) => {
            const payload = {
              ...formData?.event,
              ...(eventDetailsData ?? {}),
              ...(formData?.event?.eventType === EventType.Fundraiser
                ? {
                  description: jsonString,
                  fundraising: {
                    ...formData?.fundraising,
                    description: jsonString,
                  },
                }
                : { description: jsonString }),
            }
            setEventDetailsData(payload)
          }}
        />
        <Box className="flex flex-row items-start gap-4 w-full">
          <TextAreaInput
            tooltip="An event location is required to publish"
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('event_eventLocation'))
            )}
            testid="location-input"
            label="Event Location"
            placeholder="Please input the address where the event takes place"
            required={isFieldRequired(
              validationRules.find((f) => f[0].includes('event_eventLocation'))
            )}
            // Remove "-mt-6" to maintain alignment
            className="flex-1"
            value={eventDetailsData?.eventLocation}
            onChange={(data) => {
              setEventDetailsData({
                ...formData?.event,
                ...(eventDetailsData ?? {}),
                eventLocation: data,
              })
            }}
          />
          <FileInput
            uploadFile={uploadFile}
            label="Banner Image"
            hint=""
            crop={true}
            cropAspectRatio={1}
            cropShape={'rect'}
            testid={'banner-upload'}
            value={eventDetailsData?.bannerImage!}
            onChange={(data) => {
              setEventDetailsData({
                ...formData?.event,
                ...(eventDetailsData ?? {}),
                bannerImage: data as string,
              })
            }}
          />

          <RadioFieldInput
            testid="visibility-input"
            hint={`(Private ${formData?.event?.eventType === EventType.Fundraiser ? 'fundraisers' : 'events'
              } are only visible to your organization)`}
            options={['Private', 'Public']}
            label={`${formData?.event?.eventType === EventType.Fundraiser ? 'Fundraiser' : 'Event'
              } Visibility`}
            className="flex-1 text-lg"
            value={eventDetailsData?.publiclyListed === false ? 'Private' : 'Public'}
            onChange={(data) => {
              setEventDetailsData({
                ...formData?.event,
                ...(eventDetailsData ?? {}),
                publiclyListed: data === 'Public',
              })
            }}
          />
          {/* <FileInput */}
          {/*   uploadFile={uploadFile} */}
          {/*   label="Logo" */}
          {/*   crop={true} */}
          {/*   cropAspectRatio={1} */}
          {/*   cropShape={'rect'} */}
          {/*   data-testid={'thumbnail-upload'} */}
          {/*   value={eventDetailsData?.thumbnailImage!} */}
          {/*   onChange={(data) => { */}
          {/*     setEventDetailsData({ */}
          {/*       ...formData?.event, */}
          {/*       ...(eventDetailsData ?? {}), */}
          {/*       thumbnailImage: data as string, */}
          {/*     }) */}
          {/*   }} */}
          {/* /> */}
        </Box>

        {/*<ColorPicker label="Event Main Colour" testid={'color-picker'} />
          <ColorPicker
            label="Event Background Colour"
            testid={'bg-color-picker'}
            onChange={() => setHasEdited(true)}
          />*/}
        {/* <ColorPicker label="Event Text Colour" /> */}
        <Box>
          <Box className="mt-8 flex justify-between flex-col">
            <Box className="text-lg" textColour="textColour">
              Select Date and Time
            </Box>
            <Box className='mt-2'>
              <DropdownInput
                value={eventDetailsData?.timeZone ?? formData?.event?.timeZone}
                label="Timezone"
                options={getTimezones()}
                onChange={(data) => {
                  setEventDetailsData({
                    ...formData?.event,
                    ...(eventDetailsData ?? {}),
                    timeZone: data,
                  })
                  handleDateTimeChange({ tz: data })
                }}
              />
            </Box>
          </Box>
          <Box className="flex flex-col sm:flex-row justify-between sm:space-x-6 mt-2">
            <DateTimeInput
              tooltip="Start date/time is required to publish"
              labelBgColour={theme.backgroundColourSecondary}
              label="Event Start"
              id={'start-time-input'}
              testid={'start-time-input'}
              required={isFieldRequired(
                validationRules.find((f) =>
                  f[0].includes('event_startDateTime')
                )
              )}
              value={
                eventDetailsData?.startDateTime ??
                formData?.event?.startDateTime
              }
              onChange={(data) => {
                const tz = parseInt(
                  (
                    eventDetailsData?.timeZone ?? formData?.event?.timeZone
                  )?.split('::')[0] ?? '0'
                )
                const time = !tz
                  ? data
                  : `${data.split('Z')[0]}${tz < 0 ? '-' : '+'}${tz < 10 ? `0${Math.abs(tz)}` : tz
                  }:00`

                setEventDetailsData({
                  ...formData?.event,
                  ...(eventDetailsData ?? {}),
                  startDateTime: time,
                })
              }}
              className="flex-1"
              filterDate={(rawDate) => {
                const date = moment(rawDate)
                if (date.isBefore(moment(), 'day')) return false
                return true
              }}
              filterTime={(rawTime) => {
                return true
              }}
              clickIdOnChange="registration-close-time-input"
              tz={parseInt(
                eventDetailsData?.timeZone ?? formData?.event?.timeZone ?? '0'
              )}
            />
            <DateTimeInput
              tz={parseInt(
                eventDetailsData?.timeZone ?? formData?.event?.timeZone ?? '0'
              )}
              tooltip="Registration close date/time is required to publish"
              labelBgColour={theme.backgroundColourSecondary}
              id={'registration-close-time-input'}
              testid={'registration-close-time-input'}
              show={formData?.event?.eventType !== EventType.Fundraiser}
              value={
                eventDetailsData?.registrationCloseDateTime ??
                formData?.event?.registrationCloseDateTime
              }
              required={isFieldRequired(
                validationRules.find((f) =>
                  f[0].includes('event_registrationCloseDateTime')
                )
              )}
              onChange={(data) => {
                const tz = parseInt(
                  eventDetailsData?.timeZone ?? formData?.event?.timeZone ?? '0'
                )
                const time = !tz
                  ? data
                  : `${data.split('Z')[0]}${tz < 0 ? '-' : '+'}${tz < 10 ? `0${Math.abs(tz)}` : tz
                  }:00`

                setEventDetailsData({
                  ...formData?.event,
                  ...(eventDetailsData ?? {}),
                  registrationCloseDateTime: time,
                })
              }}
              className="flex-1"
              label="Registration Close"
              filterDate={(rawDate) => {
                const date = moment(rawDate)
                const endTime = eventDetailsData?.endDateTime

                if (!!endTime && date.isAfter(endTime, 'day')) return false
                return true
              }}
              filterTime={(rawTime) => {
                const time = moment(rawTime)
                const endTime = eventDetailsData?.endDateTime

                if (!!endTime && time.isAfter(endTime, 'minute')) return false
                return true
              }}
              clickIdOnChange="end-time-input"
              initialDate={
                new Date(moment(eventDetailsData?.startDateTime).toISOString())
              }
            />
            <DateTimeInput
              tz={parseInt(
                eventDetailsData?.timeZone ?? formData?.event?.timeZone ?? '0'
              )}
              tooltip="End date/time is required to publish"
              labelBgColour={theme.backgroundColourSecondary}
              id={'end-time-input'}
              testid={'end-time-input'}
              value={
                eventDetailsData?.endDateTime ?? formData?.event?.endDateTime
              }
              validations={{
                greaterThanDate: eventDetailsData?.startDateTime ?? '',
              }}
              required={isFieldRequired(
                validationRules.find((f) => f[0].includes('event_endDateTime'))
              )}
              className="flex-1"
              label="Event End"
              filterDate={(rawDate) => {
                const date = moment(rawDate)
                const startTime = eventDetailsData?.startDateTime

                if (!!startTime && date.isBefore(startTime, 'day')) return false
                return true
              }}
              filterTime={(rawTime) => {
                const time = moment(rawTime)
                const startTime = eventDetailsData?.startDateTime

                if (!!startTime && time.isSameOrBefore(startTime, 'minute'))
                  return false
                return true
              }}
              onChange={(data) => {
                const tz = parseInt(
                  eventDetailsData?.timeZone ?? formData?.event?.timeZone ?? '0'
                )
                const time = !tz
                  ? data
                  : `${data.split('Z')[0]}${tz < 0 ? '-' : '+'}${tz < 10 ? `0${Math.abs(tz)}` : tz
                  }:00`

                setEventDetailsData({
                  ...formData?.event,
                  ...(eventDetailsData ?? {}),
                  endDateTime: time,
                })
              }}
              initialDate={
                new Date(
                  moment(
                    eventDetailsData?.registrationCloseDateTime ??
                    eventDetailsData?.startDateTime
                  ).toISOString()
                )
              }
            />
          </Box>
        </Box>

      </Box>
    </Box>
  )

  const error_modal = () => {
    return (
      <Modal
        title={'Publish Error'}
        show={showErrorModal}
        setShow={setShowErrorModal}
      >
        <Box className={`flex items-center justify-center pb-4`}>
          <Box
            className={`flex items-center justify-center p-2 bg-red-50 rounded-full`}
          >
            <CiWarning className="w-10 h-10" />
          </Box>
        </Box>
        <span className="font-bold mb-2">
          There was an issue publishing the event.
        </span>
        <br />
        <span className="font-bold text-md">Section: </span>
        <span className="text-sm">{errors?.step}</span>
        <br />
        <span className="font-bold text-md">Error: </span>
        <span className="text-sm">{errors?.message}</span>
      </Modal>
    )
  }

  return (
    <Box
      className={`flex flex-col space-y-6 ${createEventStage?.stage === CreateEventStage.Preview && 'h-screen'
        }`}
    >
      {error_modal()}
      {errors?.message ? (
        <span className={`transition-all text-red-500 text-lg font-bold`}>
          Please complete all required sections.
        </span>
      ) : (
        <></>
      )}
      <Box
        show={saved}
        className={`flex items-center justify-end text-forumm-green animate-pulse sticky top-[20px]`}
        ignoreTheme
      >
        <FaRegCheckCircle />
        <Text ignoreTheme className="ml-2">
          Event saved.
        </Text>
      </Box>
      {createEventStage?.stage === CreateEventStage.Details ? (
        <>
          <Accordion
            className={'mt-6'}
            section={CreateEventSection.DETAILS}
            title={
              formData?.event?.eventType === EventType.Fundraiser
                ? 'Fundraising Page'
                : 'Event'
            }
            initiallyOpen={true}
            error={errors?.step === 'event' ? errors.message : undefined}
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('event'))
            )}
          >
            {EventForm}
          </Accordion>

          <Accordion
            className={'mt-6'}
            title={`Registration`}
            section={CreateEventSection.REGISTRATION}
            initiallyOpen={formState.registration}
            error={errors?.step === 'tickets' ? errors.message : undefined}
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('tickets'))
            )}
          >
            {<TicketsForm currency={organisationProfile.currency} />}
          </Accordion>

          <Accordion
            title={`Fundraising`}
            section={CreateEventSection.FUNDRAISING}
            className={'mt-6'}
            initiallyOpen={formState.fundraising}
            error={errors?.step === 'fundraising' ? errors.message : undefined}
            show={
              (shouldShowField(
                validationRules.find((f) => f[0].includes('fundraising'))
              ) ||
                !!formData?.fundraising?.enabled) &&
              formData?.event?.eventType === 'FUNDRAISER'
            }
          >
            {<FundraisingForm currency={organisationProfile.currency} />}
          </Accordion>

          {/* Tihs is the fundraiser picker only in user for online and in-person */}
          <Accordion
            title={`Fundraising`}
            section={CreateEventSection.FUNDRAISING}
            className={'mt-6'}
            initiallyOpen={formState.fundraising}
            error={errors?.step === 'fundraising' ? errors.message : undefined}
            show={formData?.event?.eventType !== 'FUNDRAISER'}
          >
            {
              <FundraisingPickerForm
                currency={organisationProfile.currency}
                organisation={profile?.company ?? profile?.university!}
              />
            }
          </Accordion>

          <Accordion
            className={'mt-6'}
            title={`Speakers`}
            section={CreateEventSection.SPEAKERS}
            initiallyOpen={formState.speakers}
            error={errors?.step === 'speakers' ? errors.message : undefined}
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('speakers'))
            )}
          >
            {<SpeakersForm />}
          </Accordion>

          <Accordion
            className={'mt-6'}
            title={`Stages`}
            section={CreateEventSection.STAGES}
            initiallyOpen={formState.stages}
            error={errors?.step === 'stages' ? errors.message : undefined}
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('stages'))
            )}
          >
            {<StagesForm />}
          </Accordion>

          <Accordion
            className={'mt-6'}
            title={`Session`}
            section={CreateEventSection.SESSIONS}
            initiallyOpen={formState.sessions}
            error={errors?.step === 'sessions' ? errors.message : undefined}
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('sessions'))
            )}
          >
            {<SessionsForm />}
          </Accordion>

          <Accordion
            className={'mt-6'}
            title={`Attendees`}
            section={CreateEventSection.ATTENDEES}
            initiallyOpen={formState.attendees}
            error={errors?.step === 'attendees' ? errors.message : undefined}
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('attendees'))
            )}
          >
            {<AttendeesForm updateInProgress={isLoading} />}
          </Accordion>

          <Accordion
            className={'mt-6'}
            title={`Partners`}
            section={CreateEventSection.PARTNERS}
            initiallyOpen={formState.sponsors}
            error={errors?.step === 'sponsors' ? errors.message : undefined}
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('sponsors'))
            )}
          >
            {<SponsorsForm />}
          </Accordion>

          {/* Only shows on Fundraiser events */}
          <Accordion
            title={`Communications`}
            section={CreateEventSection.COMMUNICATIONS}
            className={'mt-6'}
            initiallyOpen={formState.communications}
            error={
              errors?.step === 'communications' ? errors.message : undefined
            }
            show={
              formData?.event?.eventType === EventType.Fundraiser &&
              shouldShowField(
                validationRules.find((f) => f[0].includes('communications'))
              )
            }
          >
            {<CommunicationsForm />}
          </Accordion>
        </>
      ) : (
        <></>
      )}
      {createEventStage?.stage === CreateEventStage.Communications ? (
        <>
          <Accordion
            title={`Breakout`}
            section={CreateEventSection.BREAKOUT_ROOMS}
            className={'mt-6'}
            initiallyOpen={formState.breakoutRooms}
            error={
              errors?.step === 'breakoutRooms' ? errors.message : undefined
            }
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('breakoutRooms'))
            )}
          >
            {<BreakoutRoomsForm />}
          </Accordion>

          <Accordion
            title={`Communications`}
            section={CreateEventSection.COMMUNICATIONS}
            className={'mt-6'}
            initiallyOpen={formState.communications}
            error={
              errors?.step === 'communications' ? errors.message : undefined
            }
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('communications'))
            )}
          >
            {<CommunicationsForm />}
          </Accordion>

          <Accordion
            title={`On - Demand`}
            section={CreateEventSection.ON_DEMAND_CONTENT}
            className={'mt-6'}
            initiallyOpen={formState.onDemand}
            error={
              errors?.step === 'ondemandContent' ? errors.message : undefined
            }
            show={shouldShowField(
              validationRules.find((f) => f[0].includes('ondemandContent'))
            )}
          >
            {<OndemandContantForm />}
          </Accordion>
        </>
      ) : (
        <></>
      )}
      {createEventStage?.stage === CreateEventStage.Preview ? (
        <Box className="lg:block w-full relative h-full border-forumm-menu-border">
          <Box
            ignoreTheme
            className="text-md absolute p-2 bg-white rounded text-black opacity-60"
          >
            Preview
          </Box>
          <iframe
            className="w-full h-full rounded border border-white border-solid border-opacity-25 "
            onClick={(e) => {
              e.preventDefault()
            }}
            /* src={`/donation/${formData?.event?.donationUrl}`} */

            src={`/event/${formData?.eventId
              }/agenda?preview=true&r=${Math.random()}`}
          />
        </Box>
      ) : (
        <></>
      )}

      <Box className={`mt-6 ml-auto flex`}>
        <Button
          title="Back to dashboard"
          type="secondary"
          textColor="#3763e9"
          onClick={() => {
            router.push('/dashboard')
          }}
          size="small"
        />
        {completeSections.details && (
          <Button
            data-testid={'submit-button'}
            className={`ml-2`}
            title={
              createEventStage?.stage === CreateEventStage.Preview
                ? 'Finish'
                : createEventStage?.stage === CreateEventStage.Communications &&
                  createEventStage.skipPreview
                  ? 'Finish'
                  : 'Save & Next'
            }
            buttonType="submit"
            onClick={handleNext}
            size="small"
          />
        )}
      </Box>
    </Box>
  )
}

CreateEventPage.Layout = CreateEventLayout
