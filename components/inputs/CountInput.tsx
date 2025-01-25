import Box from '@components/base/Box'
import React, { useEffect, useState } from 'react'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'
import { useTheme } from '@libs/useTheme'

export interface PriceInputProps extends BaseInputProps {
  currencySymbol?: string | '£' | '$' | '€' | '¥' | '₹'
  minValue?: number
  maxValue?: number
}

/**
 * Primary UI component for text input
 */
export const CountInput = ({
  label,
  value = 0,
  onChange,
  className,
  validations,
  required,
  labelBgColour,
  textColour,
  border = 'border',
  show = true,
  minValue = 0,
  maxValue = 99,
}: PriceInputProps) => {
  const { theme } = useTheme()
  const errorMessage = validate(value, validations)
  const [count, setCount] = useState<number>(value)

  useEffect(() => {
    if (onChange) onChange(count)
  }, [count])

  if (!show) return <></>

  const input = (
    <input
      required={required}
      value={count}
      onChange={(e) => {
        let val = parseInt(e.target.value, 10)
        onChange && onChange(val)
        setCount(val > maxValue ? maxValue : val < minValue ? minValue : val)
      }}
      type="number"
      className={`transition-all bg-transparent border-t border-b cursor-pointer ${
        errorMessage ? 'text-red-500 border-red-500' : ''
      } py-4 text-sm placeholder-gray-500 px-1 w-10`}
    />
  )

  const bgHint = theme.type === 'DARK' ? 'bg-midnight-dark' : 'bg-white'
  const backgroundColour =
    labelBgColour ?? theme?.backgroundColourSecondary ?? '#0D0E11'

  return (
    <label
      className={['flex flex-row justify-between items-center', className].join(
        ' '
      )}
      style={{ color: textColour }}
    >
      {label && (
        <span
          className={`text-sm z-10 ${backgroundColour} ${
            required ? 'pl-2' : 'px-2'
          } transition-all ${errorMessage ? 'text-red-500' : ''} flex-3`}
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
      <Box className="flex flex-row flex-1 justify-end">
        <Box
          className="font-bold w-6 h-full border rounded-l-lg py-[14px] flex justify-center cursor-pointer "
          onClick={() => {
            setCount((state) => (state > minValue ? state - 1 : state))
          }}
        >
          -
        </Box>
        {input}
        <Box
          className="font-bold w-6 h-full border rounded-r-lg py-[14px] flex justify-center cursor-pointer"
          onClick={() => {
            setCount((state) => (state < maxValue ? state + 1 : state))
          }}
        >
          +
        </Box>
      </Box>
      <Box
        ignoreTheme
        className={`transition-all ${
          errorMessage ? 'opacity-100' : 'opacity-0'
        } text-red-500 text-sm font-bold`}
      >
        {errorMessage ?? '-'}
      </Box>
    </label>
  )
}
