import { useState } from 'react'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { DateTimeInput } from '@components/inputs/DateTimeInput'
import NoData from '@components/metrics/NoData'
import { roundAmount } from '@libs/Utility/util'
import type { FundraisingTransaction } from '@graphql/__generated/graphql'
import moment from 'moment'
import { useTheme } from '@libs/useTheme'

const getFilteredTransactions = (
  transactions: FundraisingTransaction[],
  filter: string,
  startDate?: string,
  endDate?: string
) => {
  const now = moment()

  let filteredTransactions = transactions
  switch (filter) {
    case 'Last Six Months':
      filteredTransactions = transactions.filter((trx) =>
        // @ts-ignore
        moment(trx.created * 1000).isBetween(
          now.clone().startOf('month').subtract(6, 'months'),
          now
        )
      )
      break
    case 'Last Month':
      filteredTransactions = transactions.filter((trx) =>
        // @ts-ignore
        moment(trx.created * 1000).isBetween(
          now.clone().startOf('month').subtract(1, 'months'),
          now
        )
      )
      break
    case 'Last Week':
      filteredTransactions = transactions.filter((trx) =>
        // @ts-ignore
        moment(trx.created * 1000).isBetween(
          now.clone().startOf('week').subtract(1, 'weeks'),
          now
        )
      )
      break
    case 'Last 3 Days':
      filteredTransactions = transactions.filter((trx) =>
        // @ts-ignore
        moment(trx.created * 1000).isBetween(
          now.clone().subtract(3, 'days'),
          now
        )
      )
      break
    case 'Custom':
      if (startDate) {
        const startMoment = moment(startDate).startOf('day')
        filteredTransactions = filteredTransactions.filter((trx) =>
          // @ts-ignore
          moment(trx.created * 1000)
            .startOf('day')
            .isSameOrAfter(startMoment)
        )
      }
      if (endDate) {
        const endMoment = moment(endDate).endOf('day')
        filteredTransactions = filteredTransactions.filter((trx) =>
          // @ts-ignore
          moment(trx.created * 1000)
            .startOf('day')
            .isSameOrBefore(endMoment)
        )
      }
      break
    case 'All Time':
      filteredTransactions = transactions
      break
  }
  return filteredTransactions
}

const DonationTableTransaction = ({
  fundraises,
  currency,
}: {
  fundraises: any
  currency?: string
}) => {
  const { theme } = useTheme()
  const isDarkTheme = theme.type === 'DARK'

  const filterOptions = [
    'All Time',
    'Last Six Months',
    'Last Month',
    'Last Week',
    'Last 3 Days',
    'Custom',
  ]

  const sortOptions = ['Most Recent', 'Largest Amount'];
  const [filter, setFilter] = useState<string>(filterOptions[0]);
  const [sort, setSort] = useState<string>(sortOptions[0]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const allTransactions = (fundraises || []).flatMap((row: any) =>
    row.fundraising.transactions?.map((transaction: any) => ({
      ...transaction,
      program: row?.fundraising?.title || row?.event?.title || '-',
    }))
  );
  const transactions = getFilteredTransactions(
    allTransactions,
    filter,
    startDate,
    endDate
  );

  const sortedTransactions = transactions.sort((a: any, b: any) => {
    if (sort === 'Most Recent') {
      return b.created - a.created;
    } else if (sort === 'Largest Amount') {
      return b.total - a.total;
    }
    return 0;
  });
  return (
    <Box
      color="foregroundColour"
      className="flex-2 rounded-3xl border shadow-md border-forumm-menu-border p-3 sm:p-5"
    >
      <Box className="flex flex-row w-full justify-between items-center mb-5">
        <Text className="text-xl mt-2">All Donations</Text>
        <Box className="flex flex-row items-center max-h-[1rem] -translate">
          {filter === 'Custom' && (
            <div className="flex">
              <DateTimeInput
                id={'metrics-date-start'}
                value={startDate}
                onChange={(data) => setStartDate(data)}
                className="mr-2"
                inputClass="h-10 rounded-md max-w-[140px] text-xs"
                placeholderText="From"
                clickIdOnChange="metrics-date-end"
                dateOnly={true}
                required
              />
              <DateTimeInput
                id={'metrics-date-end'}
                value={endDate}
                onChange={(data) => setEndDate(data)}
                inputClass="h-10 rounded-md max-w-[140px] text-xs"
                placeholderText="To"
                dateOnly={true}
                required
              />
            </div>
          )}
          <Box className="flex flex-row items-center ml-4">
            <Text className="ml-4 mt-7 text-sm mr-2">Filter:</Text>
            <DropdownInput
              className="w-[10rem] border-none ml-0 -mt-5"
              options={filterOptions}
              onChange={(data) => {
                setFilter(data)
              }}
              value={filter}
              noBorder
            />
            <Text className="ml-4 mt-7 mr-2 text-sm ml-10">Sort:</Text>
            <DropdownInput
              className="w-[10rem] border-none ml-0 -mt-5"
              options={sortOptions}
              onChange={(data) => {
                setSort(data);
              }}
              value={sort}
              noBorder
            />
          </Box>
        </Box>
      </Box>
      <Box className="max-h-[300px] overflow-y-scroll scrollbar-hide mt-8">
        <Box
          className={`w-full flex flex-row ${
            isDarkTheme ? 'bg-dark' : 'bg-forumm-light-gray'
          } rounded-t-xl py-2 mb-5`}
        >
          <Box className="flex-2 font-bold text-start text-sm sm:text-base ml-4">
            Donor
          </Box>
          <Box className="flex-1 font-bold text-sm md:text-base">Donation</Box>
          <Box className="flex-2 font-bold text-sm md:text-base">Program</Box>
          <Box className="flex-1 font-bold text-sm md:text-base">Date</Box>
        </Box>
        {(transactions || []).length === 0 && (
          <NoData className="!min-h-[225px]" />
        )}
        {transactions.map((trx: any) => {
          if (!trx || Object.keys(trx).length === 0) {
            return null;
          }
          return (
            <Box key={trx.created} className="flex flex-row items-center mb-4">
              <Box className="flex-2 flex flex-row justify-start text-sm md:text-base">
                <Box
                  className="w-[30px] h-[30px] rounded-full translate-y-[-4px] mr-2 ml-3 bg-cover"
                  style={{
                    backgroundImage: `url('https://assets.tumblr.com/images/default_header/optica_pattern_11.png')`,
                  }}
                />{' '}
                {trx.firstName} {trx?.lastName ?? ''}
              </Box>
              <Box className="flex-1 text-sm md:text-base">
                {currency}
                {roundAmount(trx.total / 100)}
              </Box>
              <Box className="flex-2 text-ellipsis text-sm md:text-base">
                {trx.program}
              </Box>
              <Box className="flex-1 text-sm md:text-base">
                {moment(trx.created * 1000).format('Do MMM')} (
                {trx?.location || 'UK'})
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default DonationTableTransaction

