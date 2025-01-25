import Box from '@components/base/Box'
import React, { useEffect } from 'react'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'

export interface RadioFieldInputProps extends BaseInputProps {
  options: string[]
  itemClassName?: string
}

/**
 * Primary UI component for text input
 */
export const RadioFieldInput = ({
  label,
  placeholder,
  value = '',
  onChange,
  className,
  hint,
  validations,
  required,
  options,
  testid,
  itemClassName = '',
}: RadioFieldInputProps) => {
  const errorMessage = validate(value, validations)

  return (
    <span className={['flex flex-col space-y-1', className].join(' ')}>
      <span
        className={`-mb-3 transition-all ${errorMessage ? 'text-red-500' : ''}`}
      >
        <span
          className={
            required
              ? "before:content-['*'] before:mr-2 before:text-red-500"
              : ''
          }
        >
          {label}
        </span>
        <span className="ml-2 text-xs">{hint}</span>
      </span>
      <Box className="flex flex-wrap">
        {options?.map((option, i) => (
          <span
            key={option}
            className={`${itemClassName} mt-4 flex items-center cursor-pointer hover:opacity-90 mr-4`}
          >
            <span className="mr-2 text-sm text-gray-600">{option}</span>
            <input
              data-testid={testid ? `${testid}-${i}` : null}
              type="radio"
              className="h-4 w-4 text-forumm-blue border-gray-300"
              name={label?.toString().toLowerCase().trim().replaceAll(' ', '_')}
              value={option}
              checked={value === option}
              onChange={(e) => {
                onChange && onChange(e.target.value, false)
              }}
            />
          </span>
        ))}
      </Box>

      <Box
        ignoreTheme
        className={`transition-all ${
          errorMessage ? 'opacity-100' : 'opacity-0'
        } text-red-500 text-sm font-bold`}
      >
        {errorMessage ?? '-'}
      </Box>
    </span>
  )
}
