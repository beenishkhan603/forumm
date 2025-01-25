import { useMutation } from '@apollo/client'
import TickIcon from '@public/images/TickIcon.svg'
import { Button } from '@components/inputs/Button'
import { Form } from '@components/inputs/Form'
import { TextInput } from '@components/inputs/TextInput'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Box from '@components/base/Box'
import { CHANGE_PASSWORD } from '@graphql/users/changePassword'
import { validateCognitoPassword } from '@libs/Utility/util'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

const ChangePasswordForm = () => {
  const [changePassword] = useMutation(CHANGE_PASSWORD)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const router = useRouter()

  return (
    <Box className="w-full md:w-1/2 my-16 relative">
      <Box
        className={`absolute transition-all !text-white p-8 top-0 bottom-0 left-0 right-0 flex items-center justify-center h-24 mt-auto bg-green-500 pointer-events-none ${
          done ? '' : 'opacity-0'
        } rounded text-center`}
      >
        Your password has been successfully updated!
        <TickIcon className="inline-block h-8 w-8 ml-2" />
      </Box>
      <Box className="text-white text-center text-2xl font-bold pl-3 md:pl-0">
        Change Password
      </Box>
      <Form
        onSubmit={async (data) => {
          setLoading(true)
          try {
            const { newPassword, confirmNewPassword } = data
            if (newPassword !== confirmNewPassword) {
              setLoading(false)
              return 'New password and confirmation do not match.'
            }
            const isValid = validateCognitoPassword(newPassword)
            if (!isValid) {
              setLoading(false)
              return 'Please ensure your password meets the following criteria: at least 8 characters, including a mix of upper and lower case letters, numbers, and special characters.'
            }
            await changePassword({
              variables: {
                password: newPassword,
              },
            })
            setDone(true)
            setTimeout(() => {
              router.push('/user')
            }, 2000)
          } catch (error: any) {
            console.error(error)
            setLoading(false)
            return error.message ?? 'Failed to sign in'
          }
        }}
      >
        <Box className="relative">
          <TextInput
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            placeholder={showPassword ? 'New password' : '*******'}
            required
            validations={{
              minLength: {
                value: 8,
                message: 'Password is too short',
              },
              maxLength: {
                value: 50,
                message: 'Password is too long',
              },
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-[15px] text-xl items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
          </button>
        </Box>
        <Box className="relative">
          <TextInput
            type={showRePassword ? 'text' : 'password'}
            label="Confirm New Password"
            placeholder="Please retype your new password"
            required
            validations={{
              minLength: {
                value: 8,
                message: 'Password is too short',
              },
              maxLength: {
                value: 50,
                message: 'Password is too long',
              },
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-[15px] text-xl items-center"
            onClick={() => setShowRePassword(!showRePassword)}
          >
            {showRePassword ? <MdVisibility /> : <MdVisibilityOff />}
          </button>
        </Box>
        <Button
          buttonType="submit"
          className={`transition-all w-full my-8 ${
            done ? 'opacity-0 pointer-events-none' : ''
          }`}
          title="Change Password"
          loading={loading}
        />
      </Form>
    </Box>
  )
}

export default ChangePasswordForm
