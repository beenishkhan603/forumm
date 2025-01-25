import moment from 'moment'
import Link from 'next/link'
import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { Form } from '@components/inputs/Form'
import CopyIcon from '@public/images/CopyIcon.svg'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { TextInput } from '@components/inputs/TextInput'
import { ToggleInput } from '@components/inputs/ToggleInput'
import Modal from '@components/base/Modal'
import { EventAttendee } from '@graphql/__generated/graphql'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import { useAuth } from '@libs/useAuth'
import React, { useContext, useState, useEffect } from 'react'
import Table from '@components/base/Table'
import TableRowActions from '@components/event/TableRowActions'
import { FileInput } from '@components/inputs/FileInput'
import { usePapaParse } from 'react-papaparse'
import useFileUploader from '@libs/useFileUploader'
import useAutosave from '@libs/useAutosave'
import { useTheme } from '@libs/useTheme'
import LoadingSpinner from '@components/base/LoadingSpinner'

const environment = process.env.ENVIRONMENT_NAME ?? 'dev'
const isDev = environment === 'dev'

const AttendeesForm = ({ updateInProgress }: { updateInProgress: boolean }) => {
  const { theme } = useTheme()
  const { formData, setFormData } = useContext(CreateEventContext)
  const [showModal, setShowModal] = useState(false)
  const [copiedStatus, setCopiedStatus] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [attendeesModalData, setAttendeesModalData] = useState<
    Partial<EventAttendee & { editIndex?: number }> | undefined
  >(undefined)
  const [notifyOrganiser, setNotifyOrganiser] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setHasEdited } = useAutosave()
  const { profile } = useAuth()
  const {
    attendees,
    tickets,
    notifyOrganiser: initialNotifyOrganizer,
  } = formData ?? {}
  const noData = attendees == undefined || attendees?.length === 0

  const endDateTime = formData?.event?.endDateTime
  const registrationCloseDateTime = formData?.event?.registrationCloseDateTime
  const isRegistrationClosed =
    (endDateTime && moment().isAfter(endDateTime)) ||
    (registrationCloseDateTime && moment().isAfter(registrationCloseDateTime))
  const hasTickets = tickets && tickets.length > 0

  useEffect(() => {
    if (
      initialNotifyOrganizer !== undefined &&
      initialNotifyOrganizer !== null
    ) {
      setNotifyOrganiser(initialNotifyOrganizer)
    }
  }, [initialNotifyOrganizer])

  useEffect(() => {
    if (!updateInProgress) {
      setIsLoading(false)
    }
  }, [updateInProgress])

  const { readRemoteFile } = usePapaParse()
  const uploadFile = useFileUploader()

  const modal = (
    <Modal
      show={showModal}
      setShow={setShowModal}
      title={`${
        attendeesModalData?.editIndex !== undefined ? 'Update' : 'Add'
      } Attendee`}
    >
      <TextInput
        required
        label="Name"
        placeholder="Joe Bloggs"
        value={attendeesModalData?.name}
        onChange={(data) => {
          setAttendeesModalData({ ...attendeesModalData, name: data })
        }}
      />
      <TextInput
        required
        label="Email"
        placeholder="joebloggs@mail.com"
        value={attendeesModalData?.email}
        onChange={(data) => {
          setAttendeesModalData({ ...attendeesModalData, email: data })
        }}
      />
      <DropdownInput
        label="Ticket"
        options={tickets?.map((t) => t.title) ?? []}
        required
        placeholder="Select a ticket"
        value={attendeesModalData?.ticketTitle}
        onChange={(data) => {
          setAttendeesModalData({ ...attendeesModalData, ticketTitle: data })
        }}
      />

      <Button
        className="my-4"
        title={`${
          attendeesModalData?.editIndex !== undefined ? 'Update' : 'Add'
        } Attendee`}
        type="primary"
        onClick={() => {
          const { name, email, ticketTitle, editIndex } =
            attendeesModalData ?? {}
          if (email === profile?.email) {
            return `Oops! You are already an attendee by default.`
          }

          let payload = {
            ...formData,
            attendees: [...(attendees ?? [])],
            notifyOrganiser: notifyOrganiser,
          }
          const newAttendee = {
            name: name ?? '',
            email: email ?? '',
            ticketTitle: ticketTitle ?? '',
            profileImage:
              'https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=',
          }

          if (!payload.attendees) payload.attendees = []

          if (editIndex === 0 || editIndex)
            payload.attendees[editIndex] = newAttendee
          else payload.attendees.push(newAttendee)

          setFormData(payload)
          setHasEdited(true)
          setShowModal(false)
        }}
      />
    </Modal>
  )

  const importCSVModal = (
    <Modal
      show={showImportModal}
      setShow={setShowImportModal}
      title="Import Attendees from CSV"
    >
      <a
        href="https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/sample_attendees.csv"
        className="text-link hover:underline pointer"
        download
      >
        Download Sample CSV
      </a>
      <Form
        clearFormOnSubmit={true}
        onSubmit={async (data) => {
          const { csvUpload, ticket } = data
          readRemoteFile(csvUpload, {
            download: true,
            complete: (res) => {
              const newAttendees: any[] = []
              const emailHeaderIndex = (res.data[0] as string[]).findIndex(
                (h: string) => {
                  return (h as string).toLowerCase() === 'email'
                }
              )
              const nameHeaderIndex = (res.data[0] as string[]).findIndex(
                (h: string) => {
                  return (h as string).toLowerCase() === 'name'
                }
              )
              if (emailHeaderIndex !== -1)
                res.data.forEach((newA: any) => {
                  if (!newA[emailHeaderIndex]) return
                  const emailRef = newA[emailHeaderIndex].toLowerCase()
                  const nameRef = newA[nameHeaderIndex] ?? 'No name on file'
                  if (attendees?.find((a) => a.email === emailRef)) return
                  if (
                    emailRef === profile?.email?.toLowerCase() ||
                    emailRef === 'email'
                  )
                    return
                  newAttendees.push({
                    name: nameRef,
                    email: emailRef,
                    ticketTitle: ticket,
                    profileImage:
                      'https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=',
                  })
                })
              setFormData({
                ...formData,
                attendees: [...(attendees ?? []), ...(newAttendees ?? [])],
              })
              setHasEdited(true)
              setShowImportModal(false)
            },
          })
        }}
      >
        <FileInput
          uploadFile={uploadFile}
          className="mt-1"
          label="CSV Upload"
          hint="Max upload: (200MB)."
          type="csv"
        />

        <DropdownInput
          label="Ticket"
          options={tickets?.map((t) => t.title) ?? []}
          required
          placeholder="Select a ticket"
          onChange={() => {}}
        />

        <Button
          className="my-4"
          title={`Import Attendees`}
          type="primary"
          buttonType="submit"
        />
      </Form>
    </Modal>
  )

  return (
    <>
      {modal}
      {importCSVModal}
      <Box className="w-full relative">
        <Box className="text-sm mt-6 ">
          Use this section to manually add attendees. They’ll then directly
          receive an email inviting them to sign up and access your event.
          <br />
          Once your event is created you’ll also be able to share an invite link
          that’ll redirect attendees to the event portal page
        </Box>
        {!hasTickets && (
          <p className="text-red-500 text-sm">
            <AiOutlineInfoCircle className="w-4 h-4 float-left mr-2" />
            Please create at least one ticket type before adding attendees to
            your event.
          </p>
        )}
        {isRegistrationClosed && (
          <p className="text-red-500 text-xs">
            <AiOutlineInfoCircle className="w-4 h-4 float-left mr-2" />
            Event registration is closed, and you can’t add any more attendees
            at this time. If you’d like to include more attendees, please update
            your event dates.
          </p>
        )}
        <Box className="mt-6 mb-4 flex">
          <Button
            onClick={() => {
              setShowModal(true)
              setAttendeesModalData(undefined)
            }}
            title="Add Attendee"
            type="secondary"
            size="small"
            className="mr-2"
            disabled={!!isRegistrationClosed || !hasTickets}
          />
          <Button
            onClick={() => {
              setShowImportModal(true)
              setAttendeesModalData(undefined)
            }}
            title="Import Attendees"
            type="secondary"
            size="small"
            className="mr-1"
            disabled={!!isRegistrationClosed || !hasTickets}
          />
          <Box>&nbsp;</Box>
          <Button
            onClick={(e) => {
              navigator.clipboard.writeText(
                `https://${isDev && 'qa.'}forumm.to/event/${formData?.eventId}`
              )
              setCopiedStatus(true)
              e.preventDefault()
            }}
            title={copiedStatus ? 'URL Copied' : 'Copy URL'}
            type="secondary"
            size="small"
          />
        </Box>
        <Table
          tableHeading={['Name', 'Email', 'Ticket', '']}
          rows={attendees?.map((attendee, index) => [
            attendee.name ?? 'Unknown',
            attendee.email,
            attendee.ticketTitle,
            <TableRowActions
              disabled={isLoading}
              key={index}
              confirmModal={{
                title: 'Are you sure?',
                content:
                  'Are you sure you want to delete this? This cannot be undone.',
              }}
              editClicked={() => {
                setAttendeesModalData({
                  name: attendee.name ?? 'No name on file',
                  email: attendee.email,
                  ticketTitle: attendee.ticketTitle,
                  editIndex: index,
                })
                setShowModal(true)
              }}
              deleteClicked={() => {
                setHasEdited(true)
                setIsLoading(true)
                setFormData({
                  ...formData,
                  attendees: attendees.filter(
                    (t) => t.email !== attendee.email
                  ),
                })
              }}
            />,
          ])}
        />

        {noData && (
          <Box>
            <Box className="text-sm mt-8 text-center">
              {'No attendees have been added'}
            </Box>
            <hr className="my-6 border-gray-600 opacity-50" />
          </Box>
        )}
      </Box>

      <Box className="w-full mt-6">
        <ToggleInput
          value={notifyOrganiser ? 'Enabled' : 'Disabled'}
          className="my-2 text-sm"
          options={['Enabled', 'Disabled']}
          callback={(val) => {
            setNotifyOrganiser(val == 'Enabled')
          }}
          label="Enable this option to receive an email notification each time an attendee registers for your event, allowing you to stay updated on new registrations."
          selected={notifyOrganiser ? 0 : 1}
        />
      </Box>
    </>
  )
}

AttendeesForm.Layout = CreateEventLayout

export default AttendeesForm
