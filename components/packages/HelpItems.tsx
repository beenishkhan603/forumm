import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { useTheme } from '@libs/useTheme'
import NeedHelp from '@public/images/NeedHelp.png'
import { BsBox2Heart } from 'react-icons/bs'

const handleScroll = () => {
  const scrollTarget = document.getElementById('pricing-bottom-area')
  if (scrollTarget) {
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const HelpItems = () => {
  const { theme } = useTheme()
  const backgroundColor =
    theme.type === 'DARK' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.6)'
  return (
    <Box className="w-full flex flex-row mt-10">
      <Box
        className="border border-forumm-menu-border flex-1 flex max-w-[300px] rounded-2xl mr-0 mb-[20px] mt-[5px] relative square p-12"
        style={{ backgroundColor }}
      >
        <Box
          className="w-full h-full rounded-t-x"
          style={{
            backgroundImage: `url(${NeedHelp.src})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      </Box>
      <Box className="flex-1 flex flex-col ml-5 p-1">
        <Box
          className={`w-full font-bold p-4 rounded-2xl mb-4 border border-forumm-menu-border hover:cursor-pointer`}
          style={{ backgroundColor }}
          onClick={handleScroll}
        >
          Running successful events and/or fundraisers
        </Box>
        <Box
          className={`w-full font-bold p-4 rounded-2xl mb-4 border border-forumm-menu-border hover:cursor-pointer`}
          style={{ backgroundColor }}
        >
          Optimising your audience segmentation
        </Box>
        <Box
          className={`w-full font-bold p-4 rounded-2xl mb-4 border border-forumm-menu-border hover:cursor-pointer`}
          style={{ backgroundColor }}
        >
          Comms strategy: crafting compelling cases for support
        </Box>
        <Box
          className={`w-full font-bold p-4 rounded-2xl mb-4 border border-forumm-menu-border hover:cursor-pointer`}
          style={{ backgroundColor }}
        >
          Reporting: measuring success and impact
        </Box>
        <Box
          className={`w-full font-bold p-4 rounded-2xl mb-4 border border-forumm-menu-border hover:cursor-pointer`}
          style={{ backgroundColor }}
        >
          An introduction to Giving Days
        </Box>
      </Box>
    </Box>
  )
}

export default HelpItems
