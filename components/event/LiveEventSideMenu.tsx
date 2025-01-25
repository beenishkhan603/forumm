import { useTheme } from '@libs/useTheme'
import Color from 'color'
import React from 'react'
import Video from '@public/images/Video.svg'
import Home from '@public/images/Home.svg'
import Speaker from '@public/images/Speaker.svg'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MdMeetingRoom } from 'react-icons/md'
import { FaDonate, FaRegEdit } from 'react-icons/fa'
import Box from '../base/Box'
import { AiFillHeart, AiFillEdit } from 'react-icons/ai'
import { useAuth } from '@libs/useAuth'

export const LiveEventSideMenu = ({
  donationUrl,
}: {
  donationUrl?: string | null
}) => {
  const { theme } = useTheme()
  const { profile } = useAuth()
  const isAdmin = profile?.groups?.includes('forumm-admin')
  const isOrganizer = profile?.groups?.includes('organizer')
  const {
    foregroundColour,
    textColour,
    foregroundTextColour,
    highlightColour,
  } = theme ?? {
    foregroundColour: '#220634',
    textColour: '#FFFFFF',
    foregroundTextColour: '#FFFFFF',
    highlightColour: '#FFA61C',
  }
  const { pathname, query } = useRouter()

  const menuItems = [
    {
      title: 'Agenda',
      href: 'agenda',
      icon: <Home height={20} width={20} fill={foregroundTextColour} />,
    },
    {
      title: 'Stages',
      href: 'stages',
      icon: <Speaker height={20} width={20} fill={foregroundTextColour} />,
    },
    {
      title: 'Partners',
      href: 'sponsors',
      icon: <AiFillHeart className="w-4 h-4" fill={foregroundTextColour} />,
    },
    {
      title: 'On Demand',
      href: 'on-demand',
      icon: <Video height={20} width={20} fill={foregroundTextColour} />,
    },
    {
      title: 'Breakout Rooms',
      href: 'breakout-rooms',
      icon: <MdMeetingRoom className="w-4 h-4" fill={foregroundTextColour} />,
    },
    {
      title: 'Donate',
      href: `donate/${donationUrl}`,
      icon: <FaDonate className="w-4 h-4" fill={foregroundTextColour} />,
    },
    // {
    //   title: "Calendar",
    //   href: "calendar",
    //   icon: <CalendarIcon height={20} width={20} fill={textColour} />,
    // },
  ]

  if (isAdmin || isOrganizer) {
    menuItems.push({
      title: 'Edit Event',
      href: `/create-event?id=${query.eventId}`,
      icon: <FaRegEdit className="w-4 h-4" fill={foregroundTextColour} />,
    })
  }

  const pathSplit = pathname.split('/')
  const lastPathKey = pathSplit[pathSplit.length - 1]

  const safeIndex = menuItems.findIndex((items) => items.href === lastPathKey)
  const selectedIndex = safeIndex === -1 ? 0 : safeIndex

  return (
    <Box
      className={`w-[104px] pl-[30px] border-r border-forumm-menu-border hidden sm:flex flex-col text-white text-center text-xs overflow-auto scrollbar-hide ${
        isAdmin || isOrganizer ? 'pt-[400px]' : ''
      }`}
      style={{ backgroundColor: foregroundColour, color: textColour }}
    >
      {menuItems.map((item, index) => {
        const isActive = index === selectedIndex
        return (
          <Link
            key={index}
            href={`/event/${query.eventId}/${item.href}`}
            className="flex flex-col justify-center items-center py-2 cursor-pointer"
          >
            {item.icon}
            <Box
              className={`h-[2px] w-6 mt-1`}
              style={{
                backgroundColor: isActive ? textColour : foregroundTextColour,
              }}
            ></Box>
            <Box textColour={'foregroundTextColour'}>{item.title}</Box>
          </Link>
        )
      })}
    </Box>
  )
}
