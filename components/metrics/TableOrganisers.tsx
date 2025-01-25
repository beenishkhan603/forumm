import { useState, useMemo } from 'react'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { TextInput } from '@components/inputs/TextInput'
import { useTheme } from '@libs/useTheme'
import type { User } from '@graphql/__generated/graphql'
import { v4 } from 'uuid'
import { useAuth } from '@libs/useAuth'

const getFiltered = (users: (User | null | undefined)[], filter: string) => {
  if (!filter || !users) return users
  const lowercasedSearchText = filter.toLowerCase()
  return (users || []).filter(
    (user) =>
      user?.name?.toLowerCase().includes(lowercasedSearchText) ||
      user?.email?.toLowerCase().includes(lowercasedSearchText)
  )
}

const TableOrganisers = ({
  users,
  className,
}: {
  users: User[]
  className?: string
}) => {
  const { profile } = useAuth()
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  const org = profile?.company ?? profile?.university!

  const [filter, setFilter] = useState<string>('')

  const filteredData = useMemo(() => {
    return getFiltered(users, filter).sort((a, b) =>
      (a?.name ?? '').localeCompare(b?.name ?? '')
    )
  }, [users, filter])

  //const ellipsis = (str: string, len?: number) =>
  //  str && str.length > (len || 11) ? str.slice(0, len || 11) + '...' : str

  return (
    <Box className="w-full flex justify-center items-center">
      <Box
        color="foregroundColour"
        className={`flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-3 sm:p-5 max-w-[1500px] justify-center items-center ${className}`}
      >
        <Box className="flex flex-col md:flex-row w-full justify-between items-center mb-8">
          <Text className="text-xl text-center md:text-left">{`${org}'s Organiser Account${
            users.length > 1 ? 's' : ''
          }`}</Text>
          <Box className="mt-4 md:mt-0 md:min-w-[300px]">
            <TextInput
              value={filter}
              className="w-full"
              placeholder="Enter your search terms"
              onChange={setFilter}
            />
          </Box>
        </Box>
        <Box className="max-h-[300px] overflow-y-scroll scrollbar-hide">
          <Box
            className={`w-full flex flex-row ${
              isDarkTheme ? 'bg-dark' : 'bg-forumm-light-gray'
            } rounded-t-xl py-2 mb-5`}
          >
            <Box className="flex-1 font-bold text-start text-sm sm:text-base ml-4">
              Organiser
            </Box>
            <Box className="flex-1 font-bold text-sm md:text-base">Email</Box>
            <Box className="flex-1 font-bold text-sm md:text-base">
              Position
            </Box>
            <Box className="flex-1 font-bold text-sm md:text-base">
              Organisation
            </Box>
          </Box>
          {(filteredData || []).map((row: any) => {
            return (
              <Box
                key={row?.email ?? v4()}
                className="flex flex-row items-center mb-4"
              >
                <Box className="flex-1 flex flex-row text-start justify-start text-sm md:text-base ml-4 break-all p-2">
                  <Box
                    className="w-[30px] h-[30px] rounded-full translate-y-[-4px] mr-2 bg-cover"
                    style={{
                      backgroundImage: `url(${
                        row?.profileImage
                          ? row?.profileImage
                          : 'https://assets.tumblr.com/images/default_header/optica_pattern_11.png'
                      })`,
                    }}
                  />{' '}
                  {row?.name}
                </Box>
                <Box className="flex-1 text-sm md:text-base break-all p-2  break-all p-2">
                  {row?.email}
                </Box>
                <Box className="flex-1 text-ellipsis text-sm md:text-base  break-all p-2">
                  {row?.jobTitle}
                </Box>
                <Box className="flex-1 text-sm md:text-base">
                  {row?.companyTitle ?? row?.company ?? row?.university!}
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default TableOrganisers
