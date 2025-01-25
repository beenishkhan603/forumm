import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import { IoCheckmark } from 'react-icons/io5'
import { getContrastColor } from '@libs/Utility/util'

interface FilterButtonProps {
  buttonType: 'ONLINE' | 'IN_PERSON' | 'FUNDRAISER'
  setTitle: (value: string) => void
  title: string
  types: string[]
  setTypes: (value: string[]) => void
}

function FilterButton({
  buttonType,
  setTitle,
  title,
  types,
  setTypes,
}: FilterButtonProps) {
  const { theme } = useTheme()
  const handleTypes = () => {
    if (types.includes(buttonType)) {
      let filteredArray = types.filter((value) => value !== buttonType)
      if (filteredArray.length === 0) {
        return setTypes(['ONLINE'])
      }
      setTypes(filteredArray)
    }
    if (!types.includes(buttonType)) setTypes([...types, buttonType])
  }
  const handlePress = () => {
    if (buttonType === 'IN_PERSON') {
      setTitle('In-person')
    }
    if (buttonType === 'FUNDRAISER') {
      setTitle('Donations')
    }
    if (buttonType === 'ONLINE') {
      setTitle('Online')
    }
    handleTypes()
  }

  // steal this
  const contrastColor = getContrastColor(theme.highlightColour)

  return (
    <Box
      onClick={handlePress}
      className="rounded-full px-1 sm:px-2 py-[5px] cursor-pointer flex items-center gap-1 hover:animate-heartbeat"
      style={{
        backgroundColor: types.includes(buttonType)
          ? theme.highlightColour
          : 'white',
        border: types.includes(buttonType) ? 'none' : '1px solid #c6c6d0',
      }}
    >
      <IoCheckmark
        style={{
          color: types.includes(buttonType) ? contrastColor : '#c6c6d0',
        }}
      />
      <span
        className="text-[13px] text-xs sm:text-sm px-2"
        style={{
          color: types.includes(buttonType) ? contrastColor : '#c6c6d0',
        }}
      >
        {title}
      </span>
    </Box>
  )
}

export default FilterButton
