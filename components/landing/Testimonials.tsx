import Box from '@components/base/Box'
import Text from '@components/base/Text'
import TestimonialCard from './TestimonialCard'
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import netNatives from '@public/net-natives.png'
import cornellUniversity from '@public/cornell-university.png'
import glascowClyde from '@public/glascow-clyde.png'
import pickleJar from '@public/pickle-jar.png'
import { InfiniteMovingCards } from '@components/ui/InfiniteMovingCards'
import { useTheme } from '@libs/useTheme'
import Carousel from '@components/carousel/Carousel'
import { useState } from 'react'

const data = [
  {
    image: netNatives,
    name: 'Nicola Jones',
    university: 'Net Natives',
    body: 'We worked with Forumm on our annual conference, firstly online and then hybrid. The team were professional, knowledgeable and thorough throughout the entire process, working alongside us to meet our event brief and project managing the set up of the platform and new app.',
  },
  {
    image: cornellUniversity,
    name: "Michael O'Neil",
    university: 'Cornell University',
    body: 'Finally, an event platform built with engaging alumni audiences in mind. Looking forward to seeing Forumm lead the way as it continues to evolve and support alumni affairs events in this new hybrid age.',
  },
  {
    image: pickleJar,
    name: 'Rich Endean',
    university: 'Pickle Jar Communications',
    body: "We've worked with Forumm now on three separate virtual conferences over the past 18 months. The team are always a pleasure to work with and their systems and technical broadcast knowledge ensure that we always go in to the event confident that everything will run smoothly.",
  },
  {
    image: glascowClyde,
    name: 'Lynne McInnes',
    university: 'Glasgow Clyde College',
    body: "We used Forumm to host Glasgow Clyde College's Virtual Graduation and Awards Event... The platform fulfilled all of our needs and provided us with the opportunity to analyse the success of the event both pre, during, and post event.",
  },
]

function Testimonials() {
  const { theme } = useTheme()

  const [useCarousel, setUseCarousel] = useState(true)

  if (useCarousel)
    return (
      <Box className={`px-1 sm:px-16 mt-12`}>
        <Text
          className={`mt-4 text-4xl md:text-5xl text-center !font-poppins font-semibold mb-4 !text-midnight-light`}
        >
          {' '}
          Our partners
        </Text>
        <Text className="text-center pb-8 !text-midnight-light">
          And their experiences partnering with Forumm:
        </Text>
        <Carousel
          width={'w-[40em] max-w-[400px]'}
          slideshow
          items={data.map((d) => ({
            title: d.university,
            url: d.image,
            description: d.body,
          }))}
        />
      </Box>
    )

  return (
    <Box id="landing-testimonials" className="sm:pb-9 sm:pt-9">
      <Text
        className={`mt-4 text-4xl md:text-5xl text-center !font-poppins font-semibold mb-4 !text-midnight-light`}
      >
        {' '}
        Our partners
      </Text>
      <Text className="text-center pb-8 !text-midnight-light">
        And their experiences partnering with Forumm:
      </Text>
      <Box
        color="foregroundColour"
        className="rounded-md flex flex-col antialiased dark:bg-grid-white/[0.05] mt-6 items-center justify-center relative overflow-hidden"
      >
        <InfiniteMovingCards items={data} direction="right" speed="slow" />
      </Box>
    </Box>
  )
}

export default Testimonials
