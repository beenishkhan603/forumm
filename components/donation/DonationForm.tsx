import React, { useState, useEffect, useMemo } from 'react'
import { cloneDeep } from 'lodash'
import Image from 'next/image'
import { useMutation } from '@apollo/client'
import DonationImg01 from '@public/images/donationImg01.svg'
import DonationImg02 from '@public/images/donationImg02.svg'
import StripeImg from '@public/images/Stripe.svg'
import GiftAid from '@public/images/GiftAid.png'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js'
import { PaymentRequest as StripePaymentRequest } from '@stripe/stripe-js'
import { TextInput } from '@components/inputs/TextInput'
import { RadioFieldInput } from '@components/inputs/RadioFieldInput'
import { useRouter } from 'next/router'
import { AiOutlineLeft } from 'react-icons/ai'
import { FaExternalLinkAlt } from 'react-icons/fa'

import {
  EventDetails,
  FundraisingProgram,
  PaymentType,
} from '@graphql/__generated/graphql'
import { Button } from '@components/inputs/Button'
import { ItemPicker } from '@components/inputs/ItemPicker'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ToggleInput } from '@components/inputs/ToggleInput'
import QRCode from 'qrcode.react'
import Box from '@components/base/Box'
import { EVENT_DONATON_CREATE_PAYMENT_INTENT } from '@graphql/events/eventDonationCreatePaymentIntent'
import { EVENT_DONATON_SEND_STRIPE_MAIL } from '@graphql/events/eventDonationSendStripeMail'
import Modal from '@components/base/Modal'
import { useTheme } from '@libs/useTheme'
import useStatistics from '@libs/useStatistics'
import { Donation } from 'pages/donation/[donationUrl]'
import moment from 'moment'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { PriceInput } from '@components/inputs/PriceInput'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import currencies from '@libs/currencies'
import { IoClose } from 'react-icons/io5'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'
import { AiFillApple } from 'react-icons/ai'
import { AiOutlineCreditCard } from 'react-icons/ai'
import { AiOutlineGoogle } from 'react-icons/ai'
import { roundAmount } from '@libs/Utility/util'
import RichTextDisplay from '@components/base/RichTextDisplay'
import {
  getBankingCountryByPaymentMethod,
  getDonationTotal,
  getProcessorFees,
} from '@libs/Stripe/util'
import { STRIPE_PAYMENT_FEES } from '@libs/Stripe/processor-fees'
import Link from 'next/link'
import {
  DonationRules,
  getValidationRules,
  isFieldRequired,
  validate,
} from '@libs/Utility/validation'

const ModalFlow = [
  { title: 'Programme', step: 0 },
  { title: 'Donation', step: 1 },
  { title: 'Payment', step: 2 },
  { title: 'Gift Aid', step: 3 },
  { title: 'Wall', step: 4 },
  { title: 'Details', step: 5 },
  { title: '', step: 6 },
]

const PaymentMethods = {
  APPLE_PAY: 'Apple pay',
  CARD: 'Card',
  DIRECT_DEBIT: 'Direct Debit',
  GOOGLE_PAY: 'Google pay',
}

const SKIP_GITFT_AID_EVENT_LIST = [
  'launch-foods-foundation',
  'sussex-hardship-appeal-us',
  // '448-studio-923213',
]

const CUSTOM_GIFT_AID_COPY = [
  { eventId: 'd9232843-4c2d-4f7f-b2d8-ab89499cd9d1', step: 'sussex' },
  { eventId: 'c52572c0-4a42-4ba1-b834-8d5500740dd4', step: 'sussex' },
]

const IS_ONE_TIME_PAY = 'One-time card'
const IS_REGULAR_DIRECT_DEBIT = 'Regular Direct Debit'

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua & Deps',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Rep',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo {Democratic Rep}',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland {Republic}',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea North',
  'Korea South',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar, {Burma}',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russian Federation',
  'Rwanda',
  'St Kitts & Nevis',
  'St Lucia',
  'Saint Vincent & the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome & Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad & Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]

