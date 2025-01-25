import { useState } from 'react'
import Box from '@components/base/Box'
import { useMutation } from '@apollo/client'
import { useAuth } from '@libs/useAuth'
import { isBusinessEmail } from '@libs/Utility/util'
import { TextInput } from '@components/inputs/TextInput'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import DonationImg02 from '@public/images/donationImg02.svg'
import { ORGANISER_REQUEST_ACCESS } from '@graphql/users/organiserRequestAccess'
import { useTheme } from '@libs/useTheme'
import { CheckboxInput } from '@components/inputs/CheckboxInput'
import Link from 'next/link'

type RequestAccessForm = {
  firstName?: string
  lastName?: string
  organisation?: string
  email?: string
  notes?: string
  agree?: boolean
}

const ApplicationForm = ({}: {}) => {
  const { theme } = useTheme()
  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const { signInWithEmail, currentUser } = useAuth()

  const [form, setForm] = useState<RequestAccessForm>({
    firstName: '',
    lastName: '',
    organisation: '',
    email: '',
    notes: '',
    agree: false,
  })
  const [formError, setFormError] = useState<string | undefined>()
  const [organiserRequestAccess] = useMutation(ORGANISER_REQUEST_ACCESS)

  const validateField = (
    field: string | undefined,
    fieldName: string,
    length: number = 1
  ): string | null => {
    let message = null
    if ((field ?? '').length < length) {
      message = `${fieldName} must be at least ${length} characters long.`
      setFormError(message)
      setLoading(false)
    }
    return message
  }

  const handleSubmit = async () => {
    if (!form.agree)
      return setFormError(
        `You must agree with our privacy notice and consent to be contacted to proceed.`
      )
    setLoading(true)
    setFormError('')
    if (validateField(form?.firstName, 'First Name', 1)) return
    if (validateField(form?.lastName, 'Last Name', 1)) return
    if (validateField(form?.organisation, 'Organisation')) return
    if (validateField(form?.email, 'Email')) return
    if (!isBusinessEmail(form?.email ?? '')) {
      setFormError(
        'The email address you entered is not allowed. Please use your institutional email address, not a personal one like Gmail or Outlook.'
      )
      setLoading(false)
      return
    }

    if (form?.organisation) {
      const forbiddenOrganisations = [
        'forumm',
        '448 studio',
        '448-studio',
        '448studio',
      ]
      if (forbiddenOrganisations.includes(form.organisation.toLowerCase())) {
        setFormError(
          'The organisation name you have provided is not allowed. Please try a different name.'
        )
        setLoading(false)
        return
      }
    }

    const autoLogin = async (email: string, password: string) => {
      try {
        await signInWithEmail(email, password)
        window.location.href = '/dashboard'
      } catch (error: any) {
        setLoading(false)
      }
    }

    await organiserRequestAccess({
      variables: {
        firstName: form?.firstName ?? '',
        lastName: form?.lastName ?? '',
        organisation: form?.organisation ?? '',
        email: form?.email ?? '',
        notes: form?.notes ?? '',
      },
    })
      .then((res) => {
        if (res.data?.organiserRequestAccess.success) {
          setCompleted(true)
          /* commented auto login
          const password = res.data?.organiserRequestAccess.password
          if (password) {
            setTimeout(() => {
              autoLogin(form?.email ?? '', password)
            }, 3000)
          }
          */
        } else {
          setFormError(
            'The provided email address seems to be in use. Please try a different one.'
          )
        }

        setLoading(false)
      })
      .catch((err) => {
        setFormError(
          'The provided email address seems to be in use. Please try a different one.'
        )
        setLoading(false)
        console.error(err)
      })
  }

  if (completed)
    return (
      <Box className="flex flex-col w-full sm:w-3/4 px-5 sm:px-20 pb-20 text-center justify-center items-center">
        <Text className="text-2xl sm:text-4xl bold mb-8 lg:w-1/2">
          You’ve requested to become an Organiser!
        </Text>
        <Box className="flex flex-col justify-center mt-4 mb-4">
          <DonationImg02 />
        </Box>
        <Text className="text-md mt-8  lg:w-1/2">
          That{`'`}s awesome! Someone in our team will review your request and
          be in touch very soon (our email might land in your junk mail; keep an
          eye out for us there too).
        </Text>
      </Box>
    )

  return (
    <Box
      id="organiser-join-form"
      className="flex flex-col w-full sm:w-3/4 px-5 sm:px-20 p-20 text-center justify-center items-center mt-8 rounded-3xl"
      style={{
        backgroundColor:
          theme.type === 'DARK'
            ? 'rgba(0, 0, 0, 0.7)'
            : 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <Text className="text-4xl md:text-5xl !font-poppins font-semibold !text-midnight-light mb-8">
        Get set up as a Forumm Organiser today!
      </Text>
      <Box className="w-full justify-start text-start flex flex-row">
        <TextInput
          placeholder="First Name"
          value={form.firstName}
          onChange={(firstName) => setForm({ ...form, firstName })}
          type="text"
          className="flex bg-transparent rounded text-sm outline-none w-1/2 border-box pr-1 -mt-1"
          validations={{
            minLength: {
              value: 2,
              message: 'First name must be at least 2 characters',
            },
          }}
          required
        />
        <TextInput
          placeholder="Last Name"
          value={form.lastName}
          onChange={(lastName) => setForm({ ...form, lastName })}
          type="text"
          className="flex bg-transparent rounded text-sm outline-none w-1/2 border-box pr-1 -mt-1"
          validations={{
            minLength: {
              value: 2,
              message: 'First name must be at least 2 characters',
            },
          }}
          required
        />
      </Box>
      <Box className="w-full justify-start text-start flex flex-row">
        <TextInput
          value={form.organisation}
          onChange={(organisation) => setForm({ ...form, organisation })}
          type="text"
          placeholder="Institution Name"
          className="flex bg-transparent rounded text-sm outline-none w-1/2 border-box pr-1 -mt-1"
          validations={{
            minLength: {
              value: 1,
              message: 'Institution must be a minimum of 1 character in length',
            },
          }}
          required
        />
        <TextInput
          placeholder="Your Institution Email"
          value={form.email}
          onChange={(email) => setForm({ ...form, email })}
          type="email"
          className="flex bg-transparent rounded text-sm outline-none w-1/2 border-box pr-1 -mt-1"
          required
        />
      </Box>
      {/*<Box className="w-full justify-center text-start flex flex-row">
        <TextInput
          value={form.notes}
          onChange={(notes) => setForm({ ...form, notes })}
          type="text"
          placeholder="(Optional) Your Notes"
          className="bg-transparent rounded text-sm outline-none w-full  border-box pr-1 -mt-1"
        />
        </Box>*/}

      <Box className="w-full text-start flex items-center">
        <CheckboxInput
          isProtected
          value={form.agree}
          onChange={(agree) => {
            setForm({ ...form, agree })
          }}
          className="bg-transparent rounded text-sm border-box pr-1 -mt-1 mx-auto"
          border=""
          label="Acknowledgements"
          required
        >
          <>
            I accept the{' '}
            <Link
              className="text-forumm-blue underline hover:text-forumm-blue font-medium"
              target="_blank"
              href={'/privacy'}
            >
              Privacy Notice
            </Link>{' '}
            and I consent to being contacted by Forumm.
          </>
        </CheckboxInput>
      </Box>
      {formError && (
        <Box className="mt-6">
          <Text className="text-red-500 text-md" ignoreTheme>
            {formError}
          </Text>
        </Box>
      )}
      <Box className="w-full justify-center flex flex-row mt-4">
        <Button
          className="w-full"
          disabled={loading}
          loading={loading}
          title="Request Access"
          onClick={handleSubmit}
        />
      </Box>
    </Box>
  )
}

export default ApplicationForm
