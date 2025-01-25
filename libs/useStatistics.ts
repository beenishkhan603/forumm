import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { useMutation } from '@apollo/client'
import useLocalStorage from '@libs/useLocalStorage'
import { ADD_STATISTIC } from '@graphql/statistic/addStatistic'
import { getGeolocation } from './Utility/geoip'

const useStatistics = () => {
  const [done, setDone] = useState(false)
  const [addStatistic] = useMutation(ADD_STATISTIC)
  const [statisticId, setStatisticId] = useLocalStorage(
    'Forum_Statistic_Tracker',
    ''
  )

  useEffect(() => {
    if (typeof window !== 'undefined' && !statisticId) {
      setStatisticId(v4())
    }
  }, [statisticId, setStatisticId])

  const onReady = async () => {
    try {
      setDone(true)
      if (typeof window === 'undefined' || typeof getGeolocation !== 'function')
        return
      const currentFullUrl = window?.location?.href
      const browser = window?.navigator?.userAgent
      const { address, ip } = await getGeolocation()
      await addStatistic({
        variables: {
          anonymousId: statisticId,
          url: currentFullUrl,
          country: address,
          browser,
          ip,
        },
      })
    } catch (error) {
      console.warn(error)
    }
  }

  useEffect(() => {
    if (!done && typeof window !== 'undefined' && statisticId) {
      onReady()
    }
  }, [statisticId, addStatistic, done])

  return statisticId
}

export default useStatistics
