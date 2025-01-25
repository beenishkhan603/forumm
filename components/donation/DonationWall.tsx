import Box from '@components/base/Box'
import { GoArrowRight } from 'react-icons/go'
import Image from 'next/image'
import { Button } from '@components/inputs/Button'
import currencies from '@libs/currencies'
import { useTheme } from '@libs/useTheme'
import moment from 'moment'
import React, { useState } from 'react'
import { Transaction } from '../../pages/donation/[donationUrl]/index'

const visibilityChoices = {
  NAME_AMOUNT: 'Name & amount',
  NAME: 'Name only',
  ANON: 'Anonymous',
}

interface DonationWallProps {
  donations: Transaction[]
  donationAction: () => void
  customClassName?: string
}

const getTimeSinceDonation = (time: string) => {
  if (!time) return ''

  try {
    const timestamp = typeof time === 'string' ? parseInt(time, 10) : time
    const momentTime =
      timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
    return moment(momentTime).fromNow()
  } catch (e) {
    console.warn({ e })
    return ''
  }
}

const noDonationsPage = (
  <Box className={`text-xl pt-4`}>
    <Box className={`flex flex-row`}>
      <Box className={`flex flex-col`}>
        <Box className={`flex flex-row space-between`}>
          <Box className="text-xs md:text-sm">
            There are no donations yet, be the first!
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
)

export const DonationWall = ({
  donations,
  donationAction,
  customClassName,
}: DonationWallProps) => {
  const [donationIndex, setDonationsIndex] = useState(1)
  const amountToShow = 5
  const { theme, StaticColours } = useTheme()
  const color =
    theme.type === 'DARK'
      ? StaticColours.forumm_blue_light
      : StaticColours.v2.blue
  return (
    <Box
      className={`flex flex-col w-full p-2 overflow-y-auto max-h-[calc(90vh-17px)] ${customClassName}`}
    >
      {/* Header */}
      <Box className={`flex flex-row items-center justify-between mb-4`}>
        <Box className={`font-normal text-3xl`}>Donation Wall</Box>
        <Box className="font-medium mr-6 md:mr-0">
          {donations?.length ?? 0} donations
        </Box>
      </Box>
      {/* Donations */}
      {donations.length < 1 ? (
        noDonationsPage
      ) : (
        <Box className="flex flex-col flex-grow h-full overflow-y-auto scrollbar-custom">
          {donations.map((dono, i) => {
            const {
              firstName,
              lastName,
              message,
              amount,
              created,
              currency,
              avatarUrl,
              coverFee,
              selectedProgram: programme,
              donation,
              visibility,
            } = dono

            const donationAmount = (() => {
              try {
                if (coverFee === 'yes' && !!donation)
                  return parseFloat(donation)
                return amount
              } catch (err) {
                console.log(err)
                return amount
              }
              return 0
            })()

            const isAnon = visibility === visibilityChoices.ANON
            const showAmount = visibility === visibilityChoices.NAME_AMOUNT

            return (
              <Box key={`${i}`}>
                <Box className={`font-medium text-xl py-4 -mt-3 mr-1`}>
                  <Box className={`flex flex-row w-full`}>
                    <Box
                      style={{ width: '80px' }}
                      className={`flex flex-col mt-3 ml-3`}
                    >
                      <Image
                        src={
                          avatarUrl ??
                          'https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/heart-and-hand-donation-icon.png'
                        }
                        alt={'Logo'}
                        width={40}
                        height={40}
                        className="rounded-full object-cover h-[40px] border border-1"
                      />
                    </Box>
                    <Box className={`flex flex-col w-full`}>
                      <Box
                        className={`flex flex-row justify-between items-center`}
                      >
                        <Box
                          className={`text-sm text-sm font-medium mt-2 mb-4`}
                        >
                          {!isAnon ? firstName + ' ' + lastName : 'Anonymous'}
                        </Box>
                        <Box
                          className={'text-xs font-light -mt-2 mr-6 xl:mr-2'}
                        >
                          {created ? getTimeSinceDonation(`${created}`) : ''}
                        </Box>
                      </Box>
                      <Box
                        className={`flex flex-col justify-between -mt-2 mb-2`}
                      >
                        <Box
                          show={!!message}
                          className="text-xs text-left font-light text-sm"
                        >
                          {message}
                        </Box>
                      </Box>
                      <Box
                        className={`text-sm font-medium flex flex-row items-center`}
                        style={{ color }}
                      >
                        {!showAmount && <span>donated to</span>}
                        {showAmount && (
                          <span>
                            {' '}
                            {currency
                              ? currencies?.[currency?.toUpperCase()].symbol
                              : '£'}
                            {donationAmount / 100}
                          </span>
                        )}
                        <Box
                          show={!!programme}
                          className={`text-xs flex items-center gap-1 pl-1`}
                        >
                          <GoArrowRight />
                          {programme}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box className="h-[2px] bg-gray-200 w-3/4 sm:w-full mx-auto"></Box>
              </Box>
            )
          })}
        </Box>
      )}
      {/* Buttons */}
      <Box
        className={`flex flex-row space-x-2 pt-4 items-center justify-center`}
      >
        <Button
          show={
            donations.length > 5 &&
            donationIndex * amountToShow >= donations.length
          }
          className="w-[180px]"
          title="Go Back"
          type="secondary"
          size="auto"
          onClick={() => {
            if (donationIndex * amountToShow >= donations.length)
              setDonationsIndex(1)
          }}
        />
      </Box>
    </Box>
  )
}
