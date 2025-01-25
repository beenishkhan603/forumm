import { QueryResult } from '@apollo/client'
import { IoCloseCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5'
import moment from 'moment'
import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import ProfileImage from '@components/base/ProfileImage'
import { EventAttendee } from '@graphql/__generated/graphql'
import { useTheme } from '@libs/useTheme'

const AttendeeModal = ({
  show,
  setShow,
  attendee,
}: {
  show: boolean
  setShow: (show: boolean) => void
  attendee?: EventAttendee
}) => {
  const { theme } = useTheme()
  if (!attendee) return null

  return (
    <Modal show={show} setShow={setShow} bgColor={theme.foregroundColour}>
      <Box className="w-full relative" color="foregroundColour">
        <Box className="text-white text-center text-2xl font-bold pl-3 md:pl-0">
          Attendee Information
        </Box>
        <div className="flex flex-row space-y-4 md:space-y-0 md:space-x-4 py-4">
          <div className="flex-1 flex flex-col">
            <div className="flex-grow flex items-center p-2">
              <ProfileImage
                size="lg"
                key={attendee?.email}
                imageUrl={attendee?.profileImage}
              />
            </div>
            <div className="p-2 font-bold">Event:</div>
            <div className="p-2 font-bold">Ticket Type:</div>
            {attendee?.ticketCode && (
              <div className="p-2 font-bold">Ticket Code:</div>
            )}
            <div className="p-2 font-bold">Registered:</div>
            <div className="p-2 font-bold">Last update:</div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-grow flex items-center p-2">
              {attendee?.name}
            </div>
            <div className="p-2">{attendee?.email}</div>
            {/* @ts-ignore */}
            <div className="p-2 capitalize">{attendee?.eventName ?? ''}</div>
            <div className="p-2 capitalize">{attendee?.ticketTitle}</div>
            {attendee?.ticketCode && (
              <div className="p-2 capitalize">{attendee?.ticketCode}</div>
            )}
            <div className="flex items-center p-2">
              {attendee?.registered ? (
                <>
                  <span className="text-green-500">Yes</span>
                  <IoCheckmarkCircleOutline
                    className="ml-2 text-green-500"
                    size="1.5em"
                  />
                </>
              ) : (
                <>
                  <span className="text-red-500">No</span>
                  <IoCloseCircleOutline
                    className="ml-2 text-red-500"
                    size="1.5em"
                  />
                </>
              )}
            </div>
            <div className="p-2">
              {attendee?.checkInDatetime
                ? moment(attendee?.checkInDatetime).format('MMM DD, h:mmA')
                : 'No activity yet'}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default AttendeeModal
