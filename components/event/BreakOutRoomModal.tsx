import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import { useTheme } from '@libs/useTheme'
import { EventBreakoutRoom } from '@graphql/__generated/graphql'

const BreakoutRoomModal = ({
  show,
  setShow,
  room,
}: {
  show: boolean
  setShow: (show: boolean) => void
  room?: EventBreakoutRoom
}) => {
  const { theme } = useTheme()

  if (!room) return null

  return (
    <Modal
      closeButton={true}
      show={show}
      setShow={setShow}
      bgColor={theme.foregroundColour}
    >
      <Box className="w-full relative" color="foregroundColour">
        <Box className="text-center text-2xl font-bold pl-3 md:pl-0">
          Breakout Room Information
        </Box>
        <div className="flex flex-col items-center py-4">
          <div
            className="w-[100px] h-[100px] rounded-full bg-cover mb-4"
            style={{
              backgroundImage: `url(${
                room?.thumbnailImage ||
                'https://assets.tumblr.com/images/default_header/optica_pattern_11.png'
              })`,
            }}
          />
          <div className="w-full px-4">
            <Box className="flex mb-2">
              <Box className="font-bold mr-2">Name:</Box>
              <Box>{room?.title}</Box>
            </Box>
            <Box className="flex mb-2">
              <Box className="font-bold mr-2">Description:</Box>
              <Box>{room?.description || 'No description available'}</Box>
            </Box>
            <Box className="flex mb-2">
              <Box className="font-bold mr-2">Max Attendees:</Box>
              <Box>{room?.maxAttendees}</Box>
            </Box>
            <Box className="flex mb-2">
              <Box className="font-bold mr-2">Current Users:</Box>
              <Box>{room?.totalUsers}</Box>
            </Box>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default BreakoutRoomModal