const DonationForm = ({
  organisationCurrency,
  platformFee,
  eventDetails,
  programs,
  eventId,
  isOpen,
  setIsOpen,
  refetchDonations,
  initialValue,
  formCTA,
  onComplete = () => {},
  disablePayment = false,
}: {
  organisationCurrency: string
  platformFee: number
  eventDetails: EventDetails
  programs?: FundraisingProgram[]
  eventId: string
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
  refetchDonations?: () => void
  initialValue?: {
    selectedProgram?: string
  }
  formCTA?: string
  onComplete?: (donationData: any) => void
  disablePayment?: boolean
}) => {
  const statisticId = useStatistics()
  const configSkipGiftAidStep = SKIP_GITFT_AID_EVENT_LIST.includes(
    eventDetails?.donationUrl ?? ''
  )
  const [paymentError, setPaymentError] = useState<string | undefined>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [disable, setDisable] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [giftAidStep, setGiftAidStep] = useState<number | string>(1)
  const [altPaymentEnabled, setAltPaymentEnabled] = useState<boolean>(false)
  const { theme, StaticColours } = useTheme()

  const onlyOneTimePayments = ['sussex-hardship-appeal-us'].includes(
    eventDetails?.donationUrl ?? ''
  )

  const selectionColour =
    theme.type === 'DARK'
      ? StaticColours.v2.dark_light_blue
      : StaticColours.v2.light_blue

  const [modalStage, setModalStage] = useState(ModalFlow[0])

  const [validPaymentDetails, setValidPaymentDetails] = useState({
    number: false,
    mmaa: false,
    cvc: false,
  })

  const [stripeCardCompleted, setStripeCardCompleted] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState<any>()
  const [paymentRequest, setPaymentRequest] =
    useState<StripePaymentRequest | null>(null)

  const initialState = {
    currency: organisationCurrency,
    amount: 100,
    donator: { dob: '', title: '', firstName: '', lastName: '', email: '' },
    message: '',
    donatedAt: moment().toISOString(),
    program: initialValue?.selectedProgram ?? programs?.[0].title ?? '',
    payment: {
      method: 'CARD',
      isRecurring: false,
      coverPlatformFee: false,
      coverTrxFee: false,
      giftAid: false,
      giftAidConfirm: false,
      card_details: {
        number: '',
        exp_date: '',
        CVC: '',
        post_code: '',
        address: '',
      },
    },
    paymentType: PaymentType.Card,
    selectedRecurrency: '',
    homeAddress: undefined,
    addressCountry: 'United Kingdom',
    visibility: 'Name & amount',
    directDebit: {
      name: '',
      number: '',
      sort: '',
      confirmDirectDebit: false,
    },
  }

  const [modalData, setModalData] = useState<Donation>(cloneDeep(initialState))
  const [isGooglePayEnabled, setIsGooglePayEnabled] = useState(false)

  const hasPrograms = !!programs && programs?.length > 0

  useEffect(() => {
    if (modalStage.step === 0)
      setModalStage(ModalFlow[!programs || programs?.length < 1 ? 1 : 0])
    if (programs && programs.length > 0) {
      setModalData({
        ...modalData,
        program: programs?.[0]?.title?.toUpperCase() ?? '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programs])

  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    setIsMobile(
      /iPhone|Android|iPod|Windows Phone|BlackBerry/i.test(
        navigator.userAgent
      ) && !/iPad|Tablet/i.test(navigator.userAgent)
    )
  }, [])

  useEffect(() => {
    if (initialValue?.selectedProgram) {
      setModalData({
        ...modalData,
        program:
          initialValue?.selectedProgram ??
          programs?.[0]?.title?.toUpperCase() ??
          '',
      })
    }
  }, [initialValue])

  const [eventDonationCreatePaymentIntent] = useMutation(
    EVENT_DONATON_CREATE_PAYMENT_INTENT
  )

  const [eventDonationSendStripeMail] = useMutation(
    EVENT_DONATON_SEND_STRIPE_MAIL
  )

  const router = useRouter()
  const shareUrl = `https://${window.location.hostname}${router.asPath}`

  useEffect(() => {
    if (!stripe || !eventId || !isMobile) return
    const params = new URLSearchParams(window.location.search)
    const urlCurrency = params.get('currency')
    const urlAmount = params.get('amount')
    const parsedAmount = urlAmount ? parseFloat(urlAmount) : null
    const urlCoverFee = params.get('coverFee')
    const parsedCoverFee = urlCoverFee
      ? urlCoverFee.toLowerCase() === 'true'
      : false
    if (urlCurrency && parsedAmount) {
      setModalData({
        ...modalData,
        currency: urlCurrency,
        amount: parsedAmount,
        program: programs?.[0]?.title?.toUpperCase() ?? '',
        payment: {
          ...modalData.payment,
          method: 'APPLE_PAY',
          coverPlatformFee: parsedCoverFee,
          coverTrxFee: parsedCoverFee,
        },
      })

      if (setIsOpen) setIsOpen(true)

      handleAlternativeMethods(
        parsedAmount,
        parsedCoverFee,
        urlCurrency,
        () => {
          setModalStage(ModalFlow[5])
        }
      )
    }
    // eslint-disable-next-line
  }, [stripe, elements, eventId])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const firstName = params.get('first') ?? ''
    const lastName = params.get('last') ?? ''
    const email = params.get('email') ?? ''
    setModalData({
      ...modalData,
      donator: { ...modalData.donator, firstName, lastName, email },
      program: programs?.[0]?.title?.toUpperCase() ?? '',
    })
  }, [])

  useEffect(() => {
    const customGiftAid = CUSTOM_GIFT_AID_COPY.find(
      (a) => a.eventId === eventId
    )
    if (!!customGiftAid) setGiftAidStep(customGiftAid.step)
  }, [eventId, isOpen])

  const handleAlternativeMethods = async (
    amount: number,
    coverFee: boolean,
    currency: string,
    onPaymentRequestReady?: () => void
  ) => {
    if (!stripe) return
    setLoading(true)

    const promise = new Promise((resolve, _reject) => {
      /* in promise */
      const trx = getDonationTotal({
        amount: amount * 100,
        platformFee: platformFee,
        coverPlatformFee: coverFee,
        coverProcessorFee: coverFee,
      })

      console.log('DEBUG: generating paymentRequestInstance')

      const paymentRequestInstance = stripe.paymentRequest({
        country: 'GB',
        currency: currency.toLowerCase(),
        total: { label: 'Donation', amount: Math.ceil(trx.total) },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      console.log('DEBUG: paymentRequestInstance:', paymentRequestInstance)

      paymentRequestInstance
        .canMakePayment()
        .then((result) => {
          if (result) {
            setPaymentRequest(paymentRequestInstance)
            if (onPaymentRequestReady) onPaymentRequestReady()
          }
          console.log('DEBUG: paymentRequestInstance resolved', result)
          return resolve(true)
        })
        .catch((error) => {
          console.error('Error in canMakePayment:', error)
          return resolve(null)
        })

      paymentRequestInstance.on('paymentmethod', async (e) => {
        const payerEmail = e.payerEmail
        const [payerFirstName, payerLastName] = e.payerName
          ? e.payerName.split(' ')
          : [undefined, undefined]
        setLoading(true)
        const newPaymentIntent = await getPaymentIntent({
          amount,
          paymentMethodType: 'card',
          paymentMethodId: e.paymentMethod.id,
          paymentMethodRegionCode: e.paymentMethod.card?.country ?? undefined,
          includeFee: coverFee,
          payerFirstName,
          payerLastName,
          payerEmail,
        })
        if (newPaymentIntent?.error) {
          setLoading(false)
          setPaymentError(newPaymentIntent.error)
          e.complete('fail')
          return
        }
        if (newPaymentIntent?.clientSecret) {
          const { error: stripeError, paymentIntent } =
            await stripe.confirmCardPayment(
              newPaymentIntent.clientSecret,
              {
                payment_method: e.paymentMethod.id,
              },
              { handleActions: false }
            )
          if (stripeError) {
            setLoading(false)
            setPaymentError(stripeError.message)
            e.complete('fail')
            return
          }
          setLoading(false)
          setModalStage(ModalFlow[ModalFlow.length - 1])
          eventDonationSendStripeMail({
            variables: {
              eventId,
              firstName: modalData.donator.firstName,
              lastName: modalData.donator.lastName,
              email: modalData.donator.email,
            },
          })
          if (refetchDonations) refetchDonations()
          e.complete('success')
        }
      })
      setLoading(false)
      setPaymentError('')
      /* in promise end */
    })
    return promise
  }

  const checkforAlternatePaymethods = async () => {
    const promise = new Promise((resolve, _reject) => {
      if (!stripe) return resolve(null)
      const paymentRequestInstance = stripe.paymentRequest({
        country: 'GB',
        currency: organisationCurrency
          ? organisationCurrency.toLowerCase()
          : 'gbp',
        total: { label: 'Donation', amount: Math.ceil(10 * 100) },
        requestPayerName: true,
        requestPayerEmail: true,
      })
      paymentRequestInstance
        .canMakePayment()
        .then((result) => {
          console.log('DEBUG: keep to verify result on https env:', result)
          if (result) {
            setAltPaymentEnabled(true)
          }
          return resolve(result)
        })
        .catch((error) => {
          console.error('Error in canMakePayment:', error)
          return resolve(null)
        })
    })
    return promise
  }

  const isGooglePayAvailable = async () => {
    if (!window.PaymentRequest) return false
    const methodData = [{ supportedMethods: 'https://google.com/pay' }]
    try {
      const request = new PaymentRequest(methodData, {
        total: {
          label: 'Verification Purchase',
          amount: { currency: 'USD', value: '0.01' },
        },
      })
      return await request.canMakePayment()
    } catch (err) {
      return false
    }
  }

  const amount = modalData?.amount ? parseFloat(`${modalData.amount}`) : 0

  const baseAmount = `${
    currencies[organisationCurrency ?? 'GBP'].symbol
  }${roundAmount(amount)}`

  const amountWithFee = `(${
    currencies[organisationCurrency ?? 'GBP'].symbol
  }${roundAmount(
    getDonationTotal({
      amount: amount * 100,
      platformFee,
      regionCode: getBankingCountryByPaymentMethod(paymentMethod),
      coverPlatformFee: true,
      coverProcessorFee: true,
    }).total / 100
  )})`

  const feeOptions = [
    `No, not today (${baseAmount})`,
    `Yes, cover the fees ${amountWithFee}`,
  ]
  const donationTypeOptions = ['One-Time Donation', 'Recurring Donation']

  const isContinueDisabled = useMemo(() => {
    const { paymentType, donator, directDebit } = modalData

    // Validation Checks
    const isCardNumberCompleted =
      validPaymentDetails.number || stripeCardCompleted
    const hasBasicCardValidations =
      !!donator.firstName &&
      !!donator.lastName &&
      !!donator.email &&
      !!isCardNumberCompleted &&
      !!validPaymentDetails.mmaa &&
      !!validPaymentDetails.cvc
    //payment.card_details?.address &&
    //payment.card_details?.post_code

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    const isValidEmail = emailRegex.test(donator.email)
    const hasBasicDonatorInfo =
      !!isValidEmail &&
      !!donator.firstName &&
      !!donator.lastName &&
      !!modalData.addressLine1 &&
      !!modalData.addressCity &&
      !!modalData.addressPostalCode &&
      !!modalData.addressCountry

    const hasDirectDebitInfo =
      !!directDebit.name &&
      !!directDebit.number &&
      !!directDebit.sort &&
      !!directDebit.confirmDirectDebit

    // Step-based Logic
    if (modalStage?.step === 1) {
      // Step 1 Validation
      if (!modalData.amount || modalData.amount === 0 || !hasBasicDonatorInfo) {
        return true
      }
    } else if (modalStage?.step === 2) {
      // Step 2 Validation for Card Payment

      if (
        paymentType === PaymentType.Card &&
        (modalData.payment.method === 'APPLE_PAY' ||
          modalData.payment.method === 'GOOGLE_PAY')
      ) {
        return false
      }

      if (paymentType === PaymentType.Card && !hasBasicCardValidations) {
        return true
      }
      // Step 2 Validation for Direct Debit
      if (paymentType === PaymentType.DirectDebit && !hasDirectDebitInfo) {
        return true
      }
    }
    return false
  }, [modalData, modalStage, validPaymentDetails, stripeCardCompleted])

  useEffect(() => {
    if (window.PaymentRequest) {
      const checkGooglePayAvailability = async () => {
        const available = await isGooglePayAvailable()
        setIsGooglePayEnabled(available)
      }
      checkGooglePayAvailability()
    }
  }, [window.PaymentRequest])

  const getPaymentIntent = async ({
    amount,
    paymentMethodRegionCode,
    paymentMethodId,
    paymentMethodType,
    includeFee,
    payerFirstName,
    payerLastName,
    payerEmail,
  }: {
    amount: number
    paymentMethodRegionCode?: string
    paymentMethodId?: string
    paymentMethodType?: string
    includeFee?: boolean
    payerFirstName?: string
    payerLastName?: string
    payerEmail?: string
  }) => {
    const { donator, payment, paymentType } = modalData
    const { coverPlatformFee, coverTrxFee, isRecurring } = payment
    let trx

    if (!isRecurring && paymentType !== PaymentType.DirectDebit) {
      trx = getDonationTotal({
        amount: amount * 100,
        platformFee,
        regionCode: paymentMethodRegionCode,
        coverProcessorFee: coverTrxFee,
        coverPlatformFee,
      })
    }
    const response = await eventDonationCreatePaymentIntent({
      variables: {
        input: {
          donationUrl: eventDetails?.donationUrl ?? '',
          eventName: eventDetails?.title,
          organizationName: eventDetails?.organizationName,
          message: modalData?.message ?? '',
          amount: Math.ceil(trx?.total ?? amount * 100),
          firstName: payerFirstName || donator.firstName,
          lastName: payerLastName || donator.lastName,
          email: payerEmail || donator.email,
          currency: organisationCurrency.toLowerCase(),
          address: modalData?.payment?.card_details?.address ?? '',
          giftAid: modalData?.payment.giftAidConfirm,
          paymentMethodId: paymentMethodId!,
          paymentMethodType: paymentMethodType ?? 'card',
          paymentType: paymentType,
          paymentMethodRegionCode: paymentMethodRegionCode,
          selectedProgram: modalData.program,
          statisticId: statisticId,
          eventId,
          coverFee: coverPlatformFee ? 'true' : 'false',
          homeAddress: modalData.homeAddress,
          visibility: modalData.visibility,
          donorTitle: modalData.donator?.title,
          donorDob: modalData.donator?.dob,
          allowEmailContact: modalData.allowEmailContact,
          allowTelephoneContact: modalData.allowTelephoneContact,
          addressLine1: modalData.addressLine1,
          addressLine2: modalData.addressLine2,
          addressLine3: modalData.addressLine3,
          addressPostalCode: modalData.addressPostalCode,
          addressCity: modalData.addressCity,
          addressCountry: modalData.addressCountry,
          addressPhone: modalData.addressPhone,
          directDebitName: modalData.directDebit.name,
          directDebitNumber: modalData.directDebit.number,
          directDebitSort: modalData.directDebit.sort,
          directDebitConfirmed: modalData.directDebit.confirmDirectDebit,
          directDebitPeriod: modalData.selectedRecurrency,
        },
      },
    })
    return response?.data?.eventDonationCreatePaymentIntent
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setPaymentError('')
    if (loading) return

    const results = validate(modalData, getValidationRules('Donation'))
    if (!results.error) {
      if (disablePayment) {
        setLoading(true)

        const {
          currency,
          amount,
          message,
          donatedAt,
          program,
          payment,
          paymentType,
        } = modalData

        if (onComplete)
          onComplete({
            currency,
            amount: typeof amount === 'string' ? parseInt(amount) : amount,
            message,
            donatedAt,
            program: program,
            payment: {
              giftAid: payment.giftAid,
              giftAidConfirm: payment.giftAidConfirm,
              paymentType,
            },
            statisticId,
          })
        return
      }

      if (modalData?.paymentType === PaymentType.DirectDebit) {
        console.log('is Direct Debit')
        setLoading(true)

        const paymentIntent = await getPaymentIntent({
          amount: modalData.amount,
        })

        if (paymentIntent?.clientSecret === 'DIRECTDEBIT') {
          console.log(`Direct Debit Saved`)

          if (refetchDonations) refetchDonations()

          eventDonationSendStripeMail({
            variables: {
              eventId,
              firstName: modalData.donator.firstName,
              lastName: modalData.donator.lastName,
              email: modalData.donator.email,
            },
          })

          setModalStage(ModalFlow[ModalFlow.length - 1])
        } else {
          setLoading(false)
          setDisable(true)
          setPaymentError(
            'It seems something went wrong with your details. Please double-check your details and verify they are correct.'
          )
        }
        setLoading(false)
        return
      }

      if (!paymentMethod) return
      if (!stripe) return

      setLoading(true)

      const paymentIntent = await getPaymentIntent({
        amount: modalData.amount,
        paymentMethodId: paymentMethod.id,
        paymentMethodRegionCode:
          getBankingCountryByPaymentMethod(paymentMethod),
      })

      try {
        if (paymentIntent?.clientSecret) {
          const { error: stripeError, ...confirmationResponse } =
            await stripe.confirmCardPayment(
              paymentIntent.clientSecret,
              {
                payment_method: paymentMethod.id,
              },
              { handleActions: false }
            )
          if (confirmationResponse?.paymentIntent?.status !== 'succeeded') {
            setLoading(false)
            setDisable(true)
            setPaymentError(
              'It seems something went wrong with your card payment. Please double-check your card details and verify that your card is active.'
            )
            return
          }
          setLoading(false)
          if (stripeError) {
            setPaymentError(stripeError.message)
            return
          }

          if (refetchDonations) refetchDonations()

          eventDonationSendStripeMail({
            variables: {
              eventId,
              firstName: modalData.donator.firstName,
              lastName: modalData.donator.lastName,
              email: modalData.donator.email,
            },
          })

          setModalStage(ModalFlow[ModalFlow.length - 1])
        } else {
          setLoading(false)
          setPaymentError(
            paymentIntent?.error ??
              'There was an unexpected error, please try again.'
          )
        }
      } catch (ex) {
        console.warn(ex)
        setPaymentError('There was an unexpected error, please try again.')
        setLoading(false)
      }
    } else {
      // setModalStage(results.error.step)
      console.log({ error: results.error })
      setPaymentError(results.error.message)
    }
  }

  const preparePaymentMethod = async () => {
    if (loading) return
    if (!stripe) return
    if (!elements) return

    const cardNumberElement = elements.getElement(CardNumberElement)
    const cardExpiryElement = elements.getElement(CardExpiryElement)
    const cardCvcElement = elements.getElement(CardCvcElement)

    const isCardNumberCompleted =
      validPaymentDetails.number || stripeCardCompleted

    if (!cardNumberElement || !isCardNumberCompleted)
      return setPaymentError('A valid card number is required')
    if (!cardExpiryElement || !validPaymentDetails.mmaa)
      return setPaymentError('Expiry date is not valid')
    if (!cardCvcElement || !validPaymentDetails.cvc)
      return setPaymentError('CVC is not valid')

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    const isValidMail = emailRegex.test(modalData.donator.email)
    if (!isValidMail) return setPaymentError('Email address is not valid')

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        address: {
          postal_code: modalData.payment.card_details.post_code,
        },
      },
    })

    if (!error) {
      setPaymentError('')
      setPaymentMethod(paymentMethod)
    } else {
      setLoading(false)
      setPaymentError(error.message)
    }
    getBankingCountryByPaymentMethod(paymentMethod!)
    return !error
  }

  const handleSetModalStage = async (newStage: {
    title: string
    step: number
  }) => {
    if (newStage.step === 2) {
      checkforAlternatePaymethods()
      if (disablePayment) return setModalStage(ModalFlow[3])

      const post_code = modalData?.addressPostalCode || ''
      const address =
        [
          modalData.addressLine1,
          modalData.addressLine2,
          modalData.addressLine3,
          modalData.addressCity,
          modalData.addressCountry,
        ]
          .filter(Boolean)
          .join('. ') || ''

      // Pre-fill address fields if possible
      if (modalData.paymentType !== PaymentType.DirectDebit) {
        setModalData({
          ...modalData,
          /*payment: {
            ...modalData.payment,
            card_details: {
              ...modalData.payment.card_details,
              address,
              post_code,
            },
          },*/
          homeAddress: [address, post_code].filter(Boolean).join('. ') || '',
        })
      } else {
        setModalData({
          ...modalData,
          homeAddress: [address, post_code].filter(Boolean).join('. ') || '',
        })
      }

      if (modalData.amount > 0) setModalStage(newStage)
    } else if (newStage.step === 3) {
      setDisable(false)
      if (configSkipGiftAidStep) newStage = { title: 'Details', step: 4 }
      if (
        modalData.payment.method === 'CARD' &&
        modalData.paymentType !== PaymentType.DirectDebit
      ) {
        const completed = await preparePaymentMethod()
        if (completed) setModalStage(newStage)
      } else {
        /*if (isMobile) {
          const { amount, payment } = modalData
          handleAlternativeMethods(
            amount,
            payment.coverFee,
            organisationCurrency
          )
          setModalStage(newStage)
        } else {
          setModalStage(newStage)
        }*/
        const { amount, payment } = modalData
        const altMethodAvailable = await handleAlternativeMethods(
          amount,
          payment.coverPlatformFee,
          organisationCurrency
        )
        if (altMethodAvailable) {
          setModalStage(newStage)
        } else {
          setPaymentError(
            "We're sorry to inform you that alternative payment methods are not available on this device. Please try using a different device or make your donation with a card."
          )
        }
      }
    } else if (newStage.step === 4) {
      if (giftAidStep === 1 && modalData?.payment?.giftAid) {
        setGiftAidStep(2)
        return
      }
      setModalStage(newStage)
    } else {
      setModalStage(newStage)
    }
  }

  const amountChoices = [
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}10`,
      value: 10,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}25`,
      value: 25,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}100`,
      value: 100,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}350`,
      value: 350,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}500`,
      value: 500,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}1000`,
      value: 1000,
    },
  ]

  const paymentTypeChoices = [
    {
      title: 'One-time card',
      value: PaymentType.Card,
    },
    {
      title: 'Regular Direct Debit',
      value: PaymentType.DirectDebit,
    },
  ]

  const recurrentChoices = [
    {
      title: 'Monthly',
      value: 'Monthly',
    },
    {
      title: 'Quarterly',
      value: 'Quarterly',
    },
    {
      title: 'Annually',
      value: 'Annually',
    },
  ]

  const visibilityChoices = [
    {
      title: 'Name & amount',
      value: 'Name & amount',
    },
    {
      title: 'Name only',
      value: 'Name only',
    },
    {
      title: 'Anonymous',
      value: 'Anonymous',
    },
  ]

  const donationFormModal = () => {
    const getDescriptionContent = () => {
      const desc = programs?.find(
        (pg) => pg.title.toUpperCase() === modalData.program
      )?.description

      if (!!desc && desc === eventDetails.description)
        return <RichTextDisplay descriptionJson={desc} />

      return desc
    }

    const baseClass = disablePayment
      ? `min-h-screen flex flex-col relative !min-h-[650px] max-h-[720px] rounded-xl ${
          theme.type === 'DARK' ? 'bg-midnight-dark' : 'bg-white'
        } !z-9999`
      : `min-h-screen flex flex-col relative !min-h-[650px] max-h-[720px] h-full rounded rounded-xl ${
          theme.type === 'DARK' ? 'bg-midnight-dark' : 'bg-white'
        } !z-9999`

    const innerConent = (
      <Box className={baseClass}>
        <Box
          className="sticky top-0 z-20 flex justify-between items-center p-4 rounded-tl-xl rounded-tr-xl"
          style={{
            backgroundColor: disablePayment ? 'white' : theme.foregroundColour,
          }}
        >
          <Box className="flex items-center justify-start">
            {modalStage.step >= (programs && programs.length > 0 ? 1 : 2) &&
              modalStage.step < 6 && (
                <AiOutlineLeft
                  className="cursor-pointer mr-4"
                  onClick={() => setModalStage(ModalFlow[modalStage.step - 1])}
                />
              )}
            <Box className="font-bold text-sm">{modalStage.title}</Box>
          </Box>
          <Box className="flex items-center space-x-1 sm:space-x-2 absolute left-1/2 transform translate-x-m-50 top-5.5">
            <Box
              show={programs && programs.length > 0}
              className={`rounded-full w-3 h-3 border`}
              style={{
                backgroundColor:
                  modalStage.step >= 0
                    ? StaticColours.v2.blue
                    : theme.backgroundColour,
              }}
            ></Box>
            <Box
              className={`rounded-full w-3 h-3 border`}
              style={{
                backgroundColor:
                  modalStage.step >= 1
                    ? StaticColours.v2.blue
                    : theme.backgroundColour,
              }}
            ></Box>
            <Box
              className={`rounded-full w-3 h-3 border`}
              style={{
                backgroundColor:
                  modalStage.step >= 2
                    ? StaticColours.v2.blue
                    : theme.backgroundColour,
              }}
            ></Box>
            <Box
              className={`rounded-full w-3 h-3 border`}
              style={{
                backgroundColor:
                  modalStage.step >= 3
                    ? StaticColours.v2.blue
                    : theme.backgroundColour,
              }}
            ></Box>
            <Box
              className={`rounded-full w-3 h-3 border`}
              style={{
                backgroundColor:
                  modalStage.step >= 4
                    ? StaticColours.v2.blue
                    : theme.backgroundColour,
              }}
            ></Box>
            <Box
              className={`rounded-full w-3 h-3 border`}
              style={{
                backgroundColor:
                  modalStage.step >= 5
                    ? StaticColours.v2.blue
                    : theme.backgroundColour,
              }}
            ></Box>
          </Box>
          <Box show={modalStage.step <= 5} className="flex text-sm">
            {(modalStage?.step ?? 0) + 1}/
            {hasPrograms ? ModalFlow.length - 1 : ModalFlow.length - 2}
          </Box>
          <Button
            show={modalStage.step === 6}
            type="tertiary"
            onClick={(e) => {
              if (setIsOpen) setIsOpen(false)
              e.stopPropagation()
              setModalData(cloneDeep(initialState))
              setModalStage(ModalFlow[0])
              setGiftAidStep(1)
              setLoading(false)
              setStripeCardCompleted(false)
              setPaymentMethod(undefined)
            }}
            className="border-none"
            icon={<IoClose className="w-8 h-8" />}
          />
        </Box>
        <Box className="relative p-3 pb-10 md:pb-3 sm:p-6 mb-16 xs:mb-2 md:mb-8 xl:mb-16 flex-grow">
          {/* Modal Content */}
          {/* Program Stage */}
          <Box
            show={modalStage.step === 0}
            className={`flex flex-col py-1 h-full`}
          >
            <span
              className={`-mb-5 ml-3 bg-white font-medium z-50 pl-[10px] w-[270px]`}
            >
              Select your donation programme
            </span>
            <Box className={`flex justify-start items-center mb-2`}>
              <DropdownInput
                className={`w-full -mt-4`}
                label=""
                placeholder="Select a fundraising programme"
                options={
                  programs && programs?.length > 0
                    ? programs?.map((program, i) => ({
                        value: program.title.toUpperCase(),
                        label: program.title,
                        selected: i === 0,
                      }))
                    : []
                }
                onChange={(data) => {
                  setModalData({ ...modalData, program: data })
                }}
                value={
                  modalData.program ||
                  (programs && programs.length > 0
                    ? programs[0].title.toUpperCase()
                    : '')
                }
              />
            </Box>

            <Box
              show={modalData.program.length > 0}
              className={`mt-0 flex justify-center items-center flex-col`}
            >
              <Box className="flex justify-center items-center w-full">
                <Box
                  className="w-full"
                  show={
                    !!programs?.find(
                      (pg) => pg.title.toUpperCase() === modalData.program
                    )?.media?.url
                  }
                >
                  <Image
                    key={
                      programs?.find(
                        (pg) => pg.title.toUpperCase() === modalData.program
                      )?.media?.title ?? 'Title'
                    }
                    src={
                      programs?.find(
                        (pg) => pg.title.toUpperCase() === modalData.program
                      )?.media?.url ?? ''
                    }
                    alt={
                      programs?.find(
                        (pg) => pg.title.toUpperCase() === modalData.program
                      )?.media?.title ?? 'Title'
                    }
                    className="object-cover w-full max-h-[225px] rounded-2xl"
                    layout="responsive"
                    width={300}
                    height={50}
                  />
                </Box>
              </Box>
              <Box
                className={`flex flex-row align-start items-center justify-start mt-4 max-w-[600px] w-[100%]`}
              >
                <Box className={`text-xl font-medium leading-[2rem]`}>
                  {
                    programs?.find(
                      (pg) => pg.title.toUpperCase() === modalData.program
                    )?.title
                  }
                </Box>
              </Box>

              <Box className="mt-1 text-sm text-justify leading-relaxed w-full">
                {getDescriptionContent()}
              </Box>
            </Box>
          </Box>
          {/* Donation Stage */}
          <Box show={modalStage.step === 1} className={`flex flex-col py-2`}>
            {/*<RadioFieldInput
                label="Please select your currency:"
                testid={'currency-radio'}
                options={['GBP', 'USD', 'CAD', 'EUR']}
                className="font-medium"
                itemClassName="text-sm mt-4"
                value="GBP"
                onChange={(currency) => {
                  //setOrgcurrency(currency)
                }}
              /> */}
            {/*
              <Box className="pb-0 pt-0 font-medium -mt-2">
                Please indicate the donation type:
              </Box>
              <Box className={`flex justify-center items-center -mt-2`}>
                <ToggleInput
                  selected={modalData.payment.isRecurring ? 1 : 0}
                  centerText
                  testid={'cover-fee-input'}
                  options={['One-Time Donation', 'Recurring Donation']}
                  className={`w-full mt-4`}
                  value={
                    modalData.payment.isRecurring
                      ? donationTypeOptions[1]
                      : donationTypeOptions[0]
                  }
                  callback={(data) => {
                    setModalData({
                      ...modalData,
                      payment: {
                        ...modalData.payment,
                        isRecurring: data.toLowerCase().includes('recurring'),
                      },
                    })
                  }}
                />
              </Box>*/}
            {!onlyOneTimePayments && (
              <>
                <Box className="pb-2 font-medium">Payment Method**</Box>
                <Box className="text-sm mb-2">
                  <ItemPicker
                    itemClass="!w-1/2"
                    choices={paymentTypeChoices}
                    onClick={(value) =>
                      setModalData({
                        ...modalData,
                        paymentType: value,
                      })
                    }
                    value={modalData.paymentType}
                  />
                </Box>

                {modalData?.paymentType === PaymentType.DirectDebit ? (
                  <ItemPicker
                    itemClass="!w-1/3"
                    choices={recurrentChoices}
                    onClick={(value: string | number) =>
                      setModalData({
                        ...modalData,
                        selectedRecurrency: value as string,
                      })
                    }
                    value={modalData.selectedRecurrency}
                  />
                ) : (
                  <Box className="!w-1/3 mb-14" />
                )}
              </>
            )}
            <Box
              className={`"pb-2 font-medium ${
                onlyOneTimePayments ? 'mt-0' : 'mt-4'
              }"`}
            >
              Amount You Would Like to Donate
            </Box>
            <ItemPicker
              choices={amountChoices}
              onClick={(value: number | string) =>
                setModalData({ ...modalData, amount: value as number })
              }
              value={modalData.amount}
            />
            <Box className={`flex justify-start items-center w-full -mt-2`}>
              <PriceInput
                hint=""
                className={`w-full`}
                currencySymbol={
                  currencies[organisationCurrency ?? 'GBP'].symbol as any
                }
                onChange={(data) => {
                  setModalData({ ...modalData, amount: data })
                }}
                value={modalData?.amount}
              />
            </Box>
            <Box className="mb-4 font-medium mt-4">Personal Information</Box>
            <Box className="-mb-4">
              <TextInput
                label="Title"
                value={modalData.donator.title}
                onChange={(value) =>
                  setModalData({
                    ...modalData,
                    donator: { ...modalData.donator, title: value },
                  })
                }
                type="text"
                placeholder="Title"
                className="bg-transparent rounded text-sm outline-none w-full mt-0"
                required
              />
            </Box>

            <Box className="w-full flex">
              <TextInput
                label="First Name"
                value={modalData.donator.firstName}
                onChange={(value) =>
                  setModalData({
                    ...modalData,
                    donator: { ...modalData.donator, firstName: value },
                  })
                }
                type="text"
                placeholder="First Name"
                className="bg-transparent rounded text-sm outline-none w-1/2 border-box pr-1"
                validations={{
                  minLength: {
                    value: 2,
                    message: 'First Name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 70,
                    message: 'First Name must be less than 70 characters',
                  },
                  pattern: {
                    value: /^[a-z ,.'-]+$/i,
                    message: 'First Name must consist of letters only',
                  },
                }}
                required
              />
              <TextInput
                label="Last Name"
                value={modalData.donator.lastName}
                onChange={(value) =>
                  setModalData({
                    ...modalData,
                    donator: { ...modalData.donator, lastName: value },
                  })
                }
                type="text"
                placeholder="Last Name"
                className="bg-transparent rounded text-sm outline-none w-1/2 border-box"
                validations={{
                  minLength: {
                    value: 2,
                    message: 'Last Name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 70,
                    message: 'Last Name must be less than 70 characters',
                  },
                  pattern: {
                    value: /^[a-z ,.'-]+$/i,
                    message: 'Last Name must consist of letters only',
                  },
                }}
                required
              />
            </Box>
            <Box className={`w-full flex`}>
              <TextInput
                label="Email"
                value={modalData.donator.email}
                onChange={(value) =>
                  setModalData({
                    ...modalData,
                    donator: { ...modalData.donator, email: value },
                  })
                }
                type="email"
                placeholder="Email"
                className="bg-transparent rounded text-sm outline-none w-1/2 mt-0 mr-1"
                required
              />
              <Box className="w-1/2">
                <DatePicker
                  selected={
                    modalData?.donator?.dob
                      ? moment(modalData?.donator?.dob).toDate()
                      : null
                  }
                  onChange={(date) => {
                    const dob = date?.toISOString()
                    if (dob) {
                      setModalData({
                        ...modalData,
                        donator: { ...modalData.donator, dob },
                      })
                    }
                  }}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  minDate={moment().subtract(100, 'years').toDate()}
                  maxDate={moment().toDate()}
                  isClearable
                  wrapperClassName="w-full"
                  popperClassName="!z-20"
                  autoComplete="off"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DOB (DD/MM/YYYY)"
                  className="rounded-2xl transition-all bg-transparent border rounded px-4 py-4 text-sm outline-none cursor-pointer w-full"
                  onChangeRaw={(e) => {
                    const inputValue = e.target.value
                    const parsedDate = moment(inputValue, 'DD/MM/YYYY', true)

                    // Check if date is valid before setting it
                    if (parsedDate.isValid()) {
                      setModalData({
                        ...modalData,
                        donator: {
                          ...modalData.donator,
                          dob: parsedDate.toISOString(),
                        },
                      })
                    }
                  }}
                />
                <Box className="text-xs ml-1">
                  To help identify you on our database
                </Box>
              </Box>
            </Box>
            <Box>
              <Box className="font-medium mt-4">Home address</Box>

              <TextInput
                required={isFieldRequired(
                  DonationRules.find((f) => f[0].includes('addressLine1'))
                )}
                value={modalData.addressLine1}
                onChange={(value) =>
                  setModalData({
                    ...modalData,
                    addressLine1: value,
                  })
                }
                label="Address line 1"
                type="text"
                placeholder="Address line 1"
                className="bg-transparent rounded text-sm outline-none w-full"
                validations={{
                  minLength: {
                    value: 2,
                    message: 'Address must be at least 2 characters',
                  },
                }}
              />
              <TextInput
                required={isFieldRequired(
                  DonationRules.find((f) => f[0].includes('addressLine2'))
                )}
                value={modalData.addressLine2}
                onChange={(value) =>
                  setModalData({
                    ...modalData,
                    addressLine2: value,
                  })
                }
                label="Address line 2"
                type="text"
                placeholder="Address line 2"
                className="bg-transparent rounded text-sm outline-none w-full"
                validations={{
                  minLength: {
                    value: 2,
                    message: 'Address must be at least 2 characters',
                  },
                }}
              />
              <TextInput
                required={isFieldRequired(
                  DonationRules.find((f) => f[0].includes('addressLine3'))
                )}
                value={modalData.addressLine3}
                onChange={(value) =>
                  setModalData({
                    ...modalData,
                    addressLine3: value,
                  })
                }
                label="Address line 3"
                type="text"
                placeholder="Address line 3"
                className="bg-transparent rounded text-sm outline-none w-full"
                validations={{
                  minLength: {
                    value: 2,
                    message: 'Address must be at least 2 characters',
                  },
                }}
              />
              <Box className="w-full flex -mt-4">
                <TextInput
                  required={isFieldRequired(
                    DonationRules.find((f) => f[0].includes('addressCity'))
                  )}
                  value={modalData.addressCity}
                  onChange={(value) =>
                    setModalData({
                      ...modalData,
                      addressCity: value,
                    })
                  }
                  label="City/Town"
                  type="text"
                  placeholder="City/Town"
                  className="bg-transparent rounded text-sm outline-none w-1/2 border-box pr-1"
                  validations={{
                    minLength: {
                      value: 2,
                      message: 'Address must be at least 2 characters',
                    },
                  }}
                />
                <TextInput
                  required={isFieldRequired(
                    DonationRules.find((f) =>
                      f[0].includes('addressPostalCode')
                    )
                  )}
                  value={modalData.addressPostalCode}
                  onChange={(value) =>
                    setModalData({
                      ...modalData,
                      addressPostalCode: value,
                    })
                  }
                  label="Postal Code"
                  type="text"
                  placeholder="Postal Code"
                  className="bg-transparent rounded text-sm outline-none w-1/2 border-box"
                  validations={{
                    minLength: {
                      value: 2,
                      message: 'Address must be at least 2 characters',
                    },
                  }}
                />
              </Box>

              <Box className="w-full flex -mt-4">
                <DropdownInput
                  required={isFieldRequired(
                    DonationRules.find((f) => f[0].includes('addressCountry'))
                  )}
                  label="country"
                  className={`w-full`}
                  placeholder="Country"
                  bgColor="bg-white"
                  options={COUNTRIES.map((country) => ({
                    value: country.toLowerCase(),
                    label: country,
                  }))}
                  onChange={(data) => {
                    setModalData({ ...modalData, addressCountry: data })
                  }}
                  overrideFullLabelClass="flex flex-col space-y-1 text-sm mt-5 w-1/2 pr-[7px] pl-1"
                  value={
                    modalData?.addressCountry?.toLowerCase() || 'united kingdom'
                  }
                />
                <TextInput
                  required={isFieldRequired(
                    DonationRules.find((f) => f[0].includes('addressPhone'))
                  )}
                  value={modalData.addressPhone}
                  onChange={(value) =>
                    setModalData({
                      ...modalData,
                      addressPhone: value,
                    })
                  }
                  label="Telephone"
                  type="text"
                  placeholder="Telephone number"
                  className="bg-transparent rounded text-sm outline-none w-1/2 border-box"
                  validations={{
                    minLength: {
                      value: 2,
                      message: 'Address must be at least 2 characters',
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
          {/* Payment Stage */}
          <Box
            show={modalStage.step === 2}
            className={`flex flex-col py-2 pt-2`}
          >
            {/* PAYMENT METHOD BOXES */}
            {isMobile && modalData.paymentType !== PaymentType.DirectDebit && (
              <>
                <Box className={`font-medium`}>Select your Payment Method</Box>
                <Box
                  className={`flex justify-center items-center border border-forumm_gray mt-4 rounded-2xl h-13`}
                >
                  <Button
                    className={`w-1/3 border-0 bg-red-400 !h-12 rounded-2xl`}
                    title="Card"
                    type="square"
                    icon={<AiOutlineCreditCard />}
                    onClick={() => {
                      setModalData({
                        ...modalData,
                        payment: { ...modalData.payment, method: 'CARD' },
                      })
                    }}
                    backgroundColor={
                      modalData.payment.method === 'CARD'
                        ? selectionColour
                        : theme.backgroundColour
                    }
                  />
                  <Button
                    className={`w-1/3 border-0 !h-12 rounded-2xl`}
                    type="square"
                    title="Pay"
                    disabled={!window.ApplePaySession || !altPaymentEnabled}
                    icon={<AiFillApple />}
                    onClick={(data) => {
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          method: 'APPLE_PAY',
                        },
                      })
                    }}
                    backgroundColor={
                      modalData.payment.method === 'APPLE_PAY'
                        ? selectionColour
                        : theme.backgroundColour
                    }
                  />
                  <Button
                    className={`w-1/3 border-0 !h-12 rounded-2xl`}
                    type="square"
                    title="Pay"
                    icon={<AiOutlineGoogle />}
                    disabled={!window.PaymentRequest || !altPaymentEnabled}
                    onClick={(data) => {
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          method: 'GOOGLE_PAY',
                        },
                      })
                    }}
                    backgroundColor={
                      modalData.payment.method === 'GOOGLE_PAY'
                        ? selectionColour
                        : theme.backgroundColour
                    }
                  />
                </Box>
              </>
            )}
            {/* PAYMENT METHOD BOXES END */}

            {modalData.payment.method === 'CARD' &&
              modalData.paymentType !== PaymentType.DirectDebit && (
                <>
                  <div className="flex flex-col w-full pt-2">
                    <div className="w-full mb-1 relative mt-2">
                      <span
                        className={`${
                          theme.type === 'DARK'
                            ? 'bg-midnight-dark'
                            : 'bg-white'
                        } text-sm absolute -top-2 left-3.5 pl-1 pr-1`}
                      >
                        Number
                      </span>
                      <CardNumberElement
                        className="h-13 bg-transparent border rounded-2xl px-4 py-5 text-sm outline-none"
                        options={{
                          style: { base: { color: theme.textColour } },
                        }}
                        onChange={(e) => {
                          setStripeCardCompleted(e.complete)
                          setValidPaymentDetails((currentDetails) => ({
                            ...currentDetails,
                            number: e.complete,
                          }))
                        }}
                      />
                    </div>
                    <div className="w-full flex relative">
                      <Box className="relative w-1/2 mt-2">
                        <span
                          className={`xs:hidden md:inline ${
                            theme.type === 'DARK'
                              ? 'bg-midnight-dark'
                              : 'bg-white'
                          } text-sm absolute -top-2 left-3.5 pl-1 pr-1`}
                        >
                          Expiry date
                        </span>
                        <CardExpiryElement
                          className="h-13 bg-transparent border rounded-2xl px-4 py-5 text-sm outline-none mr-2"
                          options={{
                            style: { base: { color: theme.textColour } },
                          }}
                          onChange={(e) => {
                            setValidPaymentDetails((currentDetails) => ({
                              ...currentDetails,
                              mmaa: e.complete,
                            }))
                          }}
                        />
                      </Box>
                      <div className="w-1/2 relative mt-2">
                        <span
                          className={`xs:hidden md:inline ${
                            theme.type === 'DARK'
                              ? 'bg-midnight-dark'
                              : 'bg-white'
                          } text-sm absolute -top-2 left-3.5 pl-1 pr-1`}
                        >
                          Security Code
                        </span>
                        <CardCvcElement
                          className="h-13 bg-transparent border rounded-2xl px-4 py-5 text-smy outline-none"
                          options={{
                            style: { base: { color: theme.textColour } },
                          }}
                          onChange={(e) => {
                            setValidPaymentDetails((currentDetails) => ({
                              ...currentDetails,
                              cvc: e.complete,
                            }))
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

            {/*modalData.paymentType !== PaymentType.DirectDebit && (
              <Box>
                <div
                  className={`w-full flex mt-1 ${
                    modalData.payment.method === 'CARD' ? '-mt-4' : ''
                  }`}
                >
                  <TextInput
                    hint="Please make sure you enter the address details associated with your payment card"
                    value={modalData.payment.card_details.address}
                    onChange={(value) =>
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          card_details: {
                            ...modalData.payment.card_details,
                            address: value,
                          },
                        },
                      })
                    }
                    label="Address"
                    type="text"
                    placeholder="Address"
                    className="bg-transparent rounded text-sm outline-none mr-2 w-1/2"
                    validations={{
                      minLength: {
                        value: 2,
                        message: 'Address must be at least 2 characters',
                      },
                      maxLength: {
                        value: 150,
                        message: 'Address must be less than 150 characters',
                      },
                    }}
                  />
                  <TextInput
                    value={modalData.payment.card_details.post_code}
                    onChange={(value) =>
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          card_details: {
                            ...modalData.payment.card_details,
                            post_code: value,
                          },
                        },
                      })
                    }
                    label="Postal Code"
                    type="text"
                    placeholder="Postal Code"
                    className="bg-transparent w-1/2 rounded text-sm outline-none mr-2"
                    customClassLabel="xs:hidden md:inline"
                    validations={{
                      minLength: {
                        value: 2,
                        message: 'Postal Code must be at least 2 characters',
                      },
                      maxLength: {
                        value: 70,
                        message: 'Postal Code must be less than 70 characters',
                      },
                    }}
                  />
                </div>
              </Box>
            )*/}

            {paymentError && (
              <div>
                <div className="w-full h-px bg-gray-200 my-4"></div>
                <span className="text-red-500 text-xs">{paymentError}</span>
              </div>
            )}

            {modalData.paymentType !== PaymentType.DirectDebit && (
              <>
                <p className="text-xs pt-4">
                  Our platform processes your data, including card details,
                  exclusively to facilitate donations through the Stripe system.
                  We do not store or retain any of your data.
                </p>
                <Box className="flex flex-row items-center justify-center">
                  <Box className="flex h-[40px] max-w-[200px]">
                    <StripeImg />
                  </Box>
                </Box>
                <Box className="h-[250px]"></Box>
              </>
            )}
          </Box>

          {/* Direct Debit details */}
          {modalData.paymentType === PaymentType.DirectDebit &&
            modalStage?.step === 2 && (
              <>
                <Box className="font-medium">Your Direct Debit details</Box>
                <TextInput
                  label="Account holder name(s)"
                  value={modalData.directDebit.name}
                  onChange={(name) =>
                    setModalData({
                      ...modalData,
                      directDebit: {
                        ...modalData.directDebit,
                        name,
                      },
                    })
                  }
                  type="text"
                  placeholder="Account holder name(s)"
                  className="bg-transparent rounded text-sm outline-none border-box pr-1"
                  validations={{
                    minLength: {
                      value: 2,
                      message: 'Must be at least 2 characters',
                    },
                  }}
                  required
                />
                <Box className="flex flex-row -mt-4">
                  <TextInput
                    className="bg-transparent rounded text-sm outline-none border-box pr-1 w-1/2"
                    label="Account number"
                    value={modalData.directDebit.number}
                    onChange={(number) =>
                      setModalData({
                        ...modalData,
                        directDebit: {
                          ...modalData.directDebit,
                          number,
                        },
                      })
                    }
                    type="text"
                    placeholder="Account number"
                    validations={{
                      minLength: {
                        value: 8,
                        message: 'Account number must be exactly 8 digits',
                      },
                      maxLength: {
                        value: 8,
                        message: 'Account number must be exactly 8 digits',
                      },
                      pattern: {
                        value: /^\d{8}$/,
                        message:
                          'Account number must consist of exactly 8 digits',
                      },
                    }}
                    required
                  />

                  <TextInput
                    className="bg-transparent rounded text-sm outline-none border-box pr-1 w-1/2"
                    label="Sort Code"
                    value={modalData.directDebit.sort}
                    onChange={(sort) =>
                      setModalData({
                        ...modalData,
                        directDebit: {
                          ...modalData.directDebit,
                          sort,
                        },
                      })
                    }
                    type="text"
                    placeholder="Sort Code"
                    required
                  />
                </Box>
                <Box
                  className="text-sm mb-1 mt-4"
                  onClick={() => {
                    setModalData({
                      ...modalData,
                      directDebit: {
                        ...modalData.directDebit,
                        confirmDirectDebit:
                          !modalData.directDebit.confirmDirectDebit,
                      },
                    })
                  }}
                >
                  <input
                    type="checkbox"
                    checked={modalData?.directDebit.confirmDirectDebit}
                    className="mr-2 pt-1"
                  />
                  <span className="font-bold cursor-pointer">
                    I confirm that I am able to authorise debits from the
                    account, either as the account holder or on behalf of the
                    multiple signatories to the account.
                  </span>
                </Box>
              </>
            )}

          {/* Gift Aid */}
          <Box show={modalStage.step === 3} className="flex flex-col px-2">
            {giftAidStep === 1 && (
              <Box className="my-4">
                <Box className="text-lg font-bold mb-6">
                  Good news! This cause supports Gift Aid.
                </Box>
                <Box className="text-sm mb-1">
                  Please confirm the statements below to ensure your donation is
                  eligible.
                </Box>
                <Box className="text-sm mb-1">
                  Charities receive 25% more at no extra cost to you
                </Box>
                <Box className="text-sm mb-1 mt-8">
                  <b>✓</b> This donation is my own money
                </Box>
                <Box className="text-sm mb-1">
                  <b>✓</b> I am not receiving anything in return for this
                  donation
                </Box>
                <Box className="flex justify-center mt-2 mb-2 max-h-720:hidden">
                  <Image
                    className="w-1/2"
                    src={GiftAid.src}
                    width={200}
                    height={200}
                    alt="Image"
                  />
                </Box>
                <Box className="text-sm mb-1 mt-8">
                  <input
                    type="checkbox"
                    checked={modalData.payment.giftAid}
                    onChange={() => {
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          giftAid: !modalData.payment.giftAid,
                        },
                      })
                    }}
                    className="mr-2 pt-1"
                  />
                  <span
                    className="font-bold cursor-pointer"
                    onClick={() => {
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          giftAid: !modalData.payment.giftAid,
                        },
                      })
                    }}
                  >
                    I agree and confirm
                  </span>
                </Box>
              </Box>
            )}
            {giftAidStep === 2 && (
              <Box className="my-2">
                <Box className="text-lg font-bold mb-6">Add Gift Aid</Box>
                <Box className="text-sm mb-3">
                  Charities receive 25% more at no extra cost to you
                </Box>
                <Box className="text-sm mb-3">
                  Gift Aid is tax relief that lets your charity claim an extra
                  25p for every £1 you give.
                </Box>
                <Box className="text-sm mb-3">
                  I am a UK taxpayer and understand that if I pay less Income
                  Tax and/or Capital Gains Tax than the amount of Gift Aid
                  claimed on all my donations in that tax year it is my
                  responsibility to pay any difference.  If you pay Income Tax
                  at the higher or additional rate and want to receive the
                  additional tax relief due to you, you must include all your
                  Gift Aid donations on your Self-Assessment tax return or ask
                  HM Revenue and Customs to adjust your tax code.
                </Box>
                <Box className="text-sm mb-3">
                  Please inform us if you want to cancel this declaration/Change
                  your name or home address/No longer pay sufficient tax on your
                  income and/or capital gains.
                </Box>
                <Box className="text-sm mb-3">
                  Gift Aid is reclaimed by {eventDetails?.organizationName} from
                  the tax you pay for the current tax year. Your home address is
                  needed to identify you as a current taxpayer.
                </Box>
                <Box className="flex justify-center mt-2 mb-2 max-h-700:hidden">
                  <Image
                    className="w-1/2"
                    src={GiftAid.src}
                    width={200}
                    height={200}
                    alt="Image"
                  />
                </Box>
                <Box className="text-sm mb-1 mt-8">
                  <input
                    type="checkbox"
                    checked={modalData.payment.giftAidConfirm}
                    onChange={() => {
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          giftAidConfirm: !modalData.payment.giftAidConfirm,
                        },
                      })
                    }}
                    className="mr-2 pt-1"
                  />
                  <span
                    className="font-bold cursor-pointer pb-[100px] md:pb-0"
                    onClick={() => {
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          giftAidConfirm: !modalData.payment.giftAidConfirm,
                        },
                      })
                    }}
                  >
                    Yes, add Gift Aid
                  </span>
                </Box>
              </Box>
            )}
            {giftAidStep === 'sussex' && (
              <Box className="my-2">
                <Box className="text-lg font-bold mb-6">Add Gift Aid</Box>
                <Box className="text-sm mb-3">
                  Charities receive 25% more at no extra cost to you
                </Box>
                <Box className="text-sm mb-3">
                  Gift Aid is tax relief that lets your charity claim an extra
                  25p for every £1 you give.
                </Box>
                <Box className="text-sm mb-3">
                  I am a UK taxpayer and I would like the University of Sussex
                  to treat all donations I have made in the last four years and
                  all donations I make in future as Gift Aid donations. I
                  understand that if I pay less income tax and/or capital gains
                  than the amount of Gift Aid claimed on all of my donations in
                  a tax year by University of Sussex and all other charities and
                  amateur sports clubs (CASCs) that I donate to, then it is my
                  responsibility to pay any difference.
                </Box>
                <Box className="text-sm mb-3">
                  If you pay a higher rate tax then you can claim extra relief
                  on your donations.
                </Box>
                <Box className="text-sm mb-3">
                  Please contact the Development and Alumni Relations Office on
                  01273 678258 or alumni@sussex.ac.uk if you want to cancel this
                  or a previous declaration, change your contact details, or if
                  you no longer pay sufficient tax on your income and/or capital
                  gains.
                </Box>

                <Box className="text-sm mb-1 mt-8">
                  <input
                    type="checkbox"
                    checked={modalData.payment.giftAidConfirm}
                    onChange={() => {
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          giftAid: !modalData.payment.giftAidConfirm,
                          giftAidConfirm: !modalData.payment.giftAidConfirm,
                        },
                      })
                    }}
                    className="mr-2 pt-1"
                  />
                  <span
                    className="font-bold cursor-pointer pb-[100px] md:pb-0"
                    onClick={() => {
                      setModalData({
                        ...modalData,
                        payment: {
                          ...modalData.payment,
                          giftAidConfirm: !modalData.payment.giftAidConfirm,
                        },
                      })
                    }}
                  >
                    Yes, I confirm I want to Gift Aid my donations.
                  </span>
                </Box>

                <Box className="flex justify-center mt-2 mb-2 max-h-700:hidden">
                  <Image
                    className="w-1/2"
                    src={GiftAid.src}
                    width={200}
                    height={200}
                    alt="Image"
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* Donation Wall */}
          <Box
            show={modalStage.step === 4}
            className={`flex flex-col px-2 pb-10 md:pb-0`}
          >
            <Box className="font-medium">Add a Message for the Donor Wall:</Box>
            <Box className="flex justify-start items-center -mt-1">
              <TextAreaInput
                className={`w-full mt-4`}
                label="Message (optional)"
                onChange={(data) => {
                  setModalData({ ...modalData, message: data })
                }}
                value={modalData?.message}
              />
            </Box>
            <Box className="font-medium mt-2 mb-1">Visibility:</Box>
            <ItemPicker
              itemClass="!w-1/3"
              choices={visibilityChoices}
              onClick={(value: string | number) =>
                setModalData({
                  ...modalData,
                  visibility: value as string,
                })
              }
              value={modalData.visibility}
            />

            <Box className="mt-4 text-sm">
              We{`'`}d love to keep in touch with you. Are you happy for us to
              use your contact details to keep you updated on the impact of your
              support, as well as other fundraising communications, campaigns
              and news?
            </Box>
            <Box className="text-sm mb-1 mt-4">
              <input
                type="checkbox"
                checked={modalData?.allowEmailContact}
                onChange={() => {
                  setModalData({
                    ...modalData,
                    allowEmailContact: !modalData.allowEmailContact,
                  })
                }}
                className="mr-2 pt-1"
              />
              <span
                className="cursor-pointer text-sm"
                onClick={() => {
                  setModalData({
                    ...modalData,
                    allowEmailContact: !modalData.allowEmailContact,
                  })
                }}
              >
                Yes - you can contact me via email
              </span>
            </Box>
            <Box className="text-sm mb-1 mt-4">
              <input
                type="checkbox"
                checked={modalData?.allowTelephoneContact}
                onChange={() => {
                  setModalData({
                    ...modalData,
                    allowTelephoneContact: !modalData.allowTelephoneContact,
                  })
                }}
                className="mr-2 pt-1"
              />
              <span
                className="cursor-pointer text-sm"
                onClick={() => {
                  setModalData({
                    ...modalData,
                    allowTelephoneContact: !modalData.allowTelephoneContact,
                  })
                }}
              >
                Yes - you can contact me via telephone
              </span>
              <Box className="h-[130px]"></Box>
            </Box>
          </Box>

          {/* Details Stage */}
          <Box
            show={modalStage.step === 5}
            className={`flex flex-col px-2 pb-10 md:pb-0`}
          >
            <Box className={`text-sm text-center`}>You are about to donate</Box>
            <Box className={`text-3xl font-bold text-center`}>
              {`${currencies[organisationCurrency].symbol}${roundAmount(
                amount
              )}${
                modalData.paymentType === PaymentType.DirectDebit
                  ? ` ${
                      modalData.selectedRecurrency === 'Monthly'
                        ? 'a month'
                        : modalData.selectedRecurrency === 'Quarterly'
                        ? 'a quarter'
                        : 'a year'
                    }`
                  : ''
              }`}
            </Box>
            <Box className={`text-sm text-center mt-4`}>to fund</Box>
            <Box className={`text-xl font-bold text-center`}>
              {modalData?.program ?? eventDetails?.title}
            </Box>
            <Box className="flex justify-center mt-4 mb-4 max-h-700:hidden">
              <DonationImg01 />
            </Box>
            {/* zone: fee */}
            {platformFee > 0 &&
              modalData.paymentType !== PaymentType.DirectDebit && (
                <>
                  <Box className={`text-sm mt-6`}>
                    To ensure that 100% of your intended donation goes towards
                    making a positive impact, we encourage you to consider
                    covering the small transaction fee associated with online
                    donations
                  </Box>
                  <Box className={`flex justify-center items-center`}>
                    <ToggleInput
                      selected={modalData.payment.coverPlatformFee ? 1 : 0}
                      centerText
                      testid={'cover-fee-input'}
                      options={feeOptions}
                      className={`w-full mt-4`}
                      value={
                        modalData.payment.coverPlatformFee
                          ? feeOptions[1]
                          : feeOptions[0]
                      }
                      callback={(data) => {
                        setModalData({
                          ...modalData,
                          payment: {
                            ...modalData.payment,
                            coverPlatformFee: data
                              .toLowerCase()
                              .includes('yes'),
                            coverTrxFee: data.toLowerCase().includes('yes'),
                          },
                        })
                      }}
                    />
                  </Box>
                </>
              )}
            {/*!isMobile && modalData.payment.method !== 'CARD' && (
                <div className="qr-container mb-8 flex justify-center">
                  <QRCode
                    value={`${window.location.origin}/donation/${
                      eventDetails?.donationUrl ?? ''
                    }?amount=${modalData.amount}&coverFee=${
                      modalData.payment.coverFee
                    }&currency=${organisationCurrency}`}
                    className="rounded"
                    style={{ width: '40%', height: 'auto' }}
                  />
                </div>
              )*/}
            <Box className={`my-4 mt-8 text-right`}>
              <Box className={`text-sm`}>
                Payment Method:{' '}
                {modalData.paymentType === PaymentType.DirectDebit ? (
                  <span className={`font-bold`}>Direct Debit</span>
                ) : (
                  <span className={`font-bold`}>
                    {
                      PaymentMethods[
                        modalData.payment.method as keyof typeof PaymentMethods
                      ]
                    }
                  </span>
                )}
              </Box>
              {/*<Box className={`text-sm`}>
                  <span className={`font-bold`}>
                    {donationTypeOptions[modalData.payment.isRecurring ? 1 : 0]}
                  </span>
                  <span>
                    {modalData.payment.isRecurring
                      ? ' (Monthly billed until cancelled)'
                      : ''}
                  </span>
                </Box>*/}
              {platformFee > 0 &&
                modalData.paymentType !== PaymentType.DirectDebit && (
                  <Box className={`text-sm`}>
                    Fees{' '}
                    {`(${
                      modalData.payment.coverPlatformFee
                        ? 'Covered by you'
                        : 'Deducted from the donation'
                    })`}
                    :{' '}
                    <span className="font-bold">
                      {`${currencies[organisationCurrency].symbol}${roundAmount(
                        getDonationTotal({
                          amount: amount * 100,
                          platformFee,
                          regionCode:
                            getBankingCountryByPaymentMethod(paymentMethod),
                          coverProcessorFee: modalData.payment.coverTrxFee,
                          coverPlatformFee: modalData.payment.coverPlatformFee,
                        }).total / 100
                      )} `}
                      {(() => {
                        const { flat, percent } = getProcessorFees(
                          getBankingCountryByPaymentMethod(paymentMethod)
                        )
                        return `(${(percent + platformFee).toFixed(
                          1
                        )}% + ${flat}p)`
                      })()}
                    </span>
                  </Box>
                )}
              {modalData?.payment?.giftAid && (
                <Box className={`text-sm`}>
                  This donation can raise 25% more with gift aid:{' '}
                  <span className={`font-bold`}>{`${
                    currencies[organisationCurrency].symbol
                  }${roundAmount(amount * 0.25)}`}</span>
                </Box>
              )}
            </Box>

            {paymentError && (
              <Box className={`mb-4 text-center items-center`}>
                <div className="w-full h-px bg-gray-200 my-4"></div>
                <span className="text-red-500 text-sm">{paymentError}</span>
              </Box>
            )}
            {modalData.payment.method !== 'CARD' && paymentRequest && (
              <PaymentRequestButtonElement options={{ paymentRequest }} />
            )}
          </Box>
          {/* Donation Completed Stage */}
          <Box
            show={modalStage.step === 6}
            className={`flex flex-col py-4 pt-4 px-2`}
          >
            <Box className={`text-2xl mt-10 font-bold text-center`}>
              You donated{' '}
              <br/>
              <span
                className={`font-bold text-3xl`}
                style={{ color: StaticColours.v2.blue }}
              >
                {`${currencies[organisationCurrency].symbol}${amount}`}
              </span>
              {modalData.paymentType === PaymentType.DirectDebit
                ? ` ${
                    modalData.selectedRecurrency === 'Monthly'
                      ? 'a month'
                      : modalData.selectedRecurrency === 'Quarterly'
                      ? 'a quarter'
                      : 'a year'
                  }`
                : ''}{' '}
            </Box>
            <Box className={`text-sm text-center mt-2`}>
              Thank you for your support!
            </Box>
            <Box className="flex justify-center mt-4 mb-4 max-h-700:hidden">
              <DonationImg02 />
            </Box>
            <Box className={`my-4 mt-10 text-center`}>
              <Box className={`text-lg font-medium`}>
                Please share our fundraiser!
              </Box>
              <Box className={`text-sm mb-2`}>
                Help us to achieve our goals, share with your friends.
              </Box>
              <Box className={`text-lg mt-2`}>
                <FacebookShareButton url={shareUrl} className="mr-2">
                  <FacebookIcon
                    bgStyle={{ fill: selectionColour }}
                    size="48px"
                    round
                  />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} className="mr-2">
                  <TwitterIcon
                    bgStyle={{ fill: selectionColour }}
                    size="48px"
                    round
                  />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} className="mr-2">
                  <LinkedinIcon
                    bgStyle={{ fill: selectionColour }}
                    size="48px"
                    round
                  />
                </LinkedinShareButton>
                <WhatsappShareButton url={shareUrl}>
                  <WhatsappIcon
                    bgStyle={{ fill: selectionColour }}
                    size="48px"
                    round
                  />
                </WhatsappShareButton>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Progress Buttons */}
        <Box
          className={
            disablePayment
              ? '!sticky bottom-0 flex flex-row w-full items-center justify-center bg-white pb-4 z-10 pt-2 '
              : '!sticky bottom-0 z-10 rounded-br-xl rounded-bl-xl pt-3 w-full flex justify-end space-x-reverse space-x-2 shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.3)] !pb-3'
          }
          style={{
            backgroundColor: theme.backgroundColour,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <Button
            className="-mr-2 md:mr-2 border-0"
            size="auto"
            type="modal"
            onClick={() => {
              window.open('mailto:hello@forumm.to', '_blank')
            }}
            icon={<FaExternalLinkAlt />}
            title={'Need Help?'}
          />
          <Button
            onClick={() => {
              const container = document.getElementById('modal')
              if (container?.firstElementChild instanceof HTMLElement) {
                container.firstElementChild.scrollTop = 0
              }
              if (modalStage.step === 0 && setIsOpen) return setIsOpen(false)
              if (modalStage.step == 1) return setModalStage(ModalFlow[0])
              if (modalStage.step == 2) return setModalStage(ModalFlow[1])
              if (modalStage.step == 3) {
                if (giftAidStep === 2) {
                  setGiftAidStep(1)
                  return
                }
                if (disablePayment) setModalStage(ModalFlow[1])
                else setModalStage(ModalFlow[2])
                return
              }
              if (modalStage.step == 4) {
                if (configSkipGiftAidStep) return setModalStage(ModalFlow[2])
                return setModalStage(ModalFlow[3])
              }
              if (modalStage.step == 5) return setModalStage(ModalFlow[4])
              if (programs && programs?.length > 0) setModalStage(ModalFlow[0])
              else setModalStage(ModalFlow[1])
              if (!disablePayment) {
                if (setIsOpen) setIsOpen(false)
              }
            }}
            className="mr-2"
            size="auto"
            type="modal"
            title={
              modalStage.step === 6
                ? 'Close'
                : modalStage.step === 0
                ? 'Cancel'
                : 'Back'
            }
          />
          <Button
            show={modalStage.step < 5}
            disabled={isContinueDisabled}
            onClick={() => {
              const container = document.getElementById('modal')
              if (container?.firstElementChild instanceof HTMLElement) {
                container.firstElementChild.scrollTop = 0
              }

              handleSetModalStage(ModalFlow[modalStage.step + 1])
            }}
            size="auto"
            type="modal"
            title="Continue"
          />
          {modalData.payment.method === 'CARD' && (
            <Button
              show={modalStage.step === 5}
              disabled={disable || loading}
              loading={loading}
              title={`${formCTA ?? 'Donate'}`}
              size="auto"
              onClick={(e) => {
                handleSubmit(e)
              }}
            />
          )}
        </Box>
      </Box>
    )

    if (disablePayment) return <Box className="w-full">{innerConent}</Box>

    return (
      <Modal
        show={isOpen || false}
        setShow={(val: boolean) => {
          if (!val) {
            setModalData(cloneDeep(initialState))
            setModalStage(ModalFlow[0])
            setGiftAidStep(1)
            setLoading(false)
            setStripeCardCompleted(false)
            setPaymentMethod(undefined)
          }
          if (setIsOpen) setIsOpen(val)
        }}
        title="Save Confirmation"
        className="p-0 sm:min-w-[650px]"
        zIndex="9999"
        version
      >
        {innerConent}
      </Modal>
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  return donationFormModal()
}

export default DonationForm
