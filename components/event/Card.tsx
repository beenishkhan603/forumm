import React from 'react'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import Image from 'next/image'

interface CardProps {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  imgSrc: string | undefined
  imgWidth?: number | undefined
  imgHeight?: number | undefined
  title?: string
  text?: string
  selected?: boolean
  fixedWidth?: boolean
  ratio?: 'aspect-square' | 'aspect-video' | 'aspect-auto'
  disabled?: boolean
}

const Card = ({
  children,
  className,
  onClick,
  imgSrc = '',
  imgWidth = 80,
  imgHeight = 80,
  title = 'Card',
  selected = false,
  text,
  fixedWidth = true,
  ratio = 'aspect-square',
  disabled = false,
}: CardProps) => {
  const { theme, StaticColours } = useTheme()
  return (
    <Box
      className={`flex flex-col items-center text-center px-5 py-5 rounded-md ${className} ${
        onClick && !disabled ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
      style={{
        backgroundColor: disabled
          ? StaticColours.disabled
          : selected
          ? StaticColours.v2.light_blue
          : theme.foregroundColour,
        ...(fixedWidth ? { width: '320px' } : {}),
      }}
      onClick={disabled ? undefined : onClick}
    >
      {title !== 'Card' && <Box className="text-xl mt-1 mb-5">{title}</Box>}

      <Box
        show={!!imgSrc}
        className={`flex items-center rounded-md bg-white ${
          fixedWidth ? 'w-full' : ''
        } h-auto ${ratio}`}
      >
        <Image
          className={`w-full h-full ${disabled && 'saturate-0'}`}
          style={{ objectFit: 'fill' }}
          src={imgSrc}
          alt={title}
          width={imgWidth}
          height={imgHeight}
        />
      </Box>
      <Box
        show={!!text}
        className="text-xs break-words pt-4 px-4"
        style={{ width: '18rem' }}
      >
        {text}
      </Box>
      <Box show={!!children} className="mt-6 text-xl size-full">
        {children}
      </Box>
      {/* <Box show={!!children} className="text-xs break-words pt-4 px-4"> */}
      {/*   {children} */}
      {/* </Box> */}
    </Box>
  )
}

export default Card
