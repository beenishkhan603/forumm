import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { Statistic} from '@graphql/__generated/graphql'
import { useTheme } from '@libs/useTheme'
import type { EventOverviewFragment } from '@graphql/__generated/graphql'
import React, { useState, useMemo } from 'react'
import {
  getUniqueUsersDonation,
  getTotalUsersDonation,
} from '@libs/Utility/util'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const FunnelChart = ({
  fundraises,
  metrics,
}: {
  fundraises: EventOverviewFragment[]
  metrics: Statistic[]
}) => {
  const { theme } = useTheme()
  const [format, setFormat] = useState('default')
  const uniqueDonors = new Set<string>()

  let totalDonors = 0

  fundraises.forEach((fundraise: EventOverviewFragment) => {
    // @ts-ignore
    const { transactions } = fundraise.fundraising

    //Below calculates the number of unique donors by filtering all donations by unique first and last names. 
    //An obvious problem is that if two people with the exact same name donate it will count as one donor. 
    //There are no further filtering in fundraisingTransaction (without counting one donor as multiple)
    //I will come back to this to try to add a filtering by email or userId or something similar.
    //Calculated the same way in Donation Overall
    if (transactions) {
      transactions.forEach((transaction: {firstName: any, lastName: any }) => {
        const userIdentifier = transaction.firstName && transaction.lastName
        if (userIdentifier) {
          uniqueDonors.add(userIdentifier)
        }
      })
    }
  })

  const processedData = useMemo(() => {
    const uniqueVisitorsList = getUniqueUsersDonation(metrics, 'default')
    const totalUsersList = getTotalUsersDonation(metrics, 'default')

    const registered = new Set(
      totalUsersList.filter((item) => item.userId).map((item) => item.userId)
    ).size
    const visitedDonation = new Set(
      totalUsersList
        .filter((item) => (item?.url ?? '').toLowerCase().includes('donation'))
        .map((item) => item.userId)
    ).size

    return {
      uniqueVisitors: uniqueVisitorsList.length,
      registered,
      visitedDonation,
      donated: uniqueDonors.size,
    }
  }, [metrics, uniqueDonors])

  const { uniqueVisitors, registered, visitedDonation, donated } = processedData

  const conversionRates = [
    ((registered / uniqueVisitors) * 100).toFixed(2),
    ((visitedDonation / registered) * 100).toFixed(2),
    ((donated / visitedDonation) * 100).toFixed(2),
  ]

  const data = {
    labels:
      format === 'default'
        ? [
            'Visited Website',
            'Completed Registration',
            'Visited a Donation',
            'Donated',
          ]
        : [
            'Web visitors that registered',
            'Registrants that visited donation page', //Filler will find a better way to phrase
            'Donation visitors that donated',
          ],
    datasets: [
      {
        label: 'Conversion',
        data:
          format === 'default'
            ? [uniqueVisitors, registered, visitedDonation, donated]
            : [
                parseFloat(conversionRates[0]),
                parseFloat(conversionRates[1]),
                parseFloat(conversionRates[2]),
              ],
        backgroundColor: ['#b9eaff', '#49d9ff', '#0097bf', '#006782'],
        barThickness: 60,
      },
    ],
  }

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || ''
            const value = context.raw
            if (format === 'percentages' && context.dataIndex >= 0) {
              return `${label}: ${value}%`
            }
            return `${label}: ${value}`
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: format === 'percentages' ? 100 : undefined,
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value: number) {
            return format === 'percentages' ? `${value}%` : value
          },
          color: theme.textColour,
          font: {
            size: 14,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
        barThickness: 'flex',
        categoryPercentage: 1.0,
        barPercentage: 1.0,
        ticks: {
          color: theme.textColour,
          font: {
            size: 14,
          },
        },
      },
    },
  }

  return (
    <div className="w-full min-h-[300px] max-h-[300px] relative">
      <div className="flex justify-between mb-4">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="p-2 border rounded ml-auto"
        >
          <option value="default">Conversion Totals</option>
          <option value="percentages">Conversion Rates</option>
        </select>
      </div>
      {/* @ts-ignore */}
      <Bar data={data} options={options} />
    </div>
  )
}

export default FunnelChart
