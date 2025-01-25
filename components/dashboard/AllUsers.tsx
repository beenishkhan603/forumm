import React from 'react'
import { useState } from 'react'
import Box from '@components/base/Box'
import { useRouter } from 'next/router'
import ProfileImage from '@components/base/ProfileImage'
import { useDashboard } from '@libs/useDashboard'
import Modal from '@components/base/Modal'
import moment from 'moment'
import { Button } from '@components/inputs/Button'
import { useTheme } from '@libs/useTheme'
import { FaFileCsv } from 'react-icons/fa'
import { stringify } from 'csv-stringify'
import { saveAs } from 'file-saver'
import { Event } from '@graphql/__generated/graphql'

type RegistrationField = { [key: string]: string }

const mapRegistrationFields = (
  fields: {
    [key: string]: RegistrationField
  },
  event: Event
): RegistrationField | undefined => {
  if (!fields || !event) return undefined
  const payload: RegistrationField = {}
  const orgKeys = Object.keys(fields)
  const fieldKeys: { [key: string]: string } = {}

  orgKeys.forEach((key: string) => {
    Object.keys(fields[key]).forEach((fkey: string) => {
      fieldKeys[fkey] = fields[key][fkey]
    })
  })

  for (let k in fieldKeys) {
    if (event.registrationFields?.find((f) => f.name === k))
      payload[k] = fieldKeys[k]
  }

  return payload
}

const prepareForCSV = (answersJSON: RegistrationField) => {
  const payload = []
  for (let a in answersJSON) {
    if (a && answersJSON[a]) payload.push(`${a}: "${answersJSON[a]}"`)
  }
  return payload.join(', ')
}

export default function AllUsers({
  selectedOption,
  group,
}: {
  group?: 'organizer'
  selectedOption: string | undefined
}): JSX.Element {
  const { theme } = useTheme()
  const { query } = useRouter()
  const { eventsData, events, eventsByMonth, eventsByYear, users } =
    useDashboard()
  let filteredAttendees

  if (selectedOption === 'All Time Information') {
    filteredAttendees = events
  }
  if (selectedOption === 'Current Year') {
    filteredAttendees = eventsByYear
  }
  if (selectedOption === 'Current Month') {
    filteredAttendees = eventsByMonth
  }

  const allAttendees = filteredAttendees
    ?.filter((e) => e.attendees !== (undefined || null))
    .filter((e) =>
      query.eventId !== undefined ? query.eventId === e.eventId : true
    )
    .flatMap((e) => {
      return e.attendees?.map((t) => ({
        email: t?.email!,
        name: t?.name!,
        title: e.event?.title!,
        profileImage: users?.find((u) => u.email === t?.email)?.profileImage!,
        ticketTitle: t?.ticketTitle!,
        userId: users?.find((u) => u.email === t?.email)?.email!,
        isActive: users?.find((u) => u.email === t?.email)?.isActive!,
        lastActive: users?.find((u) => u.email === t?.email)?.lastActive!,
        questions: e?.registrationFields?.map((r) => r.name).join(', '),
        answers: mapRegistrationFields(
          users?.find((u) => u.email === t?.email)?.registrationFields,
          e as Event
        ),
        user: users?.find((u) => u.email === t?.email),
      }))
    })


  const [showModal, setShowModal] = useState(false)
  const [selectedAttendee, setSelectedAttendee] = useState<any>(null)

  const downloadCSV = () => {
    const rows =
      allAttendees?.map((a) => ({
        Name: a?.name,
        Email: a?.email,
        Event: a?.title,
        Ticket: a?.ticketTitle,
        QA: a?.answers ? prepareForCSV(a?.answers) : '',
      })) ?? []

    const header = ['Name', 'Email', 'Event', 'Ticket', 'QA']

    stringify(rows, { header: true, columns: header }, (err, csvString) => {
      if (err) {
        console.error(err)
        return
      }
      // Save the CSV file to the user's computer
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' })
      saveAs(blob, 'registration-data.csv')
    })
  }

  const modal = (
    <Modal
      title="Registered Attendee Information"
      show={showModal}
      setShow={setShowModal}
    >
      <Box className="flex flex-col mx-10 text-sm font-light">
        <Box className="flex flex-col items-center">
          <Box className="flex">
            <ProfileImage
              className="rounded-full border border-white border-opacity-50"
              size="lg"
              imageUrl={selectedAttendee?.profileImage}
            />
          </Box>
          <Box className="py-2 flex font-bold text-2xl">
            {selectedAttendee?.name}
          </Box>
        </Box>

        <Box className="py-2 flex ">
          <Box className="font-bold mr-2"> Last Active:</Box>
          {selectedAttendee?.lastActive === undefined
            ? 'Unknown'
            : moment(selectedAttendee?.lastActive).fromNow()}
        </Box>
        <Box className="py-2 flex">
          <Box className="font-bold mr-2">Email:</Box>
          {selectedAttendee?.email}
        </Box>
        <Box className=" py-2 flex">
          <Box className="font-bold mr-2">Event:</Box>
          {selectedAttendee?.title}
        </Box>
        <Box className="py-2 flex">
          <Box className="font-bold mr-2">Ticket:</Box>
          {selectedAttendee?.ticketType}
        </Box>
        <Box className=" py-2 flex">
          <Box className="font-bold mr-2">Questions:</Box>
          {selectedAttendee?.question}
        </Box>
        <Box className=" py-2 flex">
          <Box className="font-bold mr-2">Answer:</Box>
          {selectedAttendee?.answer?.[selectedAttendee?.question] ??
            'No answer given.'}
        </Box>
        <Button
          className="mt-4"
          title="View Profile"
          href={`/user/${selectedAttendee?.userId}`}
        ></Button>
      </Box>
    </Modal>
  )

  return (
    <Box
      color="foregroundColour"
      className="px-6 py-4 h-96 overflow-y-scroll  "
    >
      <Box
        className="text-md py-4 font-bold flex justify-between"
        style={{ color: theme.textColour }}
      >
        Registered Attendees
        <FaFileCsv
          className="cursor-pointer text-2xl"
          title="Download CSV"
          onClick={downloadCSV}
        />
      </Box>

      {modal}
      {allAttendees?.length === 0 ? (
        <Box style={{ color: theme.textColour }}>No Users Registered</Box>
      ) : (
        allAttendees?.map((s: any) => (
          <Box
            onClick={() => {
              setShowModal(true)
              setSelectedAttendee({
                email: s?.email,
                userId: s?.userId,
                name: s?.name,
                title: s?.title,
                ticketType: s?.ticketTitle,
                profileImage: s?.profileImage,
                isActive: s?.isActive,
                lastActive: s?.lastActive,
                question: s?.question,
                answer: s?.answer,
              })
            }}
            key={s?.userId}
            className="grid grid-cols-5 gap-4 items-center p-2 cursor-pointer hover:border hover:scale-100 transition duration-300 ease-in-out"
          >
            <Box className="flex">
              <ProfileImage
                imageUrl={s?.profileImage}
                activityStatus={s?.isAnonymous === 'true' ? false : s?.isActive}
                className="flex-shrink"
              />
            </Box>

            <Box
              className="text-sm col-span-2"
              style={{ color: theme.textColour }}
            >
              {s?.name ?? 'No name on file.'}
            </Box>
            <Box className="text-sm col-span-2 text-left flex ">
              Event: {s?.title ?? 'No Event on file.'}
            </Box>
          </Box>
        ))
      )}
    </Box>
  )
}
