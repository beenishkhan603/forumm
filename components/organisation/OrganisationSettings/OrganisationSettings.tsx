import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_ORGANISATION } from '@graphql/organisation/updateOrganisation'
import { GET_ORGANISATION_BY_NAME } from '@graphql/organisation/getOrganisationByName'
import Image from 'next/image'
import { Button } from '@components/inputs/Button'
import Box from '@components/base/Box'
import { FileInput } from '@components/inputs/FileInput'
import { ColorPicker } from '@components/inputs/ColorPicker'
import useFileUploader from '@libs/useFileUploader'
import TickIcon from '@public/images/TickIcon.svg'
import { useTheme } from '@libs/useTheme'
import { RadioFieldInput } from '@components/inputs/RadioFieldInput'
import { useBlackBaud } from '@libs/useBlackBaud'
import { useAuth } from '@libs/useAuth'
import { useRouter } from 'next/router'
import Modal from '@components/base/Modal'
import { BiCog, BiRightArrowAlt } from 'react-icons/bi'
import { CREATE_MERCHANT } from '@graphql/users/createMerchant'
import { GET_IS_MERCHANT } from '@graphql/users/getMerchantAccount'
import { ErrorType } from '@libs/ErrorHandler/error.type'

export default function OrganisationSettings({ name }: { name: string }) {
  const uploadFile = useFileUploader()
  const { initiateOAuth, onCallback, accessToken, completed } = useBlackBaud()

  const [updateOrganisation] = useMutation(UPDATE_ORGANISATION)
  const [logo, setLogo] = useState<string | File | undefined>()
  const [mainColour, setMainColour] = useState<string | undefined>()
  const [orgCurrency, setOrgcurrency] = useState<string>('GBP')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [updated, setUpdated] = useState<boolean>(false)
  const { updateHighlightColour } = useTheme()
  const { isOrganizer, isAdmin, profile } = useAuth()
  const router = useRouter()

  if (!isOrganizer && !isAdmin) {
    router.push('/')
  }

  const { data: organisationData } = useQuery(GET_ORGANISATION_BY_NAME, {
    variables: {
      name,
    },
    skip: !name,
  })

  useEffect(() => {
    if (organisationData?.getOrganisationByName) {
      const {
        mainColour: currentMainColour,
        logoImage,
        currency,
      } = organisationData?.getOrganisationByName
      if (logoImage) setLogo(logoImage)
      if (currentMainColour) setMainColour(currentMainColour)
      if (currency) setOrgcurrency(currency)
    }
  }, [organisationData])

  useEffect(() => {
    // Check if the URL contains the OAuth callback parameters
    if (
      window.location.search.includes('code') &&
      window.location.search.includes('state')
    ) {
      onCallback(window.location.href, name)
    }
  }, [onCallback, name])

  const handleUpdateOrganisation = async () => {
    const variables = {
      name,
      mainColour,
      logoImage: logo,
      currency: orgCurrency,
    } as {
      name: string
      mainColour?: string
      logoImage?: string
      currency?: string
    }
    if (typeof logo === 'string') {
      variables.logoImage = logo
    }
    setIsLoading(true)
    await updateOrganisation({
      variables,
    })
    setIsLoading(false)
    if (variables.mainColour !== undefined && updateHighlightColour) {
      updateHighlightColour(variables?.mainColour)
    }

    setUpdated(true)
    setTimeout(() => {
      setUpdated(false)
    }, 3000)
  }

  const handleBlackBaud = () => {
    initiateOAuth()
  }

  const publicUrl =
    window.location.origin +
    '/org/' +
    organisationData?.getOrganisationByName?.url
  const previewLogo = typeof logo === 'string' ? logo : '/images/ForummLogo.svg'
  const connectedToBlackBaud =
    completed || organisationData?.getOrganisationByName?.blackBaudAccessToken

  const [errors, setErrors] = useState<ErrorType | undefined>(undefined)
  const [createMerchant] = useMutation(CREATE_MERCHANT)
  const { data: merchantQueryData } = useQuery(GET_IS_MERCHANT, {
    variables: {
      input: { userId: profile?.userId, company: profile?.company },
    },
  })

  const merchantData = (() => {
    if (!merchantQueryData) return {}

    const { merchantAccountExists, required, chargesEnabled } =
      merchantQueryData.getMerchantAccount

    return {
      isMerchant: merchantAccountExists,
      onboardingComplete: required && required.length < 1,
      chargesEnabled,
      isMerchantComplete:
        merchantAccountExists &&
        chargesEnabled &&
        required &&
        required.length < 1,
    }
  })()

  const { query } = useRouter()

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showStripeModal, setShowStripeModal] = useState(false)
  const [isLinkButtonLoading, setLinkButtonLoading] = useState(false)

  const handleStripeConnect = async (
    e: React.MouseEvent,
    isInitialSetup: boolean = true
  ) => {
    e.preventDefault()
    setLinkButtonLoading(true)

    if (!profile?.userId)
      throw new Error('You must be logged in to create a merchant account.')

    await createMerchant({
      variables: {
        input: {
          userId: profile.userId,
        },
      },
    })
      .then((data) => {
        if (data.errors) throw data.errors
        window.location.href = data.data?.createMerchant.redirectUrl!
        setLinkButtonLoading(false)
      })
      .catch((err) => {
        setErrors({ message: err[0].message })
        setLinkButtonLoading(false)
      })
  }

  useEffect(() => {
    if (query.stripeconfirmed === 'true') setShowConfirmationModal(true)
  }, [query])

  const successModal = (
    <Modal
      title="Stripe Connect Confirmation"
      show={showConfirmationModal}
      setShow={setShowConfirmationModal}
    >
      <Box className="flex flex-col mx-10 text-sm font-light">
        <Box className="flex flex-col items-center">
          <Box className="py-2 flex font-bold text-2xl">
            You have successfully linked your Stripe account.
          </Box>
        </Box>
      </Box>
    </Modal>
  )

  const stripeModal = (
    <Modal
      title="Stripe Settings"
      show={showStripeModal}
      setShow={setShowStripeModal}
    >
      <Box className="flex flex-col mx-10 text-sm font-light">
        <Box className="flex flex-col">
          Once all of the following requirements are met, you can begin to
          accept payments through Stripe Connect.
          <Box className="py-2 flex font-bold mt-2">
            Stripe Account Created:{' '}
            <span className="pl-2">
              {merchantData.isMerchant ? '✔' : '❌'}
            </span>
          </Box>
          <Box className="py-2 flex font-bold">
            Onboarding Complete:{' '}
            <span className="pl-2">
              {merchantData.onboardingComplete ? '✔' : '❌'}
            </span>
          </Box>
          <Box className="py-2 flex font-bold">
            Stripe Account Activated:{' '}
            <span className="pl-2">
              {merchantData.chargesEnabled ? '✔' : '❌'}
            </span>
          </Box>
          {!merchantData.isMerchantComplete && (
            <Box className="py-2 flex">
              Please complete the stripe connect onboarding process.
              <Button
                title="Setup"
                icon={<BiRightArrowAlt />}
                iconPos="end"
                className="ml-2"
                buttonType="button"
                type="tertiary"
                loading={isLinkButtonLoading}
                onClick={(e) => handleStripeConnect(e, false)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  )

  const generateStripeConnectButton = () => {
    const connectedUI = (
      <Button
        title="Stripe"
        icon={<BiCog />}
        iconPos="end"
        className="ml-2"
        buttonType="button"
        loading={isLinkButtonLoading}
        onClick={() => setShowStripeModal(true)}
      />
    )

    if (merchantData.isMerchantComplete) return connectedUI

    if (!merchantData.isMerchant)
      return (
        <Button
          title="Connect Stripe"
          className="ml-2"
          buttonType="button"
          loading={isLinkButtonLoading}
          onClick={handleStripeConnect}
        />
      )

    if (!merchantData.chargesEnabled || !merchantData.onboardingComplete)
      return (
        <Button
          title="Stripe"
          icon={<BiCog />}
          iconPos="end"
          className="ml-2"
          buttonType="button"
          loading={isLinkButtonLoading}
          onClick={() => setShowStripeModal(true)}
        />
      )

    return connectedUI
  }

  return (
    <Box className="flex justify-center mb-10 mt-20">
      {successModal}
      {stripeModal}
      <Box className="flex flex-col items-center mt-14 text-white max-w-md w-full">
        <Box className="text-3xl">Organisation Settings</Box>
        <Box className="pt-2 justify-center flex flex-col">
          <Box className="relative justify-center  mb-8">
            <Image
              src={previewLogo}
              width={160}
              height={160}
              alt="Profile Image"
              className="w-40 h-40 bg-contain bg-center rounded-full object-cover mt-8 ml-4"
            />
            <Box className="absolute top-10 right-2">
              <FileInput
                uploadFile={uploadFile}
                value={logo}
                onChange={(data) => {
                  setLogo(data)
                }}
                minified
              />
            </Box>
          </Box>
          <ColorPicker
            className="font-medium"
            value={mainColour}
            label="Main Organisation Colour:"
            onChange={(newColour) => {
              setMainColour(newColour)
            }}
          />
          <Box className="pb-2 mt-10">
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

          {generateStripeConnectButton()}
          <Box className="mt-10">
            <p className="font-medium mb-1">Organisation Public URL:</p>
            <p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0052DD]"
                href={publicUrl}
              >
                {publicUrl}
              </a>
            </p>
          </Box>
        </Box>
        {updated && (
          <Box
            className={`transition-all !text-white p-4 flex items-center justify-center mt-4 bg-green-400 pointer-events-none rounded text-center`}
          >
            Your organisation has been updated!
            <TickIcon className="inline-block h-8 w-8 ml-2" />
          </Box>
        )}
        {connectedToBlackBaud && (
          <span
            onClick={handleBlackBaud}
            className="w-full mt-6 text-center text-xs cursor-pointer"
          >
            <b>Connected to Blackbaud.</b> To keep your session secure, it may
            expire after some time. Please, use the button below to refresh your
            session when needed.
          </span>
        )}
        <Button
          type="secondary"
          loading={isLoading}
          onClick={handleBlackBaud}
          className="w-full mt-2"
          title={!connectedToBlackBaud ? 'Connect to BlackBaud' : 'Reconnect'}
        />
        <Button
          loading={isLoading}
          onClick={handleUpdateOrganisation}
          className="w-full mt-8"
          title="Save Changes"
        />
      </Box>
    </Box>
  )
}
