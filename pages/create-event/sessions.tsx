import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { DateTimeInput } from '@components/inputs/DateTimeInput'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import {
  EventSession,
  EventStage,
  EventType,
} from '@graphql/__generated/graphql'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import React, { useContext, useState } from 'react'
import Table from '@components/base/Table'
import TableRowActions from '@components/event/TableRowActions'
import moment from 'moment'
import { ArrayTextInput } from '@components/inputs/ArrayTextInput'
import ProfileImage from '@components/base/ProfileImage'
import useAutosave from '@libs/useAutosave'
import { v4 } from 'uuid'

const SessionsForm = () => {
  const [showModal, setShowModal] = useState(false)
  const [showBreakModal, setShowBreakModal] = useState(false)
  const [sessionModalData, setSessionModalData] = useState<any>(undefined)
  const { formData, setFormData } = useContext(CreateEventContext)
  const { sessions, stages, event, speakers } = formData ?? {}
  const noData = sessions == undefined || sessions.length === 0
  const isInPerson = formData?.event?.eventType === EventType.InPerson

  const { setHasEdited } = useAutosave()

  const handleSubmit = async () => {
    if (!sessionModalData) return
    const data = sessionModalData
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      stage,
      speakers: sessionSpeakers,
      editIndex,
      isBreak,
    } = data

    let payload = {
      ...formData,
      sessions: [...(sessions ?? [])],
    }

    let newSession: EventSession = {
      title: title ?? '',
      description: description ?? '',
      startDateTime: startDateTime ?? '',
      endDateTime: endDateTime ?? '',
      stage,
    }

    if (isBreak) newSession.isBreak = true
    if (!isBreak) {
      newSession = {
        ...newSession,

        stage: stages?.find((s) => s.title === stage) as EventStage,
        speakers: sessionSpeakers?.map((s: { key: string; value: string }) => {
          const foundSpeaker = speakers?.find((es) => {
            if (`${es.name}::${es?.email}` === s.value) return true
            if (`${es.name}::${es?.organization}` === s.value) return true
            if (es.email === s.value) return true
            return false
          })
          return foundSpeaker
        }),
      }
    }

    if (editIndex === undefined) payload.sessions.push(newSession)
    if (editIndex !== undefined) payload.sessions[editIndex] = newSession

    setFormData(payload)
    setHasEdited(true)
    setShowModal(false)
    setShowBreakModal(false)
  }

  const breakModal = (
    <Modal
      show={showBreakModal}
      setShow={setShowBreakModal}
      title={`${
        sessionModalData?.editIndex !== undefined ? 'Update' : 'Add'
      } Break`}
    >
      <TextInput
        required
        label="Title"
        placeholder="Break Session Name"
        value={sessionModalData?.title}
        onChange={(data) => {
          setSessionModalData({ ...sessionModalData, title: data })
        }}
      />
      <TextAreaInput
        className="mt-8"
        label="Description"
        placeholder="Write your description"
        value={sessionModalData?.description}
        onChange={(data) => {
          setSessionModalData({ ...sessionModalData, description: data })
        }}
      />
      <Box className="flex flex-col sm:flex-row justify-between sm:space-x-6">
        <DateTimeInput
          required
          className="flex-1"
          label="Start Date/Time"
          filterDate={(date) => {
            if (
              moment(sessionModalData?.startDateTime).isBefore(
                event?.startDateTime
              ) ||
              moment(sessionModalData?.endDateTime).isAfter(event?.endDateTime)
            )
              return true
            return (
              moment(date).isBetween(
                event?.startDateTime,
                event?.endDateTime,
                'day'
              ) ||
              moment(date).isSame(event?.startDateTime, 'day') ||
              moment(date).isSame(event?.endDateTime, 'day')
            )
          }}
          filterTime={(time) => {
            if (
              moment(sessionModalData?.startDateTime).isBefore(
                event?.startDateTime
              ) ||
              moment(sessionModalData?.endDateTime).isAfter(event?.endDateTime)
            )
              return true
            return (
              moment(time).isBetween(
                event?.startDateTime,
                event?.endDateTime,
                'minute'
              ) ||
              moment(time).isSame(event?.startDateTime, 'minute') ||
              moment(time).isSame(event?.endDateTime, 'minute')
            )
          }}
          value={sessionModalData?.startDateTime}
          onChange={(data) => {
            setSessionModalData({ ...sessionModalData, startDateTime: data })
          }}
        />
        <DateTimeInput
          required
          validations={{
            greaterThanDate: sessionModalData?.startDateTime,
          }}
          className="flex-1"
          label="End Date/Time"
          filterDate={(date) => {
            if (
              moment(sessionModalData?.startDateTime).isBefore(
                event?.startDateTime
              ) ||
              moment(sessionModalData?.endDateTime).isAfter(event?.endDateTime)
            )
              return true
            return (
              moment(date).isBetween(
                event?.startDateTime,
                event?.endDateTime,
                'day'
              ) ||
              moment(date).isSame(event?.startDateTime, 'day') ||
              moment(date).isSame(event?.endDateTime, 'day')
            )
          }}
          filterTime={(time) => {
            if (
              moment(sessionModalData?.startDateTime).isBefore(
                event?.startDateTime
              ) ||
              moment(sessionModalData?.endDateTime).isAfter(event?.endDateTime)
            )
              return true
            return (
              moment(time).isBetween(
                event?.startDateTime,
                event?.endDateTime,
                'minute'
              ) ||
              moment(time).isSame(event?.startDateTime, 'minute') ||
              moment(time).isSame(event?.endDateTime, 'minute')
            )
          }}
          value={sessionModalData?.endDateTime}
          onChange={(data) => {
            setSessionModalData({ ...sessionModalData, endDateTime: data })
          }}
        />
      </Box>
      <Button
        className="my-4"
        title={`${
          sessionModalData?.editIndex !== undefined ? 'Update' : 'Add'
        } Break`}
        type="primary"
        buttonType="button"
        onClick={handleSubmit}
      />
    </Modal>
  )
  const modal = (
    <Modal
      show={showModal}
      setShow={(visible) => {
        setShowModal(visible)
      }}
      title={`${
        sessionModalData?.editIndex !== undefined ? 'Update' : 'Create'
      } Session`}
    >
      <TextInput
        required
        label="Title"
        placeholder="Session Name"
        value={sessionModalData?.title}
        onChange={(data) => {
          setSessionModalData({ ...sessionModalData, title: data })
        }}
      />
      <Box className="mt-6">
        <ArrayTextInput
          label="Speakers"
          placeholder="Speaker Name"
          options={
            (speakers ?? []).map((s) => ({
              id: `${s?.name}::${s?.email ?? s?.organization}`,
              label: s?.name,
            })) ?? []
          }
          value={sessionModalData?.speakers}
          onChange={(data) => {
            setSessionModalData({ ...sessionModalData, speakers: data })
          }}
        />
      </Box>
      <TextAreaInput
        className="mt-6 mb-6"
        label="Description"
        placeholder="Write your description"
        value={sessionModalData?.description}
        onChange={(data) => {
          setSessionModalData({ ...sessionModalData, description: data })
        }}
      />
      <Box className="flex flex-col sm:flex-row justify-between sm:space-x-6 z-20">
        <DateTimeInput
          required
          className="flex-1"
          initialDate={new Date(moment(event?.startDateTime).toISOString())}
          label="Start Date/Time"
          filterDate={(rawDate) => {
            const date = moment(rawDate)
            const startTime = event?.startDateTime
            const endTime = event?.endDateTime
            const sessionEndTime = sessionModalData?.endDateTime

            if (!!startTime && date.isBefore(startTime, 'day')) return false
            if (!!endTime && date.isAfter(endTime, 'day')) return false
            if (!!sessionEndTime && date.isAfter(sessionEndTime, 'day'))
              return false
            return true
          }}
          filterTime={(rawTime) => {
            const time = moment(rawTime)
            const startTime = event?.startDateTime
            const endTime = event?.endDateTime
            const sessionEndTime = sessionModalData?.endDateTime

            if (!!startTime && time.isBefore(startTime, 'minute')) return false
            if (!!endTime && time.isAfter(endTime, 'minute')) return false
            if (!!sessionEndTime && time.isAfter(sessionEndTime, 'minute'))
              return false
            return true
          }}
          value={sessionModalData?.startDateTime}
          onChange={(data) => {
            setSessionModalData({ ...sessionModalData, startDateTime: data })
          }}
        />
        <DateTimeInput
          required
          validations={{
            greaterThanDate: sessionModalData?.startDateTime,
          }}
          className="flex-1"
          initialDate={
            new Date(moment(sessionModalData?.startDateTime).toISOString())
          }
          label="End Date/Time"
          filterDate={(rawDate) => {
            const date = moment(rawDate)
            const startTime = event?.startDateTime
            const endTime = event?.endDateTime
            const sessionStartTime = sessionModalData?.startDateTime

            if (!!startTime && date.isBefore(startTime, 'day')) return false
            if (!!endTime && date.isAfter(endTime, 'day')) return false
            if (!!sessionStartTime && date.isBefore(sessionStartTime, 'day'))
              return false
            return true
          }}
          filterTime={(rawTime) => {
            const time = moment(rawTime)
            const startTime = event?.startDateTime
            const endTime = event?.endDateTime
            const sessionStartTime = sessionModalData?.endDateTime

            if (!!startTime && time.isBefore(startTime, 'minute')) return false
            if (!!endTime && time.isAfter(endTime, 'minute')) return false
            if (!!sessionStartTime && time.isBefore(sessionStartTime, 'minute'))
              return false
            return true
          }}
          value={sessionModalData?.endDateTime}
          onChange={(data) => {
            setSessionModalData({ ...sessionModalData, endDateTime: data })
          }}
        />
      </Box>
      <DropdownInput
        label="Stage"
        options={stages?.map((s) => s.title) ?? []}
        required={!isInPerson}
        placeholder="Select a stage"
        className={`${isInPerson ? 'hidden' : ''}`}
        value={sessionModalData?.stage}
        onChange={(data) => {
          setSessionModalData({ ...sessionModalData, stage: data })
        }}
      />
      <Button
        className="my-4"
        title={`${
          sessionModalData?.editIndex !== undefined ? 'Update' : 'Create'
        } session`}
        type="primary"
        buttonType="button"
        onClick={() => {
          setSessionModalData({ ...sessionModalData, isBreak: false })
          handleSubmit()
        }}
      />
    </Modal>
  )

  return (
    <>
      {modal}
      {breakModal}
      <Box className="w-full">
        <Box className="mt-6 mb-4 flex">
          <Button
            onClick={() => {
              setSessionModalData(undefined)
              setShowModal(true)
            }}
            title="Add Session"
            type="secondary"
            size="small"
          />
          <Button
            onClick={() => {
              setSessionModalData({ isBreak: true })
              setShowBreakModal(true)
            }}
            title="Add Break"
            type="secondary"
            size="small"
            className="ml-2"
          />
        </Box>

        <Table
          tableHeading={[
            'Name',
            'Start Time',
            'End Time',
            ...(isInPerson ? [] : ['Stage']),
            'Speakers',
            '',
          ]}
          rows={sessions
            ?.sort((a, b) => {
              if (!a.startDateTime || !b.startDateTime) return 0

              const aStart = moment(a.startDateTime)
              const bStart = moment(b.startDateTime)

              if (aStart.isAfter(bStart)) return 1
              if (bStart.isAfter(aStart)) return -1

              return 0
            })
            .map((session, index) => [
              session?.title,
              moment(session?.startDateTime).format('MMM DD, h:mmA'),
              moment(session?.endDateTime).format('MMM DD, h:mmA'),
              !session?.isBreak ? session?.stage?.title! : 'Break',
              <Box className="flex -space-x-5 flex-wrap" key={index}>
                {session?.speakers?.map((s) => {
                  return (
                    <ProfileImage
                      key={s?.email ?? v4()}
                      imageUrl={s?.profileImage ?? null}
                    />
                  )
                })}
              </Box>,
              <TableRowActions
                key={index}
                confirmModal={{
                  title: 'Are you sure?',
                  content:
                    'Are you sure you want to delete this? This cannot be undone.',
                }}
                editClicked={() => {
                  setSessionModalData({
                    title: session?.title,
                    description: session?.description,
                    startDateTime: session?.startDateTime,
                    endDateTime: session?.endDateTime,
                    stage: session?.stage?.title,
                    speakers: session?.speakers?.map((s) => ({
                      key: s?.name,
                      value: s?.email,
                    })),
                    editIndex: index,
                    isBreak: session?.isBreak,
                  })
                  if (session?.isBreak) setShowBreakModal(true)
                  if (!session?.isBreak) setShowModal(true)
                }}
                deleteClicked={() => {
                  setHasEdited(true)
                  setFormData({
                    ...formData,
                    sessions: sessions.filter((t) => t.title !== session.title),
                  })
                }}
              />,
            ])}
        />
        {noData && (
          <Box>
            <Box className="text-sm mt-8 text-center">
              {'No sessions have been created'}
            </Box>
            <hr className="my-6 border-gray-600 opacity-50" />
          </Box>
        )}
      </Box>
    </>
  )
}

SessionsForm.Layout = CreateEventLayout

export default SessionsForm
