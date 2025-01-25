import Box from '@components/base/Box'
import currencies from '@libs/currencies'
import { useTheme } from '@libs/useTheme'
import React from 'react'
import { Transaction } from '../../pages/donation/[donationUrl]/index'
import { Button } from '@components/inputs/Button'
import { convertDonationToCSV } from '../../libs/Utility/csv'
import { GET_FUNDRAISING_CSV } from '@graphql/events/getFundrasingCSV'
import { useLazyQuery } from '@apollo/client'

interface DonationGridProps {
  donations: Transaction[]
  eventId: string
}

export const DonationGrid = ({ donations, eventId }: DonationGridProps) => {
  const { theme } = useTheme()

  const classHead =
    'p-2 md:p-3 border border-forumm-menu-border text-center font-bold'
  const classRow = 'p-2 md:p-3 mt-2 text-center break-words'

  const getSymbol = (cr: string) =>
    cr ? currencies?.[cr?.toUpperCase()].symbol : '£'

  const getAmount = (amount?: number | string, cr?: string) => {
    if (!amount) return 'N/A'
    const value = typeof amount === 'string' ? parseInt(amount, 10) : amount
    return `${getSymbol(cr ?? '')}${(value / 100).toFixed(2)}`
  }

  const getFee = (tx: Transaction) => {
    if (!tx) return ''
    if (!!tx.fee && !!tx.amount && !!tx.donation)
      return Math.max(parseInt(tx.fee), tx.amount - parseInt(tx.donation))
  }

  const [getFundraisingCSVData, { loading }] = useLazyQuery(GET_FUNDRAISING_CSV)

  const downloadCSV = async () => {
    const csv = await getFundraisingCSVData({ variables: { eventId } }).then(
      (d) => d.data?.getFundraisingCSV
    )
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'donations.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Box className={`flex flex-col h-full w-full p-2 ml-6 md:ml-0`}>
      <Box className={`flex flex-row items-center justify-between mb-4`}>
        <Box className={`font-medium text-3xl`}>Organiser Overview</Box>
        <Box className="font-medium mr-6 md:mr-0">
          {donations?.length ?? 0} donations
        </Box>
      </Box>
      {/* table */}
      <Box className="block sm:hidden text-center p-4">
        To view this content, please use a larger device.
      </Box>
      <Box
        color="backgroundColourSecondary"
        className={`hidden sm:grid col-span-9 grid-cols-9 border-collapse text-xs`}
      >
        <Box className={classHead}>Date</Box>
        <Box className={classHead}>Donor</Box>
        <Box className={classHead}>Amount</Box>
        <Box className={classHead}>Cover Fee</Box>
        <Box className={classHead}>Fee</Box>
        <Box className={classHead}>Donated (-fee)</Box>
        <Box className={classHead}>Programme</Box>
        <Box className={classHead}>Gift Aid</Box>
        <Box className={classHead}>Message</Box>
        {donations.map((tx) => {
          const fee = getAmount(getFee(tx))
          return (
            <div
              className={`grid col-span-9 grid-cols-9 border-forumm-menu-border border-2 -mt-1`}
              style={{ background: theme.backgroundColourSecondary }}
              key={tx.created}
            >
              <Box className={`${classRow}`}>{tx.datetime}</Box>
              <Box
                className={`${classRow}`}
              >{`${tx.firstName} ${tx.lastName} (${tx.email})`}</Box>
              <Box className={classRow}>
                {getAmount(tx.amount, tx.currency)}
              </Box>
              <Box className={classRow}>
                {tx?.coverFee ? tx.coverFee.toUpperCase() : 'N/A'}
              </Box>{' '}
              <Box className={classRow}>{fee}</Box>
              <Box className={classRow}>
                {getAmount(tx.donation ?? tx.amount, tx.currency)}
              </Box>
              <Box className={classRow}>{`${tx?.selectedProgram}`}</Box>
              <Box className={classRow}>
                {tx?.giftAid ? tx.giftAid.toUpperCase() : ''}
              </Box>{' '}
              <Box
                className={classRow}
              >{`${tx?.message ? tx.message : 'N/A'}`}</Box>
            </div>
          )
        })}
      </Box>
      <Box className="w-full flex items-center justify-between pt-8">
        <Box className="text-center pl-3 md:pl-0">
          <Button
            title="Export CSV"
            onClick={downloadCSV}
            className="ml-2 text-white whitespace-nowrap"
            loading={loading}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default DonationGrid
