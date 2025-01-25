import Box from '@components/base/Box'
import Tooltip from '@components/tootilp/Tooltip'
import { getParentBg, useTheme } from '@libs/useTheme'
import { Maybe } from 'graphql/jsutils/Maybe'
import React, { useEffect, useRef, useState } from 'react'
import { isReadable } from 'tinycolor2'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'

export interface TextInputProps extends BaseInputProps {
  /**
   * The type of the input.
   */
  type?: 'text' | 'password' | 'email' | 'tel' | 'number'
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onBlur?: () => void
  border?: 'border' | 'border-none'
  max?: number
  min?: number
  textColour?: string
  name?: string
  labelBgColour?: string
  show?: boolean
  customClassLabel?: string
}

/**
 * Primary UI component for text input
 */
export const TextInput = ({
  label,
  placeholder,
  value = '',
  onChange,
  className,
  hint,
  validations,
  required,
  type = 'text',
  border = 'border',
  onKeyDown,
  onBlur,
  max,
  min,
  textColour,
  labelBgColour,
  testid,
  name,
  tooltip,
  show = true,
  customClassLabel = '',
}: TextInputProps) => {
  const errorMessage = validate(value, validations)

  const { theme } = useTheme()

  const [showTooltip, setShowTooltip] = useState(true)

  useEffect(() => {
    // Autohide tooltip if the input is not required.
    if (tooltip?.toLowerCase().includes('require') && !required)
      setShowTooltip(false)
  }, [tooltip, required])

  const backgroundColour = labelBgColour
    ? labelBgColour
    : theme.backgroundColour

  if (value === null) value = ''

  const input = (
    <input
      data-testid={testid ?? null}
      required={required}
      value={value}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onChange={(e) => {
        const isInvalid = validate(e.target.value, validations) !== ''
        onChange && onChange(e.target.value, isInvalid)
      }}
      max={max}
      min={min}
      type={type}
      placeholder={placeholder}
      autoComplete={label}
      id={label}
      className={`rounded-2xl transition-all bg-transparent border-none ${
        errorMessage ? 'text-red-500 border-red-500' : ''
      } rounded px-4 py-4 text-sm outline-none placeholder-gray-500`}
      style={{ color: 'white', backgroundColor: '#96B7E8' }}
    />
  )

  const labelRef = useRef<HTMLLabelElement>(null)
  const [computedStyle, setComputedStyle] = useState<
    Maybe<CSSStyleDeclaration> & { parentBg?: string }
  >()

  useEffect(() => {
    if (labelRef.current) {
      const computed = window.getComputedStyle(labelRef.current)
      const parentBg = getParentBg(labelRef.current)
      setComputedStyle({ ...computed, parentBg })
    }
  }, [labelRef.current])

  if (!show) return <></>
  return (
    <label
      className={['flex flex-col my-4', className].join(' ')}
      style={{ color: 'white' }}
    >
      {label && (
        <span
          ref={labelRef}
          className={`absolute text-sm mb-2 ml-2 z-10 ${
            required ? 'pl-2' : 'px-2'
          } transition-all ${
            errorMessage ? 'text-red-500' : ''
          } !backdrop-blur-md`}
          style={{
            transform: 'translateY(-50%)',
          }}
        >
          <Tooltip
            show={showTooltip}
            tooltip={tooltip}
            className={`flex flex-col`}
          >
            <span
              className={`z-10 ${customClassLabel} ${
                required
                  ? "after:content-['*'] after:mx-2 after:text-red-500"
                  : ''
              }`}
            >
              {label}
            </span>
          </Tooltip>
        </span>
      )}
      {input}
      {errorMessage && (
        <Box
          ignoreTheme
          textColour="foregroundTextColour"
          className="transition-all text-red-500 text-xs font-bold mt-1"
        >
          {errorMessage}
        </Box>
      )}
      {hint && (
        <span className="mt-1 mb-4 ml-2 text-xs" style={{ color: 'white' }}>
          {hint}
        </span>
      )}
    </label>
  )
}
