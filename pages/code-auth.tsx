import CodeAuthForm from '@components/authforms/CodeAuthForm'
import LoginForm from '@components/authforms/LoginForm'
import Box from '@components/base/Box'
import EmptyLayout from '@layouts/EmptyLayout'
import React from 'react'

export default function CodeAuthPage() {
  return (
    <Box className="flex justify-center">
      <CodeAuthForm />
    </Box>
  )
}

CodeAuthPage.Layout = EmptyLayout
