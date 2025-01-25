import { useState } from 'react'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import MediaCard from './Media'
import { useTheme } from '@libs/useTheme'
import { Event } from '@graphql/__generated/graphql'
import LoadingSpinner from '@components/base/LoadingSpinner'
import NoEvents from '@public/images/NoEvents.svg'
import { Button } from '@components/inputs/Button'
import LoadingBar from '@components/base/LoadingBar'

function MainContent({
  title,
  data,
  loading,
  isDonation,
}: {
  title: string
  data: Event[]
  loading: boolean
  isDonation?: boolean
}) {
  const { theme } = useTheme()
  const [viewAll, setViewAll] = useState<boolean>(false)
  return (
    <Box
      className="flex flex-col items-center "
      style={{ backgroundColor: theme.backgroundColour }}
    >
      <Box className="flex flex-col sm:max-w-[58rem] ">
        <Text className="text-4xl pt-16 mx-4 sm:mx-0">{title}</Text>
        <Box className="sm:flex sm:flex-wrap sm:justify-between mx-4 sm:mx-0">
          {loading && (
            <Box className="flex min-w-[58rem] justify-center py-20">
              <LoadingBar/>
            </Box>
          )}
          {!loading &&
            (viewAll ? data : data?.slice(0, 3))?.map((item: Event) => (
              <MediaCard
                key={item.eventId}
                url={
                  isDonation
                    ? `/donation/${item?.event?.donationUrl}`
                    : `/event/${item?.eventId}`
                }
                image={item?.event?.bannerImage ?? ''}
                title={item?.event?.title!}
                subtitle={item?.event?.organizationName!}
                description={item?.event?.shortDescription!}
              />
            ))}
          {!loading && (data || []).length === 0 && (
            <Box className="flex flex-col min-w-[58rem] justify-center items-center py-20">
              <NoEvents className="my-6 h-40" />
              <Box>There are currently no events</Box>
            </Box>
          )}
          {!loading && !viewAll && (data || []).length > 3 && (
            <Box className="w-full justify-center flex">
              <Button
                className="sm:min-w-[15rem] text-xs sm:text-sm"
                title="View All"
                type="secondary"
                onClick={() => setViewAll(true)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default MainContent
