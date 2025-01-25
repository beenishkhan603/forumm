import React from 'react'
import { useRouter } from 'next/router'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import BecomeAnOrganiser from '@public/images/BecomeAnOrganiser.svg'

import { useTheme } from '@libs/useTheme'

const BecomeOrganiserBanner = ({}: {}) => {
  const { theme } = useTheme()
  const router = useRouter()
  const isDarkTheme = theme.type === 'DARK'

  return (
    <Box className="w-full">
      <Box
        className={`w-full flex flex-col sm:flex-row justify-center p-6 justify-center items-center ${isDarkTheme ? 'border border-panel-gray' : 'border border-forumm-menu-border'}`}
        style={{ backgroundColor: theme.foregroundColour }}
      >
        <Box className="justify-center sm:text-start">
          <Text className="text-4xl">Are you an organiser?</Text>
          <Text className="text-md justify-center text-center sm:justify-start sm:text-start mt-4">
            Activate your account as an organiser and start managing all your
            university events.
          </Text>
          <Button
            className="mt-4"
            title="Become an Organiser"
            onClick={() => router.push('/become-organiser')}
          />
        </Box>
        <Box className="ml-0 sm:ml-10 transform translate-y-[25px]">
          <BecomeAnOrganiser width={200} height={200} />
        </Box>
      </Box>
    </Box>
  )
}

export default BecomeOrganiserBanner
