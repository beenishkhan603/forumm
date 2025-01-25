import Box from '@components/base/Box'
import LoadingSpinner from '@components/base/LoadingSpinner'
import Modal from '@components/base/Modal'
import { getParentBg, isReadable, Theme, useTheme } from '@libs/useTheme'
import { getContrastColor } from '@libs/Utility/util'
import { motion, Variants } from 'framer-motion'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { IconContext, IconType } from 'react-icons'

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  type?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'special'
    | 'danger'
    | 'success'
    | 'link'
    | 'modal'
    | 'donation'
    | 'create'
    | 'square'
    | 'blackbaud'
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * What text color to use
   */
  textColor?: string
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large' | 'auto' | 'full'
  /**
   * Button contents
   */
  title?: string
  /**
   * icon
   */
  icon?: JSX.Element
  iconPos?: 'start' | 'end'
  /**
   * Optional click handler
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void
  /**
   * Optional class name
   */
  className?: string
  /**
   * Optional href link
   */
  href?: string
  confirmationModal?: { title: string; content: string }
  buttonType?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
  show?: boolean
  textColour?: keyof Theme | string
  style?: any
  isSelected?: boolean
  isInConfirmationModal?: boolean
  iconColor?: string
}

const buttonVariants: Variants = {
  hover: {
    scale: 1,
  },
}

/**
 * Primary UI component for user interaction
 */
