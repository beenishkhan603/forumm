import { useQuery } from '@apollo/client'
import Box from '@components/base/Box'
import LoadingSpinner from '@components/base/LoadingSpinner'
import ProfileImage from '@components/base/ProfileImage'
import { Button } from '@components/inputs/Button'
import { GET_USERS_IN_COMPANY } from '@graphql/users/getUsersByUniversity'
import { GET_USERS_IN_EVENT } from '@graphql/users/getUsersInEvent'
import { User } from '@graphql/__generated/graphql'
import { useAuth } from '@libs/useAuth'
import { useChat } from '@libs/useChat'
import { useEvent } from '@libs/useEvent'
import { useEffect, useState } from 'react'
import { MdOutlineRefresh } from 'react-icons/md'

const EventPeopleTab = ({
  universityUsers = false,
}: {
  universityUsers?: boolean
}) => {
  const { event } = useEvent()
  const { setModalUser } = useChat()
  const { profile } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const { data, loading, refetch } = useQuery(GET_USERS_IN_EVENT, {
    variables: { input: event?.eventId! },
    fetchPolicy: 'network-only',
    skip: universityUsers,
    notifyOnNetworkStatusChange: true,
  })

  const {
    data: grpUsers,
    loading: grpLoading,
    refetch: grpRefetch,
  } = useQuery(GET_USERS_IN_COMPANY, {
    variables: {
      company: profile?.university ?? profile?.company ?? '',
    },
    fetchPolicy: 'network-only',
    skip: universityUsers === false,
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    let allUsers = universityUsers
      ? grpUsers?.getUsersInCompany.items || []
      : data?.getUsersInEvent.items || []

    const sortedUsers = [...allUsers].sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    )

    setUsers(sortedUsers)
  }, [grpUsers?.getUsersInCompany, data?.getUsersInEvent, universityUsers])

  return (
    <Box className="text-white flex flex-col space-y-2 p-2 flex-shrink overflow-y-auto">
      <Button
        iconColor="white"
        icon={<MdOutlineRefresh />}
        iconPos="end"
        title="Refresh"
        loading={universityUsers ? grpLoading && !!grpUsers : loading && !!data}
        className="flex items-center p-2 cursor-pointer"
        onClick={() => {
          if (universityUsers) grpRefetch()
          if (!universityUsers) refetch()
        }}
      />
      <Box className="flex justify-center">
        {((grpLoading && !grpUsers) || (loading && !data)) && (
          <LoadingSpinner />
        )}
      </Box>
      {users.map((u) => (
        <Box
          className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-md"
          onClick={() => setModalUser?.(u)}
          key={u.userId}
        >
          <ProfileImage
            imageUrl={u.profileImage}
            size="md"
            activityStatus={u.isAnonymous === 'true' ? false : u.isActive}
            className="w-10 h-10 mr-4"
          />
          <Box>
            <Box className="text-white text-sm font-bold">{u.name}</Box>
            {u.userId === event?.organizerId && (
              <Box className="bg-blue-500 rounded-xl text-xs inline-block p-1 px-2">
                <text className="text-white">Organiser</text>
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default EventPeopleTab
