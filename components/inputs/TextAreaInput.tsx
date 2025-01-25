import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import React, { useRef } from 'react'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'
import { start } from 'repl'
import { set } from 'lodash'

export interface TextAreaInputProps extends BaseInputProps {
  /**
   * Number of rows for textarea if set, otherwise default to 3.
   */
  rows?: number
  show?: boolean
  dynamicResize?: boolean
  preventResize?: boolean
  preventBorder?: boolean

  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

/**
 * Primary UI component for text input
 */
export const TextAreaInput = ({
  label,
  placeholder,
  value = '',
  onChange,
  onKeyDown,
  className,
  rows,
  hint,
  validations,
  required,
  testid,
  show = true,
  labelBgColour,
  preventBorder = false,
  dynamicResize = false,
  preventResize = false,
}: TextAreaInputProps) => {
  const errorMessage = validate(value, validations)
  const ref = useRef<HTMLTextAreaElement>(null)
  const { theme } = useTheme()
  if (!show) return <></>
  if (value === null) value = ''

  function handleDynamicResize(e?: React.ChangeEvent<HTMLTextAreaElement>) {
    if (dynamicResize && ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown && onKeyDown(e)
    if (e.isDefaultPrevented() && ref.current) ref.current.style.height = 'auto'
  }

  return (
    <label className={['flex flex-col', className].join(' ')}>
      <span
        className={`absolute text-sm -translate-y-1/2 mb-2 ml-2 ${
          required ? 'pl-2' : 'px-2'
        } transition-all ${errorMessage ? 'text-red-500' : ''}`}
        style={{
          backgroundColor: labelBgColour
            ? labelBgColour
            : theme.backgroundColour,
        }}
      >
        <span
          className={
            required ? "after:content-['*'] after:mx-2 after:text-red-500" : ''
          }
        >
          {label}
        </span>
      </span>
      <textarea
        required={required}
        value={value}
        onChange={(e) => {
          const isInvalid = validate(e.target.value, validations) !== ''
          onChange && onChange(e.target.value, isInvalid)
          handleDynamicResize(e)
        }}
        rows={rows ?? 3}
        autoComplete="on"
        placeholder={placeholder}
        className={`transition-all bg-transparent ${
          preventBorder ? '' : 'border'
        } ${errorMessage ? 'text-red-500 border-red-500' : ''} ${
          preventResize ? 'resize-none' : ''
        } rounded px-4 py-4 text-sm outline-none`}
        data-testid={testid ?? null}
        onKeyDown={handleKeyDown}
        ref={ref}
      />
      {hint && <span className="mt-1 mb-4 ml-2 text-xs">{hint}</span>}
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
