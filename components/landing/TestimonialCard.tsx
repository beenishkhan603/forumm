import Box from '@components/base/Box'
import Text from '@components/base/Text'
import Image, { StaticImageData } from 'next/image'
import Testimonial from '@public/testimonial-1.png'
import { useTheme } from '@libs/useTheme'

interface TestimonialCardProps {
  name: string
  university: string
  body: string
  image: StaticImageData
}

function TestimonialCard({
  name,
  university,
  body,
  image,
}: TestimonialCardProps) {
  const { theme } = useTheme()
  return (
    <Box className="sm:flex w-full h-full sm:min-h-[14rem] sm:max-h-[16rem]">
      <Box className="sm:min-w-[160px] !max-h-[calc(100vw-20px)]">
        <Image
          src={image}
          alt="Testimonial"
          className="rounded-t-xl sm:rounded-tl-xl sm:rounded-bl-xl sm:rounded-tr-none w-full h-full !max-h-[calc(100vw-20px)] object-fit"
          objectFit="contain"
        />
      </Box>
      <Box
        className="p-4 min-h-[10rem] sm:min-h-[16rem] bg-white rounded-b-xl sm:rounded-b-none sm:rounded-e-xl sm:flex sm:flex-col justify-center sm:px-5"
        style={{ backgroundColor: theme.backgroundColour }}
      >
        <Text className="text-xs unselectable">{name}</Text>
        <Text className="font-semibold text-sm pb-4 unselectable">
          {university}
        </Text>
        <Text className="text-xs sm:text-sm unselectable">{body}</Text>
      </Box>
    </Box>
  )
}

export default TestimonialCard
