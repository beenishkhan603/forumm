import { Theme, useTheme } from '@libs/useTheme'
import {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  LegacyRef,
} from 'react'
import LoadingSpinner from './LoadingSpinner'

const Box = (
  props: {
    children?: any
    loading?: boolean
    color?: keyof Theme
    show?: boolean
    ignoreTheme?: boolean
    textColour?: keyof Theme
    blur?: boolean
    innerRef?: LegacyRef<HTMLDivElement>
  } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
  const { theme } = useTheme()
  const {
    children,
    loading = false,
    color,
    textColour,
    show = true,
    ignoreTheme = false,
    style,
    blur = false,
    innerRef,
    ...divProps
  } = props
  if (!show) {
    return null
  }
  return (
    <div
      {...divProps}
      style={
        ignoreTheme || style
          ? style ?? {}
          : {
            backgroundColor: color && theme ? theme[color] : undefined,
            color:
              theme && textColour
                ? theme[textColour]
                : theme.textColour ?? undefined,
          }
      }
      ref={innerRef}
    >
      {loading ? (
        <Box
          data-test-id={'box-spinner'}
          className="w-full h-full justify-center items-center flex"
        >
          <LoadingSpinner size="medium" />
        </Box>
      ) : blur ? (
        <span style={{ filter: 'blur(2px)' }}>{children}</span>
      ) : (
        children
      )}
    </div>
  )
}

export default Box
