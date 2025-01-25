import { isYoutubeUrl } from '@libs/Utility/parsers'

interface MediaItem {
  url: string
  title?: string
  description?: string
}

interface CarouselItem {
  url: string
  title: string
  description: string
  videoUrl?: string
}

interface PrepareCarouselArgs {
  media: MediaItem[]
  options?: {
    coverImage?: string | null
    title?: string | null
    description?: string | null
  }
}

const defaultOptions = {
  coverImage:
    'https://assets.tumblr.com/images/default_header/optica_pattern_11.png',
  title: 'Foundraising Title',
  description:
    'The program of inspirational talks stands out at our event. Experts share innovative visions about the future. In addition, interactive workshops offer practical skills to apply in real life.',
}

export const prepareCarouselItems = ({
  media,
  options,
}: PrepareCarouselArgs): CarouselItem[] => {
  if (!options) options = defaultOptions
  if (!options.coverImage) options.coverImage = defaultOptions.coverImage
  if (!options.title) options.title = defaultOptions.title
  if (!options.description) options.description = defaultOptions.description

  const { coverImage, title, description } = options

  if (media.length === 0) return []

  return media.map((item) => {
    return {
      url: item.url,
      title: item.title ?? '',
      description: item.description ?? '',
    }
  })
}
