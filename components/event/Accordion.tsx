import React, { useContext, useEffect, useState } from 'react'
import Box from '@components/base/Box'
import { motion } from 'framer-motion'
import { AiOutlineCaretDown } from 'react-icons/ai'
import { useTheme } from '@libs/useTheme'
import {
  CreateEventSection,
  getCreateEventError,
} from '@libs/Utility/validation'
import { CreateEventContext } from '@libs/CreateEventContext'

interface AccordionProps {
  show?: boolean
  section: CreateEventSection
  title: string
  children: React.ReactNode
  className?: string
  initiallyOpen?: boolean
  allowOpen?: boolean
  onClick?: (e: React.MouseEvent) => void
  onOpen?: (e?: React.MouseEvent) => void
  error?: string
}

const Accordion = ({
  show = true,
  section,
  children,
  className,
  onClick,
  onOpen,
  title,
  initiallyOpen,
  allowOpen = true,
  error,
}: AccordionProps) => {
  const { theme } = useTheme()
  const { formData } = useContext(CreateEventContext)
  const isLight = theme.type === 'LIGHT'
  const themeType = theme.type?.toLowerCase() || 'dark'
  const [isEnabled, setEnabled] = useState<boolean>(initiallyOpen ?? false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(error)

  useEffect(() => {
    if (isEnabled && onOpen) onOpen()
  }, [isEnabled, onOpen])

  useEffect(() => {
    setErrorMessage(error)
  }, [error])
  if (!show) return <></>
  return (
    <motion.div
      className={`w-full rounded-2xl border p-6
        ${className}
        ${isLight ? 'border-light' : 'border-dark'}
      `}
      style={{
        boxShadow: '0px 2px 5px -1px rgba(0,0,0,0.3)',
        background: theme.backgroundColourSecondary,
      }}
    >
      <Box
        className={`text-2xl font-medium flex justify-between items-center cursor-pointer`}
        onClick={(e) => {
          const errors = getCreateEventError(section, formData)
          if (errors.length > 0 || !allowOpen)
            return setErrorMessage(
              errors.length > 0
                ? errors[0].error
                : 'You must complete the previous sections to access this one.'
            )
          setEnabled(allowOpen ? !isEnabled : false)
          setErrorMessage(undefined)
          if (onClick) onClick(e)
        }}
      >
        <Box>
          {title}{' '}
          <span className={'text-red-500 text-xs'}>
            {errorMessage && errorMessage}
          </span>
        </Box>
        <AiOutlineCaretDown className={`${isEnabled && 'flip-180'}`} />
      </Box>
      <Box className={`mt-2 ${!isEnabled && 'hidden absolute'}`}>
        {children}
      </Box>
    </motion.div>
  )
}

export default Accordion
