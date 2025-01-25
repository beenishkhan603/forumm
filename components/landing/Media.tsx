import moment from 'moment'
import Speaker from '@public/images/Speaker.svg'
import Box from '@components/base/Box'
import Text from '@components/base/Text'
import Image from 'next/image'
import DonationPercentage from '@public/percentage-placeholder.png'
import { useTheme } from '@libs/useTheme'
import { useEffect, useState } from 'react'
import DefaultThumbnail from '@public/images/default-thumbnail.png'
import { useRouter } from 'next/router'
import CalendarIcon from '@public/images/CalendarIcon.svg'
import Edit from '@public/images/Edit.svg'
import currencies from '@libs/currencies'
import { getContrastColor, openInNewTab } from '@libs/Utility/util'
import { MediaThumbnail } from '@components/ui/MediaThumbnail'
import {
  getMediaType,
  isValidUrl,
  isVimeoUrl,
  isYoutubeUrl,
} from '@libs/Utility/parsers'

export interface MediaProps {
  url?: string
  image?: string
  title?: string
  subtitle?: string
  description?: string
  isDonation?: boolean
  type?:
  | 'LANDING'
  | 'ONLINE'
  | 'FUNDRAISER'
  | 'IN_PERSON'
  | 'PARTNER'
  | 'CONTENT'
  organization?: string
  banner?: string
  startTime?: any
  endTime?: any
  eventId?: string
  canEdit?: boolean
  isSpeaker?: boolean
  isPublished?: boolean
  size?: 'normal' | 'large'
  attendees?: number | null
  donors?: number
  goal?: number
  raised?: number
  currency?: string
  className?: string
}

