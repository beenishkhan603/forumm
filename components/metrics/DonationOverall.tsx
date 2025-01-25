import Box from '@components/base/Box'
import LoadingSpinner from '@components/base/LoadingSpinner'
import Text from '@components/base/Text'
import { useTheme } from '@libs/useTheme'
import moment from 'moment'
import {
  roundAmount,
  getUniqueUsersDonation,
  getTotalUsersDonation,
} from '@libs/Utility/util'
import type { EventOverviewFragment } from '@graphql/__generated/graphql'
import type { Statistic } from '@graphql/__generated/graphql'

const DonationOverall = ({
  fundraises,
  loading,
  currency,
  metrics,
}: {
  fundraises: EventOverviewFragment[]
  loading: boolean
  currency?: string
  metrics: Statistic[]
}) => {
  const { theme } = useTheme()

  if (!fundraises || loading)
    return (
      <Box
        color="foregroundColour"
        className="flex-1 min-h-[300px] max-h-[500px] rounded-3xl border shadow-md border-forumm-menu-border p-5"
      >
        <Box className="w-full flex h-[325px] justify-center items-center text-center">
          <LoadingSpinner size="medium" />
        </Box>
      </Box>
    )

  let totalDonations = 0
  let mostSuccessfulCampaign = { title: '', raised: 0 }
  let totalRaised = 0
  let totalDonationAmount = 0
  let mostRecentDonation = { date: new Date(0), amount: 0 }
  let allDonations: number[] = []
  let averageDonationPerVisitor = 0
  let percentDonated = 0
  const uniqueDonors = new Set<string>()

  fundraises.forEach((fundraise: EventOverviewFragment) => {
    // @ts-ignore
    const { transactions, raised, title } = fundraise.fundraising
    totalDonations += transactions?.length
    totalRaised += raised
    if (raised > mostSuccessfulCampaign.raised) {
      mostSuccessfulCampaign = { title, raised }
    }
    transactions?.forEach((transaction: any) => {
      totalDonationAmount += transaction.amount
      allDonations.push(transaction.amount)
      const createdDate = new Date(transaction.created * 1000)
      if (createdDate > mostRecentDonation.date) {
        mostRecentDonation = {
          date: createdDate,
          amount: transaction.amount,
        }
      }
      const userIdentifier = transaction.firstName && transaction.lastName
      if (userIdentifier) {
        uniqueDonors.add(userIdentifier)
      }
    })
  })
  const totalDonors = uniqueDonors.size
  const uniqueVisitorsList = getUniqueUsersDonation(metrics, 'default')
  const uniqueVisitors = Math.max(uniqueVisitorsList.length, totalDonors)

  const averageDonation = totalDonations
    ? totalDonationAmount / totalDonations / 100
    : 0
  const formattedMostRecentDonationDate = moment(
    mostRecentDonation.date
  ).format('DD MMM YYYY')

  let medianDonation = 0
  if (totalDonations > 0) {
    allDonations.sort((a, b) => a - b)
    const middleIndex = Math.floor(totalDonations / 2)

    if (totalDonations % 2 === 0) {
      medianDonation =
        (allDonations[middleIndex - 1] + allDonations[middleIndex]) / 2
    } else {
      medianDonation = allDonations[middleIndex]
    }
    medianDonation /= 100
  }

  if (uniqueVisitors > 0) {
    averageDonationPerVisitor = totalDonationAmount / uniqueVisitors / 100
    percentDonated = (totalDonors / uniqueVisitors) * 100
  }

  return (
    <Box
      color="foregroundColour"
      className="flex-1 min-h-[300px] max-h-[500px] rounded-3xl border shadow-md border-forumm-menu-border p-5 overflow-y-scroll"
    >
      <Box className="text-left mb-5">
        <Text className="mb-5 text-lg xl:text-xl">Overall Performance</Text>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">Total Donations</Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {totalDonations} Donations
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">Total Donors</Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {totalDonors} Donors
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">
            Total Unique Visitors
          </Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {uniqueVisitors} Visitors
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">Average Donation</Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {currency}
            {roundAmount(averageDonation)}
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">Median Donation</Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {currency}
            {roundAmount(medianDonation)}
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">
            Average Donation per Web Visitor
          </Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {currency}
            {roundAmount(averageDonationPerVisitor)}
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">
            Percent of Web Visitors that Donated
          </Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {roundAmount(percentDonated)}%
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">Total Raised</Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {currency}
            {roundAmount(totalRaised)}
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">
            Most Successfull Campaign
          </Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {mostSuccessfulCampaign.title}
          </Box>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center mb-5">
          <Box className="relative text-start text-sm">
            Most Recent Donation
          </Box>
          <Box
            className="relative font-bold text-end text-sm"
            style={{ color: `${theme.tealColour}` }}
          >
            {formattedMostRecentDonationDate}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DonationOverall
