import React from 'react'
import { Button } from '@components/inputs/Button'
import { BaseInputProps } from './BaseInputProps'
import Box from '@components/base/Box'

export interface ItemPickerProps<T> extends BaseInputProps {
  choices: { value: T; title: string }[]
  onClick: (value: T) => void
  value?: T
  itemClass?: string
}

export const ItemPicker = <T extends unknown>({
  choices,
  value,
  itemClass,
  onClick,
}: ItemPickerProps<T>) => {
  return (
    <div className="flex">
      {choices.map((item, index) => (
        <Box
          key={item.title}
          className={`text-[9px] md:text-xs flex pointer items-center justify-center border border-gray-400 w-1/6 ${
            index !== choices.length - 1 ? 'lg:mr-1' : ''
          }  min-h-[56px] cursor-pointer !px-1 ${itemClass} ${
            value === item.value ? 'bg-forumm-blue-light-2' : ''
          } 
      ${index === 0 ? 'rounded-l-2xl' : ''} 
      ${index === choices.length - 1 ? 'rounded-r-2xl' : ''} 
      ${index > 0 && index < choices.length - 1 ? '!rounded-[0px]' : ''}`}
          onClick={() => onClick(item.value)}
        >
          {`${value === item.value ? '✓ ' : ''}${item.title}`}
        </Box>
      ))}
    </div>
  )
}
