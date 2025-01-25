import { useState, useMemo } from 'react'
import { useTheme } from '@libs/useTheme'
import { scaleLinear } from 'd3-scale'
import {
  ComposableMap,
  Geographies,
  Geography,
  // @ts-ignore
} from 'react-simple-maps'
import Box from '@components/base/Box'
import { getCountryByAddress } from '@libs/countries'
import { getUniqueUsersDonation, getTotalUsersDonation } from '@libs/Utility/util'
import type { Statistic } from '@graphql/__generated/graphql'

type StatisticWithCountry = Statistic & {
  countryObject: {
    code: string
    name: string
  }
}

const processStatistics = (
  statistics: StatisticWithCountry[]
): { ISO3: string; users: number; name: string }[] => {
  const uniqueUsers: { [key: string]: any } = {}
  statistics.forEach((stat: any) => {
    const key = stat.userId || stat.loggedUserId || stat.anonymousId
    if (!uniqueUsers[key] && stat.countryObject.code !== '-') {
      uniqueUsers[key] = stat
    }
  })
  const countryCounts: { [code: string]: { users: number; name: string } } = {}
  Object.values(uniqueUsers).forEach((user) => {
    const { code, name } = user.countryObject
    if (code in countryCounts) {
      countryCounts[code].users++
    } else {
      countryCounts[code] = { users: 1, name }
    }
  })
  const userCount = Object.entries(countryCounts).map(
    ([ISO3, { users, name }]) => ({
      ISO3,
      users,
      name,
    })
  )
  userCount.sort((a, b) => b.users - a.users)
  return userCount
}

const MapChart = ({ metrics }: { metrics: Statistic[] }) => {
  const { StaticColours, theme } = useTheme()
  const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 })

  const metricsWithCountry = useMemo(() => 
    metrics.map((row: Statistic) => ({
      ...row,
      countryObject: getCountryByAddress(row?.country ?? ''),
    })), [metrics]
  )
  
  const totalUsersListWithCountry = useMemo(() => {
    const totalUsersList = getTotalUsersDonation(metricsWithCountry, 'default')
    return totalUsersList.map(user => {
      const originalMetric = metricsWithCountry.find(metric => metric.userId === user.userId || metric.anonymousId === user.userId)
      return {
        ...user,
        countryObject: originalMetric ? originalMetric.countryObject : { code: '-', name: 'Unknown' }
      }
    })
  }, [metricsWithCountry])

  const userCount = processStatistics(totalUsersListWithCountry)
  const highestCount = Math.max(...userCount.map((item) => item.users))

  const colorScale = scaleLinear()
    .domain([0, highestCount])
    // @ts-ignore
    .range(['#6cc4d7', theme.tealColour])

  return (
    <Box color="foregroundColour" className="flex flex-col md:flex-row">
      <Box color="foregroundColour" className="flex-2 relative">
        {/* @ts-ignore */}
        <ComposableMap
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 160,
          }}
        >
          {/* @ts-ignore */}
          <Geographies geography={'/map.json'}>
            {/* @ts-ignore */}
            {({ geographies }: { geographies: [] }) =>
              geographies.map((geo: any) => {
                const countryData = userCount.find((s) => s.ISO3 === geo.id)
                return (
                  /* @ts-ignore */
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    /* @ts-ignore */
                    fill={
                      countryData ? colorScale(countryData.users) : '#c1e6ee'
                    }
                    style={{
                      default: {
                        outline: 'none',
                      },
                      hover: {
                        fill: theme.tealColour,
                        outline: 'none',
                      },
                      pressed: {
                        outline: 'none',
                      },
                    }}
                    onMouseEnter={(event) => {
                      const { clientX: x, clientY: y } = event
                      setTooltip({
                        content: `${geo.properties.name} (${
                          countryData?.users ?? 0
                        } users)`,
                        x,
                        y,
                      })
                    }}
                    onMouseLeave={() => {
                      setTooltip({ content: '', x: 0, y: 0 })
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </Box>
      <Box className="flex-1 pl-4">
        <Box className="w-full flex flex-row mb-5">
          <Box
            className="flex-4 font-bold justify-start text-start"
            style={{ color: `${StaticColours.v2.light_gray}` }}
          >
            Top Countries
          </Box>
          <Box
            className="flex-1 font-bold justify-end text-end"
            style={{ color: `${StaticColours.v2.light_gray}` }}
          >
            Users
          </Box>
        </Box>
        {(userCount || []).slice(0, 4).map((row) => (
          <Box key={row.ISO3} className="flex flex-col items-center mb-4">
            <Box className="flex w-full flex-row items-center">
              <Box className="flex-4 flex flex-col justify-start text-start font-bold">
                {row.name}
              </Box>
              <Box className="flex-1 justify-end text-end font-bold">
                {row.users}
              </Box>
            </Box>
            <Box className="relative w-full rounded-md h-2 mt-2 bg-forumm-light-gray">
              <Box
                className="absolute rounded-md h-2"
                style={{
                  // @ts-ignore
                  backgroundColor: colorScale(row.users),
                  width: Math.round((row.users / highestCount) * 100) + '%',
                }}
              ></Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default MapChart
