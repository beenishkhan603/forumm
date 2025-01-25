import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import { TextInput } from '@components/inputs/TextInput'
import DonationImg02 from '@public/images/donationImg02.svg'
import { REQUEST_EARLY_ACCESS } from '@graphql/users/requestEarlyAccess'
import { useTheme } from '@libs/useTheme'
import Link from 'next/link'

type JoinForm = {
  email?: string
  firstName?: string
  lastName?: string
  notes?: string
}

function JoinForm() {
  const { theme } = useTheme()
  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [formError, setFormError] = useState<string | undefined>()
  const [consent, setConsent] = useState<boolean>(false)
  const [form, setForm] = useState<JoinForm>({
    email: '',
    firstName: '',
    lastName: '',
    notes: '',
  })

  const [requestEarlyAccess] = useMutation(REQUEST_EARLY_ACCESS)

  const validateField = (
    field: string | undefined,
    fieldName: string,
    type: string
  ): string | null => {
    let message = null
    switch (type) {
      case 'text':
        if ((field ?? '').length < 1) {
          message = `${fieldName} must be at least 1 character long.`
          setFormError(message)
          setLoading(false)
        }
        break
      case 'email':
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        if (!emailRegex.test(field || '')) {
          message = `${fieldName} must be a valid email address.`
          setFormError(message)
          setLoading(false)
        }
        break
    }
    return message
  }

  const handleSubmit = async () => {
    setLoading(true)
    setFormError('')
    if (!consent) {
      setFormError('You should consent to the agreement to continue.')
      return setLoading(false)
    }
    if (validateField(form?.firstName, 'First name', 'text')) return
    if (validateField(form?.lastName, 'Last name', 'text')) return
    if (validateField(form?.email, 'Email', 'email')) return
    await requestEarlyAccess({
      variables: {
        email: form?.email ?? '',
        firstName: form?.firstName ?? '',
        lastName: form?.lastName ?? '',
        notes: form?.notes,
      },
    })
    setLoading(false)
    setCompleted(true)
  }

  return (
    <Box
      id="landing-join-form"
      className="flex justify-center px-0 xs:px-4 sm:mt-10"
    >
      <Box
        className="flex flex-col justify-center items-center max-w-[1500px] p-10 px-10 sm:px-20 rounded-3xl text-center shadow-lg"
        style={{
          backgroundColor:
            theme.type === 'DARK'
              ? 'rgba(0, 0, 0, 0.7)'
              : 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <Text
          className={`mt-4 text-4xl md:text-5xl !font-poppins font-semibold max-w-[600px] ${
            theme.type !== 'DARK' ? '!text-midnight-light' : ''
          }`}
        >
          Get in touch
        </Text>
        <Text className="text-center mt-3 mb-3 max-w-[600px]">
          Leave your details and expect a prompt follow-up from someone in our
          wonderful team.
        </Text>
        <Box className="w-full sm:justify-center sm:items-center">
          {!completed && (
            <form>
              <Box className="flex flex-col justify-between">
                <TextInput
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(firstName) => setForm({ ...form, firstName })}
                  type="text"
                  validations={{
                    minLength: {
                      value: 1,
                      message: 'First name must be at least 1 character',
                    },
                    maxLength: {
                      value: 20,
                      message: 'First name must be less than 20 characters',
                    },
                  }}
                  className="flex pr-0.5"
                  required
                />
                <TextInput
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(lastName) => setForm({ ...form, lastName })}
                  type="text"
                  validations={{
                    minLength: {
                      value: 1,
                      message: 'Last name must be at least 1 character',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Last name must be less than 20 characters',
                    },
                  }}
                  className="flex pl-0.5"
                  required
                />
              </Box>
              <TextInput
                placeholder="Email"
                className="pb-1 mt-1"
                value={form.email}
                onChange={(email) => setForm({ ...form, email })}
                type="email"
                required
              />
              <TextInput
                placeholder="Notes (Optional)"
                className="pb-5"
                value={form.notes}
                onChange={(notes) => setForm({ ...form, notes })}
                type="text"
              />
              {formError && (
                <Box className="mb-5 text-center">
                  <Text className="text-red-500 text-md" ignoreTheme>
                    {formError}
                  </Text>
                </Box>
              )}
              <Box className="flex justify-center gap-1 pb-5">
                <Box className="flex flex-col gap-2">
                  <Text className="line-clamp-1 text-sm">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setConsent(event.target.checked)
                      }
                    />
                    &nbsp;&nbsp;I consent to being contacted by Forumm.
                  </Text>
                  <Text className="line-clamp-1 text-sm">
                    View{' '}
                    <Link
                      href={`/privacy`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-forumm-blue underline hover:text-forumm-blue font-medium"
                    >
                      Privacy Notice
                    </Link>
                  </Text>
                </Box>
              </Box>
              <Button
                className="w-full mb-2"
                size="auto"
                title="Submit"
                disabled={loading}
                loading={loading}
                onClick={handleSubmit}
              />
            </form>
          )}
          {completed && (
            <Box className="flex flex-col max-w-sm justify-center items-center mb-5 mx-auto">
              <DonationImg02 className="mb-5" />
              <Text className="text-md text-left">
                Thanks for contacting us, we will review your request shortly
                and be in touch very soon (our email might land in your junk
                mail; keep an eye out for us there too).{' '}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default JoinForm
