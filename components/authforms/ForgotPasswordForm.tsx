import ForumLogoText from '@public/images/ForumLogoText.svg'
import Logo from '@public/images/ForummLogo.svg'
import { Button } from '@components/inputs/Button'
import { Form } from '@components/inputs/Form'
import { TextInput } from '@components/inputs/TextInput'
import { useEffect, useState } from 'react'
import { useAuth } from '@libs/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import useLocalStorage from '@libs/useLocalStorage'

const ForgotPasswordForm = () => {
  const { theme, setTheme } = useTheme()
  const [_pwResetAddress, setPwResetAddress] = useLocalStorage<string>(
    'Forumm_pw_reset_address',
    ''
  )
  const { sendCode, currentUser, setProfile, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()

  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      push('/code-auth')
    }
  })

  return (
    <Box className="flex w-full justify-center h-screen items-center">
      <Box className="flex w-full justify-center items-center max-w-7xl flex-grow overflow-visible">
        <Box className="w-4/5 sm:w-1/2 my-16 relative">
          <Box className="flex flex-col items-center space-y-2">
            <Box
              onClick={() => window.location.href = 'https://www.forumm.to'}
              className="text-center text-2xl cursor-pointer"
            >
              <div className="flex flex-col justify-center items-center mb-12">
                <Logo className="block w-12 mb-2" />
                <ForumLogoText fill={theme.textColour} className="h-6 w-24" />
              </div>
              <p>Forgot your password?</p>
            </Box>
          </Box>
          <Box>
            <Form
              onSubmit={async (data) => {
                setLoading(true)
                try {
                  const { email } = data
                  await setPwResetAddress(email)
                  const response = await sendCode(email)
                  setProfile({
                    ...profile,
                    email,
                  })
                  push('/code-auth')
                } catch (error: any) {
                  console.error(error)
                  setLoading(false)
                  return error.message ?? 'No user assigned to that email'
                }
              }}
            >
              <TextInput
                label="Email"
                type="email"
                placeholder="your@mail.com"
                required
                validations={{
                  minLength: {
                    value: 7,
                    message: 'Email must be at least 7 characters',
                  },
                  maxLength: {
                    value: 70,
                    message: 'Email must be less than 70 characters',
                  },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email must be valid',
                  },
                }}
              />

              <Button
                buttonType="submit"
                className="my-4 w-full"
                title="Send"
                loading={loading}
              />
            </Form>
          </Box>
          <Box className="text-sm flex space-x-2 justify-center mb-2 mt-4">
            <span className="">{"Don't have an Account?"}</span>
            <Link className="text-link hover:underline" href="/create-account">
              Sign up
            </Link>
          </Box>
          <Box className="text-sm flex space-x-2 justify-center mb-8">
            <span className="">Already registered?</span>
            <Link className="text-link hover:underline" href="/login">
              Log in
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ForgotPasswordForm
