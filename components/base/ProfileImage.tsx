import { useState } from 'react'
import User from '@public/images/User.svg'
import Image from 'next/image'

const ProfileImage = ({
  imageUrl,
  className = '',
  onClick,
  size = 'md',
  activityStatus,
  tooltip,
}: {
  imageUrl?: string | null | undefined
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  onClick?: (e: any) => void
  activityStatus?: boolean | undefined | null
  tooltip?: string[]
}) => {
  const [profileImageError, setProfileImageError] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const handleMouseEnter = () => setShowTooltip(true)
  const handleMouseLeave = () => setShowTooltip(false)

  return (
    <div
      className={`relative flex-shrink-0 ${sizes[size]} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {profileImageError || !imageUrl ? (
        <User
          className={`${sizes[size]} rounded-full  bg-white`}
          onClick={onClick}
        />
      ) : (
        <Image
          src={imageUrl}
          width={32}
          height={32}
          alt="Profile Image"
          className={`${sizes[size]} bg-contain bg-center rounded-full object-cover `}
          onError={() => setProfileImageError(true)}
          onClick={onClick}
        />
      )}
      {/* {activityStatus != null && ( */}
      {/*   <div */}
      {/*     className={`w-2.5 h-2.5 rounded-full -mt-2 -mr-0.5 right-0 absolute ${ */}
      {/*       activityStatus */}
      {/*         ? 'bg-green-600 opacity-90' */}
      {/*         : 'bg-gray-500 opacity-70' */}
      {/*     }`} */}
      {/*   ></div> */}
      {/* )} */}
      {tooltip && showTooltip && (
        <div
          style={{ width: '150px' }}
          className="absolute pt-4 text-center bg-gray-700 text-white rounded-md shadow-lg -top-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2 tooltip-arrow"
        >
          <p className="text-md mb-1 font-bold ml-4 mr-4">{tooltip[0]}</p>
          {tooltip.slice(1).map((row) => (
            <p key={row} className="text-xs mb-1 ml-4 mr-4">
              {row}
            </p>
          ))}
          <p></p>
        </div>
      )}
    </div>
  )
}

export default ProfileImage
