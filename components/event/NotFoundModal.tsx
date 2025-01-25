import React from 'react'
import { BiUserX } from 'react-icons/bi'
import Box from '@components/base/Box'
import Modal from '@components/base/Modal'

const NotFoundModal = ({
  ticketCode,
  show,
  setShow,
}: {
  ticketCode: string
  show: boolean
  setShow: (show: boolean) => void
}) => {
  return (
    <Modal show={show} setShow={setShow}>
      <Box className="w-full relative">
        <Box className="text-white text-center text-2xl font-bold pl-3 md:pl-0">
          Attendee not found
        </Box>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 py-4">
          <div className="flex-1 flex flex-col">
            <div className="flex-grow flex items-center justify-center p-4">
              <BiUserX size="8em" />
            </div>
            { ticketCode && (<div className="p-4">
              Ticket Code: <span className='text-forumm-blue'>{ticketCode}</span>
            </div>)}
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default NotFoundModal
