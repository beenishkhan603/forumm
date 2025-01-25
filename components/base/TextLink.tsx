import React, { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { useTheme } from '@libs/useTheme'

interface TextLinkProps {
  children: ReactNode
  className?: string
  style?: any
  ignoreTheme?: boolean
}

const linkVariants: Variants = {
  hover: {
    scale: 1.05,
  },
}

const TextLink: React.FC<TextLinkProps> = ({
  children,
  className,
  style,
  ignoreTheme = false,
}) => {
  const { theme } = useTheme()

  const isUrl = (word: string): boolean => {
    const urlPattern =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
    return urlPattern.test(word)
  }

  const processText = (text: string): JSX.Element[] => {
    return text.split(/\n/).map((line, index) => (
      <p key={index} style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
        {line.split(' ').map((word, index) => {
          if (isUrl(word)) {
            return (
              <motion.a
                key={index}
                href={word}
                target="_blank"
                rel="noopener noreferrer"
                style={ignoreTheme ? {} : { color: theme?.textColour }}
                className="text-blue-500 underline break-words"
                variants={linkVariants}
                whileHover="hover"
              >
                {word}
              </motion.a>
            )
          }
          return (
            <span key={index} className="break-words">
              {word}{' '}
            </span>
          )
        })}
      </p>
    ))
  }

  return (
    <div
      className={className}
      style={{
        ...(!ignoreTheme && { color: theme?.textColour }),
        ...style,
      }}
    >
      {typeof children === 'string' ? processText(children) : children}
    </div>
  )
}

export default TextLink
