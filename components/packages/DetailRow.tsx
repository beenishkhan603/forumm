import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { BsCheck2 } from 'react-icons/bs'

export interface DetailRowProps {
  label: string
}

const DetailRow: React.FC<DetailRowProps> = ({ label }) => {
  const renderLabel = () => {
    const regex = /\{(.*?)\}/g
    const parts = []
    let lastIndex = 0
    let match
    while ((match = regex.exec(label)) !== null) {
      if (match.index > lastIndex) {
        parts.push(label.slice(lastIndex, match.index))
      }
      parts.push(
        <span className="!text-forumm-blue" key={match.index}>
          {match[1]}
        </span>
      )
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < label.length) {
      parts.push(label.slice(lastIndex))
    }
    return parts
  }

  return (
    <Text className="!text-black mb-6 lg:mb-8 font-medium">
      <Box
        className={`w-6 h-6 rounded-full inline-block mr-2.5 transform translate-y-1 bg-forumm-green`}
      >
        <BsCheck2 className="mt-1 ml-1 !text-white" />
      </Box>
      <span className="sm:text-sm">{renderLabel()}</span>
    </Text>
  )
}

export default DetailRow
