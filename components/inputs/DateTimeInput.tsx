import Box from '@components/base/Box'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { BaseInputProps, Validations } from './BaseInputProps'
import DatePicker from 'react-datepicker'
import DateTimePicker from 'react-datetime-picker'
import 'react-datepicker/dist/react-datepicker.css'
// import 'react-datetime-picker/dist/DateTimePicker.css';
// import 'react-calendar/dist/Calendar.css';
// import 'react-clock/dist/Clock.css';
import { useTheme } from '@libs/useTheme'
import Tooltip from '@components/tootilp/Tooltip'

export interface DateTimeInputProps extends BaseInputProps {
  /**
   * Error message to display.
   */

  validations?: { greaterThanDate: string } & Validations
  id?: string
  clickIdOnChange?: string
  dateOnly?: boolean
  placeholderText?: string
  inputClass?: string
  show?: boolean
  initialDate?: Date

  // Timezone offset
  tz?: number
}

const validateDate = (
  value: string,
  validations?: { greaterThanDate: string } & Validations
) => {
  if (validations) {
    const current = moment(value)
    const greaterThanDate = moment(validations.greaterThanDate)

    if (current <= greaterThanDate) {
      return 'Event cannot end before it starts.'
    }
  }
  return null
}

/**
 * Primary UI component for text input
 */
export const DateTimeInput = ({
  label,
  placeholder,
  value = '',
  onChange,
  className,
  hint,
  required,
  validations,
  filterDate,
  filterTime,
  id,
  clickIdOnChange,
  dateOnly = false,
  placeholderText = 'Pick a date/time',
  inputClass = '',
  show = true,
  labelBgColour,
  tooltip,
  initialDate,
  tz,
}: DateTimeInputProps) => {
  const errorMessage = validateDate(value, validations)

  const { theme } = useTheme()

  const [showTooltip, setShowTooltip] = useState(true)
  useEffect(() => {
    // Autohide tooltip if the input is not required.
    if (tooltip?.toLowerCase().includes('require') && !required)
      setShowTooltip(false)
  }, [tooltip, required])

  const closeAction = (id: string) => {
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.click()
      }
    }, 100)
  }
  const doDatePartsMatch = (firstDate: Date, secondDate: Date): boolean => {
    if (!firstDate || !secondDate) return false
    return (
      firstDate.getDate() === secondDate.getDate() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getFullYear() === secondDate.getFullYear()
    )
  }
  const hasTimeChanged = (originalTime: Date, newTime: Date): boolean => {
    if (!originalTime || !newTime) return true
    return (
      originalTime.getHours() !== newTime.getHours() ||
      originalTime.getMinutes() !== newTime.getMinutes() ||
      originalTime.getSeconds() !== newTime.getSeconds()
    )
  }
  const handleChange = (date: Date) => {
    const payload = date?.toISOString()
    onChange && onChange(payload ?? '', false)
    if (clickIdOnChange && date) {
      const current = new Date(value)
      if (doDatePartsMatch(current, date) && hasTimeChanged(current, date)) {
        closeAction(clickIdOnChange)
      }
    }
  }

  if (!show) return <></>

  return (
    <div className={['my-2 flex flex-col', className].join(' ')}>
      {label && (
        <span
          style={{
            backgroundColor: labelBgColour ?? theme.backgroundColour,
            zIndex: 10,
          }}
          className={`absolute text-sm -translate-y-1/2 mb-2 ml-2 ${
            required ? 'pl-2' : 'px-2'
          } transition-all ${errorMessage ? 'text-red-500' : ''}`}
        >
          <Tooltip
            show={showTooltip}
            tooltip={tooltip}
            className={`flex flex-col`}
          >
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
        </span>
      )}
      <DatePicker
        id={id || ''}
        selected={
          value
            ? moment(value)
                .add('h', tz ?? 0)
                .toDate()
            : null
        }
        onChange={handleChange}
        // showTime={{ user12hours: true }}
        showTimeSelect={!dateOnly}
        openToDate={initialDate ?? new Date()}
        filterDate={filterDate}
        filterTime={filterTime}
        isClearable
        popperClassName="!z-20"
        required={required}
        timeFormat="h:mm a"
        timeIntervals={15}
        autoComplete="off"
        dateFormat={!dateOnly ? 'MMMM d, yyyy h:mm a' : 'MMMM d, yyyy'}
        placeholderText={placeholderText}
        className={`rounded-2xl transition-all bg-transparent border ${
          errorMessage ? 'text-red-500 border-red-500' : ''
        } bg-transparent border rounded px-4 py-4 text-sm outline-none cursor-pointer w-full ${inputClass}`}
      />
      <span className="mt-1 ml-2 text-xs text-white">{hint}</span>
      {errorMessage && (
        <Box
          ignoreTheme
          className={`transition-all ${
            errorMessage ? 'opacity-100' : 'opacity-0'
          } text-red-500 text-sm font-bold`}
        >
          {errorMessage ?? '-'}
        </Box>
      )}
    </div>
  )
}
