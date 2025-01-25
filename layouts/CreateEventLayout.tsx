import { useLazyQuery, useMutation } from '@apollo/client'
import moment from 'moment'
import {
  getValidationRules,
  validate,
  ValidationRules,
} from '@libs/Utility/validation'
import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import LoadingSpinner from '@components/base/LoadingSpinner'
import MiniNav from '@components/base/MiniNav'
import { DELETE_EVENT_BY_ID } from '@graphql/events/deleteEventById'
import {
  CreateEventContext,
  CreateEventStageInfo,
  EventCreation,
} from '@libs/CreateEventContext'
import { useAuth } from '@libs/useAuth'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Wrapper from './Wrapper'
import { UPDATE_EVENT } from '@graphql/events/updateEvent'
import { GET_EVENT_BY_ID_FOR_EDITOR } from '@graphql/events/GetEventByIdForEditor'
import { EventType } from '@graphql/__generated/graphql'
import { useBlackBaud } from '@libs/useBlackBaud'
import { cleanEventPayload, isSame } from '@libs/Utility/util'
import FooterUnauthenticated from '@components/page/FooterUnauthenticated'
import BlackBaudIcon from '@public/images/BlackBaudIcon.svg'
import BlackBaudEventModal, {
  UpdatedConstituentItem,
} from '@components/event/BlackBaudEventModal'
import { Toaster, toast } from 'react-hot-toast'

export enum CreateEventStage {
  'Type' = 'TYPE',
  'Details' = 'DETAILS',
  'Communications' = 'COMMUNICATIONS',
  'Preview' = 'PREVIEW',
}

