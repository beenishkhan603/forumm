// @ts-nocheck
import Logo from '@public/images/ForummLogo.svg'
import SupportIcon from '@public/images/SupportIcon.svg'
import CopyIcon from '@public/images/CopyIcon.svg'
import { useAuth } from '@libs/useAuth'
import { DefaultDarkTheme, DefaultLightTheme, useTheme } from '@libs/useTheme'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Button } from '../inputs/Button'
import ForumLogoText from '@public/images/ForumLogoText.svg'
import ProfileImage from '../base/ProfileImage'
import Box from '../base/Box'
import Modal from '@components/base/Modal'
import { FaUserCircle } from 'react-icons/fa'
import {
  MdOutlineLogout,
  MdOutlineSettings,
  MdSettingsAccessibility,
} from 'react-icons/md'
import DarkModeIcon from '@public/images/DarkModeIcon.svg'
import LightModeIcon from '@public/images/LightModeIcon.svg'
import BlankImage from '@public/images/blank.png'
import Text from '@components/base/Text'

interface HeaderProps {
  title?: string
  requireAuth?: boolean
}

const DynamicBox = dynamic(() => import('../base/Box'), {
  ssr: false,
})

/**
 * Header component for the application.
 */
export const Header = ({ title, requireAuth = false }: HeaderProps) => {
  const { profile, signOut, isLogged, isOrganizer, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [showOptions, setShowOptions] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [supportEmailText, setSupportEmailText] = useState('hello@forumm.to')

  const modalRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const showProfile = profile != null

  const { foregroundColour, textColour, foregroundTextColour } = theme ?? {
    foregroundColour: '#181A20',
    textColour: '#FFFFFF',
  }
  const name = profile?.fullName ?? profile?.email?.split('@')[0]
  const page = router.pathname.split('/')[1]
  const iconColor = `text-${theme.foregroundTextColour?.slice(1, 7)}`
  const isDarkTheme = theme.type === 'DARK'

  const supportModal = (
    <Modal
      closeButton={true}
      show={supportModalOpen}
      setShow={(val) => {
        setSupportModalOpen(val)
        setSupportEmailText('hello@forumm.to')
      }}
      title="Support Details"
    >
      <Box className="flex space-x-8">
        <Box className="flex flex-col items-center">
          <Box className="flex mb-2">
            Email us with any questions you may have or issues you encounter
            with the platform.
          </Box>
          <Box className="flex flex-row items-center justify-center">
            <Box className="py-2 flex font-bold text-2xl border p-2 rounded">
              {supportEmailText}
            </Box>
            <Button
              className="border-none"
              title="Copy"
              icon={
                <CopyIcon className="inline h-12 w-12 ml-2 border rounded p-2" />
              }
              type="tertiary"
              size="medium"
              onClick={(e) => {
                navigator.clipboard.writeText('hello@forumm.to')
                setSupportEmailText('Email Copied!🤍')
                e.preventDefault()
              }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  )

  const CustomIcon = () => {
    const { theme } = useTheme()

    return theme.type === 'DARK' ? <DarkModeIcon /> : <LightModeIcon />
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        modalRef.current?.contains(event.target as Node) ||
        buttonRef.current?.contains(event.target as Node)
      ) {
        return
      }
      setShowOptions(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [modalRef])

  return (
    <>
      {supportModal}
      <header>
        <Box
          className={`sticky top-0 left-0 w-full z-[1000] flex px-4 md:px-20 lg:px-[156px] justify-between ${
            isDarkTheme
              ? 'border-b border-panel-gray'
              : 'border-b border-forumm-menu-border'
          } ${
            window.self !== window.top ? 'hidden' : ''
          } items-center h-[65px] sm:h-[75px]`}
          style={{
            color: foregroundTextColour,
            background: isDarkTheme
              ? 'rgba(0, 0, 0, 0.7)'
              : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
        >
          <DynamicBox className="flex items-center">
            <button onClick={() => router.push(isLogged ? '/dashboard' : '/')}>
              <Box className="flex items-center hover:animate-heartbeat">
                <Image
                  src={theme.logoUrl || '/images/ForummLogo.svg'}
                  alt={'Logo'}
                  width={100}
                  height={100}
                  className="hidden md:flex h-14 w-14 rounded-md object-cover mr-2"
                />
                <Box
                  className="flex flex-col"
                  textColour={'foregroundTextColour'}
                >
                  <ForumLogoText
                    className="w-20 h-8 -ml-1"
                    fill={foregroundTextColour}
                  />
                  {(profile?.university || profile?.company) && (
                    <span className="text-xs text-left min-h-[20px]">
                      {profile?.university ?? profile?.company ?? ' '}
                    </span>
                  )}
                </Box>
              </Box>
            </button>
            {page === 'organiser-dashboard' ? (
              ''
            ) : (
              <Box
                className="hidden md:block ml-6 font-medium text-xl"
                textColour={'foregroundTextColour'}
              >
                {title}
              </Box>
            )}
          </DynamicBox>
          <Box
            className="flex space-x-4 items-center cursor-pointer"
            textColour={'foregroundTextColour'}
          >
            <div className="flex items-center space-x-2 md:space-x-6 mr-3 md:mr-6">
              {isLogged && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="hover:text-forumm-blue hover:underline text-xs sm:text-sm md:text-base -ml-4 hover:animate-heartbeat"
                >
                  Events & Donations
                </button>
              )}
              <span className="border-l-2 border-textColour h-8"></span>
            </div>
            {isLogged && isOrganizer ? (
              <div
                className="flex items-center  rounded-full -ml-8 border-2"
                style={{
                  backgroundColor: theme.highlightColour,
                  borderColor: theme.highlightColour,
                }}
              >
                <ProfileImage
                  onClick={() => setShowOptions(!showOptions)}
                  imageUrl={profile?.profileImageUrl || BlankImage}
                  className="rounded-full border-2 border-forumm-blue h-[44px] w-[44px]"
                />
              </div>
            ) : (
              isLogged &&
              !isOrganizer && (
                <div className="flex items-center rounded-full">
                  <ProfileImage
                    onClick={() => setShowOptions(!showOptions)}
                    imageUrl={profile?.profileImageUrl || BlankImage}
                    className="rounded-full border-2 border-forumm-blue h-[44px] w-[44px]"
                  />
                </div>
              )
            )}
            {!isLogged && !showProfile && (
              <div className="flex items-center space-x-6 mr-6 ">
                <button
                  onClick={() => router.push('/login?previous=true')}
                  className="text-forumm-blue -ml-4 hover:text-forumm-blue hover:underline hover:animate-heartbeat text-xs sm:text-sm md:text-base"
                >
                  Log in
                </button>
                <button
                  onClick={() => router.push('/create-account')}
                  className="text-forumm-blue hover:text-forumm-blue hover:underline hover:animate-heartbeat text-xs sm:text-sm md:text-base"
                >
                  Sign Up
                </button>
              </div>
            )}
            {/*<DynamicBox className="hidden md:flex cursor-pointer  items-center">
              <Box
                onClick={() => {
                  setTheme({
                    ...theme,
                    ...(theme.type === 'LIGHT'
                      ? DefaultDarkTheme
                      : DefaultLightTheme),
                  })
                }}
              >
                <CustomIcon />
              </Box>
              </DynamicBox>*/}
          </Box>
        </Box>
        {showProfile && (
          <Box
            innerRef={modalRef}
            className={` w-64 absolute px-6 right-0 mr-7 flex flex-col space-y-2 text-lg transition-all ${
              showOptions ? 'py-6' : 'h-0 overflow-hidden'
            } -mt-[1px] rounded-xl border-t-0 rounded-tl-none rounded-tr-none shadow-md`}
            color="foregroundColour"
            style={{
              zIndex: 999999,
              backgroundColor: theme.foregroundColour,
              border: `0px solid ${theme.borderColour}`,
            }}
          >
            <Box
              onClick={() => router.push('/settings')}
              className="cursor-pointer flex items-center textColour text-base leading-none"
            >
              <FaUserCircle
                className="inline w-5 h-5 mr-2"
                fill={theme.textColour}
              />

              <Text>User Profile</Text>
            </Box>

            <Box
              show={isOrganizer || isAdmin}
              onClick={() => router.push('/organisation-settings')}
              className="cursor-pointer flex items-center textColour text-base pt-1 leading-none"
            >
              <MdOutlineSettings
                className="inline w-5 h-5 mr-2"
                fill={theme.textColour}
              />
              <Text>Organisation Settings</Text>
            </Box>
            <Box
              show={isAdmin}
              onClick={() => router.push('/admin')}
              className="cursor-pointer flex items-center textColour text-base pt-1 leading-none"
            >
              <MdSettingsAccessibility
                className="inline w-5 h-5 mr-2"
                fill={theme.textColour}
              />
              <Text>Admin Sorcery</Text>
            </Box>
            <Box
              onClick={(e) => {
                setSupportModalOpen(true)
                e.preventDefault()
              }}
              className="cursor-pointer flex items-center textColour text-base pt-1 leading-none"
            >
              <SupportIcon className={`inline w-5 h-5 mr-2 ${iconColor}`} />

              <Text>Support</Text>
            </Box>
            <Box
              onClick={signOut}
              className="cursor-pointer flex items-center textColour pt-1 text-base leading-none"
            >
              <MdOutlineLogout
                className="inline w-5 h-5 mr-2"
                fill={theme.textColour}
              />
              <Text>Logout</Text>
            </Box>
          </Box>
        )}
      </header>
    </>
  )
}
