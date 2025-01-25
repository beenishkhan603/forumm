import { UnauthenticatedWrapper } from '@layouts/Wrapper'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import ApplicationForm from '@components/become-organiser/ApplicationForm'
import FeatureCard from '@components/become-organiser/FeatureCard'
import OrganiserFeature01 from '@public/images/OrganiserFeature01.svg'
import OrganiserFeature02 from '@public/images/OrganiserFeature02.svg'
import OrganiserFeature03 from '@public/images/OrganiserFeature03.svg'
import OrganiserFeature04 from '@public/images/OrganiserFeature04.svg'
import OrganiserBanner from '@public/images/OrganiserBanner.jpeg'

import { useTheme } from '@libs/useTheme'

export default function BecomeOrganiser() {
  const { theme } = useTheme()
  const handleScroll = () => {
    const joinFormArea = document.getElementById('organiser-join-form')
    if (joinFormArea) {
      joinFormArea.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return (
    <Box className="overflow-y-scroll scrollbar-hide relative">
      {/* Header */}
      <Box
        className="w-full items-center justify-center bg-cover bg-left-top sm:bg-center-top flex flex-col justify-center p-10 sm:p-24 text-center sm:text-start drop-opacity"
        style={{ backgroundImage: `url('${OrganiserBanner.src}')` }}
      >
        <Box className="sm:w-[85%] max-w-[1500px] z-10">
          <Text className="text-2xl sm:text-5xl mb-6">
            Elevate Your Impact with Forumm
          </Text>
          <Text className="text-xl mt-10">
            Step into the role of a <strong>Forumm Organiser</strong> and unlock
            the full potential of your alumni community.
            <br />
            Lead the charge in with seamless event registration and data
            integrations and supercharge your fundraising efforts with donation
            pages.
          </Text>
          <Button
            className="mt-6 w-full sm:w-auto"
            title="Request Access"
            onClick={handleScroll}
          />
        </Box>
      </Box>
      {/* Center Box */}
      <Box className="flex flex-col w-full justify-center items-center">
        {/* Box 01 */}
        <Box
          className="flex flex-col w-full p-10 sm:p-20 text-center justify-center items-center rounded-2xl mb-10"
          style={{ backgroundColor: theme.foregroundColour }}
        >
          <Text className="text-2xl sm:text-4xl sm:w-1/2 max-w-[560px] bold mb-10">
          Become an organiser for free now!
          </Text>
          <Box className="w-full sm:w-2/3 flex flex-col sm:flex-row">
            <FeatureCard
              className="mb-4 sm:mb-0"
              title="Get individual support on events and fundraising campaigns"
              text="Technical support, event planning, and marketing strategy  - think of us as an extra pair of hands ready to help!"
              img={<OrganiserFeature01 className="mt-6 mr-2" />}
            />
            <FeatureCard
              title="Full access to all Forumm features"
              text="Full access to all Forumm features"
              img={<OrganiserFeature02 className="mt-2 mr-2" />}
            />
          </Box>
          <Box className="w-full sm:w-2/3 flex flex-col sm:flex-row mt-4">
            <FeatureCard
              className="mb-4 sm:mb-0"
              title="Early access to new features"
              text="Beta testing and product feedback opportunities"
              img={<OrganiserFeature03 className="mt-2 mr-2"/>}
            />
            <FeatureCard
              title="Alumni Professional Network"
              text="An exclusive space within Forumm that supports connections with your peers across the globe"
              img={<OrganiserFeature04 className="mt-2 ml-2" />}
            />
          </Box>
          <Box className="sm:w-1/2 text-center justify-center mt-8">
            <Text className="text-sm">
              With Forumm, you{`'`}re not just accessing a platform; you{`'`}re
              stepping into a partnership. We{`'`}re committed to supporting you
              every step of the way, ensuring your events and campaigns exceed
              expectations.
            </Text>
          </Box>
        </Box>
      </Box>
      {/* Box 02 */}
      <Box className="flex flex-col sm:px-4 xl:px-16 w-full justify-center items-center">
        <ApplicationForm />
      </Box>
    </Box>
  )
}

BecomeOrganiser.Layout = UnauthenticatedWrapper
