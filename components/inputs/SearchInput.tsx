import React, { useState } from 'react'
import { Autocomplete } from '@aws-amplify/ui-react'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'

export interface SearchInputProps extends BaseInputProps {
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  border?: 'border' | 'border-none'
  max?: number
  min?: number
  options: { id: string; label: string }[]
  addValueInOptions?: boolean // optional boolean prop
}

export const SearchInput = ({
  label,
  placeholder,
  value = '',
  onChange,
  className,
  hint,
  validations,
  required,
  border = 'border',
  onKeyDown,
  max,
  min,
  options,
  addValueInOptions = false, // default to false
  textColour,
  labelBgColour,
}: SearchInputProps) => {
  const { theme } = useTheme()

  const backgroundColour = labelBgColour ?? theme?.backgroundColour ?? '#0D0E11'

  const [autocompleteValue, setAutocompleteValue] = useState(value)

  const errorMessage = validate(value, validations)

  const isValueInOptions = options.some(
    (option) => option.label === autocompleteValue
  )
  const modifiedOptions =
    addValueInOptions && !isValueInOptions
      ? [{ id: value, label: value }, ...options]
      : options

  const input = (
    <Autocomplete
      label={label}
      required={required}
      onKeyDown={onKeyDown}
      value={autocompleteValue}
      onChange={(e) => {
        setAutocompleteValue(e.target.value)
        const isInvalid = validate(e.target.value, validations) !== ''
        onChange && onChange(e.target.value, isInvalid)
      }}
      onSelect={(e) => {
        setAutocompleteValue(e.label)
        const isInvalid = validate(e.id, validations) !== ''
        onChange && onChange(e.id, isInvalid)
      }}
      max={max}
      min={min}
      placeholder={placeholder}
      hasSearchIcon={false}
      className="border border-none"
      inputStyles={{
        // padding: '15.5px 16px',
        fontSize: '14px',
        color: 'white',
        borderRadius: '1rem',
        border: '0px solid #ccc', // Add or modify border styles here
      }}
      options={modifiedOptions}
      crossOrigin={undefined}
      onPointerEnterCapture={undefined}
      onPointerOutCapture={undefined}
      onPointerLeaveCapture={undefined}
    />
  )

  return (
    <label
      className={['flex flex-col', className].join(' ')}
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
        {errorMessage}
      </Box>
    </label>
  )
}
