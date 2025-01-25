import { useTheme } from '@libs/useTheme'
import React from 'react'
import Box from './Box'
import { roundAmount } from '@libs/Utility/util'

interface ProgressWheelProps {
  fillColor?: string
  bgColor?: string
  diameter?: number
  percentageComplete: number
}

export const ProgressWheel = ({
  fillColor,
  bgColor,
  diameter = 140,
  percentageComplete,
}: ProgressWheelProps) => {
  const { theme, StaticColours } = useTheme()

  return (
    <Box
      className={`rounded-full relative flex justify-center items-center`}
      style={{
        width: diameter,
        height: diameter,
        background: fillColor,
      }}
    >
      <Box
        className={`rounded-full absolute flex justify-center items-center text-5xl`}
        style={{
          width: diameter * 0.9,
          height: diameter * 0.9,
          background: theme.foregroundColour,
          color: bgColor,
        }}
      >
        {Math.round(percentageComplete)}%
      </Box>
      <svg
        className="w-full h-full absolute top-0 left-0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{
          transform: 'rotate(-90deg)',
          fill: 'none',
          stroke: bgColor,
          strokeWidth: diameter * 0.05,
          strokeDasharray: Math.PI * diameter,
          strokeDashoffset: Math.PI * diameter * (1 - percentageComplete / 100),
          strokeLinecap: 'butt',
          strokeOpacity: percentageComplete > 0 ? '100' : '0',
          transition: `all ease-out ${percentageComplete * 10 + 50}ms`,
        }}
      >
        <circle cx={diameter / 2} cy={diameter / 2} r={(diameter * 0.95) / 2} />
      </svg>
    </Box>
  )
}
