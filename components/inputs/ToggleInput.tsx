import React, { useState } from 'react'
import { BaseInputProps } from './BaseInputProps'
import { useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'

export interface ToggleInputProps extends Omit<BaseInputProps, 'value'> {
  /**
   * Error message to display.
   */
  errorMessage?: string
  /**
   * Callback with value when the input value changes.
   */

  uploadFile?: (value: File) => Promise<string>

  value?: string

  options: string[]

  /**
   * Index of the option to be selected.
   */
  selected?: number

  callback?: (val: string) => void
  centerText?: boolean
}

/**
 * Primary UI component for toggle input
 */
export const ToggleInput = ({
  label,
  placeholder,
  onChange,
  className,
  errorMessage,
  hint,
  required,
  value,
  options,
  selected = 0,
  callback,
  centerText = false,
}: ToggleInputProps) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null)
  const [toggleValue, setToggleValue] = useState<number>(selected ?? 0)
  const { theme } = useTheme()
  const isLight = theme.type === 'LIGHT'

  return (
    <label
      htmlFor="formToggle"
      className={['flex flex-col text-sm space-y-1 text-white', className].join(
        ' '
      )}
    >
      {(errorMessage || label || hint) && (
        <span
          className={`transition-all ${
            errorMessage
              ? 'text-red-500'
              : isLight
              ? 'text-black'
              : 'text-white'
          }`}
        >
          {errorMessage ?? label}{' '}
          <span
            className={`
        ${isLight ? 'text-black' : 'text-white'} 
        ml-2 text-xs
        `}
          >
            {hint}
          </span>
        </span>
      )}
      <Box className="flex w-full">
        {options.map((c, index) => {
          return (
            <Box
              key={index}
              className={`
                py-1 flex justify-center items-center h-[55px]
                ${selected === index && 'bg-forumm-blue-light-2'}
                ${index + 1 === options.length && 'rounded-r-2xl'}
                ${index === 0 && 'rounded-l-2xl'}
                ${centerText && 'text-center'}
                ${isLight ? 'border-forumm-gray-3' : 'border-white'}
                border py-2 px-3 cursor-pointer flex-1
                ${selected === index && '!text-[#181A20]'}
              `}
              onClick={async () => {
                hiddenFileInput.current!.value = c
                if (callback) return callback(c)
              }}
            >
              {selected === index ? `✓  ${c}` : c}
            </Box>
          )
        })}
      </Box>
      <input
        required={required}
        className="hidden"
        type="text"
        id={label}
        ref={hiddenFileInput}
        onChange={(e) => {
          if (onChange) onChange(e)
        }}
        value={options[selected]}
      />
    </label>
  )
}
