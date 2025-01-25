import { CreateEventStage } from '@layouts/CreateEventLayout'
import { CreateEventStageInfo } from '@libs/CreateEventContext'
import { useTheme } from '@libs/useTheme'
import { Fragment } from 'react'
import { FaCheck } from 'react-icons/fa'

type GenericSteppedFlow = {
  stage: string
}

export type MiniNavInput = CreateEventStageInfo | GenericSteppedFlow

const MiniNav = ({
  className,
  navItems,
  stage,
  disabled,
  setStage,
}: {
  className?: string
  navItems: {
    label: string
    targetStage: CreateEventStage | string
  }[]
  stage?: MiniNavInput
  disabled?: boolean
  setStage: (data: Partial<MiniNavInput>) => void
}) => {
  const { theme } = useTheme()
  const isLight = theme.type === 'LIGHT'
  const selectedIndex = navItems.findIndex(
    (items) => items.targetStage === stage?.stage
  )
  return (
    <div className={`flex flex-col items-center my-6 py-2 ${className ?? 'px-[10%] sm:pl-[25%] sm:pr-[25%] mt-20'}`}>
    {/* Progress Bar */}
    <div className="relative w-full h-1 bg-gray-300 rounded-full" style={{ maxWidth: '80%' }}>
      {/* Progress fill */}
      <div
        className="absolute top-0 left-0 h-1 bg-black rounded-full transition-all duration-300"
        style={{
          width: `${(selectedIndex / (navItems.length - 1)) * 100}%`, // Calculate the fill width based on the current step
        }}
      ></div>
    </div>
  
    {/* Clickable Labels */}
    <div className="flex w-full justify-between mt-2" style={{ maxWidth: '80%' }}>
      {navItems.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        const isCompleted = index < selectedIndex;
        const { label, targetStage } = item;
  
        return (
          <div
            key={`mininav-label-${item.label}`}
            onClick={() => {
              if (!disabled) setStage({ stage: targetStage });
            }}
            className={`text-sm text-center cursor-pointer transition-all duration-300 ${
              isHighlighted
                ? 'text-black'
                : isCompleted
                ? 'text-gray-500'
                : 'text-gray-400'
            } hover:text-black`}
          >
            {label}
          </div>
        );
      })}
    </div>
  </div>
  







  )
}

export default MiniNav
