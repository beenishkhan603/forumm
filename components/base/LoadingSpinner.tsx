import { useTheme } from '@libs/useTheme'
import Box from './Box'
import ForumLogoText from '@public/images/ForumLogoText.svg'
import ForumLogoRotating from '@public/images/ForumLogoRotating.svg'


const LoadingSpinner = ({
  className,
  size = 'small',
}: {
  size?: 'small' | 'medium' | 'large'
  className?: string
}) => {
  const { theme } = useTheme()

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }

  return (
    <Box
      data-testid="loading"
      className={`${sizeClasses[size]} ${className ?? ''}`}
      style={{ color: theme.textColour }}
    >
      <ForumLogoRotating fill={theme.textColour} className={`${sizeClasses[size]} ${className ?? ''}` } />
      { (size !== 'small') && (<ForumLogoText fill={theme.textColour} className={`${sizeClasses[size]} ${className ?? ''} !h-12` } />)}
    </Box>
  )
}

export default LoadingSpinner
