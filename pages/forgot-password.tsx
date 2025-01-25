import ForgotPasswordForm from '@components/authforms/ForgotPasswordForm'
import Box from '@components/base/Box'
import EmptyLayout from '@layouts/EmptyLayout'
import React from 'react'
import { useTheme } from '@libs/useTheme'
import bgHome from '@public/images/login.jpg'

export default function ForgotPassword() {
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
      <ForgotPasswordForm />
    </Box>
  )
}

ForgotPassword.Layout = EmptyLayout
