import TickIcon from '@public/images/TickIcon.svg'
import { Button } from '@components/inputs/Button'
import { FileInput } from '@components/inputs/FileInput'
import { Form } from '@components/inputs/Form'
import { TextInput } from '@components/inputs/TextInput'
import React, { useState } from 'react'
import { useAuth } from '@libs/useAuth'
import { useRouter } from 'next/router'
import useFileUploader from '@libs/useFileUploader'
import Box from '@components/base/Box'
import Modal from '@components/base/Modal'

const EditProfileForm = ({
  modal,
  setModal,
}: {
  modal: boolean
  setModal: (showModal: boolean) => void
}) => {
  const { setAttributes, profile, setProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [modalPage, setModalPage] = useState(1)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const uploadFile = useFileUploader()

  return (
    <Modal show={modal} setShow={setModal}>
      <Box className="w-sm relative">
        <Box
          className={`absolute transition-all text-white p-8 top-0 bottom-0 left-0 right-0 flex items-center justify-center h-24 mt-auto bg-green-500 pointer-events-none ${
            done ? '' : 'opacity-0'
          } rounded text-center`}
        >
          Profile Updated
          <TickIcon className="inline-block h-8 ml-2" />
        </Box>
        <Box className="text-white text-center text-2xl font-bold pl-3 md:pl-0">
          Edit Profile
        </Box>
        <Form
          initialFormData={{
            profileImage: profile?.profileImageUrl ?? '',
            name: profile?.fullName ?? '',
            email: profile?.email ?? '',
            phone: profile?.phoneNumber ?? '',
            position: profile?.jobTitle ?? '',
            companyOrInstitution: profile?.companyTitle ?? '',
            phoneNumber: profile?.phoneNumber ?? '',
            facebookAccount: profile?.otherProfiles?.facebookAccount ?? '',
            twitterAccount: profile?.otherProfiles?.twitterAccount ?? '',
            instagramAccount: profile?.otherProfiles?.instagramAccount ?? '',
            linkedinAccount: profile?.otherProfiles?.linkedinAccount ?? '',
          }}
          onSubmit={async (data) => {
            setLoading(true)
            try {
              const {
                profileImage,
                name,
                position,
                companyOrInstitution,
                phoneNumber,
                facebookAccount,
                twitterAccount,
                instagramAccount,
                linkedinAccount,
              } = data

              const socials = {
                facebookAccount,
                twitterAccount,
                instagramAccount,
                linkedinAccount,
              }

              setAttributes([
                { Name: 'custom:fullName', Value: name },
                { Name: 'custom:profileImageUrl', Value: profileImage },
                { Name: 'custom:jobTitle', Value: position },
                { Name: 'custom:companyTitle', Value: companyOrInstitution },
                { Name: 'custom:phoneNumber', Value: phoneNumber },
                {
                  Name: 'custom:otherProfiles',
                  Value: JSON.stringify(socials),
                },
              ])
              setDone(true)
              setProfile({
                ...profile,
                profileImageUrl: profileImage,
                fullName: name,
                jobTitle: position,
                companyTitle: companyOrInstitution,
                otherProfiles: socials,
              })
              setTimeout(() => {
                setModal(false)
                setDone(false)
                setLoading(false)
              }, 1500)
            } catch (error: any) {
              console.error(error)
              setLoading(false)
              return error.message ?? 'Failed to sign in'
            }
          }}
        >
          <Box show={modalPage === 1}>
            <FileInput
              className="mt-8"
              uploadFile={uploadFile}
              label="Profile Image"
              crop={true}
              cropShape={'rect'}
              cropAspectRatio={1}
              showProgress={true}
            />
            <TextInput
              required
              validations={{
                minLength: {
                  value: 2,
                  message: 'Full Name must be at least 2 characters',
                },
                maxLength: {
                  value: 70,
                  message: 'Full Name must be less than 70 characters',
                },
                pattern: {
                  value: /^[a-z ,.'-]+$/i,
                  message: 'Name must consist of letters only',
                },
              }}
              label="Name"
              placeholder="John Doe"
            />
            <TextInput
              validations={{
                minLength: {
                  value: 2,
                  message: 'Your position must be at least 2 characters',
                },
              }}
              label="Position"
              type="text"
              placeholder="UX Designer..."
            />
            <TextInput
              validations={{
                minLength: {
                  value: 3,
                  message: 'Company/Institution must be at least 3 characters',
                },
              }}
              label="Company or Institution"
              type="text"
              placeholder="Google..."
            />
            <TextInput
              validations={{
                minLength: {
                  value: 8,
                  message: 'Phone number must be at least 8 characters',
                },
              }}
              label="Phone Number"
              type="text"
              placeholder="07123..."
            />
          </Box>
          <Box show={modalPage === 2}>
            <TextInput
              validations={{
                minLength: {
                  value: 10,
                  message: 'The URL must be at least 10 characters',
                },
              }}
              label="Facebook Account"
              type="text"
              placeholder="Facebook URL..."
            />
            <TextInput
              validations={{
                minLength: {
                  value: 10,
                  message: 'The URL must be at least 10 characters',
                },
              }}
              label="Twitter Account"
              type="text"
              placeholder="Twitter URL..."
            />
            <TextInput
              validations={{
                minLength: {
                  value: 10,
                  message: 'The URL must be at least 10 characters',
                },
              }}
              label="Instagram Account"
              type="text"
              placeholder="Instagram URL..."
            />
            <TextInput
              validations={{
                minLength: {
                  value: 10,
                  message: 'The URL must be at least 10 characters',
                },
              }}
              label="Linkedin Account"
              type="text"
              placeholder="Linkedin URL..."
            />
          </Box>
          <Box className="flex justify-between">
            <Button
              className={`transition-all w-1/3 my-8 mx-1 ${
                done ? 'opacity-0 pointer-events-none' : ''
              }`}
              title="Previous Page"
              loading={loading}
              show={modalPage > 1}
              onClick={() => setModalPage(modalPage - 1)}
            />
            <Button
              className={`transition-all w-1/3 my-8 mx-1 ml-auto ${
                done ? 'opacity-0 pointer-events-none' : ''
              }`}
              title="Next Page"
              loading={loading}
              show={modalPage < 2}
              onClick={() => setModalPage(modalPage + 1)}
            />
          </Box>
          <Button
            buttonType="submit"
            className={`transition-all w-full my-8 ${
              done ? 'opacity-0 pointer-events-none' : ''
            }`}
            title="Update Profile"
            loading={loading}
          />
        </Form>
      </Box>
    </Modal>
  )
}

export default EditProfileForm
