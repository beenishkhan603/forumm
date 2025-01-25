import Box from '@components/base/Box'
import Text from '@components/base/Text'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { CardHoverEffect } from '@components/ui/CardHoverEffect'

const infoData = [
  {
    title: 'Effortless Events',
    description:
      'Simple event set up with appealing event pages, easy registration and automated email (and calendar) reminders.',
    link: 'https://google.com',
  },
  {
    title: 'Gifts That Grow',
    description:
      'Easily set up donation pages and push your alumni where they want to be pulled to; drive giving within all stages of your alumni groups with campaigns they care about.',
    link: 'https://google.com',
  },
  {
    title: 'Integrated CRM',
    description:
      "We've integrated with Raiser's Edge meaning all those hours spent adding data manually are a thing of the past; giving you precious time back to focus on important tasks.",
    link: 'https://google.com',
  },
  {
    title: 'Be More Inclusive',
    description:
      "With events and fundraisers that can be celebrated by alumni exactly where they are; whether that's on campus or in the comfort of their own home.",
    link: 'https://google.com',
  },
  {
    title: 'How did we do?',
    description:
      'Answer this with data points that matter. Refine your future strategy with insights from past events and fundraising campaigns built on Forumm.',
    link: 'https://google.com',
  },
  {
    title: 'In-app Donations',
    description:
      'Turn your alumni into donors while they attend events; whether in-person or virtual, donations are straightforward, secure and safe.',
    link: 'https://google.com',
  },
]

function InfoSection() {
  return (
    <Box
      id="landing-info-section"
      className="lg:flex lg:flex-col lg:items-center mt-10"
    >
      <Box className="sm:max-w-[60em]">
        <Text className="text-4xl md:text-5xl text-center pb-3 mt-10 !font-poppins font-semibold !text-midnight-light !leading-tight px-10">
          Forumm <span className={`whitespace-nowrap`}>makes event</span>{' '}
          management and fundraising{' '}
          <span className="text-forumm-blue">easy</span>
        </Text>
        <Text className="text-sm sm:text-base text-center -mb-2 !text-midnight-light">
          Helping your team build successful campaigns your alumni love.
        </Text>
        <div className="mx-auto px-8 mt-4">
          <CardHoverEffect items={infoData} />
        </div>
      </Box>
    </Box>
  )
}

export default InfoSection