function Button({
  type = 'primary',
  size = 'medium',
  backgroundColor,
  textColor,
  title,
  icon,
  iconPos = 'start',
  href,
  className,
  buttonType = 'button',
  loading,
  disabled,
  confirmationModal,
  onClick,
  onMouseDown,
  show = true,
  textColour,
  isSelected = false,
  isInConfirmationModal = false,
  iconColor,
  ...props
}: ButtonProps) {
  const { theme } = useTheme()
  const isLight = theme.type === 'LIGHT'

  const sizeClasses = {
    small: 'px-4 py-4 text-xs h-6',
    medium: 'px-6 py-4 text-base h-8',
    large: 'px-8 py-4 text-base h-10',
    full: 'px-8 py-4 text-base h-10 w-full',
  }
  const colorClasses = {
    primary: `${
      isLight
        ? 'bg-forumm-blue-2 text-white relative'
        : 'bg-forumm-blue text-white hover:bg-blue-700 relative'
    }`,
    secondary: `${
      isLight
        ? 'border border-forumm-menu-border text-forumm-blue-2 bg-forumm-white relative'
        : 'border-2 border-panel-gray text-midnight-light2 relative'
    } `,
    tertiary: 'bg-tertiary border',
    square: 'bg-tertiary border',
    special: 'border-forumm-orange border text-forumm-orange',
    blackbaud: 'border-blackbaud border text-blackbaud',
    danger: 'border-red-600 text-red-600 border',
    success: 'border-green-500 text-green-500 border',
    disabled: `${
      isLight
        ? '!bg-disabled-bg text-disabled-text border-disabled'
        : 'border-2 border-panel-gray text-forumm-gray'
    }`,
    link: `${
      isLight ? 'text-forumm-blue-2 bg-white' : 'text-midnight-light2'
    } `,
    modal: 'border border-panel-gray',
    donation: 'border border-tertiary',
    create: 'text-forumm-blue',
  }

  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const [computedStyle, setComputedStyle] = useState<
    CSSStyleDeclaration & { parentBg?: string }
  >()

  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleAutoSize = (
    content: string | any[] | JSX.Element | null | undefined
  ) => {
    if (
      typeof content === 'string' &&
      content.length > 15 &&
      window.innerWidth < 1012
    )
      return sizeClasses['small']
    if (window.innerWidth < 640) return sizeClasses['small']
    if (window.innerWidth <= 960) return sizeClasses['medium']
    if (window.innerWidth > 960) return sizeClasses['large']
  }

  useEffect(() => {
    if (buttonRef.current) {
      const computed = window.getComputedStyle(buttonRef.current)
      const parentBg = getParentBg(buttonRef.current)
      setComputedStyle({ ...computed, parentBg })
    }
  }, [buttonRef.current])

  const computedBg = computedStyle?.backgroundColor ?? ''
  const computedText = computedStyle?.color ?? ''

  const textColorForTransparentBg = isReadable(
    computedText,
    computedStyle?.parentBg ?? ''
  )
    ? computedText
    : getContrastColor(computedStyle?.parentBg ?? '#ffffff')

  const buttonBgColor = backgroundColor
    ? backgroundColor
    : type === 'primary'
    ? theme.highlightColour ?? ''
    : computedBg

  const bgIsTransparent = [buttonBgColor, computedBg].includes(
    'rgba(0, 0, 0, 0)' || type === 'tertiary'
  )
  const contrastColor = getContrastColor(buttonBgColor)

  const tertiaryTextColor = bgIsTransparent
    ? textColorForTransparentBg
    : contrastColor

  let buttonTextColor = textColor
    ? isReadable(textColor, buttonBgColor)
      ? textColor
      : tertiaryTextColor
    : isReadable(computedText, buttonBgColor)
    ? computedText
    : tertiaryTextColor

  if (
    !buttonBgColor &&
    (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
      /firefox/i.test(navigator.userAgent))
  ) {
    buttonTextColor = '#000'
  }

  // if (title === 'Confirm')
  //   console.log({
  //     input: {
  //       title,
  //       icon,
  //       textColor,
  //       backgroundColor,
  //     },
  //     output: {
  //       computedBg,
  //       computedText,
  //       textColorForTransparentBg,
  //       buttonBgColor,
  //       buttonTextColor,
  //       contrastColor,
  //       tertiaryTextColor,
  //       bgIsTransparent,
  //     },
  //   })

  const getIcon = () => {
    if (!icon) return null

    // TODO: implement computed contrast for icon colour.
    return (
      <IconContext.Provider
        value={{
          style: {
            fill: iconColor ? iconColor : theme.textColour,
          },
        }}
      >
        {icon}
      </IconContext.Provider>
    )
  }

  const getTextContent = () => {
    if (loading) return <LoadingSpinner />
    if (title && icon)
      return (
        <span className="flex items-center space-between">
          {iconPos === 'start' && getIcon()}
          <p className="m-0 px-1 text-sm">{title}</p>
          {iconPos === 'end' && getIcon()}
        </span>
      )
    return title ?? getIcon()
  }

  if (href) {
    return (
      <motion.a
        ref={buttonRef as RefObject<HTMLAnchorElement>}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="hover"
        className={`
        ${colorClasses[type]}         
        btn hover:animate-heartbeat rounded-full flex justify-center items-center text-center ${
          size !== 'auto' ? sizeClasses[size] : handleAutoSize(title)
        } my-0 ${className}`}
        style={{
          backgroundColor,
        }}
        href={href}
      >
        {title ?? getIcon()}
      </motion.a>
    )
  }

  return (
    <>
      {confirmationModal && (
        <Modal
          title={confirmationModal?.title}
          show={showConfirmation}
          setShow={setShowConfirmation}
        >
          <Box>{confirmationModal?.content}</Box>
          <Box className="flex w-full space-x-4 mt-4">
            <Button
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
              title="Cancel"
              type="tertiary"
              style={{
                backgroundColor: 'transparent',
              }}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation()
                if (onClick) onClick(e)
                setShowConfirmation(false)
              }}
              className="flex-1"
              title="Confirm"
              type="danger"
              style={{
                backgroundColor: 'transparent',
              }}
            />
          </Box>
        </Modal>
      )}
      {show && (
        <motion.button
          ref={buttonRef as RefObject<HTMLButtonElement>}
          variants={disabled ? undefined : buttonVariants}
          whileHover="hover"
          whileTap="hover"
          type={buttonType}
          className={`
      ${colorClasses[disabled ? 'disabled' : type]} ${
            type === 'square' ? 'rounded' : 'rounded-full'
          }  ${
            size !== 'auto'
              ? sizeClasses[size]
              : handleAutoSize(getTextContent())
          } flex items-center hover:animate-heartbeat justify-center ${className}`}
          style={
            buttonBgColor
              ? {
                  backgroundColor: buttonBgColor,
                }
              : {}
          }
          onMouseDown={onMouseDown}
          onClick={(e) => {
            e.stopPropagation()
            if (disabled) return
            if (confirmationModal) {
              setShowConfirmation(true)
              return
            }
            return onClick ? onClick(e) : null
          }}
          disabled={disabled}
          {...props}
        >
          <span
            className={`relative z-10`}
            style={
              buttonTextColor
                ? {
                    color: buttonTextColor,
                  }
                : {}
            }
          >
            {getTextContent()}
          </span>
        </motion.button>
      )}
    </>
  )
}

export { Button }
