import Box from '@components/base/Box'
import React, { useState } from 'react'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'
import { useTheme } from '@libs/useTheme'
import { WhatsappShareButton } from 'react-share'

export interface PriceInputProps extends BaseInputProps {
  currencySymbol?: string | '£' | '$' | '€' | '¥' | '₹'
  maxValue?: number
}

/**
 * Primary UI component for text input
 */
export const PriceInput = ({
  label,
  placeholder,
  value = '',
  onChange,
  className,
  hint,
  validations,
  required,
  currencySymbol = '£',
  labelBgColour,
  textColour,
  border = 'border',
  maxValue,
}: PriceInputProps) => {
  const { theme, StaticColours } = useTheme()
  const errorMessage = validate(value, validations)
  const [hintColor, setHintColor] = useState(theme.textColour)
  const [dynamicClasses, setDynamicClasses] = useState('')
  const [timer, setTimer] = useState<NodeJS.Timer>()

  const input = (
    <span className="relative flex items-center">
      <span className="absolute ml-4 text-sm">{currencySymbol}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => {
          let val = e.target.value
          const isInvalid = validate(e.target.value, validations) !== ''
          if (maxValue && parseInt(e.target.value) > maxValue) {
            e.target.value = maxValue?.toString()
            if (!timer) {
              const timeout = setTimeout(() => {
                setHintColor(theme.textColour)
                setDynamicClasses('')
                clearTimeout(timer)
                setTimer(undefined)
              }, 3000)
              setHintColor(StaticColours.forumm_red)
              setDynamicClasses('animate-shake-input')
              setTimer(timeout)
            }
            value = maxValue.toString()
            val = maxValue.toString()
          }
          onChange && onChange(val, isInvalid)
        }}
        type="number"
        autoComplete="on"
        placeholder={placeholder}
        className={`w-full transition-all bg-transparent ${border} ${
          errorMessage ? 'text-red-500 border-red-500' : ''
        } rounded-2xl pl-8 pr-4 py-4 text-sm outline-none placeholder-gray-500`}
      />
    </span>
  )

  const bgHint = theme.type === 'DARK' ? 'bg-midnight-dark' : 'bg-white'
  const backgroundColour =
    labelBgColour ?? theme?.backgroundColourSecondary ?? '#0D0E11'

  return (
    <label
      className={`${['flex flex-col my-4', className].join(' ')}  ${dynamicClasses}`}
      style={{ color: textColour }}
    >
      {label && (
        <span
          className={`absolute text-sm mb-2 ml-2 z-10 ${backgroundColour} ${
            required ? 'pl-2' : 'px-2'
          } transition-all ${errorMessage ? 'text-red-500' : ''}`}
          style={{
            background: backgroundColour,
            transform: 'translateY(-50%)',
          }}
        >
          <span
            style={{ backgroundColor: backgroundColour }}
            className={`z-10 ${
              required
                ? "after:content-['*'] after:mx-2 after:text-red-500"
                : ''
            }`}
          >
            {label}
          </span>
        </span>
      )}
      {input}
      <Box
        ignoreTheme
        className={`transition-all ${
          errorMessage ? 'opacity-100' : 'opacity-0'
        } text-red-500 text-sm font-bold`}
      >
        {errorMessage ?? '-'}
      </Box>

      {hint && (
        <span className="mt-1 mb-4 ml-2 text-xs" style={{ color: hintColor }}>
          {hint}
        </span>
      )}
    </label>
  )
}
