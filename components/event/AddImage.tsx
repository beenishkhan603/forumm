import React from 'react'
import { useTheme } from '@libs/useTheme'
import AddImage from '@public/images/AddImage.svg'
import AddImageDark from '@public/images/AddImageDark.svg'

interface AddImageProps {
  className?: string
  onClick?: () => void
}

const AddImageSelector: React.FC<AddImageProps> = ({ className, onClick }) => {
  const { theme } = useTheme()

  const isDarkTheme = theme.type === 'DARK'

  return isDarkTheme ? (
    <AddImageDark
      onClick={onClick}
      className={`${className} w-20 h-20 rounded object-contain top-0 ml-4`}
    />
  ) : (
    <AddImage
      onClick={onClick}
      className={`${className} w-20 h-20 rounded object-contain top-0 ml-4`}
    />
  )
}

export default AddImageSelector
