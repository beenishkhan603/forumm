import { useTheme } from '@libs/useTheme'

const Text = ({
  children,
  className,
  style = {},
  ignoreTheme = false,
}: {
  children: any
  className?: string
  ignoreTheme?: boolean
  style?: {}
}) => {
  const { theme } = useTheme()
  return (
    <div
      className={className}
      style={ignoreTheme ? {} : { ...style, color: theme.textColour }}
    >
      {children}
    </div>
  )
}

export default Text
