import Box from '@components/base/Box'
import Text from '@components/base/Text'
import HaverstImage1 from '@public/landing-giving-built-for-education.svg'
import HaverstImage2 from '@public/landing-giving-flexible-pricing.svg'
import HaverstImage3 from '@public/landing-giving-1-1-support.svg'
import { PinContainer } from '@components/ui/PinContainer'
import { useTheme } from '@libs/useTheme'

const harvestData = [
  {
    ImageComponent: HaverstImage1,
    title: 'Built for Education',
    description:
      'Tailored for schools and universities. From webinars to reunions, streamline your event planning, boost engagement, and connect your community.',
    viewBox: '0 0 360 264',
    textFloat: 'Contact Us',
    handleClick: () => {
      const joinFormArea = document.getElementById('landing-join-form')
      if (joinFormArea) {
        joinFormArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
  },
  {
    ImageComponent: HaverstImage2,
    title: 'Flexible Pricing',
    description:
      'Affordable options for every school and university (because everyone truly deserves the right tools for effective and successful campaigning).',
    viewBox: '0 0 360 264',
    textFloat: 'Pricing',
    handleClick: () => {
      // window.location.assign('/pricing')
    },
  },
  {
    ImageComponent: HaverstImage3,
    title: '1:1 Support',
    description:
      "You're never alone. Whether setting up your event, integrating systems, or managing registrations, our packages offer expert hands-on support.",
    viewBox: '0 0 360 264',
    textFloat: 'Contact Us',
    handleClick: () => {
      const joinFormArea = document.getElementById('landing-join-form')
      if (joinFormArea) {
        joinFormArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
  },
]

function HarvestSection() {
  const { theme } = useTheme()

  return (
    <Box className="sm:py-20 flex flex-col justify-center items-center px-6">
      <Text
        className={`mt-4 text-4xl md:text-5xl !font-poppins text-center font-semibold max-w-[600px] !text-midnight-light`}
      >
        Why Choose Forumm?
      </Text>

      <Text className="text-center pb-20 mt-4 !text-midnight-light">
        Simplify event management, boost donations, and build stronger alumni
        communities.
      </Text>
      <Box className="sm:flex sm:justify-evenly sm:mb-12">
        {harvestData.map((data, index) => (
          <Box
            key={index}
            className="flex flex-col items-center mb-36 sm:mb-0 sm:max-w-xs mx-4 sm:mx-6"
          >
            <PinContainer title={data.textFloat} onClick={data.handleClick}>
              <Box
                className="flex basis-full flex-col p-4 tracking-tight sm:basis-1/2 w-[20rem]"
                style={{
                  backgroundColor: 'transparent  !important',
                }}
              >
                <Box className="container flex aspect-ratio-1/1 rounded-xl mt-4 mb-4 overflow-hidden">
                  <data.ImageComponent
                    aria-label={data.title}
                    className="h-full w-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 360 264"
                  />
                </Box>
                <h3 className="max-w-xs !pb-2 !m-0 font-bold text-2xl text-center unselectable !font-poppins font-semibold">
                  {data.title}
                </h3>
                <Box className="text-base !m-0 !p-0 font-normal text-center">
                  <span
                    className="text-slate-500 unselectable"
                    style={{ color: theme.textColour }}
                  >
                    {data.description}
                  </span>
                </Box>
              </Box>
            </PinContainer>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
export default HarvestSection
