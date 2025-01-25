import * as d3 from 'd3-color'
import type {
  GetEventByIdForEditorQuery,
  Statistic,
  StatisticDonation,
} from '@graphql/__generated/graphql'
import type { Maybe } from '@graphql/__generated/graphql'
import { Moment } from 'moment'
import { DropdownOptions } from '@components/inputs/DropdownInput'
import { full_timezones, timezones } from '@libs/timezones'

import type { Event } from '@graphql/__generated/graphql'
import { isValidUrl } from './parsers'

type ValidatePasswordFunction = (password: string) => boolean

export const parseTime = (time: string, tzOffset: number) => {
  return `${time.split('Z').length > 1 ? time.split('Z')[0] : time.slice(0, -6)}${tzOffset < 0 ? '-' : '+'}${
    Math.abs(tzOffset) < 10 ? `0${Math.abs(tzOffset)}` : tzOffset
  }:00`
}

export const getTimezones = (): DropdownOptions[] => {
  const payload = full_timezones.map((tz) => {
    return {
      label: tz.text,
      value: `${tz.offset}::${tz.abbr}`,
    }
  })

  return payload
}

export const isObject = (obj: any) => typeof obj === 'object'

export const isSame = (a: any, b: any) => {
  try {
    if (isObject(a) && isObject(b)) {
      const stringifiedA = JSON.stringify(a)
      const stringifiedB = JSON.stringify(b)
      return stringifiedA.includes(stringifiedB)
    }
    return a == b
  } catch (err) {
    console.error(err)
    return false
  }
}

export const cleanEventPayload = (data: GetEventByIdForEditorQuery) => {
  try {
    return JSON.parse(
      JSON.stringify(data.getEventById, (name, val) => {
        if (name === '__typename') {
          delete val[name]
        } else {
          return val
        }
      })
    )
  } catch (err) {
    console.error(err)
    return null
  }
}

