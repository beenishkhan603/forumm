import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import DonationImg01 from '@public/images/donationImg01.svg'
import DonationImg02 from '@public/images/donationImg02.svg'
import { RadioFieldInput } from '@components/inputs/RadioFieldInput'
import { useRouter } from 'next/router'
import { AiOutlineLeft } from 'react-icons/ai'
import { Event } from '@graphql/__generated/graphql'
import { Button } from '@components/inputs/Button'
import { ItemPicker } from '@components/inputs/ItemPicker'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import useStatistics from '@libs/useStatistics'
import moment from 'moment'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { PriceInput } from '@components/inputs/PriceInput'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import currencies from '@libs/currencies'
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
import { roundAmount } from '@libs/Utility/util'

export interface NoPaymentDonation {
  currency: string
  amount: number
  message: string
  donatedAt: string
  program: string
  payment: {
    giftAid: any
    giftAidConfirm: any
  }
  statisticId: string
}

const ModalFlow = [
  { title: 'Programme', step: 0 },
  { title: 'Donation', step: 1 },
  { title: 'Gift Aid', step: 2 },
  { title: 'Details', step: 3 },
  { title: '', step: 4 },
]

const NoPaymentDonationForm = ({
  show = true,
  organisationCurrency,
  transactionFee,
  event,
  formCTA,
  onComplete,
  loading = false,
}: {
  show: boolean
  organisationCurrency: string
  transactionFee: number
  onComplete: (donationData: NoPaymentDonation) => void
  formCTA: string
  event: Partial<Event>
  loading: boolean
}) => {
  const statisticId = useStatistics()

  const [giftAidStep, setGiftAidStep] = useState<number>(1)
  const { theme, StaticColours } = useTheme()

  const selectionColour =
    theme.type === 'DARK'
      ? StaticColours.v2.dark_light_blue
      : StaticColours.v2.light_blue

  const [modalStage, setModalStage] = useState(ModalFlow[4])

  const [modalData, setModalData] = useState<NoPaymentDonation>({
    currency: organisationCurrency,
    amount: 0,
    message: '',
    donatedAt: moment().toISOString(),
    program: '',
    payment: {
      giftAid: false,
      giftAidConfirm: false,
    },
    statisticId: statisticId,
  })
  const programs = event.fundraising?.programs
  const eventDetails = event.event

  const hasPrograms = !!programs && programs?.length > 0

  useEffect(() => {
    setModalStage(ModalFlow[!programs || programs?.length < 1 ? 1 : 0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programs])

  const router = useRouter()
  const shareUrl = `https://${window.location.hostname}${router.asPath}`

  const amount = modalData?.amount ? parseFloat(`${modalData.amount}`) : 0

  const baseAmount = `${
    currencies[organisationCurrency ?? 'GBP'].symbol
  }${roundAmount(amount)}`

  const amountWithFee = `(${
    currencies[organisationCurrency ?? 'GBP'].symbol
  }${roundAmount(amount + amount * transactionFee)})`

  const feeOptions = [
    `No, not today (${baseAmount})`,
    `Yes, cover the fee ${amountWithFee}`,
  ]

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (loading) return
    // setLoading(true)
    try {
      if (onComplete) onComplete(modalData)
      handleSetModalStage(ModalFlow[modalStage.step + 1])
    } catch (ex) {
      console.warn(ex)
      // setLoading(false)
    }
  }

  const handleSetModalStage = async (newStage: {
    title: string
    step: number
  }) => {
    if (newStage.step === 2 && modalData.amount < 1) return

    return setModalStage(newStage)
  }

  const amountChoices = [
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}10`,
      value: 10,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}20`,
      value: 20,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}50`,
      value: 50,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}100`,
      value: 100,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}200`,
      value: 200,
    },
    {
      title: `${currencies[organisationCurrency ?? 'GBP'].symbol}300`,
      value: 300,
    },
  ]

  return (
    <Box
      show={show}
      className={`overflow-auto scrollbar-hide max-h-[800px] rounded-xl ${
        theme.type === 'DARK' ? 'bg-midnight-dark' : 'bg-white'
      } !z-9999`}
    >
      <Box
        className="sticky top-0 z-10 flex justify-between items-center p-4 rounded-tl-xl rounded-tr-xl shadow-black"
        style={{
          backgroundColor: theme.backgroundColourSecondary,
        }}
      >
        <Box className="relative flex items-center justify-start">
          {modalStage.step >= (programs && programs.length > 0 ? 1 : 2) &&
            modalStage.step < 5 && (
              <AiOutlineLeft
                className="cursor-pointer mr-4"
                onClick={() => setModalStage(ModalFlow[modalStage.step - 1])}
              />
            )}
          <Box className="font-bold">{modalStage.title}</Box>
        </Box>
        <Box show={modalStage.step <= 4} className="flex">
          {modalStage.step}/
          {hasPrograms ? ModalFlow.length - 1 : ModalFlow.length - 2}
        </Box>
      </Box>
      <Box className="relative p-3 pb-10 md:pb-3 sm:p-6 mb-16">
        {/* Modal Content */}
        {/* Program Stage */}
        <Box
          show={modalStage.step === 0}
          className={`relative flex flex-col py-4 h-full`}
        >
          <Box
            className={`flex justify-start items-center flex-col sticky top-14 bg-white w-full`}
          >
            <Box className={`-mb-6 self-start`}>
              Select your donation programme:
            </Box>
            <DropdownInput
              className={`w-full -mt-4`}
              label=""
              placeholder="Select a fundraising programme"
              bgColor="bg-white"
              options={
                programs && programs?.length > 0
                  ? programs?.map((program) => ({
                      value: program.title.toUpperCase(),
                      label: program.title,
                    }))
                  : []
              }
              onChange={(data) => {
                setModalData({ ...modalData, program: data })
              }}
              value={modalData?.program}
            />
          </Box>

          <Box
            show={modalData.program.length > 0}
            className={`mt-6 flex justify-start items-start flex-col`}
          >
            <Box className="flex flex-col md:flex-row items-center w-full">
              <Box
                show={
                  !!programs?.find(
                    (pg) => pg.title.toUpperCase() === modalData.program
                  )?.media?.url
                }
                className={`mr-2 flex justify-center items-center max-w-[65%]`}
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
                  className={`object-cover rounded min-w-[150px] max-w-[100%] w-[100%]`}
                  width={300}
                  height={50}
                />
              </Box>
              <Box className={`flex flex-col align-start justify-start`}>
                <Box className={`text-xl font-medium`}>
                  {
                    programs?.find(
                      (pg) => pg.title.toUpperCase() === modalData.program
                    )?.title
                  }
                </Box>
              </Box>
            </Box>

            <Box className={`mt-4`}>
              {
                programs?.find(
                  (pg) => pg.title.toUpperCase() === modalData.program
                )?.description
              }
            </Box>
          </Box>
        </Box>
        {/* Donation Stage */}
        <Box show={modalStage.step === 1} className={`flex flex-col py-4 pt-4`}>
          <RadioFieldInput
            label="Please select your currency:"
            testid={'currency-radio'}
            options={['GBP', 'USD', 'CAD', 'EUR']}
            className="font-medium"
            itemClassName="text-sm mt-4"
            value="GBP"
            onChange={(currency) => {
              //setOrgcurrency(currency)
            }}
          />
          <Box className="pb-2 pt-4 font-medium">
            Please indicate the amount you wish to donate:
          </Box>
          <ItemPicker
            choices={amountChoices}
            onClick={(value: string | number) =>
              setModalData({ ...modalData, amount: Number(value) })
            }
            value={modalData.amount}
          />
          <Box className={`flex justify-start items-center w-full`}>
            <PriceInput
              hint="Amount"
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
          <Box className={`flex flex-col mt-6`}>
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
          </Box>
        </Box>

        {/* Gift Aid */}
        <Box show={modalStage.step === 2} className="flex flex-col px-2">
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
                <b>✓</b> I am not receiving anything in return for this donation
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
            <Box className="my-4">
              <Box className="text-lg font-bold mb-6">Add Gift Aid</Box>
              <Box className="text-sm mb-3">
                Charities receive 25% more at no extra cost to you
              </Box>
              <Box className="text-sm mb-3">
                Gift Aid is tax relief that lets your charity claim an extra 25p
                for every £1 you give.
              </Box>
              <Box className="text-sm mb-3">
                I am a UK taxpayer and understand that if I pay less Income Tax
                and/or Capital Gains Tax than the amount of Gift Aid claimed on
                all my donations in that tax year it is my responsibility to pay
                any difference.  If you pay Income Tax at the higher or
                additional rate and want to receive the additional tax relief
                due to you, you must include all your Gift Aid donations on your
                Self-Assessment tax return or ask HM Revenue and Customs to
                adjust your tax code.
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
        </Box>
        {/* Details Stage */}
        <Box
          show={modalStage.step === 3}
          className={`flex flex-col pt-4 px-2 pb-10 md:pb-0`}
        >
          <Box className={`text-xl text-center`}>
            You are about to donate to
          </Box>
          <Box className={`text-2xl font-bold text-center`}>
            {eventDetails?.organizationName}
          </Box>
          <Box className="flex justify-center mt-4 mb-4 max-h-700:hidden">
            <DonationImg01 />
          </Box>
          <Box className={`my-4 text-right`}>
            <Box className={`text-sm`}>
              You are about to donate:{' '}
              <span className={`font-bold`}>{`${
                currencies[organisationCurrency].symbol
              }${roundAmount(modalData.amount)}`}</span>
            </Box>
          </Box>
          <div className="w-full h-px bg-gray-200 my-4"></div>
          <Box className={`mb-4 text-right`}>
            <Box className={`text-sm`}>
              Total:{' '}
              <span className={`font-bold text-m`}>{`${
                currencies[organisationCurrency].symbol
              }${roundAmount(amount)}`}</span>
            </Box>
          </Box>
        </Box>
        {/* Donation Completed Stage */}
        <Box
          show={modalStage.step === 4}
          className={`flex flex-col py-4 pt-4 px-2`}
        >
          <Box className={`text-2xl mt-10 font-bold text-center`}>
            You&apos;ve added a{' '}
            <span
              className={`font-bold text-3xl`}
              style={{ color: StaticColours.v2.blue }}
            >{`${currencies[organisationCurrency].symbol}${roundAmount(
              amount
            )}`}</span>{' '}
            Donation to your order
          </Box>
          <Box className={`text-sm text-center mt-2`}>
            Thank you for your support!
          </Box>
          <Box className="flex justify-center mt-4 mb-4 max-h-700:hidden">
            <DonationImg02 />
          </Box>
          <Box show={false} className={`my-4 mt-10 text-center`}>
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
      <Box className="sticky bottom-0 flex flex-col w-full items-center justify-center bg-white pb-4">
        <Box
          className="rounded-br-xl rounded-bl-xl pb-3 pt-3 w-full flex justify-center space-x-reverse space-x-2 shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.3)] bg-red-400"
          style={{
            backgroundColor: theme.backgroundColour,
          }}
        >
          <Button
            onClick={() => {
              // if (modalStage.step === 3 && setIsOpen) return setIsOpen(false)
              if (programs && programs?.length > 0) setModalStage(ModalFlow[0])
              else setModalStage(ModalFlow[1])
              // if (setIsOpen) setIsOpen(false)
            }}
            className="mr-2"
            size="auto"
            type="modal"
            title={modalStage.step === 4 ? 'Close' : 'Cancel'}
          />
          <Button
            show={modalStage.step < 3}
            // disabled={isContinueDisabled}
            onClick={() => {
              handleSetModalStage(ModalFlow[modalStage.step + 1])
            }}
            size="auto"
            type="modal"
            title="Continue"
          />
          <Button
            show={modalStage.step >= 3}
            disabled={loading}
            loading={loading}
            title={`${formCTA ?? 'Donate'}`}
            size="auto"
            onClick={(e) => {
              handleSubmit(e)
            }}
          />
        </Box>
        <Box className="flex items-center space-x-2">
          <Box
            show={!!programs && programs.length > 0}
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
        </Box>
      </Box>
    </Box>
  )
}

export default NoPaymentDonationForm
