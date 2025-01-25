import Box from '@components/base/Box'
import Text from '@components/base/Text'
import Image, { StaticImageData } from 'next/image'
import { useTheme } from '@libs/useTheme'

interface InfoCardProps {
  title: string
  body: string
  image: StaticImageData
}

function InfoCard({ title, body, image }: InfoCardProps) {
  const { theme } = useTheme()

  const isDarkTheme = theme.type === 'DARK'

  return (
    <Box
      color="foregroundColour"
      className={`!h-73 rounded-xl mx-9 sm:mx-36 p-8 mt-5 sm:flex sm:items-center hover:animate-heartbeat ${
        isDarkTheme ? '' : 'border border-forumm-menu-border'
      }`}
    >
      <Box>
        <Image
          src={image}
          className={`h-[230px] rounded-xl ${
            isDarkTheme ? '' : 'border border-forumm-menu-border'
          }`}
          alt={image.src}
        />
      </Box>
      <Box className="m-8">
        <Text className="text-2xl line-clamp-2 mb-3 font-medium">{title}</Text>
        <Text className="text-base">{body}</Text>
      </Box>
    </Box>
  )
}

export default InfoCard
