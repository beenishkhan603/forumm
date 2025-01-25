//Flat values are represented as the unit for said currency (GBP = pence, USD = cent).

type ProcessorFeeData = Record<string, { percent: number; flat: number }>

export const EUROPE_ECONOMIC_AREA = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GI',
  'GR',
  'HU',
  'IS',
  'IE',
  'IT',
  'LV',
  'LI',
  'LT',
  'LU',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
]

export const STRIPE_PAYMENT_FEES: ProcessorFeeData = {
  GBP: {
    percent: 1.5,
    flat: 20,
  },
  EEA: {
    percent: 2.5,
    flat: 20,
  },
  INTERNATIONAL: {
    percent: 3.25,
    flat: 20,
  },
}
