import Box from '@components/base/Box'
import SkeletonBox from './SkeletonBox'

export default function Skeleton({ visible }: { visible?: boolean }) {
  if (!visible) return null
  return (
    <Box className="w-full flex flex-row mt-4 -ml-4 -mr-12">
      <SkeletonBox />
      <SkeletonBox />
      <SkeletonBox />
      <SkeletonBox />
    </Box>
  )
}