const CreateEventLayout = ({ children }: { children: React.ReactNode }) => {
  const { publish, getEvent: getBlacBaudEvent } = useBlackBaud()
  const [blackbaudId, setBlackbaudId] = useState<string | undefined>()
  const [showBlackBaudModal, setShowBlackBaudModal] = useState<boolean>(false)
  const [blackBaudComparison, setBlackBaudComparison] = useState<any>({
    local: null,
    remote: null,
  })
  const [formData, setFormData] = useState<Partial<EventCreation> | undefined>()
  const [validationRules, setValidationRules] = useState<ValidationRules>([])
  const [errors, setErrors] = useState<
    { step: string; message: string } | undefined
  >()
  const { profile } = useAuth()
  const [getEventById, { data, loading, refetch }] = useLazyQuery(
    GET_EVENT_BY_ID_FOR_EDITOR,
    { fetchPolicy: 'network-only' }
  )
  const [updateEvent] = useMutation(UPDATE_EVENT)
  const [deleteEventById] = useMutation(DELETE_EVENT_BY_ID)
  const [loaded, setLoaded] = useState(false)
  const [pushedToBlackbaud, setPushedToBlackbaud] = useState(false)
  const [loadingBlackBaud, setLoadingBlackBaud] = useState(false)
  const [blackBaudError, setBlackbaudError] = useState(false)
  const [editMode, setEditMode] = useState<boolean>(false)
  const { query, push, isReady } = useRouter()
  const eventId = useMemo(
    () => query.id ?? formData?.eventId,
    [query.id, formData?.eventId]
  )
  const [createEventStage, dispatchCreateEventStage] = useState<
    CreateEventStageInfo | undefined
  >({ stage: CreateEventStage.Type, skipPreview: true })

  const setCreateEventStage = (data: Partial<CreateEventStageInfo>): void => {
    dispatchCreateEventStage({ ...createEventStage!, ...data })
  }

  useEffect(() => {
    setEditMode(window.location.href.includes('?id='))
  }, [])

  useEffect(() => {
    if (pushedToBlackbaud) {
      toast(`Successfully Synced with BlackBaud!`, {
        icon: '🎉',
        duration: 4000,
      })
    }
  }, [pushedToBlackbaud])

  useEffect(() => {
    if (data?.getEventById?.event?.blackbaudId)
      setBlackbaudId(data?.getEventById?.event?.blackbaudId)
  }, [data?.getEventById?.event?.blackbaudId])

  useEffect(() => {
    async function getEvent(eventId: string) {
      if (eventId) {
        getEventById({
          variables: { input: { eventId: eventId } },
        })
      }
    }

    if (isReady && !loaded && data?.getEventById?.event?.eventType) {
      setCreateEventStage({ stage: CreateEventStage.Details })
    }

    if (eventId && !formData) {
      void getEvent(eventId as string)
    }

    if (data?.getEventById) {
      let shouldUpdateEvent = false
      const cleanPayload: Partial<EventCreation> = cleanEventPayload(data)

      if (!formData) shouldUpdateEvent = true
      // If the event data has changed since last fetch, update the local event data.
      if (!isSame(formData, cleanPayload)) shouldUpdateEvent = true

      if (shouldUpdateEvent) {
        setFormData(cleanPayload)
        setLoaded(true)
      }
    }

    if (isReady && formData) {
      void getEvent(eventId as string)
    }

    if (isReady && eventId == null) {
      setLoaded(true)
    }
  }, [data, eventId, getEventById, isReady])

  const disableProgress =
    createEventStage?.stage === CreateEventStage.Type &&
    !!!formData?.event?.eventType

  const items = useMemo(() => {
    return [
      { label: 'Type', targetStage: CreateEventStage.Type },
      { label: 'Details', targetStage: CreateEventStage.Details },
      {
        label: 'Communication',
        targetStage: CreateEventStage.Communications,
      },
      { label: 'Preview', targetStage: CreateEventStage.Preview },
    ].filter(
      (i) =>
        (i.targetStage === CreateEventStage.Communications &&
          formData?.event?.eventType !== EventType.Fundraiser) ||
        i.targetStage !== CreateEventStage.Communications
    )
  }, [formData?.event?.eventType])

  useEffect(() => {
    const rules = getValidationRules(
      formData?.event?.eventType ?? undefined
    ).reduce(
      (acc: ValidationRules, val) =>
        acc.find((f) => f[0] === val[0] || typeof val[1] === 'function')
          ? acc
          : [...acc, val],
      []
    )
    setValidationRules(rules)
  }, [formData?.event?.eventType])

  const handlePushToCRM = async (
    selection: string[],
    updatedConstituents: UpdatedConstituentItem[] | undefined
  ) => {
    setLoadingBlackBaud(true)
    const response = await publish(
      eventId as string,
      selection,
      updatedConstituents,
      blackbaudId
    )
    const isSuccess = response?.data?.pushToBlackbaud?.success
    if (response?.data?.pushToBlackbaud?.newBlackbaudId)
      setBlackbaudId(response?.data?.pushToBlackbaud?.newBlackbaudId)
    if (isSuccess) {
      setPushedToBlackbaud(true)
    } else {
      setBlackbaudError(true)
    }
    setTimeout(() => {
      setPushedToBlackbaud(false)
      setLoadingBlackBaud(false)
    }, 1000)
  }

  const openBlackBaudModal = async () => {
    setBlackbaudError(false)
    setLoadingBlackBaud(true)

    const response = await getBlacBaudEvent(eventId as string, blackbaudId)

    if (response?.errors?.[0]?.message === 'AuthenticationError') {
      setBlackbaudError(true)
      setLoadingBlackBaud(false)
      return
    }

    const localEvent = formData?.event
    const localAttendees = formData?.attendees ?? []
    const localSpeakers = formData?.speakers ?? []
    const blackbaudEvent = response?.data?.getBlackBaudEvent

    let blackbaudData = null

    const localData = [
      { label: 'Title', content: localEvent?.title ?? '' },
      {
        label: 'Description',
        content: localEvent?.shortDescription ?? '',
      },
      {
        label: 'Start Date',
        content: localEvent?.startDateTime
          ? moment(localEvent?.startDateTime).format('MMM DD, h:mmA')
          : '',
      },
      {
        label: 'End Date',
        content: localEvent?.endDateTime
          ? moment(localEvent?.endDateTime).format('MMM DD, h:mmA')
          : '',
      },
      {
        label: 'Attendees',
        content: localAttendees
          .map((attendee) => `${attendee.name} (${attendee.email})`)
          .join(', '),
      },
      {
        label: 'Speakers',
        content: localSpeakers
          .map((speaker) => `${speaker.name} (${speaker.email})`)
          .join(', '),
      },
    ]

    if (blackbaudEvent) {
      const startDateTime = `${blackbaudEvent?.start_date ?? ''} ${
        blackbaudEvent?.start_time ?? ''
      }`
      const endDateTime = `${blackbaudEvent?.end_date ?? ''} ${
        blackbaudEvent?.end_time ?? ''
      }`

      blackbaudData = [
        { label: 'Title', content: blackbaudEvent?.name ?? '' },
        {
          label: 'Description',
          content: blackbaudEvent?.description ?? '',
        },
        {
          label: 'Start Date',
          content: startDateTime
            ? moment(startDateTime).format('MMM DD, h:mmA')
            : null,
        },
        {
          label: 'End Date',
          content: endDateTime
            ? moment(endDateTime).format('MMM DD, h:mmA')
            : null,
        },
        {
          label: 'Attendees',
          content: blackbaudEvent?.attendees
            .map(
              (attendee: { name: any; email: any }) =>
                `${attendee.name} (${attendee.email})`
            )
            .join(', '),
        },
        {
          label: 'Speakers',
          content: blackbaudEvent?.speakers
            .map(
              (speaker: { name: any; email: any }) =>
                `${speaker.name} (${speaker.email})`
            )
            .join(', '),
        },
      ]
    }
    setBlackBaudComparison({
      local: localData,
      remote: blackbaudData,
    })
    setShowBlackBaudModal(true)
    setLoadingBlackBaud(false)
  }

  const handleSaveSelectionBlackBaud = async (
    selection: string[],
    updatedConstituents: UpdatedConstituentItem[] | undefined
  ) => {
    console.log('updatedConstituents 2:', updatedConstituents)
    setShowBlackBaudModal(false)
    setBlackbaudError(false)
    handlePushToCRM(selection, updatedConstituents)
  }

  const alreadyOnBlackbaud = blackbaudId || pushedToBlackbaud

  return (
    <Wrapper
      requireAuth={false}
      showFooter={false}
      requireChat={false}
      className="h-screen"
      wrapperClasses="flex flex-col flex-1  transition-all'"
    >
      <Box className="-mt-[80px] pt-[80px] overflow-x-hidden h-[calc(100vh)] relative">
        <CreateEventContext.Provider
          value={{
            formData,
            setFormData,
            createEventStage,
            setCreateEventStage,
            errors,
            setErrors,
            validationRules,
          }}
        >
          <Box className="px-4 md:px-20 lg:px-[156px]">
            <Box className="py-6 sm:py-6">
              <Box className="text-2xl">
                {editMode ? 'Edit' : 'Create'} {' Event'}
                {/* {profile?.company ?? profile?.university} */}
              </Box>
              <MiniNav
                stage={createEventStage}
                setStage={setCreateEventStage}
                navItems={items}
                disabled={disableProgress}
              />
              {loading ? (
                <Box className="flex items-center justify-center w-full py-24">
                  <LoadingSpinner size="medium" />
                </Box>
              ) : (
                <>{children}</>
              )}
            </Box>
          </Box>
          <Toaster
            toastOptions={{
              className:
                'shadow-lg !rounded-full flex items-center border-2 !bg-forumm-white border-forumm-green !text-forumm-green mt-[80px]',
              duration: 4000,
            }}
          />
          <BlackBaudEventModal
            show={showBlackBaudModal}
            setShow={setShowBlackBaudModal}
            data={blackBaudComparison}
            onSave={handleSaveSelectionBlackBaud}
          />
          <Box className="flex flex-col items-center space-y-4">
            {eventId && (
              <>
                <Box className="flex flex-wrap justify-center items-center gap-4">
                  {/* Publish Event Button */}
                  <Button
                    confirmationModal={{
                      title: 'Confirm Publish Event',
                      content:
                        'Are you sure you want to publish this event? This cannot be undone.',
                    }}
                    onClick={() => {
                      const eventType: EventType =
                        formData?.event?.eventType ?? EventType.Online
                      const results = validate(
                        { ...formData },
                        getValidationRules(eventType)
                      )
                      if (!results.error) {
                        updateEvent({
                          variables: {
                            input: {
                              eventId: eventId as string,
                              isPublished: true,
                            },
                          },
                        }).then(() => refetch())
                      } else {
                        setErrors(results.error)
                      }
                    }}
                    title={
                      formData?.isPublished ? 'Published' : 'Publish Event'
                    }
                    type="success"
                    size="medium"
                    disabled={formData?.isPublished ?? false}
                    isInConfirmationModal={true}
                  />

                  {/* Delete Event Button */}
                  <Button
                    confirmationModal={{
                      title: 'Confirm Event Deletion',
                      content: 'Are you sure you want to delete this event?',
                    }}
                    onClick={() => {
                      deleteEventById({
                        variables: {
                          input: {
                            eventId: eventId as string,
                          },
                        },
                      })
                      setTimeout(() => {
                        push('/dashboard')
                      }, 500)
                    }}
                    title="Delete Event"
                    type="danger"
                    size="medium"
                    isInConfirmationModal={true}
                  />

                  {/* Blackbaud Buttons */}
                  {formData?.isPublished && !blackBaudError && (
                    <Button
                      onClick={openBlackBaudModal}
                      title={
                        alreadyOnBlackbaud
                          ? 'Sync with Blackbaud'
                          : 'Publish to BlackBaud'
                      }
                      type="blackbaud"
                      size="medium"
                      loading={loadingBlackBaud}
                      icon={
                        <BlackBaudIcon
                          viewBox="0 0 58 58"
                          preserveAspectRatio="xMidYMid meet"
                          height="24px"
                          width="24px"
                        />
                      }
                    />
                  )}

                  {/* Blackbaud Error Button */}
                  {blackBaudError && (
                    <Button
                      onClick={() => {
                        push('/organisation-settings')
                      }}
                      title="Session expired, Please Reconnect"
                      type="link"
                      size="medium"
                      loading={loadingBlackBaud}
                    />
                  )}
                </Box>
              </>
            )}
            <Box></Box>
          </Box>
        </CreateEventContext.Provider>
        <FooterUnauthenticated transparent={false} />
      </Box>
    </Wrapper>
  )
}

export default CreateEventLayout
