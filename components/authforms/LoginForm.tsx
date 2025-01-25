import ForumLogoText from '@public/images/ForumLogoText.svg'
import Logo from '@public/images/ForummLogo.svg'
import { Button } from '@components/inputs/Button'
import { Form } from '@components/inputs/Form'
import { TextInput } from '@components/inputs/TextInput'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@libs/useAuth'
import Link from 'next/link'
import Box from '@components/base/Box'
import { useRouter } from 'next/router'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { useTheme } from '@libs/useTheme'
import { FaEnvelope, FaLock } from 'react-icons/fa'

const LoginForm = () => {
  const { theme, setTheme } = useTheme()
  const { signInWithEmail, currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwords, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emails, setEmail] = useState('');
  const [error, setError] = useState('');

  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      location.href = '/'
    }
  })

  const validateEmail = (value: string) => {
    if (value.length < 7) {
      return 'Email must be at least 7 characters';
    }
    if (value.length > 70) {
      return 'Email must be less than 70 characters';
    }
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailPattern.test(value)) {
      return 'Email must be valid';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value)
    setEmail(value);
    const validationError = validateEmail(value);
    setError(validationError);
  };

  const handlePasswordChange = (value: string, isInvalid?: boolean) => {
    setPassword(value)
  }

  return (
    <Box className="flex w-full justify-center h-screen items-center"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}
    >
      <Box className="flex w-full justify-center items-center max-w-7xl flex-grow overflow-visible">
        <Box className="w-10/12 sm:w-1/3 my-12 p-6 relative">
          <Box className="flex flex-col items-center space-y-2">
            <Box
              onClick={() => (window.location.href = 'https://www.forumm.to')}
              className="text-center text-2xl cursor-pointer cursor-pointer"
            >
              <div className="flex flex-col justify-center items-center mb-12">
                <Logo className="block w-12 mb-2" />
                <ForumLogoText fill={theme.textColour} className="h-6 w-24" />
              </div>

            </Box>
          </Box>
          <Box>
            <Form
              onSubmit={async (data) => {
                setLoading(true)
                try {
                  const email = emails
                  const password = passwords
                  console.log(password)
                  const response = await signInWithEmail(email, password)
                  if (
                    router.query.previous &&
                    !document.referrer.includes('www.forumm.to') &&
                    !document.referrer.includes('//forumm.to')
                  )
                    router.back()
                  else router.push('/')
                } catch (error: any) {
                  console.error(error)
                  setLoading(false)
                  return error.message ?? 'Failed to sign in'
                }
              }}
            >
              <div className="relative flex items-center rounded-3xl bg-[#96B7E8] focus-within:ring-2 focus-within:ring-indigo-400 my-1.5">
                <FaEnvelope className="absolute left-3 text-gray-100" />
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleEmailChange}
                  className="pl-10 p-3 w-full bg-[#96B7E8] text-white placeholder-white focus:outline-none focus:ring-0 border-none rounded-3xl"
                  style={{
                    border: 'none',
                    boxShadow: 'none',
                  }}
                  required
                />
              </div>



              <div className="relative flex items-center rounded-3xl bg-[#96B7E8] focus-within:ring-2 focus-within:ring-indigo-400 my-1.5 text-gray-100">
                <FaLock className="absolute left-3 text-gray-100" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={passwords}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 p-3 w-full bg-[#96B7E8] text-white placeholder-white focus:outline-none focus:ring-0 border-none rounded-3xl text-gray-100"
                  style={{
                    border: 'none',
                    boxShadow: 'none',
                  }}
                  required
                  minLength={8}
                  maxLength={50}
                />
                <button
                  type="button"
                  className="absolute right-3 text-xl text-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                </button>
              </div>
              <Button
                buttonType="submit"
                className="my-4 w-full" // Reduced margin
                title="Log in"
                loading={loading}
                backgroundColor="#3763e9"
                textColor="white"
              />
            </Form>
          </Box>
          <Box className="text-sm flex justify-between w-full mt-2 mb-4">
            <Link className="text-link hover:underline" href="/create-account">
              Create Account
            </Link>
            <Link className="text-link hover:underline" href="/forgot-password">
              Reset Password
            </Link>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}

export default LoginForm
