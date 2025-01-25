import { useMutation } from '@apollo/client'
import ForumLogoText from '@public/images/ForumLogoText.svg'
import Logo from '@public/images/ForummLogo.svg'
import { Button } from '@components/inputs/Button'
import { Form } from '@components/inputs/Form'
import { TextInput } from '@components/inputs/TextInput'
import { useEffect, useState } from 'react'
import TickIcon from '@public/images/TickIcon.svg'
import { useAuth } from '@libs/useAuth'
import { DefaultDarkTheme, DefaultLightTheme, useTheme } from '@libs/useTheme'
import Link from 'next/link'
import Box from '@components/base/Box'
import { generateSecurePassword } from '@libs/Utility/util'
import useLocalStorage from '@libs/useLocalStorage'
import DarkModeIcon from '@public/images/DarkModeIcon.svg'
import LightModeIcon from '@public/images/LightModeIcon.svg'
import { PASSWORD_RESET_CONFIRMATION } from '@graphql/users/passwordResetConfirmation'

const CodeAuthForm = () => {
  const { theme, setTheme } = useTheme()
  const [pwResetAddress, setPwResetAddress] = useLocalStorage(
    'Forumm_pw_reset_address',
    ''
  )
  const [passwordResetConfirmation] = useMutation(PASSWORD_RESET_CONFIRMATION)

  const { currentUser, forgotPassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  //const [reveal, setReveal] = useState(false)
  const { profile } = useAuth()

  useEffect(() => {
    if (currentUser) {
      location.href = '/dashboard'
    }
  })

  const CustomIcon = () => {
    const { theme } = useTheme()
    return theme.type === 'DARK' ? <DarkModeIcon /> : <LightModeIcon />
  }

  return (
    <Box
      className="flex w-full justify-center h-screen items-center"
      color={'backgroundColour'}
    >
      {/*<<div className="absolute top-0 right-0 mt-4 mr-4">
        <Box
          onClick={() => {
            setTheme({
              ...theme,
              ...(theme.type === 'LIGHT'
                ? DefaultDarkTheme
                : DefaultLightTheme),
            })
          }}
        >
          <CustomIcon />
        </Box>
      </div>*/}

      <Box
        className="flex w-full justify-center items-center max-w-7xl flex-grow overflow-visible"
        color={'backgroundColour'}
      >
        <Box className="w-full md:w-1/2 my-16 relative">
          <div className="flex flex-col justify-center items-center mb-12">
            <Logo className="block w-12 mb-2" />
            <ForumLogoText fill={theme.textColour} className="h-6 w-24" />
          </div>
          <Box className="text-white text-center text-2xl pl-3 md:pl-0">
            Enter authorisation code!
          </Box>
          {!done && (
            <Box className="mt-8 mb-4 text-center text-sm">
              <span>
                We{`'`}ve just sent a message to your email inbox with your
                recovery code. Kindly check your email, find the code, and enter
                it below to proceed with getting back into your account.
              </span>
            </Box>
          )}
          <Form
            onSubmit={async (data) => {
              setLoading(true)
              const password = generateSecurePassword()
              try {
                const { code } = data
                await forgotPassword(
                  profile?.email || pwResetAddress || '',
                  code,
                  password
                )
                setDone(true)
                setGeneratedPassword(password)
                await passwordResetConfirmation({
                  variables: {
                    email: pwResetAddress ?? profile?.email,
                    password,
                  },
                })
                setPwResetAddress('')
                /*setTimeout(() => {
              router.push('/login')
            }, 5000)*/
              } catch (error: any) {
                console.error(error)
                setLoading(false)
                return error.message ?? 'Authentication failed'
              }
            }}
          >
            {!done ? (
              <TextInput
                label="Code"
                type="text"
                placeholder="Authorisation code"
                required
                validations={{
                  minLength: {
                    value: 6,
                    message: 'Code must be at least 6 characters',
                  },
                  maxLength: {
                    value: 6,
                    message: 'Code must be less than 6 characters',
                  },
                }}
              />
            ) : (
              <></>
            )}
            {!done ? (
              <Button
                buttonType="submit"
                className={`transition-all w-full my-8 ${done ? 'opacity-0 pointer-events-none' : ''
                  }`}
                title="Reset Password"
                loading={loading}
              />
            ) : (
              <></>
            )}
          </Form>
          {done && (
            <Box
              className={`transition-all mb-10 !text-white p-8 bottom-0 left-0 right-0 flex items-center justify-center mt-10 bg-green-400 pointer-events-none ${done ? '' : 'opacity-0'
                } rounded text-center`}
            >
              Thank you very much! Please check your email to find your new
              password!
              <TickIcon className="inline-block h-8 w-8 ml-2" />
            </Box>
          )}
          {done && (
            <Box className="flex justify-center text-center mb-10">
              Haven{`'`}t received your password yet?

            </Box>
          )}

          <Box className="text-sm flex space-x-2 justify-center mb-2 mt-2">
            <span className="">{"Don't have an Account?"}</span>
            <Link className="text-link hover:underline" href="/create-account">
              Sign up
            </Link>
          </Box>
          <Box className="text-sm flex space-x-2 justify-center">
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

export default CodeAuthForm
