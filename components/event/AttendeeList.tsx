import { useEffect, useState, useCallback } from 'react'
import moment from 'moment'
import ReactMarkdown from 'react-markdown'
import { useMutation, QueryResult } from '@apollo/client'
// import ProfileImage from '@components/base/ProfileImage'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { EventAttendee } from '@graphql/__generated/graphql'
import { Button } from '@components/inputs/Button'
import { TextInput } from '@components/inputs/TextInput'
// import { IoDownloadOutline } from 'react-icons/io5'
import { SEND_ATTENDEE_EMAILS_FOR_EVENT } from '@graphql/events/sendAttendeeEmailsForEvent'
import { motion } from 'framer-motion'
import React from 'react'
import { convertAttendeesToCSV } from '../../libs/Utility/csv'
import Box from '../base/Box'
import AttendeeModal from './AttendeeModal'
import NotFoundModal from './NotFoundModal'
import QRScanner from '../base/QRScanner'
import { debounce, truncateString } from '@libs/Utility/util'
import { useTheme } from '@libs/useTheme'
import useWindowSize from '@libs/useWindowSize'

// type RefetchType = QueryResult['refetch']

type EventAttendeeWithRender = EventAttendee & {
  resentMessage?: string
}

export const AttendeeList = ({
  eventId,
  attendees,
  isPublished,
  refetchEvent,
  registrationFields,
  userRegistrationFields,
}: {
  eventId: string
  attendees: EventAttendeeWithRender[]
  isPublished: boolean | null | undefined
  registrationFields: {}[]
  userRegistrationFields: {}[]
  refetchEvent: () => void
}) => {
  const { theme } = useTheme()
  const [search, setSearch] = useState<string>('')
  const [nameSortAsc, setNameSortAsc] = useState<boolean>(true)
  const [emailSortAsc, setEmailSortAsc] = useState<boolean>(true)
  const [allAttendees, setAllAttendees] =
    useState<EventAttendeeWithRender[]>(attendees)
  const [filteredAttendees, setFilteredAttendees] =
    useState<EventAttendeeWithRender[]>(attendees)
  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedAttendee, setSelectedAttendee] = useState<
    EventAttendeeWithRender | undefined
  >()
  const [ticketCode, setTicketCode] = useState<string>('')
  const [showNotFoundModal, setShowNotFoundModal] = useState<boolean>(false)
  const [openedQr, setOpenedQr] = useState<boolean>(false)
  const [smallView, setSmallView] = useState<boolean>(false)

  const [sendAttendeeEmailsForEvent] = useMutation(
    SEND_ATTENDEE_EMAILS_FOR_EVENT
  )
  const { width } = useWindowSize()

  useEffect(() => {
    setFilteredAttendees(attendees)
    setAllAttendees(attendees)
    setSearch('')
    if (selectedAttendee) {
      const updatedSelectedAttendee = attendees.find(
        (attendee) => attendee.email === selectedAttendee.email
      )
      if (updatedSelectedAttendee) {
        setSelectedAttendee(updatedSelectedAttendee)
      }
    }
  }, [attendees, selectedAttendee])

  const debouncedUpdateSize = useCallback(
    debounce((data: number) => {
      setSmallView((data ?? 0) < 700)
    }, 100),
    []
  )

  useEffect(() => {
    debouncedUpdateSize(width)
  }, [width])

  const handleTicketCode = useCallback(
    (text: string) => {
      setTicketCode(text)
      setOpenedQr(true)
      const matchingAttendee = attendees.filter(
        ({ ticketCode }) => ticketCode === text
      )?.[0]
      if (matchingAttendee) {
        handlePressAttendee(matchingAttendee)
      } else {
        setShowNotFoundModal(true)
      }
    },
    [attendees]
  )

  useEffect(() => {
    if (openedQr) return
    if (attendees && attendees.length > 0) {
      const params = new URLSearchParams(window.location.search)
      const ticketCodeParam = params.get('ticketCode')
      if (ticketCodeParam) {
        handleTicketCode(ticketCodeParam)
      }
    }
  }, [openedQr, attendees, handleTicketCode])

  const handleOnQrRead = (text: string) => {
    try {
      const url = new URL(text)
      const params = new URLSearchParams(url.search)
      const code = params.get('ticketCode')
      if (code) {
        if (!text.includes(eventId)) {
          window.location.href = text
          return
        }
        handleTicketCode(code)
      } else {
        handleTicketCode('')
      }
    } catch (error) {
      handleTicketCode('')
      console.error('Invalid URL:', error)
      return null
    }
  }

  const filterAttendees = (searchText: string) => {
    const lowercasedSearchText = searchText.toLowerCase()
    return allAttendees.filter(
      (attendee) =>
        attendee?.name?.toLowerCase().includes(lowercasedSearchText) ||
        attendee.email.toLowerCase().includes(lowercasedSearchText)
    )
  }

  const handleSearch = (text: string) => {
    setSearch(text)
    setFilteredAttendees(filterAttendees(text))
  }

  const sortAttendees = (
    attendees: EventAttendeeWithRender[],
    field: keyof EventAttendeeWithRender,
    asc: boolean
  ) => {
    return attendees.sort((a, b) => {
      if (asc) {
        return String(a[field]).localeCompare(String(b[field]))
      }
      return String(b[field]).localeCompare(String(a[field]))
    })
  }

  const handleSortName = () => {
    setNameSortAsc(!nameSortAsc)
    setFilteredAttendees(
      sortAttendees([...filteredAttendees], 'name', !nameSortAsc)
    )
  }

  const handleSortEmail = () => {
    setEmailSortAsc(!emailSortAsc)
    setFilteredAttendees(
      sortAttendees([...filteredAttendees], 'email', !emailSortAsc)
    )
  }

  const sendInvitations = async (attendees: string[]) => {
    setLoading(true)
    await sendAttendeeEmailsForEvent({
      variables: {
        emails: attendees,
        eventId: eventId,
      },
    })
    const updatedAttendees = [...allAttendees].map((attendee) =>
      attendees.includes(attendee.email)
        ? { ...attendee, resentMessage: 'Email Resent' }
        : attendee
    )
    setAllAttendees(updatedAttendees)
    setFilteredAttendees(updatedAttendees)
    setSearch('')
    setLoading(false)
  }

  const handleResend = (attendee: EventAttendeeWithRender) => {
    sendInvitations([attendee.email])
  }

  const handleResendAll = () => {
    const pendingAttendess = allAttendees
      .filter((attendee) => !attendee.resentMessage && !attendee.registered)
      .map((attendee) => attendee.email)
    sendInvitations(pendingAttendess)
  }

  const formatDate = (date: string) => {
    if (!date) return ''
    return moment(date).format('MMM DD, H:mmA')
  }

  const getStatusMessage = (attendee: EventAttendeeWithRender) => {
    if (attendee?.resentMessage) {
      return attendee.resentMessage
    }
    if (isPublished) {
      if (attendee.registered) {
        return 'Registered'
      }
      const dateMessage = attendee?.invitationSentDatetime
        ? formatDate(attendee?.invitationSentDatetime)
        : null
      if (dateMessage) {
        return (
          <>
            Sent <br />
            {dateMessage}
          </>
        )
      }
      return 'Sent'
    }
    return 'Not sent yet'
  }

  const handlePressAttendee = (attendee: EventAttendeeWithRender) => {
    setSelectedAttendee(attendee)
    setShowModal(true)
  }

  const pendingAttendees = attendees.filter((attendee) => !attendee.registered)

  if (!attendees || attendees.length === 0) {
    return (
      <Box className="px-8">
        <ReactMarkdown>
          No attendees have been added for this event yet. Check back soon!
        </ReactMarkdown>
      </Box>
    )
  }

  const numberOfAttendees = attendees?.length ?? 0
  const markedAsPresent = attendees.filter(
    ({ checkInStatus }) => checkInStatus == 'present'
  ).length
  const markedAsAbsent = attendees.filter(
    ({ checkInStatus }) => checkInStatus == 'absent'
  ).length

  const downloadCSV = () => {
    const csv = convertAttendeesToCSV(attendees)
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'attendees.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <TextInput
        value={search}
        className="w-full"
        label=""
        placeholder="Enter your search terms"
        onChange={handleSearch}
      />
      {pendingAttendees.length > 0 && (
        <Box className="mt-3 flex items-center space-x-2">
          <a
            className="text-link hover:underline cursor-pointer"
            onClick={handleResendAll}
          >
            Resend pending invites
          </a>
          {loading && <LoadingSpinner className="mt-1" size="small" />}
        </Box>
      )}
      <Box className="w-full pt-5 text-xs sm:text-sm ">
        <Box
          color="backgroundColourSecondary"
          className="grid grid-cols-3 my-3"
        >
          <Box
            color="backgroundColourSecondary"
            className="p-3 border-l-8 border-l-blue-500 text-left"
          >
            <span className="">Total Invitees: </span>
            <span className="">{numberOfAttendees}</span>
          </Box>
          <Box className="p-3 text-left">
            <span className="">Marked as Present: </span>
            <span className="text-green-500">{markedAsPresent}</span>
          </Box>
          <Box className="p-3 border-r-8 text-left">
            <span className="">Marked as Absent: </span>
            <span className="text-red-500">{markedAsAbsent}</span>
          </Box>
        </Box>
      </Box>
      <Box
        color="backgroundColourSecondary"
        className={`grid md:col-span-5 md:grid-cols-5 col-span-4 grid-cols-4 border-collapse text-[9px] sm:text-sm `}
      >
        <Box
          className="p-2 md:p-7 border border-forumm-menu-border cursor-pointer"
          onClick={handleSortName}
        >
          Full Name {nameSortAsc ? '↓' : '↑'}
        </Box>
        <Box
          className="p-2 md:p-7 border border-forumm-menu-border cursor-pointer"
          onClick={handleSortEmail}
        >
          Email {emailSortAsc ? '↓' : '↑'}
        </Box>
        <Box className="p-2 md:p-7 border border-forumm-menu-border">
          Check-in Status
        </Box>
        <Box className="p-2 md:p-7 border border-forumm-menu-border hidden md:block">
          Reminder
        </Box>
        <Box className="p-2 md:p-7 border border-forumm-menu-border">
          View More Info
        </Box>
        {filteredAttendees.map((attendee, i) => (
          <motion.div
            className={`grid md:col-span-5 md:grid-cols-5 col-span-4 grid-cols-4 border-forumm-menu-border border-2 -mt-1`}
            style={{ background: theme.backgroundColourSecondary }}
            whileHover={{ scale: 1.02 }}
            key={i}
          >
            <Box
              className="p-2 md:p-7 mt-2 cursor-pointer text-[9px] sm:text-sm"
              onClick={() => handlePressAttendee(attendee)}
            >
              {attendee?.name}
            </Box>
            <Box
              className="p-2 md:p-7 text-[9px] sm:text-sm mt-2 cursor-pointer overflow-auto word-wrap"
              onClick={() => handlePressAttendee(attendee)}
            >
              {attendee?.email}
            </Box>
            <Box className="p-2 md:p-7 text-[9px] sm:text-sm mt-2 capitalize">
              {attendee?.checkInStatus || 'No activity'}
            </Box>
            <Box className="p-2 md:p-7 text-[9px] sm:text-sm mt-2 hidden md:block">
              {!attendee.registered && !attendee.resentMessage && (
                <Button
                  title="Resend"
                  type="modal"
                  size="small"
                  onClick={() => handleResend(attendee)}
                />
              )}
              {attendee.registered && 'Registered'}
              {!attendee.registered &&
                attendee.resentMessage &&
                'Invitation Resent!'}
            </Box>
            <Box
              className="p-2 md:p-7 mt-2 cursor-pointer"
              onClick={() => handlePressAttendee(attendee)}
            >
              <Button
                title="i"
                size="auto"
                className={`text-white text-[9px] sm:text-sm p-0`}
                onClick={() => handlePressAttendee(attendee)}
              />
            </Box>
          </motion.div>
        ))}
      </Box>
      <Box className="w-full flex items-center justify-between pt-8">
        <Box className="text-center pl-3 md:pl-0">
          <Button
            title="Export CSV"
            size="auto"
            // TODO: this should be visible, review it after.
            // icon={<IoDownloadOutline size="1.5em" />}
            onClick={downloadCSV}
            className="ml-2 text-white whitespace-nowrap"
          />
        </Box>
        <QRScanner onRead={handleOnQrRead} />
      </Box>
      <AttendeeModal
        key={selectedAttendee?.email}
        eventId={eventId}
        show={showModal}
        setShow={setShowModal}
        attendee={selectedAttendee}
        registrationFields={registrationFields}
        userRegistrationFields={userRegistrationFields}
        refetchEvent={() => {
          setShowModal(false)
          refetchEvent()
        }}
      />
      <NotFoundModal
        key={ticketCode}
        ticketCode={ticketCode}
        show={showNotFoundModal}
        setShow={setShowNotFoundModal}
      />
    </>
  )
}
