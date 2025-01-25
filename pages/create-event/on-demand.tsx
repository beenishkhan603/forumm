import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import React, { useContext, useState } from 'react'
import Table from '@components/base/Table'
import TableRowActions from '@components/event/TableRowActions'
import { FileInput } from '@components/inputs/FileInput'
import useFileUploader from '@libs/useFileUploader'
import { v4 } from 'uuid'
import useAutosave from '@libs/useAutosave'
import { EventOndemandContent } from '@graphql/__generated/graphql'

const OndemandContantForm = () => {
  const [showOndemandContentModal, setShowOndemandContentModal] =
    useState(false)

  const [modalData, setModalData] = useState<{
    [label: string]: string
  }>()

  const { formData, setFormData } = useContext(CreateEventContext)

  const { ondemandContent } = formData ?? {}

  const noMedia = ondemandContent == undefined || ondemandContent?.length === 0

  const { setHasEdited } = useAutosave()

  const uploadFile = useFileUploader()

  const [onDemandModalData, setOnDemandModalData] = useState<any | undefined>(
    undefined
  )

  const MediaRenderer = ({ url }: { url: string }) => {
    const [isVideo, setIsVideo] = useState(true)

    return isVideo ? (
      <video
        width={128}
        height={72}
        src={url}
        onError={() => setIsVideo(false)} // Switch to image on video load failure
        controls
      />
    ) : (
      <img
        src={url}
        width={128}
        height={72}
        alt="media content"
        onError={() =>
          console.error('Media failed to load as an image as well.')
        }
      />
    )
  }

  const ondemandContentModal = (
    <Modal
      show={showOndemandContentModal}
      setShow={(visible) => {
        setOnDemandModalData(undefined)
        setShowOndemandContentModal(visible)
      }}
      title="Upload Ondemand Content"
    >
      <FileInput
        className="mt-8"
        uploadFile={uploadFile}
        label="Media Input"
        hint="Max upload: (200MB)."
        value={onDemandModalData?.mediaInput}
        onChange={(data) => {
          setOnDemandModalData({ ...onDemandModalData, mediaInput: data })
        }}
      />

      <TextInput
        validations={{
          minLength: {
            value: 2,
            message: 'Media title must be at least 2 character',
          },
        }}
        required
        label="Media Title"
        placeholder="Content title"
        value={onDemandModalData?.mediaTitle}
        onChange={(data) => {
          setOnDemandModalData({ ...onDemandModalData, mediaTitle: data })
        }}
      />
      <TextInput
        validations={{
          minLength: {
            value: 2,
            message: 'Media description must be at least 2 character',
          },
        }}
        required
        label="Media Description"
        placeholder="Content description"
        value={onDemandModalData?.mediaDescription}
        onChange={(data) => {
          setOnDemandModalData({ ...onDemandModalData, mediaDescription: data })
        }}
      />

      <TextInput
        validations={{
          isURL: true,
        }}
        label="Url"
        placeholder="https://youtube.com/...."
        value={onDemandModalData?.url}
        onChange={(data) => {
          setOnDemandModalData({ ...onDemandModalData, url: data })
        }}
      />

      <Button
        className="my-4"
        title={`${modalData ? 'Update' : 'Upload'} Content`}
        type="primary"
        onClick={() => {
          const {
            mediaTitle,
            mediaDescription,
            mediaInput,
            url,
            editIndex,
            id,
          } = onDemandModalData ?? []

          let payload = {
            ...formData,
            ondemandContent: [...(ondemandContent ?? [])],
          }

          let newODC: EventOndemandContent = {
            id: id ?? v4(),
            title: mediaTitle ?? '',
            description: mediaDescription ?? '',
            url: mediaInput ?? url,
          }

          if (editIndex === undefined) payload.ondemandContent.push(newODC)
          if (editIndex !== undefined)
            payload.ondemandContent[editIndex] = newODC
          setFormData(payload)
          setHasEdited(true)
          setShowOndemandContentModal(false)
          setOnDemandModalData(undefined)
        }}
      />
    </Modal>
  )

  return (
    <>
      {ondemandContentModal}
      <Box className="w-full">
        <Box className="mb-6 max-w-2xl">
          Want to provide attendees with some additional content? Upload
          ondemand content here for all attendees to view.
        </Box>
        <div className="flex items-center">
          <Button
            onClick={() => {
              setShowOndemandContentModal(true)
              setModalData(undefined)
            }}
            title="Upload Media"
            type="secondary"
            size="small"
          />
        </div>
        <hr className="my-6 border-gray-600 opacity-50" />

        <Box className="text-xl mb-6">On-demand Content</Box>
        <Table
          tableHeading={['Media', 'Title', 'Description', '']}
          rows={ondemandContent?.map((content, index) => [
            <MediaRenderer key={content.id} url={content.url} />,
            content.title ?? 'Title',
            content.description ?? 'Description',
            <TableRowActions
              key={index}
              confirmModal={{
                title: 'Are you sure?',
                content:
                  'Are you sure you want to delete this? This cannot be undone.',
              }}
              editClicked={() => {
                setOnDemandModalData({
                  id: content.id ?? '',
                  mediaTitle: content.title ?? '',
                  mediaDescription: content.description ?? '',
                  url: content.url ?? '',
                  editIndex: index,
                })
                setShowOndemandContentModal(true)
              }}
              deleteClicked={() => {
                setHasEdited(true)
                setFormData({
                  ...formData,
                  ondemandContent: ondemandContent.filter(
                    (c) => content.id !== c.id
                  ),
                })
              }}
            />,
          ])}
        />
        <Box show={noMedia}>
          <Box className="text-sm mt-8 text-center">
            {'No ondemand content have been created'}
          </Box>
        </Box>
        <hr className="my-6 border-gray-600 opacity-50" />
      </Box>
    </>
  )
}

OndemandContantForm.Layout = CreateEventLayout

export default OndemandContantForm
