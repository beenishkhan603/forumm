import Box from '@components/base/Box'
import { LuCalendarX } from 'react-icons/lu'

const NoData = ({ text, className }: { text?: string; className?: string }) => {
  return (
    <Box
      className={`flex flex-col w-full min-h-[100px] items-center justify-center !text-[#888888] ${className}`}
    >
      {text || 'Create new events or donations to see metrics.'}
      <Box>
        <LuCalendarX className="mt-2 text-2xl !text-[#888888]" />
      </Box>
    </Box>
  )
}

export default NoData
