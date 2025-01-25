import ForumLogoText from '@public/images/ForumLogoText.svg'
import Logo from '@public/images/ForummLogo.svg'
import { useMutation } from '@apollo/client'
import { Button } from '@components/inputs/Button'
import { Form } from '@components/inputs/Form'
import { TextInput } from '@components/inputs/TextInput'
import { isBusinessEmail } from '@libs/Utility/util'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@libs/useAuth'
import Text from '@components/base/Text'
import { SearchInput } from '@components/inputs/SearchInput'
import { universityNames } from '@libs/universities'
import { CREATE_USER } from '@graphql/users/createUser'
import Link from 'next/link'
import Box from '@components/base/Box'
import { MdInfoOutline } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useTheme } from '@libs/useTheme'
import DarkModeIcon from '@public/images/DarkModeIcon.svg'
import LightModeIcon from '@public/images/LightModeIcon.svg'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const genericError =
  "Sorry, we couldn't create an account with that email. Please try using a different one"

const SignUpForm = () => {
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [createUser] = useMutation(CREATE_USER)
  const { currentUser } = useAuth()
  const router = useRouter()
  const [names, setName] = useState('');
  const [emails, setEmail] = useState('');
  const [passwords, setPassword] = useState('');
  const [university, setUniversity] = useState('');


  useEffect(() => {
    if (currentUser) {
      location.href = '/dashboard'
    }
  })

  const CustomIcon = () => {
    const { theme } = useTheme()

    return theme.type === 'DARK' ? <DarkModeIcon /> : <LightModeIcon />
  }

  const handleSubmit = async (data: { [label: string]: string }) => {
    setLoading(true)
    setError('')
    try {
      const {university, universityOrSchool } = data
      const email = emails
      const name = names 
      const operationResult = await createUser({
        variables: {
          university: university || universityOrSchool,
          email,
          name,
        },
      })
      setLoading(false)
      if (operationResult?.errors) {
        const existsException = operationResult?.errors?.[0]?.message?.includes(
          'UsernameExistsException'
        )
        let loginError = existsException
          ? `You've already registered with that email address. Please try a different one or log in.`
          : genericError
        setError(loginError)
      } else {
        setCompleted(true)
      }
    } catch (error: any) {
      setError(genericError)
    }
  }
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  if (completed) {
    return (
      <Box className="w-4/5 sm:w-1/2 mt-20">
        <Box className="flex flex-col space-y-2">
          <Box className="text-center text-2xl">
          <div className="flex flex-col justify-center items-center mb-12">
                <Logo className="block w-12 mb-2" />
                <ForumLogoText fill={theme.textColour} className="h-6 w-24" />
              </div>
            <p>Please check your inbox</p>
          </Box>
        </Box>
        <Box className="flex justify-center  text-center mx-auto">
          <Text>
            {`We've sent an email to the address you've provided. Please follow the instructions inside to finalise your sign-up.`}
          </Text>
        </Box>
        <Box className="text-sm flex space-x-2 justify-center mt-8">
          <Link className="text-link hover:underline" href="/login">
            Back to Log in
          </Link>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="w-4/5 sm:w-1/2 mt-2 md:mt-20">
      {/*<div className="absolute top-0 right-0 mt-4 mr-4">
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
      <Box className="flex flex-col items-center space-y-2">
        <Box
          onClick={() => (window.location.href = 'https://www.forumm.to')}
          className="text-center text-2xl cursor-pointer"
        >
           <div className="flex flex-col justify-center items-center mb-12">
                <Logo className="block w-12 mb-2" />
                <ForumLogoText fill={theme.textColour} className="h-6 w-24" />
              </div>
          <p>Sign up to get started</p>
        </Box>
      </Box>
      <Box>
        <Form onSubmit={handleSubmit} error={error}>
          <div className="relative flex items-center rounded-3xl bg-[#96B7E8] focus-within:ring-2 focus-within:ring-indigo-400">
            <FaUser className="absolute left-3 text-gray-100" />
            <input
              id="name"
              type="text"
              placeholder="Name"
              className="pl-10 p-3 w-full bg-[#96B7E8] text-white placeholder-white focus:outline-none focus:ring-0 border-none rounded-3xl"
              style={{
                border: 'none',
                boxShadow: 'none',
              }}
              required
              minLength={2}
              maxLength={70}
              pattern="^[a-zA-Z ,.'-]+$"
              title="Name must consist of letters only"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z ,.'-]/g, ''); // Remove invalid characters
              }}
              value={names}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <SearchInput
            className="mt-6 bg-[#96B7E8] placeholder-white rounded-2xl"
            addValueInOptions
            required={true}
            placeholder="Find your university or school"
            options={universityNames.map((n) => ({ id: n, label: n }))}
            labelBgColour='white'
          />
          <div
            style={{
              border: 'none',
              boxShadow: 'none'
            }}
            className="text-xs mb-6 mt-1 flex"
          >
            <MdInfoOutline className="mr-1 text-xl" />
            <span className="mt-[2px]">
              Can&apos;t find your university or school? Please proceed with the
              sign-up process, and we&apos;ll handle it from here.
            </span>
          </div>
          <Button
            buttonType="submit"
            className="my-8 w-full"
            title="Sign up"
            loading={loading}
            textColor="white"
          />
        </Form>
      </Box>
      <Box className="text-sm flex space-x-2 justify-center mb-8 mt-4">
        <span className="">Already registered?</span>
        <Link className="text-link hover:underline" href="/login">
          Log in
        </Link>
      </Box>
    </Box>
  )
}

export default SignUpForm
