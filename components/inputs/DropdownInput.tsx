import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'
import { v4 } from 'uuid'
import { useEffect } from 'react'
import Tooltip from '@components/tootilp/Tooltip'

export type DropdownOptions = {
  label: string
  value: string | number
  selected?: boolean
}

export interface DropdownInputProps extends BaseInputProps {
  /**
   * The type of the input.
   */
  onChange:
    | ((
        value: any,
        isInvalid?: boolean | undefined,
        index?: number | undefined
      ) => void)
    | undefined
  options: DropdownOptions[] | string[]
  textColour?: string
  // The value of the selected option.
  selected?: any
  labelBgColour?: string
  bgColor?: string
  noBorder?: boolean
  autoWidth?: boolean
  id?: string
  overrideFullLabelClass?: string
}

/**
 * Primary UI component for text input
 */
export const DropdownInput = ({
  label,
  placeholder,
  value = '',
  onChange,
  className,
  hint,
  validations,
  required,
  options,
  disabled = false,
  selected,
  labelBgColour,
  noBorder = false,
  autoWidth = false,
  id,
  tooltip,
  bgColor = 'none',
  overrideFullLabelClass = undefined,
}: DropdownInputProps) => {
  const { theme } = useTheme()
  const errorMessage = validate(value, validations)
  const dropDownId = id ?? v4()

  const adjustSelectWidth = () => {
    const select = document.getElementById(dropDownId)
    if (!select) return
    const measureSpan = document.createElement('span')
    measureSpan.style.visibility = 'hidden'
    measureSpan.style.position = 'absolute'
    measureSpan.style.whiteSpace = 'nowrap'
    document.body.appendChild(measureSpan)
    // @ts-ignore
    measureSpan.textContent = select.options[select.selectedIndex].text
    const width = measureSpan.offsetWidth
    select.style.width = `${width + 60}px`
    document.body.removeChild(measureSpan)
  }

  const labelBackgroundColour = labelBgColour ?? theme?.backgroundColour ?? ''

  const input = (
    <select
      id={dropDownId}
      // placeholder={placeholder}
      required={required}
      value={selected ?? value}
      onChange={(e) => {
        const isInvalid = validate(e.target.value, validations) !== ''
        const selectedIndex = e.target.selectedIndex
        onChange && onChange(e.target.value, isInvalid, selectedIndex)
        if (autoWidth) adjustSelectWidth()
      }}
      className={`transition-all bg-transparent ${noBorder ? '' : 'border'} ${
        errorMessage ? 'text-red-500 border-red-500' : ''
      } rounded-2xl px-4 pt-[15px] pb-[14px] text-sm outline-none cursor-pointer ${
        autoWidth ? 'w-[80px]' : ''
      } ${bgColor} border-0 outline outline-1 outline-gray-400 border-r-[10px] border-transparent`}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options?.map((op) => (
        <option
          key={typeof op !== 'string' ? `${op.value}::${op.label}` : op}
          value={typeof op !== 'string' ? op.value : op}
          className="capitalize"
          disabled={disabled}
          selected={typeof op !== 'string' ? op.selected : false}
        >
          {typeof op !== 'string' ? op.label : op}
        </option>
      ))}
    </select>
  )

  const mainLabelclassName = overrideFullLabelClass
    ? overrideFullLabelClass
    : ['flex flex-col space-y-1 text-sm mt-2', className].join(' ')

  return (
    <label className={mainLabelclassName}>
      {tooltip && (
        <Tooltip className="size-full relative" tooltip={tooltip}>
          <span
            className={`absolute text-sm z-10 left-2 -top-2 transition-all bg-white ${
              errorMessage ? 'text-red-500' : ''
            }`}
          >
            <span
              className={
                required
                  ? "after:content-['*'] after:ml-2 after:text-red-500 pl-1 text-nowrap"
                  : 'ml-2 text-nowrap'
              }
            >
              {label}
            </span>{' '}
            <span className="ml-4 text-xs">{hint}</span>
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
  )
}
