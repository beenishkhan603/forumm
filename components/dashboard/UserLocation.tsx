import React, { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { IoLocationOutline } from 'react-icons/io5'
import { GET_LOCATION } from '@graphql/location/getLocation'
import ProfileImage from '@components/base/ProfileImage'
import { useChat } from '@libs/useChat'
import { useDashboard } from '@libs/useDashboard'
import Box from '@components/base/Box'
import LoadingSpinner from '@components/base/LoadingSpinner'

const API = process.env.NEXT_PUBLIC_GOOGLE_API_URL
declare let google: any

export default function UserLocation() {
  const [getLocation, { loading, data }] = useLazyQuery(GET_LOCATION)
  const { setModalUser } = useChat()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      const result = getLocation({
        variables: { latitude: lat, longitude: lng },
      })
    })
  }, [getLocation])

  const { users } = useDashboard()

  return (
    <Box
      loading={loading}
      color="foregroundColour"
      className="px-6 py-8 h-96 overflow-y-scroll "
    >
      <Box className="text-white text-md py-4 ">Attendees Location</Box>
      {users?.length === 0 ? (
        <Box className="text-white text-md py-4 ">No Attendees</Box>
      ) : (
        users?.map((user) => (
          <Box
            key={Math.random()}
            className="grid grid-cols-5 gap-4 py-2 px-2 items-center cursor-pointer"
            onClick={() => setModalUser?.(user)}
          >
            <Box className="bg-midnight-dark p-3 w-12 h-12 flex justify-center rounded items-center">
              <IoLocationOutline className="text-lg text-white " />
            </Box>

            <Box className="text-white text-sm col-span-3">
              <Box>{user.name}</Box>
              <Box className="text-xs text-gray-400">
                Location: {user.location}
              </Box>
            </Box>
            <Box className="text-white text-sm text-center">
              <ProfileImage
                activityStatus={
                  user.isAnonymous === 'true' ? false : user.isActive
                }
                imageUrl={user?.profileImage}
                className="w-10 h-10"
              />
            </Box>
          </Box>
        ))
      )}
    </Box>
  )
}
