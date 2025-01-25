import { FiMessageCircle } from 'react-icons/fi'
import Box from '../base/Box'

const ActionButtons = ({
  className,
  show,
}: {
  className?: string
  show?: boolean
}) => {
  return (
    <Box
      className={
        className ??
        'sticky flex-1 bottom-0 text-white p-8 flex space-x-4 w-full justify-end items-end z-30 pointer-events-none translate-x-2'
      }
    >
      <Box
        show={show}
        className="bg-white w-15 h-15 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto hover:bg-gray-200 transform border border-forumm-menu-border"
        onClick={() => {
          document.dispatchEvent(new CustomEvent('toggle-chatbox'))
        }}
      >
        <FiMessageCircle className="text-forumm-blue w-8 h-8 " />
      </Box>
    </Box>
  )
}

export default ActionButtons
