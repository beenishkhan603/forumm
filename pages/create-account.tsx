import SignUpForm from '@components/authforms/SignUpForm'
import React from 'react'
import EmptyLayout from '@layouts/EmptyLayout'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import bgHome from '@public/images/login.jpg'

export default function CreateAccountPage() {
  const { theme } = useTheme()
  return (
    <Box
      color={'backgroundColour'}
      className="flex justify-center h-screen items-center"
      style={{
        backgroundImage: `url(${bgHome.src})`,
        backgroundSize: `100% 100%`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: theme.backgroundColour,
      }}
    >
      <Box className="flex justify-center items-center max-w-7xl flex-grow overflow-visible">
        <SignUpForm />
      </Box>
    </Box>
  )
}
CreateAccountPage.Layout = EmptyLayout
