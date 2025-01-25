import { useTheme } from '@libs/useTheme'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { IoClose } from 'react-icons/io5'
import Box from './Box'
import Text from './Text'

export interface ModalProps {
  /**
   * Children to enclose in the wrapper.
   */
  children: React.ReactNode
  /**
   * Should the header be shown?
   */
  title?: string

  show: boolean

  setShow?: (show: boolean) => void

  closeButton?: boolean

  animating?: (animating: boolean) => void

  version?: boolean

  className?: string

  bgColor?: string

  zIndex?: string
}

const Modal = ({
  children,
  closeButton = true,
  setShow,
  title,
  show,
  animating,
  version = false,
  className = undefined,
  bgColor = undefined,
  zIndex = '99',
}: ModalProps) => {
  const [mounted, setMounted] = useState(false)
  const [maxHeight, setMaxHeight] = useState(window.innerHeight)
  const ref = useRef<Element | null>(null)
  const { theme } = useTheme()
  const isLight = theme.type === 'LIGHT'

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (setShow) setShow(false)
    }
  }

  useEffect(() => {
    ref.current = document.getElementById('modal-root')
    setMounted(true)
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setMaxHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const toggleAnimation = (override: boolean) => {
    if (!animating) return
    animating(override)
  }

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  if (!mounted) {
    return null
  }

  return ReactDOM.createPortal(
    // Started causing a build error out of the blue, works fine.
    // @ts-ignore
    <AnimatePresence>
      {show && (
        <motion.div
          /* istanbul ignore next */
          onAnimationComplete={() => toggleAnimation(false)}
          onAnimationStart={() => toggleAnimation(true)}
          initial={{ backgroundColor: '#00000000' }}
          animate={{ backgroundColor: '#00000080' }}
          id="modal"
          transition={{
            duration: 0.3,
          }}
          exit={{ backgroundColor: '#00000000' }}
          className="fixed w-full h-full top-0 left-0 bg-black z-40 flex items-center justify-center"
          style={{ zIndex }}
          onClick={(e) => {
            e.stopPropagation()
            if (setShow) setShow(false)
          }}
        >
          {!version ? (
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.3,
              }}
              exit={{
                scale: 0,
                opacity: 0,
              }}
              className={`relative flex items-center flex-col top-0 w-full mx-2 xs:mt-[155px] md:mt-2 sm:mx-0 !sm:w-5/6 md:min-w-[90%] lg:min-w-[1000px] xl:min-w-[850px] rounded-2xl p-3 !pt-0 sm:p-6 max-w-xl z-50 !max-h-[calc(100vh-155px)] ${
                !isLight
                  ? 'border border-panel-gray'
                  : 'border border-forumm-menu-border'
              } overflow-y-auto ${className ?? ''}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: bgColor || theme.backgroundColour,
              }}
            >
              <Box
                className={`sticky top-0 flex w-full items-center py-3 box-border min-h-16`}
                style={{
                  backgroundColor: theme.backgroundColour,
                  zIndex: 1000,
                }}
              >
                <Text
                  className={`text-center text-lg flex-1 font-semibold`}
                  ignoreTheme
                >
                  {title}
                </Text>
                {closeButton && (
                  <button
                    onClick={(e) => {
                      setShow!(false)
                      e.stopPropagation()
                    }}
                    className="absolute right-0"
                  >
                    <IoClose className="w-8 h-8" />
                  </button>
                )}
              </Box>
              <Box className={`w-full`} ignoreTheme>
                {children}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.3,
              }}
              exit={{
                scale: 0,
                opacity: 0,
              }}
              className={`relative flex items-center flex-col top-0 w-full sm:w-3/4 max-w-xl z-50 rounded-xl overflow-y-auto ${
                className ? className : ''
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: theme.backgroundColour,
                maxHeight: `${maxHeight}px`,
              }}
            >
              <Box className={`w-full`} ignoreTheme>
                {children}
              </Box>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    ref.current!
  )
}

export default Modal
