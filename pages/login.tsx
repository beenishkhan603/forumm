import { useTheme } from '@libs/useTheme'
import LoginForm from '@components/authforms/LoginForm'
import Box from '@components/base/Box'
import EmptyLayout from '@layouts/EmptyLayout'
import React from 'react'
import bgHome from '@public/images/login.jpg'

export default function LoginPage() {
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
      <LoginForm />
    </Box>
  )
}

LoginPage.Layout = EmptyLayout
