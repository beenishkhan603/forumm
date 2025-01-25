import ActionButtons from '@components/chat/ActionButtons'
import AnimatedView from '@components/event/AnimatedView'
import { UnauthenticatedLiveEventLayout } from '@layouts/LiveEventLayout'
import { useAuth } from '@libs/useAuth'
import { useEvent } from '@libs/useEvent'
import DonationPage from 'pages/donation/[donationUrl]'

const Donate = () => {
  const { event } = useEvent()
  const { profile } = useAuth()

  return (
    <AnimatedView className="-mt-[80px] pt-[80px] h-[calc(100vh_+_160px)]">
      <DonationPage eventDonationUrl={event?.event?.donationUrl ?? ''} />
      <ActionButtons show={!!profile} />
    </AnimatedView>
  )
}

Donate.Layout = UnauthenticatedLiveEventLayout

export default Donate
