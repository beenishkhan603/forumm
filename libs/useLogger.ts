import { flatMap } from 'lodash'
import { useCallback, useEffect } from 'react'

export enum LoggerLevel {
  'LOG',
  'INFO',
  'WARN',
  'ERROR',
}

interface LoggerPushConfig {
  timestamped?: boolean
  group?: string
  level?: LoggerLevel
}

interface ILogger {
  get: (group?: string) => any[]
  push: (data: any, config?: LoggerPushConfig) => void
  clear: () => void
}

const defaultLoggerConfig = {
  level: LoggerLevel.LOG,
  timestamped: true,
}

const LoggerInteractor = (logToConsole: boolean): ILogger | false => {
  if (typeof window === 'undefined' || !window) {
    console.log('No window global found; aborting logger initialisation.')
    return false
  }

  if (window && !window.ForummLogs) window['ForummLogs'] = { default: [] }

  const get = (group?: string) => {
    const defaultLogGroup = window.ForummLogs.default
    if (group) {
      if (group.trim() === '*') return flatMap(window.ForummLogs)
      return window.ForummLogs[group]
    }
    return defaultLogGroup
  }

  const push = (data: any, config: LoggerPushConfig = defaultLoggerConfig) => {
    const cfg = { ...defaultLoggerConfig, ...config }
    const { timestamped, group, level } = cfg
    let payload: any = { ...data, level }

    if (timestamped) payload = { ...data, timestamp: new Date(), level }

    if (group) {
      if (!window.ForummLogs[group]) window.ForummLogs[group] = []
      window.ForummLogs[group].push(payload)
      if (logToConsole) console.log(payload)
      return
    }

    window.ForummLogs.default.push(payload)
  }

  const clear = () => {
    window['ForummLogs'] = { default: [] }
  }

  if (get().length < 1) push('Logger Initialised')
  return {
    get,
    push,
    clear,
  }
}

const handleUncaughtError = (event: ErrorEvent, Logger: ILogger | false) => {
  const { message, filename, lineno, colno, error } = event
  console.log(
    'Captured uncaught error:',
    message,
    filename,
    lineno,
    colno,
    error.stack
  )
  if (Logger) Logger.push({ ...event }, { group: 'UncaughtError' })
}

const useLogger = (logToConsole: boolean = false) => {
  const Logger = LoggerInteractor(logToConsole)

  useEffect(() => {
    window.addEventListener('error', (e) => handleUncaughtError(e, Logger))
    return window.addEventListener('error', (e) =>
      handleUncaughtError(e, Logger)
    )
  }, [Logger])

  if (!Logger) return
  const { get, push, clear } = Logger

  return {
    get,
    push,
    clear,
  }
}

export default useLogger
