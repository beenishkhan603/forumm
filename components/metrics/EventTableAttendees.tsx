import { useState, useMemo } from 'react'
import moment from 'moment'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { TextInput } from '@components/inputs/TextInput'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { useTheme } from '@libs/useTheme'
import type {
  Event,
  EventAttendee,
  EventOverviewFragment,
} from '@graphql/__generated/graphql'
import AttendeeModal from '@components/metrics/AttendeeModal'

const statusOptions = ['All', 'Present', 'Absent', 'Registered', 'Pending']

const EventTableAttendees = ({
  events,
  fundraises,
  showEventColumn,
}: {
  events: Event[]
  fundraises: EventOverviewFragment[]
  showEventColumn: boolean
}) => {
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  const [filter, setFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedAttendee, setSelectedAttendee] = useState<
    EventAttendee | undefined
  >()

  const allTransactions = (fundraises || []).flatMap((row: any) =>
    (row?.fundraising?.transactions || []).map((transaction: any) => ({
      ...transaction,
      program: row?.fundraising?.title || row?.event?.title || '-',
      eventId: row?.eventId,
      eventTitle: row?.event?.title,
      fundraiseTitle: row?.fundraising?.title,
    }))
  )
  const attendeesWithEventTitles = (events || []).flatMap((event) =>
    (event?.attendees || []).map((attendee: EventAttendee) => ({
      ...attendee,
      eventTitle: event?.event?.title ?? '',
      ticketPrice:
        (event?.availableTickets?.tickets || []).filter(
          (tk) => tk.ticketTitle === attendee.ticketTitle
        )?.[0]?.price ?? '0',
      ticketQuantity:
        (event?.availableTickets?.tickets || []).filter(
          (tk) => tk.ticketTitle === attendee.ticketTitle
        )?.[0]?.totalQuantity ?? '0',
    }))
  )

  const getStatus = (attendee: EventAttendee) => {
    if (attendee.checkInStatus) {
      return attendee.checkInStatus
    }
    if (attendee.registered && !attendee.checkInStatus) {
      return 'Registered'
    }
    return 'Pending'
  }

  const getFiltered = (
    attendees: typeof attendeesWithEventTitles,
    filter: string,
    status: string
  ) => {
    const lowercasedSearchText = filter.toLowerCase()
    const filteredByText = attendees.filter(
      (attendee) =>
        attendee?.name?.toLowerCase().includes(lowercasedSearchText) ||
        attendee?.email.toLowerCase().includes(lowercasedSearchText)
    )

    const filteredByStatus = filteredByText.filter((attendee) => {
      const attendeeStatus = getStatus(attendee)
      if (status === 'All') return true
      if (status === 'Present' && attendeeStatus === 'present') return true
      if (status === 'Absent' && attendeeStatus !== 'present') return true
      if (status === 'Registered' && attendeeStatus === 'Registered')
        return true
      if (status === 'Pending' && attendeeStatus === 'Pending') return true
      return false
    })

    return filteredByStatus
  }

  const filteredData = useMemo(() => {
    const result = getFiltered(
      [...attendeesWithEventTitles],
      filter,
      statusFilter
    )
    return result.sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
  }, [attendeesWithEventTitles, filter, statusFilter])

  const getDonationAmount = (attendee: EventAttendee) => {
    const first = (attendee?.name?.split(' ')?.[0] ?? '').toLowerCase()
    const last = (attendee?.name?.split(' ')?.[1] ?? '').toLowerCase()
    const donation = (allTransactions || []).filter((trx) => {
      return (
        // @ts-ignore
        (trx?.eventTitle === attendee?.eventTitle ||
          // @ts-ignore
          trx?.fundraiseTitle === attendee?.eventTitle) &&
        trx?.firstName.toLowerCase() === first &&
        trx?.lastName.toLowerCase() === last
      )
    })

    if (donation && donation.length > 0)
      return `£${(donation[0]?.amount ?? 100) / 100}`
    return `£0`
  }

  const handlePressAttendee = (attendee: EventAttendee) => {
    setSelectedAttendee(attendee)
    setShowModal(true)
  }

  const ellipsis = (str: string, len?: number) =>
    str && str.length > (len || 11) ? str.slice(0, len || 11) + '...' : str

  return (
    <Box
      color="foregroundColour"
      className="flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-3 sm:p-5"
    >
      <Box className="flex flex-row w-full justify-between items-center mb-8 min-h-8">
        <Text className="text-lg xl:text-xl translate-y-2">
          Attendee Summary
        </Text>
        <Box className="flex flex-row items-center ml-4">
          <Text className="text-lg flex flex-row mt-[20px] text-sm mr-3">
            Filter:
          </Text>
          <Box className="max-h-[1rem] h-[25px] md:min-w-[50px] mt-[-72px] mr-5">
            <DropdownInput
              options={statusOptions}
              onChange={(_data, _isValid, index) => {
                setStatusFilter(statusOptions[index ?? 0])
              }}
              value={statusFilter}
              autoWidth
              noBorder
            />
          </Box>
          <Box className="max-h-[1rem] -translate-y-6 md:min-w-[300px]">
            <TextInput
              value={filter}
              className="w-full max-h-[12px] mt-[17px]"
              placeholder="Search for Attendee"
              onChange={setFilter}
            />
          </Box>
        </Box>
      </Box>
      <Box className="max-h-[300px] overflow-y-scroll">
        <div
          className={`w-full flex flex-row ${
            isDarkTheme ? 'bg-dark' : 'bg-forumm-light-gray'
          } rounded-t-xl py-2 mb-5 sticky top-0 z-10`}
        >
          <Box className="flex-1 font-bold text-sm">Name</Box>
          {showEventColumn && (
            <Box className="flex-1 font-bold text-sm">Event</Box>
          )}
          <Box className="flex-1 font-bold text-sm">Ticket Type</Box>
          <Box className="flex-1 font-bold text-sm">Order Date</Box>
          <Box className="flex-1 font-bold text-sm">Donation Amount</Box>
          <Box className="flex-1 font-bold text-sm">Status</Box>
        </div>
        {(filteredData || []).map(
          (at: (typeof attendeesWithEventTitles)[0], index: number) => (
            <Box
              key={index}
              className="flex flex-row items-center mb-4 cursor-pointer"
              onClick={() => handlePressAttendee(at)}
            >
              <Box className="flex-1 justify-start text-sm ml-0">
                {ellipsis(at?.name ?? '', 25)}
              </Box>
              {showEventColumn && (
                <Box className="flex-1 text-sm">
                  {ellipsis(at?.eventTitle ?? '', 17)}
                </Box>
              )}
              <Box className="flex-1 text-sm">
                {ellipsis(at?.ticketTitle, 17)}
              </Box>
              <Box className="flex-1 text-ellipsis text-sm">
                {at?.invitationSentDatetime
                  ? moment(at?.invitationSentDatetime).format('DD/MM/YYYY')
                  : '-'}
              </Box>
              <Box className="flex-1 text-sm">{getDonationAmount(at)}</Box>
              <Box className="flex-1 text-sm capitalize">{getStatus(at)}</Box>
            </Box>
          )
        )}
      </Box>
      <AttendeeModal
        key={selectedAttendee?.email}
        show={showModal}
        setShow={setShowModal}
        attendee={selectedAttendee}
      />
    </Box>
  )
}

export default EventTableAttendees
