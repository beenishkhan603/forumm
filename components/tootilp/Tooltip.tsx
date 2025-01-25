import React, {
  useState,
  useEffect,
  HTMLAttributes,
  DetailedHTMLProps,
} from 'react'
import IconInfo from '@public/images/IconInfo.svg'
import rawData from './tooltips.json'
import { useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'
import { useRouter } from 'next/router'

interface TooltipProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode
  tooltip?: string
  show?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({
  tooltip,
  show,
  children,
  className = 'w-full',
  onClick,
}) => {
  const [tooltipText, setTooltipText] = useState<string>(tooltip ?? '')
  const { theme, StaticColours } = useTheme()
  const router = useRouter()

  useEffect(() => setTooltipText(tooltip ?? ''), [tooltip])

  if (!tooltip) return <Box className={className}>{children}</Box>

  // if (
  //   tooltip.includes('publish') &&
  //   !router?.basePath?.includes('create-event')
  // )
  //   show = false
  // return (
  //   <div className="relative group cursor-pointer flex items-center">
  //     {children}
  //     <div className="relative flex justify-center items-center ml-2">
  //       <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center">
  //         <div className="bg-black text-white text-sm px-3 py-1 rounded-lg w-40">
  //           {tooltipText}
  //         </div>
  //         <div className="w-3 h-3 bg-black transform rotate-45 -translate-y-1/2"></div>
  //       </div>
  //       <IconInfo className="w-4 h-4" />
  //     </div>
  //   </div>
  // )

  return (
    <Box
      className={`relative group z-[49] hover:z-[50] ${className}`}
      onClick={(e) => {
        if (onClick) onClick(e)
      }}
    >
      {children}
      <Box
        className={`select-none absolute hidden group-hover:flex right-0 translate-x-[100%] translate-y-[-100%] border px-2 py-1 rounded w-auto whitespace-nowrap`}
        show={show}
        style={{
          background: theme.backgroundColourSecondary,
        }}
      >
        {tooltipText}
      </Box>
    </Box>
  )
}

export default Tooltip
