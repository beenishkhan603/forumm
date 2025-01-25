import User from '@public/images/User.svg'
import { Button } from '@components/inputs/Button'
import { useAuth } from '@libs/useAuth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Box from '@components/base/Box'
import LoadingBar from '@components/base/LoadingBar'
import EditProfileForm from '@components/authforms/EditProfileForm'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { useTheme } from '@libs/useTheme'
import {
  FaUser,
  FaEnvelope,
  FaUniversity,
  FaUserTag,
  FaEdit,
  FaLock,
  FaEyeSlash,
  FaEye,
} from 'react-icons/fa'

export default function UserDetailsPage() {
  const [showEditProfileModal, setShowEditProfileModal] =
    useState<boolean>(false)
  const { profile, setAttributes, changeAccess, getPermission } = useAuth()
  const router = useRouter()
  const profileImage = profile?.profileImageUrl
  const isOrganizer = profile?.groups?.includes('organizer')
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>()
  const { theme } = useTheme()

  useEffect(() => {
    if (profile)
      setSelectedOrganisation(profile.university ?? profile.company ?? 'FORUMM')
  }, [profile])

  const handleOrgChange = (e: string) => {
    setSelectedOrganisation(e)
    changeAccess(e)
  }

  const perms = getPermission('USER::ACCESS_ORGANISATION::*').sort((a, b) =>
    a > b ? 1 : a === b ? 0 : -1
  )

  if (!profile) return <LoadingBar />

  return (
    <>
      <EditProfileForm
        modal={showEditProfileModal}
        setModal={setShowEditProfileModal}
      />
      <div className="flex items-center justify-center min-h-screen font-sans bg-gray-100">
        {/* Outer Card */}
        <div className="rounded-xl shadow-xl bg-white p-10 w-full max-w-6xl">
          <div className="">
            {' '}
            {/* Adjusted grid template columns */}
            {/* Left Column */}
            <div className="flex flex-col items-center bg-gray-50 p-8 rounded-lg shadow-sm">
              {/* Profile Picture Box */}
              <div className="w-40 h-40 rounded-full flex items-center justify-center shadow-md">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile Image"
                    className="w-full h-full rounded-full object-cover"
                    style={{
                      borderColor: theme.highlightColour,
                    }}
                  />
                ) : (
                  <User className="w-full h-full bg-forumm-blue rounded-full" />
                )}
              </div>
              {/* Buttons Box */}
              <div className="mt-8 flex space-x-4">
                <button
                  className="flex items-center rounded-full px-3 py-1.5 text-xs text-white bg-[#3863E9] hover:bg-[#2948b6] transition duration-200 shadow"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <FaEdit className="mr-2 text-sm" /> {/* Icon */}
                  Edit Profile
                </button>
                <button
                  className="flex items-center rounded-full px-3 py-1.5 text-xs text-white bg-[#3863E9] hover:bg-[#2948b6] transition duration-200 shadow"
                  onClick={() => router.push('/user/change-password')}
                >
                  <FaLock className="mr-2 text-sm" /> {/* Icon */}
                  Change Password
                </button>
              </div>
              {/* Centered Button */}
              <div className="mt-6">
                <button
                  className="flex items-center rounded-full px-3 py-1.5 text-xs text-white bg-[#3863E9] hover:bg-[#2948b6] transition duration-200 shadow"
                  onClick={() => {
                    setAttributes([
                      {
                        Name: 'custom:isAnonymous',
                        Value:
                          profile?.isAnonymous?.toLowerCase() === 'true'
                            ? 'false'
                            : 'true',
                      },
                    ])
                    setTimeout(() => {
                      router.reload()
                    }, 1000)
                  }}
                >
                  {profile?.isAnonymous?.toLowerCase() === 'true' ? (
                    <FaEyeSlash className="mr-2 text-sm" />
                  ) : (
                    <FaEye className="mr-2 text-sm" />
                  )}
                  {`${
                    profile?.isAnonymous?.toLowerCase() === 'true'
                      ? 'Disable'
                      : 'Enable'
                  } Anonymous Mode`}
                </button>
              </div>
            </div>
            {/* Right Column */}
            <div className="grid grid-cols-2 gap-4 p-8 bg-gray-50 ">
              <div>
                {' '}
                <div className="flex items-center rounded-lg p-5 bg-white shadow-sm my-4">
                  <FaUser className="text-blue-500 mr-5 text-xl" />
                  <span className="font-medium text-lg text-gray-800">
                    {profile?.fullName}
                  </span>
                </div>
                {/* Email */}
                <div className="flex items-center rounded-lg p-5 bg-white shadow-sm my-4">
                  <FaEnvelope className="text-blue-500 mr-5 text-xl" />
                  <span className="font-medium text-lg text-gray-800">
                    {profile?.email}
                  </span>
                </div>
              </div>
              <div>
                {/* Account Type */}
                <div className="flex items-center rounded-lg p-5 bg-white shadow-sm my-4">
                  <FaUserTag className="text-blue-500 mr-5 text-xl" />
                  <span className="font-medium text-lg text-gray-800">
                    {isOrganizer ? 'Organiser' : 'Member'} Account
                  </span>
                </div>
                {/* University */}
                <div className="flex items-center rounded-lg p-5 bg-white shadow-sm my-4">
                  <FaUniversity className="text-blue-500 mr-5 text-xl" />
                  <span className="font-medium text-lg text-gray-800">
                    {profile?.company ?? profile?.university}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
