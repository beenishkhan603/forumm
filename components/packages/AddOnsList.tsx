import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { BsArrowRightCircleFill } from 'react-icons/bs'
import { BsCheck2 } from 'react-icons/bs'
import { useTheme } from '@libs/useTheme'

const handleScroll = () => {
  const scrollTarget = document.getElementById('pricing-bottom-area')
  if (scrollTarget) {
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const Card = ({
  title,
  text,
  label,
  price,
}: {
  title: string
  text: string
  label?: string
  price: string
}) => {
  const { theme } = useTheme()
  const isDark = theme.type === 'DARK'
  const backgroundColor = isDark
    ? 'rgba(0, 0, 0, 0.7)'
    : 'rgba(255, 255, 255, 0.6)'
  return (
    <Box
      className={`w-full flex main-shadow relative flex-row items-start rounded-2xl p-4 pl-5 mt-3 hover:cursor-pointer`}
      style={{ backgroundColor }}
      onClick={handleScroll}
    >
      {label && (
        <Box className="absolute -top-[32px] right-5 bg-forumm-green !text-white p-1 px-3 rounded-t-md">
          {label}
        </Box>
      )}
      <Box className="bg-forumm-green w-6 h-6 items-center justify-center rounded-full mt-5">
        <BsCheck2 className="mt-1 ml-1 !text-white" />
      </Box>
      <Box className="flex flex-col flex-1 w-full pl-5 items-start text-left">
        <Text
          className="p-1 px-3 text-left rounded-full mb-2 font-semibold"
          style={{ backgroundColor: theme.foregroundColour }}
        >
          {title}
        </Text>
        <Text>{text}</Text>
      </Box>
    </Box>
  )
}

const AddOnsList = () => {
  return (
    <Box className="w-full mt-14">
      <Card
        title="Additional Organiser Account"
        text="Empower your team to manage diverse initiatives"
        label="Platform Add-ons"
        price=""
      />
      <Card
        title="Fundraising Page"
        text="Create targeted pages for specific fundraising goals"
        price=""
      />
      <Card
        title="Enhanced Data Dashboard"
        text="Unlock deeper insights into your fundraising"
        price=""
      />
      <Card
        title="CRM Integration"
        text="Streamline donor management and communication (Creator + Visionary
            Package includes CRM integration)"
        price=""
      />
      <Card
        title="Virtual Events (150 min / 200 attendees)"
        text="Expand your reach with engaging virtual events"
        price=""
      />
      <Card
        title="Event and Fundraising Support"
        text="Campaign support from your own Forumm rep (included in Creator + Visionary packages)"
        price=""
      />
    </Box>
  )
}

export default AddOnsList
