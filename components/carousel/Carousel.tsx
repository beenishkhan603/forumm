import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import VideoModal from './VideoModal'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import Box from '@components/base/Box'
import RichTextDisplay from '@components/base/RichTextDisplay'
import { MediaThumbnail } from '@components/ui/MediaThumbnail'
import { getMediaType } from '@libs/Utility/parsers'
import { StaticImageData } from 'next/image'
import useTimers from '@libs/Utility/useTimers'

interface CarouselItem {
  url: string | StaticImageData
  title: string
  description: string
  onClick?: (data: any) => void
  isImage?: boolean
}

interface CarouselProps {
  items: CarouselItem[]
  fixedHeight?: boolean
  width?: string
  show?: boolean
  className?: string
  slideshow?: boolean
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  fixedHeight = true,
  show = true,
  className = 'relative',
  width,
  slideshow = false,
}: CarouselProps) => {
  const timer = useRef<NodeJS.Timer>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMediaUrl, setCurrentMediaUrl] = useState('')
  const [currIndex, setCurrIndex] = useState(0)
  const [isImage, setIsImage] = useState(false)
  const [content, setContent] = useState<CarouselItem[]>([])

  useEffect(() => {
    const parseMedia = async () => {
      const payload = await Promise.all(
        items.map(async (item) => {
          return {
            ...item,
            isImage: (await getMediaType(item.url)) === 'IMAGE',
          }
        })
      )
      setContent(payload)
    }
    parseMedia()
  }, [items])

  const handleMediaClick = async (media: string | StaticImageData) => {
    const url = typeof media === 'string' ? media : media.src
    const isImage = (await getMediaType(url)) === 'IMAGE'
    setIsImage(isImage)
    setCurrentMediaUrl(url)
    setIsModalOpen(true)
  }

  const prevSlide = () => {
    pauseSlideshow()
    setCurrIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    )
  }

  const nextSlide = (opt: { pause: boolean } = { pause: true }) => {
    if (opt.pause) pauseSlideshow()
    setCurrIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    )
  }

  const clearLoop = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = undefined
    }
  }

  const pauseSlideshow = () => {
    if (!slideshow) return
    clearLoop()
    setTimeout(() => {
      const loop = setInterval(() => {
        nextSlide({ pause: false })
      }, 4000)
      timer.current = loop
    }, 8000)
  }

  useEffect(() => {
    if (slideshow) {
      const loop = setInterval(() => {
        if (!slideshow) return
        nextSlide({ pause: false })
      }, 4000)

      clearLoop()
      timer.current = loop
    }

    return () => clearLoop()
  }, [])

  // useEffect(() => {
  //   if (timer.current) clearInterval(timer.current)
  //   return () => clearInterval(timer.current)
  // }, [])

  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ele = carouselRef.current
    let isPressing = false
    let startX: number

    const dragStart = (e: MouseEvent | TouchEvent) => {
      document.onmousemove = dragMove
      document.ontouchmove = dragMove
      document.onmouseup = dragEnd
      document.ontouchend = dragEnd
      document.ontouchcancel = dragEnd
      isPressing = true
      if (e.type === 'touchstart') {
        startX = (e as TouchEvent).touches[0].pageX
      } else if (e.type === 'mousedown') {
        startX = (e as MouseEvent).pageX
      }
    }
    const dragMove = (e: MouseEvent | TouchEvent) => {
      if (isPressing) {
        dragEnd()
        let currentX = startX
        if (e.type === 'touchmove') {
          currentX = (e as TouchEvent).touches[0].pageX
        } else if (e.type === 'mousemove') {
          currentX = (e as MouseEvent).pageX
        }
        if (currentX < startX) nextSlide()
        if (currentX > startX) prevSlide()
      }
    }
    const dragEnd = () => {
      document.onmousemove = null
      document.onmouseup = null
      document.ontouchmove = null
      document.ontouchend = null
      document.ontouchcancel = null
      isPressing = false
    }

    if (ele) {
      ele.addEventListener('touchstart', dragStart)
      ele.addEventListener('mousedown', dragStart)
    }
    return () => {
      if (ele) {
        ele.removeEventListener('touchstart', dragStart)
        ele.removeEventListener('mousedown', dragStart)
      }
    }
  }, [carouselRef.current])

  if (!show) return <></>

  const prevIndex = currIndex - 1 < 0 ? items.length - 1 : currIndex - 1

  const nextIndex = currIndex + 1 > items.length - 1 ? 0 : currIndex + 1

  const targetIndexes = [prevIndex, currIndex, nextIndex]

  return (
    <div ref={carouselRef} className={`${className} h-full relative`}>
      <VideoModal
        isOpen={isModalOpen}
        videoUrl={currentMediaUrl}
        onClose={() => setIsModalOpen(false)}
        isImage={isImage}
      />
      <div className="flex h-full w-full justify-center items-center relative max-w-[900px] mx-auto lg:max-h-[300px]">
        <div className="flex w-full h-[60em] max-w-[900px] md:h-[30em] transition-transform ease-out duration-500 relative justify-center items-center">
          {content.map((item, index) => {
            const isImage = item.isImage
            const isTarget = targetIndexes.includes(index)

            return (
              <div
                key={index}
                className={`flex-none absolute ${
                  fixedHeight
                    ? 'size-[35em] md:h-[28em] md:w-[28em] lg:max-w-[200px] lg:max-h-[200px]'
                    : `h-auto w-[${width}]`
                } cursor-pointer ${index}`}
                style={{
                  opacity:
                    items.length < 3 && index !== currIndex
                      ? '0'
                      : isTarget
                        ? '1'
                        : '0',
                  position: 'absolute',
                  transform: `perspective(75em) translateX(${
                    items.length < 3
                      ? '0%'
                      : index == prevIndex
                        ? '-100%'
                        : index == nextIndex
                          ? '100%'
                          : '0%'
                  }) rotateY(${
                    items.length < 3
                      ? '0deg'
                      : prevIndex === index
                        ? '-40deg'
                        : nextIndex === index
                          ? '40deg'
                          : isTarget
                            ? '0deg'
                            : index < currIndex
                              ? '-90deg'
                              : '90deg'
                  }) scale(${index === currIndex ? '1' : '0.7'})`,
                  transition: `transform 500ms ease-in-out, opacity 200ms linear ${
                    isTarget ? '300ms' : '0ms'
                  }`,
                  zIndex: isTarget ? (index === currIndex ? '19' : '15') : '10',
                }}
              >
                <div
                  className="w-full h-full flex items-center justify-center relative"
                  onClick={() => {
                    item.onClick
                      ? item.onClick(item)
                      : handleMediaClick(item.url || '')
                  }}
                >
                  <MediaThumbnail
                    key={item.title.trim().replaceAll(' ', '_').toLowerCase()}
                    media={item.url}
                    alt={item.title}
                    size="any"
                    className={`h-full ${
                      width ? 'w-full' : 'w-auto'
                    } bg-none rounded-2xl`}
                  />
                  <span
                    className={`${
                      isImage && 'hidden'
                    } absolute text-white text-6xl`}
                  >
                    ▶
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        {items.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-[50%] left-0 p-2 rounded-full bg-white text-gray-800 hover:bg-gray-200 z-[20]"
              style={{ transform: 'translateY(-50%)' }}
            >
              <IoIosArrowBack className="text-xl" />
            </button>
            <button
              onClick={() => nextSlide()}
              className="absolute top-[50%] right-0 p-2 rounded-full bg-white text-gray-800 hover:bg-gray-200 z-[20]"
              style={{ transform: 'translateY(-50%)' }}
            >
              <IoIosArrowForward className="text-xl" />
            </button>
          </>
        )}
      </div>
      {items.length > 0 && (
        <Box className="flex flex-col w-full px-6 sm:px-10 md:px-12 lg:px-16 mt-10 mx-auto text-center ml-4 mr-4 md:ml-0 md:mr-0">
          <Box className="text-2xl font-medium w-full">
            {items[currIndex]?.title}
          </Box>
          <Box
            className="text-sm mt-3 font-small w-full max-w-[900px] mx-auto text-center h-[200px] md:h-[50px] lg:h-[0px]"
            style={{ whiteSpace: 'pre-line' }}
          >
            <RichTextDisplay descriptionJson={items[currIndex]?.description} />
          </Box>
        </Box>
      )}
    </div>
  )
}

export default Carousel
