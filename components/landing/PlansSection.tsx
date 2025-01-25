import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { useRouter } from 'next/router'
import PlansBanner from '@public/images/PlansBanner.png'
import Image from 'next/image'
import { Button } from '@components/inputs/Button'

const PlansSection = () => {
  const router = useRouter()
  return (
    <Box className="w-full flex justify-center py-10">
      <Box className="w-full px-6 sm:px-0 sm:w-3/5 flex flex-col sm:flex-row justify-center items-center">
        <Box className="flex-1 flex max-w-[400px] rounded-2xl mr-0 sm:mr-5 relative">
          <Image
            className="w-full"
            src={PlansBanner.src}
            width={200}
            height={200}
            alt="Image"
          />
        </Box>
        <Box className="flex-1 flex flex-col rounded-2xl ml-0 sm:ml-5 p-1 pt-8 text-center items-center sm:text-left sm:items-start">
          <Text className="text-4xl sm:text-4xl mb-2">
            From Explorer to Visionary
          </Text>
          <Text className="font-medium mt-0 mb-6">
            There&apos;s a plan for everyone!
          </Text>
          <Text className="text-base">
            Picture effortless event management, engaging donor campaigns and
            insightful data all at your fingertips <br />
            (so you can focus on what matters most: making great campaigns).
          </Text>
          <Button
            size="auto"
            className="mt-6 max-w-[16rem]"
            title="Explore Your Options"
            onClick={() => router.push('/pricing')}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default PlansSection
