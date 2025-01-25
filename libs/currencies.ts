export interface Currency {
  symbol: '$' | '€' | '£' | '¥' | '₹' | undefined
  name: string
}

const currencies: Record<string, Currency> = {
  CAD: {
    symbol: '$',
    name: 'Canadian Dollar',
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
  },
}

export default currencies
