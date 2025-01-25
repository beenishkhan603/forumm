import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import React, { useContext, useState } from 'react'
import Table from '@components/base/Table'
import TableRowActions from '@components/event/TableRowActions'
import useAutosave from '@libs/useAutosave'
import { shouldShowField } from '@libs/Utility/validation'

const CommunicationsForm = () => {
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const { setHasEdited } = useAutosave()

  const [modalData, setModalData] = useState<{
    [label: string]: string
  }>()

  const { formData, setFormData, validationRules } =
    useContext(CreateEventContext)
  const { communications } = formData ?? {}

  const noSocials =
    communications?.socials == undefined ||
    communications?.socials?.length === 0

  const noAnnouncements =
    communications?.announcements == undefined ||
    communications?.announcements?.length === 0

  const [communicationsModalData, setCommunicationsModalData] = useState<
    | {
        title?: string
        body?: string
        socialPlatform?: string
        platformUrl?: string
        editIndex?: number
      }
    | undefined
  >(undefined)

  const addSocialModal = (
    <Modal
      show={showSocialModal}
      setShow={(newShow) => {
        setShowSocialModal(newShow)
        setCommunicationsModalData(undefined)
      }}
      title="Manage Social Info"
    >
      <DropdownInput
        label="Social Platform"
        options={['Facebook', 'Twitter', 'Linkedin', 'Instagram']}
        required
        placeholder="Select a social platforms"
        value={communicationsModalData?.socialPlatform}
        onChange={(data) => {
          setCommunicationsModalData({
            ...communicationsModalData,
            socialPlatform: data,
          })
        }}
      />

      <TextInput
        validations={{
          minLength: {
            value: 5,
            message: 'Platform url must be at least 5 character',
          },
        }}
        required
        label="Platform Url"
        placeholder="http://www.facebook.com/..."
        value={communicationsModalData?.platformUrl}
        onChange={(data) => {
          setCommunicationsModalData({
            ...communicationsModalData,
            platformUrl: data,
          })
        }}
      />

      <Button
        className="my-4"
        title={`Manage Social Info`}
        type="primary"
        onClick={() => {
          const { platformUrl = '', socialPlatform = '', editIndex } = communicationsModalData ?? {};
          let newSocials = [...(formData?.communications?.socials ?? [])]

          if (editIndex !== undefined) {
            // Edit existing social info
            newSocials[editIndex] = {
              platform: socialPlatform,
              url: platformUrl,
            }
          } else {
            // Add new social info
            newSocials.push({ platform: socialPlatform, url: platformUrl })
          }

          setFormData({
            ...formData,
            communications: {
              ...formData?.communications,
              socials: newSocials,
            },
          })

          setHasEdited(true)
          setShowSocialModal(false)
          setCommunicationsModalData(undefined)
        }}
      />
    </Modal>
  )

  const addAnnouncementModal = (
    <Modal
      show={showAnnouncementModal}
      setShow={setShowAnnouncementModal}
      title="Manage Announcements"
    >
      <TextInput
        validations={{
          minLength: {
            value: 2,
            message: 'Announcement title need to be atleast 2 characters long',
          },
        }}
        required
        label="Title"
        placeholder="Announcement Title"
        value={communicationsModalData?.title}
        onChange={(data) => {
          setCommunicationsModalData({
            ...communicationsModalData,
            title: data,
          })
        }}
      />

      <TextInput
        validations={{
          minLength: {
            value: 2,
            message: 'Announcement need to be atleast 2 characters long',
          },
        }}
        required
        label="Body"
        placeholder="Announcement message"
        value={communicationsModalData?.body}
        onChange={(data) => {
          setCommunicationsModalData({
            ...communicationsModalData,
            body: data,
          })
        }}
      />

      <Button
        className="my-4"
        title={`Manage Announcement`}
        type="primary"
        onClick={() => {
          const { title = '', body = '', editIndex } = communicationsModalData ?? {}
          let newAnnouncements = [
            ...(formData?.communications?.announcements ?? []),
          ]

          if (editIndex !== undefined) {
            // Edit existing announcement
            newAnnouncements[editIndex] = { title, body }
          } else {
            // Add new announcement
            newAnnouncements.push({ title, body })
          }

          setFormData({
            ...formData,
            communications: {
              ...formData?.communications,
              announcements: newAnnouncements,
            },
          })
          setHasEdited(true)
          setShowAnnouncementModal(false)
        }}
      />
    </Modal>
  )

  return (
    <>
      {addSocialModal}
      {addAnnouncementModal}
      <Box className="w-full">
        <Box
          show={shouldShowField(
            validationRules.find((f) => f[0].includes('communications_socials'))
          )}
          className=""
        >
          <Box className="text-sm mb-6">
            {noSocials
              ? 'No social have been added'
              : `${communications.socials?.length} Social Account${
                  communications.socials?.length ?? 0 > 1 ? 's' : ''
                } Added`}
          </Box>
          <div className="flex items-center">
            <Button
              onClick={() => {
                setShowSocialModal(true)
                setModalData(undefined)
              }}
              title="Add Social Info"
              type="secondary"
              size="small"
            />
          </div>
          <hr className="my-6 border-gray-600 opacity-50" />

          <Box className="text-xl mb-6">Social Info</Box>
          <Table
            tableHeading={['Platform', 'Url', '']}
            rows={communications?.socials?.map((social, index) => [
              social.platform,
              social.url,
              <TableRowActions
                key={index}
                editClicked={() => {
                  setCommunicationsModalData({
                    socialPlatform: social.platform,
                    platformUrl: social.url,
                    editIndex: index,
                  })
                  setShowSocialModal(true)
                }}
                deleteClicked={() => {
                  setFormData({
                    ...formData,
                    communications: {
                      socials: communications.socials?.filter(
                        (_, i) => i !== index
                      ),
                    },
                  })
                }}
              />,
            ])}
          />
          <Box show={noSocials}>
            <Box className="text-sm mt-8 text-center">
              {'No social have been added'}
            </Box>
          </Box>
        </Box>
        <hr className="my-6 border-gray-600 opacity-50" />
        <Box
          show={shouldShowField(
            validationRules.find((f) =>
              f[0].includes('communications_announcements')
            )
          )}
          className=""
        >
          <Box className="text-xl mb-6">Announcements</Box>
          <Box className="mb-6 max-w-2xl">
            Need to let your attendees know some important information? Create
            an announcement to show all attendees when they join your event:
          </Box>

          <Button
            onClick={() => {
              setShowAnnouncementModal(true)
              setModalData(undefined)
              setCommunicationsModalData(undefined)
            }}
            title="Create Announcement"
            type="secondary"
            size="small"
          />
          <hr className="my-6 border-gray-600 opacity-50" />
          <Box className="text-xl mb-6">Announcements</Box>
          <Table
            tableHeading={['Title', 'Info', '']}
            rows={communications?.announcements?.map((announcement, index) => [
              announcement.title,
              announcement.body,
              <TableRowActions
                key={index}
                confirmModal={{
                  title: 'Are you sure?',
                  content:
                    'Are you sure you want to delete this? This cannot be undone.',
                }}
                editClicked={() => {
                  setCommunicationsModalData({
                    title: announcement.title,
                    body: announcement.body,
                    editIndex: index,
                  })
                  setShowAnnouncementModal(true)
                }}
                deleteClicked={() => {
                  setFormData({
                    ...formData,
                    communications: {
                      announcements: communications?.announcements?.filter(
                        (_, i) => i !== index
                      ),
                    },
                  })
                }}
              />,
            ])}
          />
          <hr className="my-6 border-gray-600 opacity-50" />
        </Box>
      </Box>
    </>
  )
}

CommunicationsForm.Layout = CreateEventLayout

export default CommunicationsForm
