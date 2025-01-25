import Box from '@components/base/Box'
import { ProgressWheel } from '@components/base/ProgressWheel'
import { Currency } from '@libs/currencies'
import { useTheme } from '@libs/useTheme'
import React, { useState } from 'react'
import { roundAmount } from '@libs/Utility/util'
import LoadingSpinner from '@components/base/LoadingSpinner'
import { Button } from '@components/inputs/Button'
import { useRouter } from 'next/router'

interface DonationProgressWheelProps {
  currentAmount: number
  donationGoal: number
  numberOfDonators: number
  currency: Currency
  isLoading?: boolean
  donationAction: () => void
}

export const DONATION_WHEEL_CONFIG = {
  disabled: [
    'd9232843-4c2d-4f7f-b2d8-ab89499cd9d1', //Sussex UK
    'd9232843-4c2d-4f7f-b2d8-ab89499cd9d2', //Sussex US
  ],
}

export const DonationProgressWheel = ({
  currentAmount,
  donationGoal,
  numberOfDonators,
  currency,
  isLoading,
  donationAction,
}: DonationProgressWheelProps) => {
  const { theme, StaticColours } = useTheme()
  const router = useRouter()
  const isDarkTheme = theme.type === 'DARK'
  const defaultColor = isDarkTheme
    ? StaticColours.forumm_blue_light
    : StaticColours.v2.blue
  const color =
    currentAmount >= donationGoal ? theme.successColour : defaultColor

  const buttonTextColorClass = isDarkTheme
    ? 'text-forumm-light-blue-dark'
    : 'text-forumm-selected-menu-blue'

  const iconFillColor = isDarkTheme
    ? StaticColours.forumm_share_dark
    : StaticColours.v2.blue_share

  const [shareButtonText, setShareButtonText] = useState<string>('Share')

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center my-auto">
        <LoadingSpinner size="medium" />
      </Box>
    )
  }

  return (
    <Box
      className={`flex items-center justify-center flex-col px-4 space-y-2 mt-11 mb-4`}
    >
      <Box className="mb-3 hover:animate-jello-horizontal">
        <ProgressWheel
          fillColor={
            currentAmount >= donationGoal
              ? theme.successColour
              : theme.wheelColour
          }
          bgColor={
            currentAmount >= donationGoal
              ? theme.successColour
              : theme.type === 'DARK'
                ? StaticColours.forumm_blue_light
                : StaticColours.v2.blue
          }
          diameter={200}
          percentageComplete={
            donationGoal === 0 ? 0 : (currentAmount / donationGoal) * 100
          }
        />
      </Box>
      <Box className={`font-medium text-[36px] mb-2`} style={{ color }}>
        {currency?.symbol ?? '$'}
        {roundAmount(currentAmount)}
      </Box>
      <Box className={`text-md`}>
        Raised of{' '}
        <span style={{ color }} className="font-medium">
          {currency?.symbol ?? '$'}
          {roundAmount(donationGoal)}
        </span>{' '}
        target by{' '}
        <span style={{ color }} className="font-medium">
          {numberOfDonators}
        </span>{' '}
        donations.
      </Box>
      <div style={{ marginTop: '40px' }}>
        <Button
          onClick={() => {
            donationAction()
          }}
          type="primary"
          title="Donate"
          className={``}
          size="full"
        />
        <Button
          className={`w-[180px] mt-2 border-none ${buttonTextColorClass} text-xs flex items-center justify-center`}
          title={shareButtonText}
          textColor={theme.tealColour}
          icon={
            <svg
              width="13"
              height="16"
              viewBox="1 -1 12 15"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path d="M11.375 0.601562H4.625C3.8 0.601562 3.125 1.27656 3.125 2.10156V11.1016C3.125 11.9266 3.8 12.6016 4.625 12.6016H11.375C12.2 12.6016 12.875 11.9266 12.875 11.1016V2.10156C12.875 1.27656 12.2 0.601562 11.375 0.601562ZM11.375 11.1016H4.625V2.10156H11.375V11.1016ZM0.125 10.3516V8.85156H1.625V10.3516H0.125ZM0.125 6.22656H1.625V7.72656H0.125V6.22656ZM5.375 14.1016H6.875V15.6016H5.375V14.1016ZM0.125 12.9766V11.4766H1.625V12.9766H0.125ZM1.625 15.6016C0.8 15.6016 0.125 14.9266 0.125 14.1016H1.625V15.6016ZM4.25 15.6016H2.75V14.1016H4.25V15.6016ZM8 15.6016V14.1016H9.5C9.5 14.9266 8.825 15.6016 8 15.6016ZM1.625 3.60156V5.10156H0.125C0.125 4.27656 0.8 3.60156 1.625 3.60156Z" />
            </svg>
          }
          type="tertiary"
          size="small"
          onClick={(e) => {
            navigator.clipboard.writeText(
              `https://${window.location.hostname}${router.asPath}`
            )
            setShareButtonText('Copied!')
            setTimeout(() => {
              setShareButtonText('Share')
            }, 3000)
            e.preventDefault()
          }}
        />
      </div>
    </Box>
  )
}
