import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { FileInput } from '@components/inputs/FileInput'
import { Form } from '@components/inputs/Form'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import {
  EventSpeaker,
  EventType,
  TicketType,
} from '@graphql/__generated/graphql'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import useFileUploader from '@libs/useFileUploader'
import React, { useContext, useState } from 'react'
import Table from '@components/base/Table'
import TableRowActions from '@components/event/TableRowActions'
import { usePapaParse } from 'react-papaparse'
import useAutosave from '@libs/useAutosave'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import { truncateString } from '@libs/Utility/util'

const SpeakersForm = () => {
  const [showSpeakerModal, setShowSpeakerModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const { formData, setFormData } = useContext(CreateEventContext)
  const { speakers } = formData ?? {}
  const noSpeakers = speakers == undefined || speakers?.length === 0

  const uploadFile = useFileUploader()
  const { readRemoteFile } = usePapaParse()
  const { setHasEdited } = useAutosave()

  const [speakerModalData, setSpeakerModalData] = useState<
    Partial<EventSpeaker & { editIndex?: number }> | undefined
  >(undefined)

  const addSpeakerModal = (
    <Modal
      show={showSpeakerModal}
      setShow={setShowSpeakerModal}
      title="Add Speaker"
    >
      <Box className="flex justify-center p-2">
        <FileInput
          uploadFile={uploadFile}
          label="Profile Image"
          hint="(Optional) recommended size 800x800px"
          hintPosition="bottom"
          value={speakerModalData?.profileImage!}
          crop={true}
          cropShape={'rect'}
          cropAspectRatio={1}
          onChange={(data) => {
            setSpeakerModalData({
              ...speakerModalData,
              profileImage: data as string,
            })
          }}
        />
      </Box>
      <Box className={`flex gap-2 flex-wrap`}>
        <TextInput
          className="flex-1"
          validations={{
            maxLength: {
              value: 70,
              message: 'Name must be at most 70 characters',
            },
          }}
          required
          label="Name"
          placeholder="Joe Bloggs"
          value={speakerModalData?.name}
          onChange={(data) => {
            setSpeakerModalData({ ...speakerModalData, name: data })
          }}
        />
        <TextInput
          className="flex-2"
          validations={{
            minLength: {
              value: 7,
              message: 'Email must be at least 7 characters',
            },
            maxLength: {
              value: 70,
              message: 'Email must be less than 70 characters',
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email must be valid',
            },
          }}
          type="email"
          label="Email"
          required={formData?.event?.eventType === EventType.Online}
          placeholder="joebloggs@mail.com"
          value={speakerModalData?.email}
          onChange={(data) => {
            setSpeakerModalData({ ...speakerModalData, email: data })
          }}
        />
      </Box>
      <Box className={`flex flex-wrap gap-2`}>
        <TextInput
          className="flex-1 mt-2"
          validations={{
            maxLength: {
              value: 70,
              message: 'Position must be less than 70 characters',
            },
          }}
          required
          label="Position"
          placeholder="Manager"
          value={speakerModalData?.position}
          onChange={(data) => {
            setSpeakerModalData({ ...speakerModalData, position: data })
          }}
        />
        <TextInput
          className="flex-1 mt-2"
          validations={{
            maxLength: {
              value: 70,
              message: 'Organisation must be less than 70 characters',
            },
          }}
          required
          label="Organisation"
          placeholder="Forumm"
          value={speakerModalData?.organization}
          onChange={(data) => {
            setSpeakerModalData({ ...speakerModalData, organization: data })
          }}
        />
      </Box>
      <TextAreaInput
        className="mt-2"
        testid={'speaker-bio-input'}
        validations={{
          maxLength: {
            value: 1000,
            message: 'Speakers bio must be 1000 characters or less',
          },
        }}
        required
        hint="(Maximum of 1000 characters)"
        label="Bio"
        placeholder="A short bio about the speaker"
        value={speakerModalData?.bio}
        onChange={(data) => {
          setSpeakerModalData({ ...speakerModalData, bio: data })
        }}
      />
      <Box className="text-sm">
        Once you&apos;ve published your event, your speakers will receive an
        invite email.
      </Box>

      <Button
        className="my-4 ml-auto"
        title={`${speakerModalData?.name ? 'Save' : 'Add'} Speaker`}
        type="primary"
        disabled={
          !(
            !!speakerModalData &&
            !!speakerModalData.name &&
            (!!speakerModalData.email ||
              formData?.event?.eventType !== EventType.Online) &&
            !!speakerModalData.position &&
            !!speakerModalData.organization &&
            !!speakerModalData.bio
          )
        }
        onClick={() => {
          const speakerData = {
            name: speakerModalData?.name ?? '',
            email: speakerModalData?.email,
            position: speakerModalData?.position ?? '',
            organization: speakerModalData?.organization ?? '',
            profileImage:
              speakerModalData?.profileImage != ''
                ? speakerModalData?.profileImage
                : 'https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=',
            ticketType: TicketType.Free,
            bio: speakerModalData?.bio,
          }

          const payload = [...(formData?.speakers ?? [])]

          if (speakerModalData?.editIndex || speakerModalData?.editIndex === 0)
            payload[speakerModalData.editIndex] = speakerData
          else payload.push(speakerData)

          setFormData({
            ...formData,
            speakers: payload,
          })
          setSpeakerModalData(undefined)
          setShowSpeakerModal(false)
        }}
      />
    </Modal>
  )

  const importCSVModal = (
    <Modal
      show={showImportModal}
      setShow={setShowImportModal}
      title="Import Speaker from CSV"
    >
      <a
        href="https://forumm-images-prod.s3.eu-west-1.amazonaws.com/user-content/manual-upload/sample_speakers.csv"
        className="text-link hover:underline pointer"
        download
      >
        Download Sample CSV
      </a>
      <Form
        clearFormOnSubmit={true}
        onSubmit={async (data) => {
          const { csvUpload, ticket } = data
          readRemoteFile(csvUpload, {
            download: true,
            complete: (res) => {
              const newSpeakers: any[] = []
              const emailHeaderIndex = (res.data[0] as string[]).findIndex(
                (h: string) => {
                  return (h as string).toLowerCase() === 'email'
                }
              )
              const nameHeaderIndex = (res.data[0] as string[]).findIndex(
                (h: string) => {
                  return (
                    (h as string).toLowerCase() === 'name' ||
                    (h as string).toLowerCase() === 'fullname'
                  )
                }
              )
              const organisationHeaderIndex = (
                res.data[0] as string[]
              ).findIndex((h: string) => {
                return (
                  (h as string).toLowerCase() === 'organisation' ||
                  (h as string).toLowerCase() === 'organization'
                )
              })
              const positionHeaderIndex = (res.data[0] as string[]).findIndex(
                (h: string) => {
                  return (h as string).toLowerCase() === 'position'
                }
              )
              const profileImageHeaderIndex = (
                res.data[0] as string[]
              ).findIndex((h: string) => {
                return (
                  (h as string).toLowerCase() === 'profileimage' ||
                  (h as string).toLowerCase() === 'image' ||
                  (h as string).toLowerCase() === 'pfp' ||
                  (h as string).toLowerCase() === 'avatar'
                )
              })

              if (emailHeaderIndex !== -1)
                res.data.forEach((newA: any) => {
                  if (!newA[emailHeaderIndex]) return
                  const emailRef = newA[emailHeaderIndex].toLowerCase()
                  const nameRef = newA[nameHeaderIndex] ?? 'No name on file'
                  const organisationRef =
                    newA[organisationHeaderIndex] ?? 'No organisation on file'
                  const positionRef =
                    newA[positionHeaderIndex] ?? 'No position on file'
                  const profileImageRef =
                    newA[profileImageHeaderIndex] ??
                    'https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU='

                  if (speakers?.find((a) => a.email === emailRef)) return
                  if (emailRef === 'email') return
                  newSpeakers.push({
                    name: nameRef,
                    email: emailRef,
                    ticketType: 'FREE',
                    organization: organisationRef,
                    position: positionRef,
                    profileImage: profileImageRef,
                  })
                })

              setFormData({
                ...formData,
                speakers: [...(speakers ?? []), ...(newSpeakers ?? [])],
              })
              setHasEdited(true)
              setShowImportModal(false)
            },
          })
        }}
      >
        <FileInput
          uploadFile={uploadFile}
          className="mt-1"
          label="CSV Upload"
          hint="Max upload: (200MB)."
          type="csv"
        />
        <Button
          className="my-4"
          title={`Import Speakers`}
          type="primary"
          buttonType="submit"
        />
      </Form>
    </Modal>
  )

  return (
    <>
      {importCSVModal}
      {addSpeakerModal}
      <Box className="w-full">
        <Box className="mt-6 mb-4 flex">
          <Button
            onClick={() => {
              setSpeakerModalData(undefined)
              setShowSpeakerModal(true)
            }}
            title="Add Speaker"
            type="secondary"
            size="small"
            className="mr-4"
          />
          <Button
            onClick={() => {
              setShowImportModal(true)
            }}
            title="Import Speakers"
            type="secondary"
            size="small"
          />
        </Box>
        <Table
          tableHeading={['Name', 'Email', 'Postion', 'Organization', '']}
          rows={speakers?.map((speaker, index) => [
            speaker?.name,
            truncateString(speaker?.email, 200) ?? 'No email on file',
            speaker?.position,
            speaker?.organization,
            <TableRowActions
              key={index}
              confirmModal={{
                title: 'Are you sure?',
                content:
                  'Are you sure you want to delete this? This cannot be undone.',
              }}
              editClicked={() => {
                const modalData = {
                  name: speaker?.name,
                  email: speaker?.email,
                  position: speaker?.position,
                  organization: speaker?.organization,
                  profileImage: speaker?.profileImage ?? '',
                  bio: speaker?.bio ?? '',
                  editIndex: index,
                }
                setSpeakerModalData(modalData)
                setShowSpeakerModal(true)
              }}
              deleteClicked={() => {
                setHasEdited(true)
                setFormData({
                  ...formData,
                  speakers: speakers.filter((_, i) => i !== index),
                })
              }}
            />,
          ])}
        />
        {noSpeakers && (
          <Box>
            <Box className="text-sm mt-8 text-center">
              {'No speakers have been created'}
            </Box>
            <hr className="my-6 border-gray-600 opacity-50" />
          </Box>
        )}
      </Box>
    </>
  )
}

SpeakersForm.Layout = CreateEventLayout

export default SpeakersForm
