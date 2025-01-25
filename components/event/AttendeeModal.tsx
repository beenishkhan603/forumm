import CopyIcon from '@public/images/CopyIcon.svg'
import React, { useEffect, useState } from 'react'
import { useMutation, QueryResult, useQuery } from '@apollo/client'
import { IoCloseCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import moment from 'moment'
import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import ProfileImage from '@components/base/ProfileImage'
import { Button } from '../inputs/Button'
import { EventAttendee, TicketOrder } from '@graphql/__generated/graphql'
import { SET_CHECKIN_FOR_ATTENDEE } from '@graphql/events/setCheckInforAttendee'
import { GET_ORDER_BY_EVENT_ID } from '@graphql/events/GetOrderByEventId'
import { truncateString } from '@libs/Utility/util'
import { useTheme } from '@libs/useTheme'

type RefetchType = QueryResult['refetch']

type EventAttendeeInfo = EventAttendee & { additionalTicketQuantity?: number }

const AttendeeModal = ({
  eventId,
  show,
  setShow,
  attendee,
  refetchEvent,
  registrationFields,
  userRegistrationFields,
}: {
  eventId: string
  show: boolean
  setShow: (show: boolean) => void
  refetchEvent: () => void
  registrationFields: { name?: string }[]
  userRegistrationFields: { email?: string; registrationFields?: {} }[]
  attendee?: EventAttendeeInfo
}) => {
  const { StaticColours } = useTheme()

  const [additionalTickets, setAdditionalTickets] = useState<TicketOrder>()

  const { data } = useQuery(GET_ORDER_BY_EVENT_ID, {
    variables: { eventId, userId: attendee?.email ?? '' },
    skip: !eventId || !attendee?.email,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (attendee && data?.getOrderByEventId?.quantity) {
      setAdditionalTickets(data?.getOrderByEventId)
    }
  }, [data, data?.getOrderByEventId])

  const [setCheckInforAttendee] = useMutation(SET_CHECKIN_FOR_ATTENDEE)
  if (!attendee) {
    return null
  }
  const handleCheckInChange = async (checkInStatus: string) => {
    await setCheckInforAttendee({
      variables: {
        email: attendee.email,
        eventId: eventId,
        checkInStatus,
      },
    })
    refetchEvent()
  }

  const getCheckInRow = (checkInStatus?: string | null) => {
    if (!checkInStatus)
      return (
        <>
          <Button
            title="Present"
            icon={<IoCheckmarkCircleOutline size="1em" />}
            size="small"
            onClick={() => handleCheckInChange('present')}
            className="mr-2"
          />
          <Button
            title="Absent"
            icon={<IoCloseCircleOutline size="1em" />}
            size="small"
            onClick={() => handleCheckInChange('absent')}
          />
        </>
      )
    return attendee.checkInStatus === 'present' ? (
      <>
        <span className="text-green-500">Present</span>
        <IoCheckmarkCircleOutline
          className="ml-2 text-green-500"
          size="1.5em"
        />
        <Button
          title="Mark as absent"
          icon={<IoCloseCircleOutline size="1.5em" />}
          size="small"
          onClick={() => handleCheckInChange('absent')}
          className="ml-2 whitespace-nowrap text-xs"
        />
      </>
    ) : (
      <>
        <span className="text-red-500">Absent</span>
        <IoCloseCircleOutline className="ml-2 text-red-500" size="1.5em" />
        <Button
          title="Mark as present"
          icon={<IoCheckmarkCircleOutline size="1.5em" />}
          type="success"
          size="small"
          onClick={() => handleCheckInChange('present')}
          className="ml-2 whitespace-nowrap text-xs"
        />
      </>
    )
  }

  // reads the user response during registration
  const getResgistrationFieldAnswer = (field?: string, email?: string) => {
    if (field && email) {
      const userRow = userRegistrationFields.filter(
        (rf) => rf?.email === email
      )?.[0]?.registrationFields
      const value =
        userRow?.[
          // @ts-ignore
          Object.keys(userRow).find(
            (key) => key.toLowerCase() === field.toLowerCase()
          )
        ]
      return value
    }
    return '-'
  }

  return (
    <Modal show={show} setShow={setShow}>
      <Box className="w-full relative">
        <Box className="text-white text-center text-2xl font-bold pl-3 md:pl-0">
          Attendee Information
        </Box>
        <Box className={`flex flex-col w-full h-full min-h-32 mt-4`}>
          {/* User Info */}
          <Box className={`flex items-center`}>
            <Box className="flex flex-1 justify-center">
              <ProfileImage
                size="lg"
                key={attendee?.email}
                imageUrl={attendee?.profileImage}
              />
            </Box>
            <Box className="flex flex-col flex-2">
              <Box className="p-4">{attendee?.name}</Box>
              <Box className="p-4 pt-0">{attendee?.email}</Box>
            </Box>
          </Box>

          {/* Ticket Type */}
          <Box className={`flex items-center`}>
            <Box className="flex flex-1 justify-center">
              <Box className="p-4 font-bold">Ticket Type:</Box>
            </Box>
            <Box className="flex flex-col flex-2">
              <Box className="p-4 capitalize">{attendee.ticketTitle}</Box>
            </Box>
          </Box>

          {/* Ticket Code */}
          <Box className={`flex items-center`}>
            <Box className="flex flex-1 justify-center">
              <Box className="p-4 font-bold">Ticket Code:</Box>
            </Box>
            <Box className="flex flex-col flex-2">
              <Box className="p-4 capitalize">{attendee.ticketCode}</Box>
            </Box>
          </Box>

          {/* Registered */}
          <Box className={`flex items-center`}>
            <Box className="flex flex-1 justify-center">
              <Box className="p-4 font-bold">Registered:</Box>
            </Box>
            <Box className="flex flex-col flex-2">
              {attendee?.registered ? (
                <Box className="flex items-center p-4">
                  <span className="text-green-500">Yes</span>
                  <IoCheckmarkCircleOutline
                    className="ml-2 text-green-500"
                    size="1.5em"
                  />
                </Box>
              ) : (
                <>
                  <span className="text-red-500">No</span>
                  <IoCloseCircleOutline
                    className="ml-2 text-red-500"
                    size="1.5em"
                  />
                </>
              )}
            </Box>
          </Box>

          {/* Check-in Status */}
          <Box className={`flex items-center`}>
            <Box className="flex flex-1 justify-center">
              <Box className="p-4 font-bold">Check-in Status:</Box>
            </Box>
            <Box className="flex flex-col flex-2">
              <Box className="p-4 capitalize flex">
                {getCheckInRow(attendee?.checkInStatus)}
              </Box>
            </Box>
          </Box>

          {/* Last Activite */}
          <Box className={`flex items-center`}>
            <Box className="flex flex-1 justify-center">
              <Box className="p-4 font-bold">Last Activity:</Box>
            </Box>
            <Box className="flex flex-col flex-2">
              <Box className="p-4 capitalize">
                {attendee?.checkInDatetime
                  ? moment(attendee?.checkInDatetime).format('MMM DD, h:mmA')
                  : 'No activity yet'}
              </Box>
            </Box>
          </Box>

          {/* Additional Tickets */}
          <Box
            show={
              !!additionalTickets &&
              !!additionalTickets.quantity &&
              !!additionalTickets.tickets
            }
            className={`flex flex-col items-center`}
          >
            <Box className="flex flex-1 justify-center">
              <Box className="p-4 font-bold">
                Additional Tickets ({additionalTickets?.quantity}):
              </Box>
            </Box>
            <Box className="flex flex-col flex-2">
              <Box className="p-4 flex-col">
                <Box
                  className={`flex items-center`}
                  key={`additional_ticket_header`}
                >
                  <Box className="p-2 font-bold flex-1">Name</Box>
                  <Box className="p-2 font-bold flex-1">Email</Box>
                  <Box className="p-2 font-bold flex-1">Ticket</Box>
                </Box>
                {additionalTickets?.tickets?.map((t) => {
                  return (
                    <Box
                      className={`flex items-center`}
                      key={`additional_ticket_${t.fullName}`}
                    >
                      <Box className="p-2 capitalize flex-1">{t.fullName}</Box>
                      <Box className="p-2 capitalize flex-1">
                        <Button
                          className="border-none pl-0"
                          title="Copy"
                          icon={
                            <CopyIcon
                              fill={StaticColours.forumm_blue}
                              className=""
                            />
                          }
                          type="tertiary"
                          size="medium"
                          onClick={(e) => {
                            if (t?.email) navigator.clipboard.writeText(t.email)

                            e.preventDefault()
                          }}
                        />
                      </Box>
                      <Box className="p-2 capitalize flex-1">{t.title}</Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>

          {/* Registration Fields */}
          <Box
            show={!!registrationFields}
            className={`flex flex-col items-center`}
          >
            {registrationFields && registrationFields.length > 0 && (
              <Box className="flex flex-1 justify-center">
                <Box className="p-4 font-bold">Registration Fields:</Box>
              </Box>
            )}
            <Box className="flex flex-col flex-2 w-full">
              <Box className="p-4 flex-col">
                {registrationFields.map((f) => {
                  return (
                    <Box
                      className={`flex items-center`}
                      key={`additional_ticket_${f.name}`}
                    >
                      <Box className="p-2 font-bold flex-1">{f.name}:</Box>
                      <Box className="p-2 capitalize flex-1">
                        {getResgistrationFieldAnswer(f.name, attendee?.email)}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Begin of the 2 columns structure */}
        {/* <div className="flex flex-row space-y-4 md:space-y-0 md:space-x-4 py-4"> */}
        {/* Column 1 */}
        {/*   <div className="flex-1 flex flex-col"> */}
        {/*     <div className="flex-grow flex items-center p-4"> */}
        {/*       <ProfileImage */}
        {/*         size="lg" */}
        {/*         key={attendee?.email} */}
        {/*         imageUrl={attendee?.profileImage} */}
        {/*       /> */}
        {/*     </div> */}
        {/*     <div className="p-4 font-bold">Ticket Type:</div> */}
        {/*     {attendee?.ticketCode && ( */}
        {/*       <div className="p-4 font-bold">Ticket Code:</div> */}
        {/*     )} */}
        {/*     <div className="p-4 font-bold">Additional Tickets:</div> */}
        {/*     <div className="p-4 font-bold">Registered:</div> */}
        {/*     <div className="p-4 font-bold">Check-in Status:</div> */}
        {/*     <div className="p-4 font-bold">Last update:</div> */}
        {/*     {registrationFields.map((rf) => ( */}
        {/*       <div key={rf?.name} className="p-4 font-bold"> */}
        {/*         {rf?.name} */}
        {/*       </div> */}
        {/*     ))} */}
        {/*   </div> */}
        {/**/}
        {/* Column 2 */}
        {/*   <div className="flex-1 flex flex-col"> */}
        {/*     <div className="flex-grow flex items-center p-4"> */}
        {/*       {attendee?.name} */}
        {/*     </div> */}
        {/*     <div className="p-4">{attendee?.email}</div> */}
        {/*     <div className="p-4 capitalize">{attendee?.ticketTitle}</div> */}
        {/*     {attendee?.ticketCode && ( */}
        {/*       <div className="p-4 capitalize">{attendee?.ticketCode}</div> */}
        {/*     )} */}
        {/*     <Box */}
        {/*       show={!!additionalTickets && !!additionalTickets?.quantity} */}
        {/*       className="p-4 capitalize" */}
        {/*     > */}
        {/*       {additionalTickets?.quantity ?? ''} */}
        {/*     </Box> */}
        {/*     <div className="flex items-center p-4"> */}
        {/*       {attendee?.registered ? ( */}
        {/*         <> */}
        {/*           <span className="text-green-500">Yes</span> */}
        {/*           <IoCheckmarkCircleOutline */}
        {/*             className="ml-2 text-green-500" */}
        {/*             size="1.5em" */}
        {/*           /> */}
        {/*         </> */}
        {/*       ) : ( */}
        {/*         <> */}
        {/*           <span className="text-red-500">No</span> */}
        {/*           <IoCloseCircleOutline */}
        {/*             className="ml-2 text-red-500" */}
        {/*             size="1.5em" */}
        {/*           /> */}
        {/*         </> */}
        {/*       )} */}
        {/*     </div> */}
        {/*     <div className="flex items-center p-4"> */}
        {/*       {getCheckInRow(attendee?.checkInStatus)} */}
        {/*     </div> */}
        {/*     <div className="p-4"> */}
        {/*       {attendee?.checkInDatetime */}
        {/*         ? moment(attendee?.checkInDatetime).format('MMM DD, h:mmA') */}
        {/*         : 'No activity yet'} */}
        {/*     </div> */}
        {/*     {registrationFields.map((rf) => ( */}
        {/*       <div key={rf.name} className="p-4"> */}
        {/*         {getResgistrationFieldAnswer(rf.name, attendee?.email)} */}
        {/*       </div> */}
        {/*     ))} */}
        {/*   </div> */}
        {/* </div> */}
        {/* End of the 2 columns structure */}
      </Box>
    </Modal>
  )
}

export default AttendeeModal
