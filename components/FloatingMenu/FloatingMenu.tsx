import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@libs/useAuth'

import { IoIosArrowForward } from 'react-icons/io'
import Link from 'next/link'
import {
  MdOutlineDashboard,
  MdOutlineEvent,
  MdOutlineSettings,
  MdMeetingRoom,
  MdDvr,
  MdPeople,
  MdMonetizationOn,
  MdStarBorder,
  MdVideocam,
  MdAssessment,
  MdHelp,
} from 'react-icons/md'
import Image from 'next/image'
import { darken, isReadable, useTheme } from '@libs/useTheme'
import Box from '@components/base/Box'
import { Event } from '@graphql/__generated/graphql'
import { useEvent } from '@libs/useEvent'
import { getContrastColor } from '@libs/Utility/util'
import { FaUserCircle } from 'react-icons/fa'

interface MenuItemOptions<T> {
  path: string
  icon: JSX.Element
  label: string
  disabled?: boolean
  show?: (e: T) => boolean
  onClick?: (e?: any) => void
}

interface TawkAPI {
  showWidget: () => void
  maximize: () => void
}
declare var Tawk_API: TawkAPI | undefined

const FloatingMenu: React.FC = () => {
  const { theme, StaticColours } = useTheme()
  const { profile, isAdmin } = useAuth()
  const { event } = useEvent()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const isLinkActive = (path: string) => router.pathname === path
  const iconColor = getContrastColor(theme.backgroundColour)
  const contrastColor = isReadable(
    StaticColours.forumm_light_blue!,
    theme.backgroundColour!
  )
    ? StaticColours.forumm_light_blue
    : isReadable(StaticColours.forumm_blue, theme.backgroundColour!)
    ? StaticColours.forumm_blue
    : darken(StaticColours.forumm_blue, 25)

  const organiserOptions: MenuItemOptions<any>[] = [
    {
      path: '/create-event',
      icon: (
        <MdOutlineEvent
          className="w-6 h-6"
          style={{
            color: !isAdmin
              ? '#cccccc'
              : isLinkActive('/create-event')
              ? contrastColor
              : '',
          }}
        />
      ),
      label: 'Create Event',
      show: (e?: any) => !e?.eventId,
      disabled: !isAdmin,
    },
    {
      path: '/metrics',
      icon: (
        <MdAssessment
          className="w-6 h-6"
          style={{ color: isLinkActive('/metrics') ? contrastColor : '' }}
        />
      ),
      label: 'Metrics',
    },
    // {
    //   path: '/organisation-settings',
    //   icon: (
    //     <MdOutlineSettings
    //       className="w-6 h-6"
    //       style={{
    //         color: isLinkActive('/organisation-settings') ? contrastColor : '',
    //       }}
    //     />
    //   ),
    //   label: 'Organisation Settings',
    // },
  ]

  const eventOptions: MenuItemOptions<Partial<Event>>[] = [
    {
      path: '/event/[eventId]/agenda',
      icon: (
        <MdDvr
          className="w-6 h-6"
          style={{
            color: isLinkActive('/event/[eventId]/agenda') ? contrastColor : '',
          }}
        />
      ),
      label: 'Agenda',
    },
    {
      path: '/event/[eventId]/sponsors',
      icon: (
        <MdStarBorder
          className="w-6 h-6"
          style={{
            color: isLinkActive('/event/[eventId]/sponsors')
              ? contrastColor
              : '',
          }}
        />
      ),
      label: 'Partners',
      show: (e) => !!e?.sponsors && e?.sponsors?.length > 0,
    },
    {
      path: '/event/[eventId]/on-demand',
      icon: (
        <MdVideocam
          className="w-6 h-6"
          style={{
            color: isLinkActive('/event/[eventId]/on-demand')
              ? contrastColor
              : '',
          }}
        />
      ),
      label: 'On Demand',
      show: (e) => !!e?.ondemandContent && e?.ondemandContent?.length > 0,
    },
    {
      path: '/event/[eventId]/breakout-rooms',
      icon: (
        <MdMeetingRoom
          className="w-6 h-6"
          style={{
            color: isLinkActive('/event/[eventId]/breakout-rooms')
              ? contrastColor
              : '',
          }}
        />
      ),
      label: 'Breakout Rooms',
      show: (e) => !!e?.breakoutRooms && e?.breakoutRooms?.length > 0,
    },
    {
      path: '/event/[eventId]/donate',
      icon: (
        <MdMonetizationOn
          className="w-6 h-6"
          style={{
            color: isLinkActive('/event/[eventId]/donate') ? contrastColor : '',
          }}
        />
      ),
      label: 'Donate',
      show: (e) => !!e?.fundraising?.goal && e?.fundraising?.goal > 0,
    },
  ]

  const settingOptions: MenuItemOptions<any>[] = [
    // {
    //   path: '/settings',
    //   icon: (
    //     <FaUserCircle
    //       className="w-6 h-6"
    //       style={{
    //         color: isLinkActive('/settings') ? contrastColor : '',
    //       }}
    //     />
    //   ),
    //   label: 'User Settings',
    // },
    {
      path: '#',
      icon: (
        <MdHelp
          className="w-6 h-6"
          style={{
            color: isLinkActive('#') ? contrastColor : '',
          }}
        />
      ),
      onClick: () => {
        if (Tawk_API) {
          Tawk_API?.showWidget()
          Tawk_API?.maximize()
        }
      },
      label: 'Help',
    },
  ]

  const { foregroundColour, textColour, foregroundTextColour } = theme ?? {
    foregroundColour: '#ffffff',
    textColour: '#FFFFFF',
  }

  const isOrganizer = profile?.groups?.includes('organizer')

  const isDarkTheme = theme.type === 'DARK'

  const eventId = router.query.eventId

  // ${
  //           isLinkActive(option.path)
  //             ? 'text-white bg-forumm-selected-menu-blue rounded-xl'
  //             : 'text-midnight-sky bg-transparent hover:bg-gray-200'
  //         }

  const renderOption = (
    option: MenuItemOptions<any> & { theme?: string },
    isOpen: boolean,
    isLinkActive: { (path: string): boolean; (arg0: string): any },
    foregroundTextColour: string | undefined,
    eventId?: string | string[]
  ) => {
    option.path = (option.path || '').replace(/\/\[eventId\]\//, `/${eventId}/`)

    return (
      <Link
        key={option.label}
        className={`flex overflow-hidden items-center justify-start h-8 md:h-11 px-[10px] ml-[5px] md:ml-[9px] mr-3 cursor-pointer hover:rounded-xl rounded-xl ${
          isOpen ? 'w-full' : 'w-8 ml-[8px] pl-1 md:w-11 md:pl-[10px]'
        } ${option.theme ?? ''}-THEME`}
        onClick={(e) => {
          e.stopPropagation()
          if (option.onClick) {
            option.onClick()
          } else {
            const target = e.currentTarget
            target.style.cursor = 'wait'
            setTimeout(() => {
              target.style.cursor = 'pointer'
            }, 1000)
          }
        }}
        href={option.path}
        style={{
          color: isLinkActive(option.path) ? '!white' : foregroundTextColour,
          pointerEvents: option.disabled ? 'none' : 'auto',
        }}
      >
        <Box className="relative group">
          <Box className={`hover:animate-jello-vertical`}>{option.icon}</Box>
          <span className="absolute left-0 bottom-full mb-1 hidden w-[90px] p-2 text-xs text-white bg-black opacity-82 rounded-xl shadow-lg group-hover:block">
            {option.label}
          </span>
        </Box>
        <span
          className={`ml-4 textColour text-base transition-opacity w-[200px] duration-300 select-none ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Box
            className={`hover:animate-jello-vertical `}
            style={{ color: isLinkActive(option.path) ? contrastColor : '' }}
          >
            {option.label}
          </Box>
        </span>
      </Link>
    )
  }

  return (
    <Box
      className={`absolute z-9998 top-20 md:top-[113px] mt-[4px] -left-[14px] ml-[16px] md:ml-[23px] bg-forumm-menu-light-blue
         z-[999] transition-all duration-300 pb-4 ${
           isDarkTheme
             ? 'border border-panel-gray'
             : 'border border-forumm-menu-border'
         } ${isOpen ? 'w-56' : 'w-11 md:w-16'} h-fix rounded-2xl shadow-md`}
      style={{
        background: isDarkTheme
          ? 'rgba(0, 0, 0, 0.6)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <Box className="flex items-center w-full mt-4 relative border-forumm-menu-border">
        {/* eslint-disable-next-line */}
        <Box
          className={`hover:animate-jello-vertical flex items-center justify-center mt-4 mb-3 duration-300 w-full`}
          onClick={() => router.push('/dashboard')}
        >
          {/* {!profile || !profile.profileImageUrl ? (
            <User className="w-12 h-12 fill-current bg-white" />
          ) : ( */}
          <Image
            src={theme.logoUrl || '/images/ForummLogo.svg'}
            alt={'Logo'}
            width={12}
            height={12}
            className="flex h-12 w-12 md:h-14 md:w-14 rounded-md object-cover"
          />
          {/* )} */}
        </Box>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute flex justify-end items-center p-1 bg-forumm-menu-light-blue rounded transition-all duration-300 ${
            isDarkTheme ? '' : 'border border-forumm-menu-border'
          } ${
            isOpen ? 'right-[1px] translate-x-1/2' : '-right-[10px]'
          } top-1 shadow-md`}
          style={{
            background: isDarkTheme
              ? 'rgba(0, 0, 0, 1)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
        >
          <IoIosArrowForward
            className={`transform transition-transform duration-300 z-10 text-xs text-midnight-sky ${
              isOpen ? 'rotate-180' : ''
            }`}
            style={{
              color: foregroundTextColour,
            }}
          />
        </button>
      </Box>
      {isOrganizer &&
        organiserOptions
          ?.reduce(
            (acc: MenuItemOptions<Partial<Event>>[], val) =>
              !event
                ? [...acc, val]
                : val.show === undefined
                ? [...acc, val]
                : val.show(event)
                ? [...acc, val]
                : acc,
            []
          )
          .map((option) =>
            renderOption(
              { ...option, theme: theme.type, disabled: option?.disabled },
              isOpen,
              isLinkActive,
              foregroundTextColour
            )
          )}
      {eventId && event && (
        <Box className="mx-4 my-2 h-[1px] bg-forumm-menu-border" />
      )}
      {eventId &&
        event &&
        eventOptions
          ?.reduce(
            (acc: MenuItemOptions<Partial<Event>>[], val) =>
              !event
                ? [...acc, val]
                : val.show === undefined
                ? [...acc, val]
                : val.show(event)
                ? [...acc, val]
                : acc,
            []
          )
          .map((option) =>
            renderOption(
              { ...option, theme: theme.type },
              isOpen,
              isLinkActive,
              foregroundTextColour,
              eventId
            )
          )}
      <Box className="mx-4 my-2 h-[1px] bg-forumm-menu-border" />
      {settingOptions?.map((option) =>
        renderOption(
          { ...option, theme: theme.type },
          isOpen,
          isLinkActive,
          foregroundTextColour
        )
      )}
    </Box>
  )
}

export default FloatingMenu