export const debounce = (cb: any, delay = 1000) => {
  let timeout: NodeJS.Timeout | undefined
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

export const flatten = <T>(data: T, parentKey?: string): Record<string, T> => {
  let output = {}
  for (let key in data) {
    let val = data[key]
    let newKey = parentKey ? `${parentKey}_${key}` : key
    if (val && typeof val === 'object') {
      const flat = flatten(val, newKey)
      output = { ...output, ...flat }
    } else {
      output = { ...output, [newKey]: val }
    }
  }
  return output
}

export const toArray = (data: any | any[]) => {
  if (!data) return []
  if (Array.isArray(data)) {
    if (Array.isArray(data[0]) && data.length < 2) return data[0]
    return data
  }
  return [data]
}

export const truncateString = (string?: string | null, length: number = 8) => {
  if (!string) return ''
  return `${string.slice(0, length)}${string.length > length ? '...' : ''}`
}

export const roundAmount = (amount: number | string): string => {
  try {
    const parsedAmount = parseFloat(amount.toString())
    if (isNaN(parsedAmount)) {
      return `${amount}`
    }
    return parsedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch (_ex) {
    return `${amount}`
  }
}

export const isJSON = (text?: string) => {
  if (!text) return false
  if (typeof text !== 'string') return false
  try {
    JSON.parse(text)
    return true
  } catch (_) {
    return false
  }
}

export const generateSecurePassword = () => {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numberChars = '0123456789'
  const specialChars = '-'
  const randomLowercase =
    lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
  const randomUppercase =
    uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
  const randomNumber =
    numberChars[Math.floor(Math.random() * numberChars.length)]
  const randomSpecial =
    specialChars[Math.floor(Math.random() * specialChars.length)]
  const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars
  let password =
    randomLowercase + randomUppercase + randomNumber + randomSpecial
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}

export const validateCognitoPassword: ValidatePasswordFunction = (password) => {
  const lowercaseLetters = 'a-z'
  const uppercaseLetters = 'A-Z'
  const numbers = '0-9'
  const specialChars =
    '\\^\\$\\*\\.\\[\\]\\{\\}\\(\\)\\?\\"\\!\\@\\#\\%\\&\\/\\\\,\\>\\<\\\'\\:\\;\\|\\_\\~\\`\\=\\+\\-'

  const passwordPattern = `^
    (?=.*[${lowercaseLetters}])
    (?=.*[${uppercaseLetters}])
    (?=.*[${numbers}])
    (?=.*[${specialChars}])
    [${lowercaseLetters}${uppercaseLetters}${numbers}${specialChars}]{8,256}
  $`.replace(/\s+/g, '') // Remove whitespace from the multiline string

  const regex = new RegExp(passwordPattern)
  return regex.test(password)
}

export const darkenColor = (color: string, percentage: number) => {
  let baseColor = d3.hsl(color)
  baseColor.l = Math.max(0, baseColor.l * (1 - percentage))
  return baseColor.formatHex()
}

export const lightenColor = (color: string, percentage: number) => {
  let baseColor = d3.hsl(color)
  baseColor.l = Math.max(0, baseColor.l * (1 + percentage))
  return baseColor.formatHex()
}

export const getDynamicStyle = (colorBase?: string) => {
  let dynamicStyle = {
    '--color-change-start': '#3763E9',
    '--color-change-middle': '#6FC7F0',
    '--color-change-end': '#7BECCD',
  }
  if (!colorBase) return dynamicStyle
  dynamicStyle = {
    '--color-change-start': darkenColor(colorBase, 0.4),
    '--color-change-middle': colorBase,
    '--color-change-end': lightenColor(colorBase, 0.4),
  }
  return dynamicStyle
}

export const getContrastColor = (colorInput?: string) => {
  const defaultColor = '#000000' // Default color if none is provided
  const colorObject = d3.color(colorInput || defaultColor)

  if (!colorObject) {
    return 'black' // Fallback color
  }

  // Extract RGB values
  const rgb = colorObject.rgb()
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  // Calculate luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  // Decide on the contrast color based on luminance
  return luminance > 0.5 ? 'black' : 'white'
}

export const openInNewTab = (url: string) => {
  if (!url) return

  if (isValidUrl(url)) {
    url.replace('http', 'https')
    if (!url.includes('https')) url = `https://${url}`
  }

  if (window) window.open(url, '_blank', '')?.focus()
}

export const openInSameTab = (url: string) => {
  if (!url) return

  if (isValidUrl(url)) {
    url.replace('http', 'https')
    if (!url.includes('https')) url = `https://${url}`
  }

  if (window) window.open(url, '_self')?.focus()
}

export const isBusinessEmail = (email: string) => {
  const commonProviders = [
    'gmail.com',
    'outlook.com',
    'yahoo.com',
    'hotmail.com',
    'aol.com',
    'icloud.com',
  ]
  const emailDomain = email.split('@')[1]
  return !commonProviders.includes(emailDomain.toLowerCase())
}

//Unique/Total users in a donation campaign (does not mean they donated)
export const getUniqueUsersDonation = (
  metrics: Statistic[],
  input: string
): string[] => {
  const uniqueUsers = new Set<string>()
  metrics
    .filter((metric) => metric.url && metric.url.includes('donation'))
    .forEach((metric) => {
      const userIdentifier = metric.userId || metric.anonymousId
      if (userIdentifier) {
        uniqueUsers.add(userIdentifier)
      }
    })
  return Array.from(uniqueUsers)
}

export const getTotalUsersDonation = (
  metrics: Statistic[],
  input: string
): {
  datetime: string
  userId: string
  url: Maybe<string>
  donation: Maybe<StatisticDonation>
}[] => {
  return metrics
    .filter(
      (metric) =>
        metric.datetime &&
        metric.userId &&
        metric.url &&
        metric.url.includes('donation')
    )
    .map((metric) => {
      const userIdentifier = metric.userId
      return {
        datetime: metric.datetime as string,
        userId: (userIdentifier as string) ?? null,
        url: metric.url ?? null,
        donation: metric.donation ?? null,
      }
    })
}

export type OptType = {
  id: string
  title: string
  donationUrl: string
}
export type TicketInfo = {
  eventName: string
  ticketType: string
  ticketsSold: number
  ticketPrice: number
  totalRevenue: number
}

export const getTicketInfo = (events: Event[]): TicketInfo[] => {
  return events.flatMap((event) => {
    const ticketCounts: { [key: string]: number } = {}
    const ticketPrices: { [key: string]: number } = {}

    event.attendees?.forEach((attendee) => {
      if (attendee.ticketTitle) {
        ticketCounts[attendee.ticketTitle] =
          (ticketCounts[attendee.ticketTitle] || 0) + 1
      }
    })

    event.availableTickets?.tickets?.forEach((ticket) => {
      if (ticket.ticketTitle && ticket.price !== undefined) {
        ticketPrices[ticket.ticketTitle] = Number(ticket.price)
      }
    })

    return Object.entries(ticketCounts).map(([ticketType, ticketsSold]) => {
      const ticketPrice = ticketPrices[ticketType] || 0
      const totalRevenue = ticketsSold * ticketPrice

      return {
        eventName: event.event?.title || '',
        ticketType,
        ticketsSold,
        ticketPrice,
        totalRevenue,
      }
    })
  })
}
