import { EventAttendee, PaymentType } from '@graphql/__generated/graphql'
import { Transaction } from '../../pages/donation/[donationUrl]/index'
import currencies from '@libs/currencies'

export const importAttendeesFromCSV = (CSVFile: File, readString: any) => {
  if (!CSVFile || !readString) return
  try {
    return readString(CSVFile, {
      worker: true,
    })
  } catch (error) {
    return console.error(error)
  }
}

export const convertAttendeesToCSV = (attendees: EventAttendee[]) => {
  const headers = [
    'email',
    'firstname',
    'lastname',
    'profileImage',
    'ticketTitle',
    'invitationSentDatetime',
    'registered',
    'checkInStatus',
    'checkInDatetime',
  ] as const
  let csvArr = [headers.join(',')]
  for (let attendee of attendees) {
    let row = []
    for (let header of headers) {
      let value = ['firstname', 'lastname'].includes(header)
        ? attendee['name']?.split(' ')[header === 'firstname' ? 0 : 1]
        : attendee[header as keyof EventAttendee] || ''
      row.push(`"${value}"`)
    }
    csvArr.push(row.join(','))
  }
  return csvArr.join('\r\n')
}

const getSymbol = (cr: string) =>
  cr ? currencies?.[cr?.toUpperCase()].symbol : '£'

const getAmount = (amount?: number | string, cr?: string) => {
  if (!amount) return ''
  const value = typeof amount === 'string' ? parseInt(amount, 10) : amount
  return `${getSymbol(cr ?? '')}${(value / 100).toFixed(2)}`
}

export const convertDonationToCSV = (donations: Transaction[]) => {
  const headers = [
    'amount',
    'firstName',
    'lastName',
    'donorDob',
    'currency',
    'message',
    'created',
    'datetime',
    'address',
    'coverFee',
    'donation',
    'fee',
    'giftAid',
    'selectedProgram',
    'email',
    'paymentType',
  ] as const
  let csvArr = [headers.join(',')]
  for (let donation of donations) {
    let row = []
    for (let header of headers) {
      let value = donation[header as keyof Transaction] || ''
      if (header === 'paymentType') {
        value =
          !!donation.fee && !!donation.coverFee && !!donation.donation
            ? PaymentType.Card
            : PaymentType.DirectDebit
      }
      if (['amount', 'donation', 'fee'].includes(header)) {
        value = getAmount(value, donation.currency)
      }
      row.push(`"${value}"`)
    }
    csvArr.push(row.join(','))
  }
  return csvArr.join('\r\n')
}
