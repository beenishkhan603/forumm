import { useEffect, useState } from 'react'

const useWindowSize = () => {
  const hasWindow = typeof window !== 'undefined'
  const [width, setWidth] = useState(hasWindow ? window.innerWidth : null)
  const [height, setHeight] = useState(hasWindow ? window.innerHeight : null)
  const updateDimensions = () => {
    setWidth(hasWindow ? window.innerWidth : null)
    setHeight(hasWindow ? window.innerHeight : null)
  }
  useEffect(() => {
    if (!hasWindow) return
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return { width, height }
}
export default useWindowSize
