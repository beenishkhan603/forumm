import { PaymentMethod } from '@stripe/stripe-js'
import { EUROPE_ECONOMIC_AREA, STRIPE_PAYMENT_FEES } from './processor-fees'

export const getBankingCountryByPaymentMethod = (
  paymentMethod: PaymentMethod
) => {
  if (!paymentMethod) return undefined
  const { type, card } = paymentMethod
  return card?.country ?? undefined
}

export const getProcessorFees = (regionCode?: string) => {
  if (!regionCode) return STRIPE_PAYMENT_FEES.INTERNATIONAL
  if (regionCode === 'GB') return STRIPE_PAYMENT_FEES.GBP
  if (EUROPE_ECONOMIC_AREA.includes(regionCode)) return STRIPE_PAYMENT_FEES.EEA
  return STRIPE_PAYMENT_FEES.INTERNATIONAL
}

export const getDonationTotal = ({
  amount,
  platformFee,
  regionCode,
  coverPlatformFee,
  coverProcessorFee,
}: {
  amount: number
  platformFee: number
  regionCode?: string
  coverPlatformFee?: boolean
  coverProcessorFee?: boolean
}) => {
  const { flat, percent } = getProcessorFees(regionCode)
  const processorFee = percent / 100
  const processorFixedFeeCents = flat

  let donationAmountCents = amount

  let totalDonationCents = 0

  let processorFeeAmountCents = 0

  const platformFeeAmountCents = donationAmountCents * (platformFee / 100)

  if (coverProcessorFee && coverPlatformFee) {
    totalDonationCents = donationAmountCents + platformFeeAmountCents

    processorFeeAmountCents =
      (totalDonationCents + processorFixedFeeCents * 2) * processorFee +
      processorFixedFeeCents

    totalDonationCents += Math.ceil(processorFeeAmountCents)
  }

  if (!coverProcessorFee && !coverPlatformFee) {
    totalDonationCents = donationAmountCents

    processorFeeAmountCents =
      totalDonationCents * processorFee + processorFixedFeeCents

    donationAmountCents =
      totalDonationCents -
      platformFeeAmountCents -
      Math.ceil(processorFeeAmountCents)
  }

  return {
    donation: donationAmountCents, // Amount going to charity (in cents)
    platformFee: platformFeeAmountCents, // Platform fee (in cents)
    processorFee: Math.ceil(processorFeeAmountCents), // Payment processor fee (in cents)
    total: totalDonationCents, // Total donation amount (in cents)
    regionCode,
  }
}
