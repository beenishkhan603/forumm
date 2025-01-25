import Box from '@components/base/Box'
import Text from '@components/base/Text'

const FeatureCard = ({
  title,
  text,
  img,
  className,
}: {
  title: string
  text: string
  img: React.ReactNode
  className?: string
}) => {
  return (
    <Box
      className={`flex flex-row w-full border rounded-lg border-gray-300 min-h-[100px] p-3 text-start ml-4 ${className}`}
    >
      <Box className="w-full flex flex-col">
        <Text className="text-2xl mb-2">{title}</Text>
        <Text className="text-sm">{text}</Text>
      </Box>
      <Box className="flex w-[100px] h-[100px]">{img}</Box>
    </Box>
  )
}

export default FeatureCard
