import Box from '@components/base/Box'
import Text from '@components/base/Text'
import Tooltip from '@components/tootilp/Tooltip'
import { useTheme } from '@libs/useTheme'
import React from 'react'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'

export interface CheckboxInputProps extends BaseInputProps {
  children: JSX.Element
  border?: string
}

/**
 * Primary UI component for text input
 */
export const CheckboxInput = ({
  label,
  show = true,
  placeholder,
  value = '',
  onChange,
  className,
  hint,
  validations,
  required,
  testid,
  children,
  border = 'border',
  isProtected = true,
}: CheckboxInputProps) => {
  const { theme } = useTheme()
  const errorMessage = validate(value, validations)

  const backgroundColour = theme.editorBackgroundColour

  if (!show) return <></>
  return (
    <fieldset
      className={`rounded-2xl transition-all bg-transparent ${border} ${
        errorMessage ? 'text-red-500 border-red-500' : ''
      } rounded text-sm outline-none placeholder-gray-500 ${className}`}

      // className={[
      //   'flex flex-col space-y-1 border border-black',
      //   className,
      // ].join(' ')}
    >
      {label && border?.length > 0 && (
        <legend
          className={`text-sm text-justify ml-2 z-10 ${backgroundColour} ${
            required ? 'pl-2' : 'px-2'
          } transition-all ${errorMessage ? 'text-red-500' : ''}`}
        >
          <Tooltip show={required} tooltip="Required to publish.">
            <span
              className={`z-10 ${
                required
                  ? "after:content-['*'] after:mx-2 after:text-red-500"
                  : ''
              }`}
            >
              {label}
            </span>
          </Tooltip>
        </legend>
      )}
      <Box className="flex items-center justify-center w-full p-2 px-4">
        <input
          data-testid={testid ? `${testid}` : null}
          type="checkbox"
          className="h-4 w-4 text-forumm-blue border-gray-300 inline-block"
          name={label}
          checked={value === true}
          onClick={(e) => {
            e.stopPropagation()
          }}
          onChange={(e) => {
            // e.stopPropagation()
            // e.preventDefault()
            onChange && onChange(e.target.checked, false)
          }}
        />
        <Box className="inline-block ml-2">{children}</Box>
      </Box>

      <Box
        ignoreTheme
        className={`transition-all ${
          errorMessage ? 'opacity-100' : 'opacity-0'
        } text-red-500 text-sm font-bold`}
      >
        {errorMessage ?? '-'}
      </Box>
    </fieldset>
  )
}
