import Box from '@components/base/Box'
import Text from '@components/base/Text'
import { BsCheck2 } from 'react-icons/bs'
import { ROWS } from './labels'
import ExprolerIcon from '@public/images/Explorer.svg'
import TrailblazerIcon from '@public/images/Trailblazer.svg'
import CreatorIcon from '@public/images/Creator.svg'
import VisionaryIcon from '@public/images/Visionary.svg'
import { useTheme } from '@libs/useTheme'
import DetailRow from './DetailRow'

type DetaiColProps = {
  label: string
  price?: string
  priceSub?: string
  rows: { label: string }[]
  icon: any
  description: string
  footer: string
}

const DetailCol: React.FC<DetaiColProps> = ({
  label,
  price,
  priceSub,
  rows,
  icon,
  description,
  footer,
}) => {
  const { theme } = useTheme()
  const backgroundColor =
    theme.type === 'DARK' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.6)'

  const handleScroll = () => {
    const scrollTarget = document.getElementById('pricing-bottom-area')
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Box>
      <Box
        className={`flex-col rounded-xl overflow-hidden main-shadow h-[76rem]`}
        style={{ backgroundColor }}
      >
        <Box className="flex w-full h-[8rem] sm:h-[10rem] md:h-[12rem] 2xl:h-[14rem] p-5 items-center justify-center bg-forumm-blue-light-3">
          {icon}
        </Box>
        <Box className="flex flex-1 flex-col p-5 justify-center items-center border-forumm-signup-gray-help">
          <Text className="text-2xl !text-black mb-2">{label}</Text>
          <Text className="text-5xl !text-forumm-blue mb-2">{price}</Text>
          <Text className="text-md !text-black">{priceSub}</Text>
          <Box className="mt-5 border-t border-b py-4">
            <Text
              className="flex text-base !text-black text-center items-center"
              style={{ minHeight: '75px' }}
            >
              {description}
            </Text>
          </Box>
        </Box>
        <Box className="flex flex-1 flex-col p-5 text-left">
          {rows.map((row) => (
            <DetailRow key={row.label} label={row.label} />
          ))}
        </Box>
      </Box>
      <Box className="mt-1 text-sm !text-black">{footer}</Box>
    </Box>
  )
}

const PackagesTable = () => {
  return (
    <Box className="w-full flex flex-wrap grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-center">
      <DetailCol
        label="Explorer"
        price="Free!"
        priceSub="Core features"
        rows={ROWS.explorer}
        icon={
          <ExprolerIcon
            viewBox="0 0 128 129"
            preserveAspectRatio="xMidYMid meet"
            height="180px"
            width="180px"
          />
        }
        description={'Ideal for those who are beginning their journey'}
        footer="* 8% +30p payment processing fee (includes all payment provider fees)"
      />
      <DetailCol
        label="Trailblazer"
        price="£1,500"
        priceSub="+ VAT (per year)"
        rows={ROWS.trailblazer}
        icon={
          <TrailblazerIcon
            viewBox="0 0 128 129"
            preserveAspectRatio="xMidYMid meet"
            height="180px"
            width="180px"
          />
        }
        description={
          'Schools or institutions stepping into fundraising and event management'
        }
        footer="* 5.5% +30p payment processing fee (includes all payment provider fees)"
      />
      <DetailCol
        label="Creator"
        price="£4,500"
        priceSub="+ VAT (per year)"
        rows={ROWS.creator}
        icon={
          <CreatorIcon
            viewBox="0 0 128 129"
            preserveAspectRatio="xMidYMid meet"
            height="180px"
            width="180px"
          />
        }
        description={
          'This is our best value plan. Tailored for schools and universities with ambitious goals'
        }
        footer="*4.5% +30p payment processing fee (includes all payment provider fees)"
      />
      <DetailCol
        label="Visionary"
        price="Contact Us!"
        priceSub="Core features"
        rows={ROWS.visionary}
        icon={
          <VisionaryIcon
            viewBox="0 0 145 128"
            preserveAspectRatio="xMidYMid meet"
            height="200px"
            width="200px"
          />
        }
        description={
          'Universities leading in fundraising and event management. Tailored to fit your specific organisational needs'
        }
        footer=""
      />
    </Box>
  )
}

export default PackagesTable
