import { useState, useEffect } from 'react'
import { UnauthenticatedWrapper } from '@layouts/Wrapper'
import { useQuery, useMutation } from '@apollo/client'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import { useAuth } from '@libs/useAuth'
import { TextInput } from '@components/inputs/TextInput'
import LoadingBar from '@components/base/LoadingBar'
import { useRouter } from 'next/router'
import TickIcon from '@public/images/TickIcon.svg'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { RadioFieldInput } from '@components/inputs/RadioFieldInput'
import { GET_ORGANISATIONS } from '@graphql/organisation/getOrganisations'
import { UPDATE_ORGANISATION } from '@graphql/organisation/updateOrganisation'
import { ADMIN_RESET_PASSWORD } from '@graphql/users/adminResetPassword'

export default function Admin() {
  const { push } = useRouter()
  const { profile, isAdmin, isLogged, getPermission, changeAccess } = useAuth()
  const perms = getPermission('USER::ACCESS_ORGANISATION::*').sort((a, b) =>
    a > b ? 1 : a === b ? 0 : -1
  )

  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [organisations, setOrganisations] = useState<any[]>([])
  const [organisation, setOrganisation] = useState<any>('')
  const [formError, setFormError] = useState<string | undefined>()
  const [orgPercentage, setOrgPercentage] = useState<number | undefined>()
  const [orgCurrency, setOrgcurrency] = useState<string>()
  const [ghostedEmail, setGhostedEmail] = useState<string>('')
  const [resetCompleted, setResetCompleted] = useState<boolean>(false)
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>()

  const [adminResetPassword] = useMutation(ADMIN_RESET_PASSWORD)
  const [updateOrganisation] = useMutation(UPDATE_ORGANISATION)
  const { data, loading: apiLoading } = useQuery(GET_ORGANISATIONS, {
    skip: !isAdmin,
  })

  const [form, setForm] = useState({
    currency: '',
    percentage: '',
  })

  useEffect(() => {
    if (!isLogged || (profile && isAdmin === false)) {
      push(`/`)
    }
  }, [profile, isAdmin, isLogged, push])

  useEffect(() => {
    if (data?.getAllOrganisations) {
      setOrganisations(data?.getAllOrganisations)
    }
  }, [data])

  const handleSubmit = async () => {
    setFormError(undefined)
    if (!orgCurrency) return setFormError('A currency is required')
    if (!orgPercentage) return setFormError('A percentage is required')
    if (isNaN(orgPercentage))
      return setFormError('Percentage should be a number')
    if (orgPercentage < 0 || orgPercentage > 90)
      return setFormError('Percentage is invalid')
    setLoading(true)
    await updateOrganisation({
      variables: {
        name: organisation?.name,
        currency: orgCurrency,
        percentage: parseFloat(orgPercentage as unknown as string),
      },
    })
    setLoading(false)
    setCompleted(true)
    setTimeout(() => {
      setCompleted(false)
    }, 2000)
  }

  const handleSetNewPassword = async () => {
    if (ghostedEmail) {
      setLoading(true)
      await adminResetPassword({
        variables: {
          ghostedEmail,
        },
      })
      setResetCompleted(true)
      setLoading(false)
      setGhostedEmail('')
    }
  }

  useEffect(() => {
    if (profile)
      setSelectedOrganisation(profile.university ?? profile.company ?? 'FORUMM')
  }, [profile])

  const handleOrgChange = (e: string) => {
    setSelectedOrganisation(e)
    changeAccess(e)
  }

  if (apiLoading || !profile || !isAdmin) {
    return (
      <Box className="flex-1 overflow-y-scroll scrollbar-hide h-[calc(100vh_-_81px)] relative flex items-center flex-col">
        <LoadingBar />
      </Box>
    )
  }

  return (
    <Box className="overflow-y-scroll scrollbar-hide relative">
      <Box className="flex flex-col w-full justify-center items-center">
        <Box className="flex flex-col sm:px-4 xl:px-16 w-full justify-center items-center">
          <Box className="flex flex-col w-full sm:w-3/4 px-5 sm:px-20 pb-20 text-center justify-center items-center mt-8">
            <Text className="text-2xl sm:text-3xl bold mb-8">
              General Settings
            </Text>
            <>
              <TextInput
                label="Reset email address"
                value={ghostedEmail}
                onChange={(newEmail) => setGhostedEmail(newEmail)}
                type="email"
                placeholder="Provide a user email address"
                className="bg-transparent text-start rounded text-sm outline-none w-full sm:w-1/2 border-box pr-1 mt-2"
              />
              <Button
                className="w-full sm:w-1/2"
                disabled={loading}
                loading={loading}
                title="Reset and send new password"
                onClick={handleSetNewPassword}
              />
              {resetCompleted && (
                <Box
                  className={`transition-all !text-white p-4 flex items-center justify-center mt-2 bg-green-400 pointer-events-none rounded text-center`}
                >
                  The password has been reset
                  <TickIcon className="inline-block h-8 w-8 ml-2" />
                </Box>
              )}
            </>
            {perms.length > 0 && (
              <>
                <Text className="text-2xl sm:text-3xl bold mt-8">
                  Switch Organisation
                </Text>
                <DropdownInput
                  value={selectedOrganisation
                    ?.replaceAll(' ', '_')
                    .toUpperCase()}
                  onChange={(e) => handleOrgChange(e)}
                  options={perms}
                  className="bg-transparent text-start rounded text-sm outline-none w-full sm:w-1/2 border-box"
                />
              </>
            )}{' '}
            <Text className="text-2xl sm:text-3xl bold mt-8">
              Manage Organisations
            </Text>
            <DropdownInput
              className="w-full sm:w-1/2"
              label=""
              placeholder="Select an Organisation"
              options={
                data?.getAllOrganisations
                  .map((item) => item?.name ?? '')
                  .sort((a, b) => (a > b ? 1 : a === b ? 0 : -1)) ?? []
              }
              onChange={(value) => {
                const selection = organisations.filter(
                  (org) => org.name === value
                )?.[0]
                setOrganisation(selection)
                setOrgPercentage(selection?.percentage)
                setOrgcurrency(selection?.currency)
              }}
              value={organisation?.name ?? ''}
            />
            {organisation && (
              <>
                <Box className="sm:w-1/2 text-start justify-start pb-2 mt-10">
                  <RadioFieldInput
                    label="Select currency:"
                    testid={'currency-radio'}
                    options={['USD', 'CAD', 'EUR', 'GBP']}
                    className="font-medium"
                    itemClassName="text-sm mt-4"
                    value={orgCurrency}
                    onChange={(currency) => {
                      setOrgcurrency(currency)
                    }}
                  />
                </Box>
                <TextInput
                  label="Donation Percentage"
                  value={orgPercentage}
                  onChange={(percentage) => setOrgPercentage(percentage)}
                  type="text"
                  placeholder="(%) of donations allocated to the organisation."
                  className="bg-transparent text-start rounded text-sm outline-none w-full sm:w-1/2 border-box pr-1 mt-2"
                />
                {formError && (
                  <Box className="mt-6">
                    <Text className="text-red-500 text-md" ignoreTheme>
                      {formError}
                    </Text>
                  </Box>
                )}
                {completed && (
                  <Box
                    className={`transition-all !text-white p-4 flex items-center justify-center mt-4 bg-green-400 pointer-events-none rounded text-center`}
                  >
                    {organisation?.name} organisation has been updated!
                    <TickIcon className="inline-block h-8 w-8 ml-2" />
                  </Box>
                )}
                <Box className="w-full justify-center flex flex-row mt-4">
                  <Button
                    className="w-full sm:w-1/2"
                    disabled={loading}
                    loading={loading}
                    title="Update"
                    onClick={handleSubmit}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

Admin.Layout = UnauthenticatedWrapper
