import Box from '@components/base/Box'
import PackagesPreview from '@public/images/packagesPreview.jpg'
import Image from 'next/image'

const PackagesMin = () => {
  return (
    <Box className="block sm:hidden">
      <Box className="flex-1 flex w-full rounded-2xl mr-5 relative">
        <Image
          className="w-full"
          src={PackagesPreview.src}
          width={200}
          height={200}
          alt="Image"
        />
      </Box>
    </Box>
  )
}

export default PackagesMin
