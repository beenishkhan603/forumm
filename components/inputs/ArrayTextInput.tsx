import { Autocomplete } from '@aws-amplify/ui-react'
import Box from '@components/base/Box'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useTheme } from '@libs/useTheme'
import { BaseInputProps } from './BaseInputProps'
import { Button } from './Button'
import { validate } from './Validations'
import Tooltip from '@components/tootilp/Tooltip'

export interface ArrayTextInputProps
  extends BaseInputProps<{ key: string; value: string }[]> {
  /**
   * The type of the input.
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  border?: 'border' | 'border-none'
  max?: number
  min?: number
  options: { id: string; label: string }[]
}

/**
 * Primary UI component for text input
 */
export const ArrayTextInput = ({
  label,
  placeholder,
  value = [],
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
  labelBgColour,
  tooltip,
}: ArrayTextInputProps) => {
  const { theme } = useTheme()
  const errorMessage = validate(value, validations)

  const [showTooltip, setShowTooltip] = useState(true)
  useEffect(() => {
    // Autohide tooltip if the input is not required.
    if (tooltip?.toLowerCase().includes('require') && !required)
      setShowTooltip(false)
  }, [tooltip, required])

  const [textInput, setTextInput] = useState('')
  const [selectedVal, setSelectedVal] = useState<{
    key: string
    value: string
  }>()

  const input = (
    <Autocomplete
      label={label}
      value={textInput}
      required={required}
      onKeyDown={onKeyDown}
      onChange={(e) => {
        setTextInput(e.target.value)
      }}
      onSelect={(e) => {
        setSelectedVal({ key: e.label, value: e.id })
        setTextInput(e.label)
      }}
      innerEndComponent={null}
      outerEndComponent={
        <Button
          onClick={() => {
            if (
              selectedVal &&
              value.findIndex((v) => v.value === selectedVal.value) === -1
            ) {
              onChange?.([...value, selectedVal])
              setTextInput('')
            }
          }}
          title="Add"
          className="h-[54px] ml-2"
          type="tertiary"
        />
      }
      max={max}
      min={min}
      placeholder={placeholder}
      hasSearchIcon={false}
      inputStyles={{
        padding: '15.5px 16px',
        fontSize: '14px',
        color: theme.textColour,
      }}
      options={options}
      crossOrigin={undefined}
      onPointerEnterCapture={undefined}
      onPointerOutCapture={undefined}
      onPointerLeaveCapture={undefined}
    />
  )

  return (
    <>
      <label
        style={{ color: 'initial' }}
        className={['relative flex-col space-y-1', className].join(' ')}
      >
        {label && (
          <Tooltip
            show={showTooltip}
            tooltip={tooltip}
            className={`flex flex-col`}
          >
            <span
              className={`transition-all text-sm pl-1 pr-1 absolute -top-3 left-2 z-10 ${
                errorMessage ? 'text-red-500' : ''
              }`}
              style={{
                backgroundColor: labelBgColour ?? theme.backgroundColour,
                color: theme.textColour,
              }}
            >
              {label}
              <span className="ml-2 text-xs">{hint}</span>
            </span>
          </Tooltip>
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
      <div className="flex flex-wrap">
        {value.map((v, i) => (
          <div
            key={i}
            className="bg-white text-black rounded px-2 m-1 flex items-center space-x-1"
          >
            <span>{v.key}</span>
            <AiFillCloseCircle
              className="hover:opacity-50 cursor-pointer"
              onClick={() => onChange?.(value.filter((i) => i !== v))}
            />
          </div>
        ))}
      </div>
    </>
  )
}