function MediaCard({
  className,
  url,
  image,
  title,
  subtitle,
  description,
  isDonation,
  type = 'LANDING',
  organization,
  banner,
  startTime,
  endTime,
  eventId,
  canEdit,
  isSpeaker = false,
  size,
  attendees,
  donors,
  isPublished,
  goal,
  raised,
  currency,
}: MediaProps) {
  const router = useRouter()
  const { theme } = useTheme()

  const contrastColor = getContrastColor(theme.highlightColour)

  const { push } = useRouter()
  const [bgColor, setBgColor] = useState(theme.foregroundColour)
  const [percentage, setPercentage] = useState(0)
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO' | undefined>(
    undefined
  )

  const isDarkTheme = theme.type === 'DARK'
  const textColorClass = 'text-forumm-text-deep-teal-blue'

  useEffect(() => {
    if (image) {
      getMediaType(image).then((type) => setMediaType(type))
    }
  }, [image])

  useEffect(() => {
    if (raised && goal) {
      setPercentage(Math.min((raised / goal) * 100, 100))
    }
  }, [goal, percentage, raised])

  useEffect(() => {
    if (theme.type === 'DARK') {
      setBgColor(theme.mediaBackgroundColor)
    } else {
      setBgColor(theme.foregroundColour)
    }
  }, [theme.foregroundColour, theme.mediaBackgroundColor, theme.type])

  const handleNavigation = () => {
    if (!url) return
    if (isValidUrl(url)) openInNewTab(url)
    else router.push(url)
  }

  const handleEdit = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    router.push(`/create-event?id=${eventId}`)
  }

  return (
    <Box
      onClick={handleNavigation}
      className={`relative w-[90%] max-w-[1600px] sm:w-[28%] my-6 mx-[22px] cursor-pointer pb-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out rounded-3xl ${className}`}
      style={{
        backgroundColor: bgColor,
      }}
    > 
      <Box className="relative w-full aspect-square rounded-t-md overflow-hidden">
        {mediaType === 'VIDEO' ? (
          <MediaThumbnail
            className="absolute inset-0 w-full h-full"
            key=""
            media={image}
          />
        ) : (
          <Box
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${(image as string) || DefaultThumbnail.src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: theme.backgroundColour,
            }}
          />
        )}
      </Box>

      {/* Minimalistic line break after image */}
      <hr className="border-t border-none my-3 mx-4" />

      {/* Text/Info Container */}
      <Box className="px-4 flex flex-col">

        {/* Organization Row (banner + name) */}
        <Box className="flex items-center mb-2">
          <MediaThumbnail
            className="h-7 w-7 object-cover rounded-full mr-2"
            key=""
            media={banner}
          />
          <span className={`text-sm font-medium truncate ${textColorClass}`}>
            {organization}
          </span>
        </Box>

        {/* Title */}
        <Text className="text-sm font-semibold mb-1 line-clamp-2">
          {title}
        </Text>

        {/* Subtitle */}
        {subtitle && (
          <Text className="text-xs text-gray-600 mb-2 line-clamp-2">
            {subtitle}
          </Text>
        )}

        {/* Description */}
        <Text className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-5">
          {description || ''}
        </Text>

        {/* Minimalistic line break before extra info */}
        <hr className="border-t border-gray-200 mb-3" />

        {/* For non-LANDING, non-FUNDRAISER, non-CONTENT, non-PARTNER */}
        {type !== 'LANDING' &&
          type !== 'FUNDRAISER' &&
          type !== 'CONTENT' &&
          type !== 'PARTNER' && (
            <p className={`text-xs mb-3 ${textColorClass}`}>
              <b>{attendees}</b> Participants
            </p>
          )}

        {/* For FUNDRAISER only */}
        {type === 'FUNDRAISER' && (
          <p className={`text-xs mb-3 ${textColorClass}`}>
            <b>{donors}</b> Donors
          </p>
        )}

        {/* Calendar Info (for events) */}
        {type !== 'LANDING' &&
          type !== 'FUNDRAISER' &&
          type !== 'CONTENT' &&
          type !== 'PARTNER' && (
            <Box className="text-xs flex items-center text-gray-400 mb-3">
              <CalendarIcon className="w-4 h-4 mr-2" fill={theme?.textColour} />
              <span>
                {moment(startTime).format('MMM DD, h:mmA')} -{' '}
                {moment(endTime).format('MMM DD, h:mmA')}
              </span>
            </Box>
          )}

        {/* Fundraiser Progress Bar */}
        {type === 'FUNDRAISER' && (
          <Box
            style={{
              opacity: goal || raised ? 1 : 0,
            }}
          >
            <Box className="flex justify-between text-xs mb-1">
              <span className={textColorClass}>
                <b>
                  {`${currencies[currency ?? 'GBP'].symbol}${!!raised && raised % 1 === 0 ? raised : raised?.toFixed(2)
                    }`}
                </b>{' '}
                Raised
              </span>
              <span className={textColorClass}>
                <b>
                  {`${currencies[currency ?? 'GBP'].symbol}${goal}`}
                </b>
              </span>
            </Box>
            <Box className="w-full bg-gray-200 rounded-full h-2">
              <Box
                className="h-2 rounded-full bg-forumm-blue-light"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              />
            </Box>
          </Box>
        )}

        {/* Donation info (if isDonation = true) */}
        {isDonation && (
          <Box className="flex items-center mt-3 gap-6">
            <Image
              src={DonationPercentage}
              alt="Donation Percentage"
              width={76}
              height={76}
            />
            <Box className="flex-col opacity-0">
              <Text>€20,000</Text>
              <Text>Raised by 190 supporters</Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* Minimalistic line break before footer buttons */}
      <hr className="border-t border-gray-200 my-3 mx-4" />

      {/* Footer Buttons */}
      <Box className="relative px-4 flex justify-between items-center pb-2">
        {/* Published/Draft Badge */}
        <Box
          show={!!canEdit}
          className={`px-3 py-1 rounded-full text-xs shadow-sm ${isPublished ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'
            }`}
        >
          <span>{isPublished ? 'Published' : 'Draft'}</span>
        </Box>

        {/* Speaker Badge */}
        <Box
          show={isSpeaker}
          className="px-3 py-1 rounded-full text-xs shadow-sm text-white flex items-center"
          style={{
            backgroundColor: theme.highlightColour,
          }}
        >
          <Speaker className="h-4 w-4 mr-1" />
          <span style={{ color: contrastColor }}>Speaker</span>
        </Box>

        {/* View Button (for PARTNER or CONTENT) */}
        <Box
          show={!!type && ['PARTNER', 'CONTENT'].includes(type)}
          onClick={handleNavigation}
          className="px-3 py-1 ml-auto rounded-full text-xs shadow-sm cursor-pointer flex items-center hover:bg-opacity-90"
          style={{
            backgroundColor: theme.highlightColour,
          }}
        >
          <span style={{ color: contrastColor }}>View</span>
        </Box>

        {/* Edit Button (if canEdit = true) */}
        <Box
          show={!!canEdit}
          onClick={handleEdit}
          className="px-3 py-1 rounded-full text-xs shadow-sm cursor-pointer flex items-center hover:bg-opacity-90"
          style={{
            backgroundColor: theme.highlightColour,
          }}
        >
          <Edit className="h-4 w-4 mr-1" />
          <span style={{ color: contrastColor }}>Edit</span>
        </Box>
      </Box>
    </Box>


  )
}

export default MediaCard
