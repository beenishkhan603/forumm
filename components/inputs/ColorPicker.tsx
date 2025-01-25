import Box from '@components/base/Box'
import { tryGetReadableColour, useTheme } from '@libs/useTheme'
import ColorPickerIcon from '@public/images/ColorPicker.svg'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { SwatchesPicker } from 'react-color'
import { BaseInputProps } from './BaseInputProps'
import { validate } from './Validations'

export interface TextInputProps extends BaseInputProps {
  /**
   * The type of the input.
   */
  type?: 'text' | 'password' | 'email' | 'tel' | 'number'
}

/**
 * Primary UI component for text input
 */
export const ColorPicker = ({
  label,
  placeholder,
  value = '',
  onChange,
  className,
  hint,
  validations,
  required,
  type = 'text',
  testid,
}: TextInputProps) => {
  const { theme } = useTheme()
  const colourPickerButtonRef = useRef<HTMLImageElement>(null)
  const errorMessage = validate(value, validations)
  const [showPickColor, setShowPickColor] = useState(false)
  const [pickColor, setPickColor] = useState(value)
  const [contrastColor, setContrastColor] = useState(theme.textColour)

  const parentHasClassRecursive = (
    element: any,
    classname: string
  ): boolean => {
    try {
      if (element?.className?.split(' ').indexOf(classname) >= 0) return true
    } catch (e) {}
    return (
      (element.parentNode &&
        parentHasClassRecursive(element.parentNode, classname)) ??
      false
    )
  }

  useEffect(() => {
    setPickColor(value ?? theme.backgroundColour)
    setContrastColor(tryGetReadableColour(value ?? theme.backgroundColour))
  }, [value, theme.backgroundColour])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const clickedOnColourPicker = parentHasClassRecursive(
        event.target,
        'swatches-picker'
      )
      if (
        colourPickerButtonRef.current?.contains(event.target as Node) ||
        clickedOnColourPicker
      ) {
        return
      }
      setShowPickColor(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  })

  const availableColors = [
    // Colors for good contrast with white text
    ['#8B0000', '#A52A2A', '#cc0a0a', '#DC143C'],
    ['#ffbb00', '#ed9315', '#cf7202', '#a35802'],
    ['#9ACD32', '#6B8E23', '#556B2F', '#808000'],
    ['#008000', '#228B22', '#078507', '#2E8B57'],
    ['#008B8B', '#20B2AA', '#5F9EA0', '#008080'],
    ['#00008B', '#0000CD', '#000080', '#12124f'],
    ['#4B0082', '#800080', '#8A2BE2', '#9932CC'],
    ['#C71585', '#DB7093', '#FF1493', '#ad075a'],
    ['#A52A2A', '#8B4513', '#ff793b', '#D2691E'],
    ['#696969', '#808080', '#A9A9A9', '#778899'],

    // Colors for good contrast with black text
    ['#fc4732', '#a86d59', '#b32525', '#6e0b0b'],
    ['#ffbb00', '#d4945b', '#fa8150', '#fa4e0f'],
    ['#ffff05', '#d4be00', '#8a8a11', '#9c8700'],
    ['#00de95', '#21b853', '#4b734b', '#227a5d'],
    ['#00f5f5', '#14b8b8', '#0a9191', '#207173'],
    ['#407c8f', '#2890d1', '#0a4963', '#145259'],
    ['#6363ff', '#5c2ef2', '#5c13c2', '#4f0599'],
    ['#ef42ff', '#9e649e', '#cc7ecc', '#b015aa'],
    ['#73215a', '#7d1047', '#b80d40', '#573e3e'],
    ['#6a7f9c', '#8f8f8f', '#707070', '#97aac2'],
  ]

  const input = (
    <Box className="relative">
      {showPickColor ? (
        <SwatchesPicker
          width={250}
          className="absolute top-full right-0 z-50"
          color={pickColor}
          onChange={(color) => {
            setPickColor(color.hex)
            onChange && onChange(color.hex, false)
          }}
          colors={availableColors}
        />
      ) : (
        ''
      )}
      {pickColor ? (
        <Box
          className="w-5 h-5 cursor-pointer absolute my-4 mr-4 right-0 rounded-full border-white border-solid border-2 drop-shadow shadow-inner"
          innerRef={colourPickerButtonRef}
          style={{ backgroundColor: pickColor }}
          onClick={() => setShowPickColor(!showPickColor)}
        ></Box>
      ) : (
        <ColorPickerIcon
          className="w-5 h-5 cursor-pointer absolute my-4 mr-4 right-0"
          onClick={() => setShowPickColor(!showPickColor)}
        />
      )}

      <input
        required={required}
        value={value}
        onChange={(e) => {
          const isInvalid = validate(e.target.value, validations) !== ''
          onChange && onChange(e.target.value, isInvalid)
        }}
        onFocus={() => setShowPickColor(true)}
        type={type}
        autoComplete="on"
        placeholder={value ? '' : 'Select Color'}
        data-testid={testid ?? null}
        style={{
          backgroundColor: pickColor,
          color: contrastColor,
        }}
        className={`bg-transparent select-none cursor-pointer ${
          errorMessage && 'text-red-500 border-red-500'
        } rounded px-4 py-4 text-sm outline-none w-full`}
      />
    </Box>
  )

  return (
    <label className={['flex flex-col space-y-1', className].join(' ')}>
      <span className={`transition-all ${errorMessage ? 'text-red-500' : ''}`}>
        {label} <span className="ml-2 text-xs">{hint}</span>
      </span>
      {input}
      <Box
        className={`transition-all ${
          errorMessage ? 'opacity-100' : 'opacity-0'
        } text-red-500 text-sm font-bold`}
      >
        {errorMessage}
      </Box>
    </label>
  )
}
