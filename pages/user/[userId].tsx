import React from 'react'
import Box from '@components/base/Box'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { GoArrowLeft } from 'react-icons/go'
import { GET_USERS_BY_IDS } from '@graphql/users/GetUsersByIds'
import UserGraph from '@components/dashboard/UserGraph'
import {
  BsFillPersonCheckFill,
  BsFillEnvelopeFill,
  BsTwitter,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
} from 'react-icons/bs'
import { FaTicketAlt } from 'react-icons/fa'
import moment from 'moment'
import ProfileImage from '@components/base/ProfileImage'
import LoadingSpinner from '@components/base/LoadingSpinner'

export default function UserDashboard(): JSX.Element {
  const { query } = useRouter()
  const router = useRouter()

  const { data, loading, error } = useQuery(GET_USERS_BY_IDS, {
    variables: { input: { userIds: [query.userId as string] } },
  })

  if (loading) {
    return (
      <Box className="flex justify-center w-full py-24">
        <LoadingSpinner size="medium" />
      </Box>
    )
  }

  return (
    <Box className="flex flex-col space-y-6 py-8 max-2xl mx-auto px-8">
      <Box
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
      >
        <GoArrowLeft />
        Back to Dashboard
      </Box>

      {data?.getUsersByIds.items?.map((user) => (
        <Box className="w-full flex gap-4" key={user?.userId}>
          <Box className="flex flex-col bg-midnight-light w-3/12 rounded-lg gap-4 border border-white/20 ">
            <Box className="w-full bg-midnight-sky rounded-t-lg py-4 px-2 font-semibold ">
              User Profile
            </Box>
            <Box className="flex flex-col px-2 gap-2 items-center">
              <ProfileImage
                className="mb-2"
                imageUrl={user?.profileImage}
                activityStatus={
                  user?.isAnonymous === 'true' ? false : user?.isActive
                }
              />

              <Box className="text-xl font-bold">{user?.name}</Box>
              <Box className="text-sm font-thin flex">
                <Box className="mr-2 font-medium"> Email:</Box> {user?.email}
              </Box>
              <Box className="text-sm font-extralight flex">
                <Box className="mr-2 font-medium">
                  {user?.company ? 'Company:' : 'University:'}
                </Box>
                {user?.company ? ` ${user?.company}` : `${user?.university}`}
              </Box>
              <Box></Box>
              <Box className="text-sm font-extralight flex">
                <Box className="mr-2 font-medium"> Location:</Box>
                {user?.location}
              </Box>
              <Box className="text-sm font-extralight flex">
                <Box className="mr-2 font-medium"> Registered:</Box>
                {moment(user?.dateCreated).format('DD/MM/YYYY')}
              </Box>
              <Box className="text-sm font-extralight flex">
                <Box className="mr-2 font-medium"> Last Active:</Box>
                {user?.isActive
                  ? 'Active Now'
                  : moment(user?.lastActive).fromNow()}
              </Box>
              <Box className="flex w-full justify-evenly">
                <BsFacebook className="w-6 h-6 " />
                <BsTwitter className="w-6 h-6 " />
                <BsInstagram className="w-6 h-6 " />
                <BsLinkedin className="w-6 h-6 " />
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col bg-midnight-light w-full  rounded-lg  border border-white/20 ">
            <Box className="w-full bg-midnight-sky rounded-t-lg py-4 px-2">
              User Statistics
            </Box>
            <Box className="text-xl font-bold grid grid-cols-5 gap-4 px-4  ">
              <Box className="col-span-2 py-2">
                <UserGraph />
              </Box>
              <Box className="my-auto p-4 bg-midnight-dark text-sm h-1/2 rounded-lg flex flex-col justify-evenly items-center">
                <BsFillEnvelopeFill className="w-8 h-8 text-forumm-active " />
                Invited Events
                <Box blur>19</Box>
              </Box>
              <Box className="my-auto p-4 bg-midnight-dark text-sm h-1/2 rounded-lg flex flex-col justify-evenly items-center">
                <FaTicketAlt className="w-8 h-8 text-forumm-red" />
                Registered Events
                <Box blur>10</Box>
              </Box>
              <Box className="my-auto p-4 bg-midnight-dark text-sm h-1/2 rounded-lg flex flex-col justify-evenly items-center">
                <BsFillPersonCheckFill className="w-8 h-8 text-forumm-blue" />
                Attended Events
                <Box blur>12</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
