import moment, { Moment } from 'moment'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'

interface TimerBase {
  id: string
  startedAt: Moment
  endsAt: Moment
  clear: () => void
  callback: () => any
  onCancel?: () => any
}

interface Timer extends TimerBase {
  type: 'TIMER'
  start?: () => void
}

interface Countdown extends TimerBase {
  type: 'COUNTDOWN'
  pollInterval: number
  complete: () => any
  loop?: NodeJS.Timer
}

const useTimers = () => {
  const [timers, setTimers] = useState<Record<string, Timer>>({})
  const [loop, setLoop] = useState<NodeJS.Timer>()
  const [countdowns, setCountdowns] = useState<Record<string, Countdown>>({})

  const hasTimers = () => Object.entries(timers).length > 0

  const hasCountdowns = () => Object.entries(countdowns).length > 0

  const getTimer = (timerId: string) =>
    Object.values(timers).find((t) => t.id === timerId)

  const getCountdown = (countdownId: string) =>
    Object.values(countdowns).find((c) => c.id === countdownId)

  useEffect(() => {
    if (hasTimers()) {
      if (!loop) {
        const intervalTimer = setInterval(() => {
          const now = moment()
          Object.values(timers).forEach((t) => {
            if (t.endsAt.isBefore(now)) {
              // console.log(`Timer is finished: `, t.id)
              t.callback()
            }
            // console.log(
            //   `Timer: ${t.id} has ${t.endsAt.diff(now, 's')} seconds remaining!`
            // )
          })
        }, 1000)
        setLoop(intervalTimer)
      }
    }

    if (!hasTimers() && loop) {
      clearInterval(loop)
      setLoop(undefined)
    }
    // return () => clearInterval(loop)
  }, [Object.entries(timers)])

  useEffect(() => {
    if (hasCountdowns()) {
      Object.values(countdowns).forEach((c) => {
        if (!c.loop) {
          c.loop = setInterval(() => {
            const now = moment()
            if (c.endsAt.isBefore(now)) {
              // console.log(`Countdown is finished: `, c.id)
              c.complete()
              clearInterval(c.loop)
            }
            c.callback()
            // console.log(
            //   `Countdown: ${c.id} has ${c.endsAt.diff(now, 's')} seconds remaining on iteration ${c.endsAt.diff(now, 's').valueOf() / c.pollInterval}!`
            // )
          }, c.pollInterval)
        }
        if (c.endsAt.isBefore(moment())) {
          c.complete()
        }
      })
    }
  }, [Object.keys(countdowns)])

  const deleteRecord = (
    record: Timer | Countdown,
    executeNow: boolean = false
  ) => {
    const payload = record.type === 'TIMER' ? timers : countdowns

    if (executeNow) record.callback()
    if (record.onCancel) record.onCancel()
    delete payload[record.id]

    record.type === 'TIMER'
      ? setTimers(payload as any)
      : setCountdowns(payload as any)

    return true
  }

  const deleteTimer = (timerId: string, executeNow: boolean = false) => {
    if (!hasTimers()) return false
    if (!timerId) return false

    const timer = getTimer(timerId)

    if (!timer) return false

    const res = deleteRecord(timer, executeNow)
    // if (res) console.log('Timer Cleared: ', timerId)
    return res
  }

  const deleteCountdown = (
    countdownId: string,
    executeNow: boolean = false
  ) => {
    if (!hasCountdowns()) return false
    if (!countdownId) return false

    const countdown = getCountdown(countdownId)

    if (!countdown) return false

    clearInterval(countdown.loop)

    const res = deleteRecord(countdown, executeNow)
    // if (res) console.log('Countdown Cleared: ', countdownId)
    return res
  }

  const addTimer = (delay: number, callback?: () => any) => {
    if (!delay) return undefined

    const now = moment()
    const id = v4()
    const newTimer = {
      id,
      type: 'TIMER',
      startedAt: now,
      endsAt: now.add(delay, 'seconds'),
      callback: () => {
        callback?.()
        deleteTimer(id)
      },
      clear: () => deleteTimer(id),
    }

    const payload = timers

    payload[id] = newTimer as Timer

    if (payload[id]) setTimers(payload)
    return newTimer
  }

  const addCountdown = (
    delay: number,
    pollInterval: number = 1000,
    onCount?: () => any,
    onComplete?: () => any,
    onCancel?: () => any
  ) => {
    if (!delay) return undefined
    const now = moment()
    const id = v4()
    const newCountdown = {
      id,
      type: 'COUNTDOWN',
      startedAt: now,
      endsAt: now.add(delay, 'seconds'),
      callback: () => {
        onCount?.()
      },
      pollInterval,
      clear: () => deleteCountdown(id),
      complete: () => {
        onComplete?.()
        deleteCountdown(id)
      },
      onCancel,
    }

    const payload = countdowns

    payload[id] = newCountdown as Countdown

    if (payload[id]) setCountdowns(payload)
    return newCountdown
  }

  return {
    addCountdown,
    addTimer,
    deleteTimer,
    deleteCountdown,
  }
}
export default useTimers
