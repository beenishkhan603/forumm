import { Button } from '@components/inputs/Button'
import { useAuth } from '@libs/useAuth'
import Box from '@components/base/Box'
import LoadingSpinner from '@components/base/LoadingSpinner'
import Logo from '@public/images/ForummLogo.svg'
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

const SignUpForm = () => {
  const { signInWithEmail, acceptTcPp } = useAuth()

  const [userData, setUserData] = useState(null)
  const hasSignedInRef = useRef(false)

  useEffect(() => {
    const autoSignIn = async () => {
      if (!hasSignedInRef.current && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const email = urlParams.get('email')
        const temporalPassword = urlParams.get('temporalPassword')

        if (email && temporalPassword) {
          try {
            const response = (await signInWithEmail(
              email,
              temporalPassword
            )) as any
            const {
              idToken: { payload },
            } = response
            setUserData(payload)
            hasSignedInRef.current = true
          } catch (error) {
            console.error('Error during automatic sign-in:', error)
          }
        }
      }
    }

    autoSignIn()
  }, [signInWithEmail])

  useEffect(() => {
    if (userData?.['custom:acceptedTcPp']) {
      window.location.href = '/dashboard'
    }
  }, [userData])

  const handleAcceptAndContinue = async () => {
    await acceptTcPp()
    //@ts-ignore
    const isOrganizer = userData?.['cognito:groups']?.includes('organizer')
    if (isOrganizer) {
      window.location.href = '/create-event'
      return
    }
    window.location.href = '/dashboard'
  }

  if (!userData?.['custom:fullName'] || userData?.['custom:acceptedTcPp']) {
    return (
      <Box className="w-full min-h-screen" color={'backgroundColour'}>
        <Box
          className="w-full mx-auto md:w-1/2 my-16 p-10"
          color={'backgroundColourSecondary'}
        >
          <Box className="text-white text-center text-2xl font-bold pl-3 md:pl-0 mb-8">
            Welcome to Forumm
            <Logo className="inline-block w-12" />
          </Box>
          <Box className="w-full flex justify-center">
            <LoadingSpinner size="large" />
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="w-full min-h-screen" color={'backgroundColour'}>
      <Box
        className="w-full md:w-1/2 my-16 mx-auto rounded p-10"
        color={'backgroundColourSecondary'}
      >
        <Box className="text-white text-center text-2xl font-bold pl-3 md:pl-0 mb-8">
          Welcome to Forumm
          <Logo className="inline-block w-12" />
        </Box>
        <Box className="w-full text-center items-center justify-center">
          <span className="mt-8">
            Welcome, <strong>{userData?.['custom:fullName']}</strong>!
          </span>
          <p className="mt-4">
            Before continuing, please review our&nbsp;
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forumm-blue underline hover:text-forumm-blue font-medium"
            >
              Privacy Notice
            </Link>
            .
          </p>
          <p className="mb-8">
            By clicking &quot;Accept and Continue&quot;, you consent.
          </p>
          <Button
            onClick={handleAcceptAndContinue}
            title="Accept and Continue"
            className="mt-4 w-full"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default SignUpForm
