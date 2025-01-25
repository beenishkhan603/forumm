import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { FileInput } from '@components/inputs/FileInput'
import { Form } from '@components/inputs/Form'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import useFileUploader from '@libs/useFileUploader'
import React, { useContext, useState } from 'react'
import Table from '@components/base/Table'
import Image from 'next/image'
import BreakoutRoom from '@public/images/breakout-room.png'
import Text from '@components/base/Text'
import TableRowActions from '@components/event/TableRowActions'
import useAutosave from '@libs/useAutosave'

const BreakoutRoomsForm = () => {
  const [showModal, setShowModal] = useState(false)
  const { formData, setFormData } = useContext(CreateEventContext)
  const { breakoutRooms } = formData ?? {}
  const noData = breakoutRooms == undefined || breakoutRooms.length === 0
  const uploadFile = useFileUploader()
  const { setHasEdited } = useAutosave()
  const [breakoutModalData, setBreakoutModalData] = useState<any | undefined>(
    undefined
  )

  const modal = (
    <Modal
      show={showModal}
      setShow={setShowModal}
      title={
        breakoutModalData?.editIndex !== undefined
          ? 'Update Breakout Room'
          : 'Create Breakout Room'
      }
    >
      <Form initialFormData={breakoutModalData} clearFormOnSubmit={true}>
        <TextInput
          required
          label="Title"
          placeholder="Forumm"
          value={breakoutModalData?.title}
          onChange={(data) => {
            setBreakoutModalData({ ...breakoutModalData, title: data })
          }}
        />
        <TextAreaInput
          className="mt-6"
          label="Description"
          placeholder="Write your description"
          value={breakoutModalData?.description}
          onChange={(data) => {
            setBreakoutModalData({ ...breakoutModalData, description: data })
          }}
        />
        <TextInput
          label="Max Attendees"
          type="number"
          required
          placeholder="Example: 10"
          min={1}
          max={30}
          hint="Maximum: 30"
          value={breakoutModalData?.maxAttendees}
          onChange={(data) => {
            setBreakoutModalData({
              ...breakoutModalData,
              maxAttendees: data ?? 1,
            })
          }}
        />
        <FileInput
          uploadFile={uploadFile}
          label="Thumbnail Image"
          hint="(Optional) recommended size 500x500px"
          value={breakoutModalData?.thumbnailImage}
          onChange={(data) => {
            setBreakoutModalData({ ...breakoutModalData, thumbnailImage: data })
          }}
        />
        <Button
          className="my-4"
          title={
            breakoutModalData?.editIndex !== undefined ? 'Save' : 'Create Room'
          }
          type="primary"
          buttonType="submit"
          onClick={() => {
            const {
              title,
              description,
              maxAttendees,
              thumbnailImage,
              editIndex,
            } = breakoutModalData ?? []

            let payload = {
              ...formData,
              breakoutRooms: [...(breakoutRooms ?? [])],
            }

            const maxAtt = parseInt(maxAttendees)

            if (maxAtt > 60) return

            const newBreakoutRoom = {
              title: title,
              description: description,
              maxAttendees: maxAtt,
              thumbnailImage: thumbnailImage,
            }

            if (!payload.breakoutRooms) payload.breakoutRooms = []
            if (editIndex === 0 || editIndex)
              payload.breakoutRooms[editIndex] = newBreakoutRoom
            else payload.breakoutRooms.push(newBreakoutRoom)
            setFormData(payload)
            setHasEdited(true)
            setShowModal(false)
          }}
        />
      </Form>
    </Modal>
  )

  return (
    <>
      {modal}
      <Box className="w-full">
        <Box className="text-xl mb-6">
          {noData
            ? 'You have not added any Breakout Rooms.'
            : `${breakoutRooms.length} Room${
                breakoutRooms.length > 1 ? 's' : ''
              } Added`}
        </Box>
        <Box className="mb-6">Click add room to add a new Breakout Room.</Box>
        <Button
          onClick={() => {
            setShowModal(true)
            setBreakoutModalData(undefined)
          }}
          title="Add Room"
          type="secondary"
          size="small"
        />
        <hr className="my-6 border-gray-600 opacity-50" />

        <Box className="text-xl mb-6">Breakout Rooms</Box>
        <Table
          tableHeading={['', 'Name', 'Description', 'Capacity', '']}
          rows={breakoutRooms?.map((breakoutRoom, index) => [
            <Image
              key={breakoutRoom.title}
              src={breakoutRoom.thumbnailImage || BreakoutRoom}
              alt={breakoutRoom.title}
              className={`w-10 h-10 object-cover rounded hue-rotate-${
                !breakoutRoom.thumbnailImage && index * 15
              }`}
              width={40}
              height={40}
            />,
            breakoutRoom.title,
            <Text key={breakoutRoom.title} className="max-w-sm truncate">
              {breakoutRoom.description}
            </Text>,
            breakoutRoom.maxAttendees ?? 0,
            <TableRowActions
              key={breakoutRoom.title}
              confirmModal={{
                title: 'Are you sure?',
                content:
                  'Are you sure you want to delete this? This cannot be undone.',
              }}
              editClicked={() => {
                setBreakoutModalData({
                  index: `${index}`,
                  title: breakoutRoom.title,
                  description: breakoutRoom.description,
                  maxAttendees: `${breakoutRoom.maxAttendees}`,
                  thumbnailImage: breakoutRoom.thumbnailImage ?? '',
                  editIndex: index,
                })
                setShowModal(true)
              }}
              deleteClicked={() => {
                setHasEdited(true)
                setFormData({
                  ...formData,
                  breakoutRooms: breakoutRooms.filter((_, i) => i !== index),
                })
              }}
            />,
          ])}
        />
      </Box>
    </>
  )
}

BreakoutRoomsForm.Layout = CreateEventLayout

export default BreakoutRoomsForm
