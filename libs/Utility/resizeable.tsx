import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import React from 'react'
import { useState } from 'react'
import { MdDragHandle } from 'react-icons/md'
import { ReactElement } from 'react-markdown/lib/react-markdown'

interface ResizeableProps {
  children: JSX.Element
  initalSize?: {
    width?: number
    height?: number
  }
  // targetRef: RefObject<T>
}

interface ElementSize {
  width: number
  height: number
}

// interface ResizeablePayload {
//   handler: JSX.Element
//   element: JSX.Element
// }

const Resizeable = ({ children, initalSize }: ResizeableProps) => {
  const getInitialSize = () => {
    return { width: 0, height: 0, ...initalSize }
  }

  const [size, setSize] = useState<ElementSize>(getInitialSize())

  const onMouseDown = (e: React.MouseEvent) => {
    const startSize = size
    const startPosition = { x: e.pageX, y: e.pageY }
    const onMouseMove = (evt: MouseEvent) => {
      setSize((state) => ({
        ...state,
        height: startSize.height - startPosition.y + evt.pageY,
      }))
    }

    const onMouseUp = () => {
      console.log('Mouse Up')
      document.body.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseup', onMouseUp)
    }

    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', onMouseUp)
  }

  const resizeHandle = (
    <span className={`absolute bottom-0 w-full`} onMouseDown={onMouseDown}>
      <MdDragHandle style={{ cursor: 'row-resize' }} className="mx-auto" />
    </span>
  )

  const payload = (
    <Box className="relative" style={{ height: `${size.height}px` }}>
      {children}
      {resizeHandle}
    </Box>
  )
  return payload
}

export default Resizeable
