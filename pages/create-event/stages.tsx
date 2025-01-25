import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import { EventStageInput, StageType } from '@graphql/__generated/graphql'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import React, { useContext, useState } from 'react'
import Table from '@components/base/Table'
import TableRowActions from '@components/event/TableRowActions'
import useAutosave from '@libs/useAutosave'

const StagesForm = () => {
  const [showStageModal, setShowStageModal] = useState(false)
  const [modalData, setModalData] = useState<any>()
  const { formData, setFormData } = useContext(CreateEventContext)
  const { stages } = formData ?? {}
  const noStages = stages == undefined || stages.length === 0
  const { setHasEdited } = useAutosave()
  const [stageModalData, setStageModalData] = useState<
    Partial<EventStageInput & { editIndex?: number }> | undefined
  >(undefined)

  const addStageModal = (
    <Modal
      show={showStageModal}
      setShow={(visible) => {
        if (!visible) {
          setStageModalData(undefined)
        }
        setShowStageModal(visible)
      }}
      title={`${
        modalData?.editIndex !== undefined ? 'Update' : 'Create'
      } Stage`}
    >
      <TextInput
        required
        label="Title"
        placeholder="Stage Name"
        value={stageModalData?.title}
        onChange={(data) => {
          setStageModalData({ ...stageModalData, title: data })
        }}
      />
      <TextAreaInput
        className="mt-8"
        label="Description"
        placeholder="Write your description"
        value={stageModalData?.description}
        onChange={(data) => {
          setStageModalData({ ...stageModalData, description: data })
        }}
      />
      <DropdownInput
        label="Stage Type"
        required
        value={stageModalData?.class}
        onChange={(data) => {
          setStageModalData({ ...stageModalData, class: data })
        }}
        options={[
          { label: 'Hosted by 3rd Party', value: StageType.External },
          { label: 'Hosted on Forumm', value: StageType.Internal },
        ]}
        placeholder="Select stage type"
      />
      <TextInput
        validations={{
          isURL: true,
        }}
        label={
          stageModalData?.class === StageType.External
            ? 'Live Video Url'
            : 'Holding Video Url'
        }
        placeholder="https://www.youtube.com/..."
        value={stageModalData?.holdingVideoUrl}
        onChange={(data) => {
          setStageModalData({ ...stageModalData, holdingVideoUrl: data })
        }}
      />
      <Button
        className="my-4"
        title={`${
          stageModalData?.editIndex !== undefined ? 'Update' : 'Create'
        } Stage`}
        type="primary"
        onClick={() => {
          let payload = {
            ...formData,
            stages: [...(stages ?? [])],
          }
          const newStage = {
            title: stageModalData?.title ?? '',
            description: stageModalData?.description ?? '',
            class: stageModalData?.class ?? StageType.Internal,
            holdingVideoUrl: stageModalData?.holdingVideoUrl ?? '',
            ...(stageModalData?.description && {
              description: stageModalData.description,
            }),
            ...(stageModalData?.holdingVideoUrl && {
              holdingVideoUrl: stageModalData.holdingVideoUrl,
            }),
          }

          if (stageModalData?.editIndex === undefined)
            payload.stages.push(newStage)
          if (stageModalData?.editIndex !== undefined)
            payload.stages[stageModalData?.editIndex] = newStage
          setFormData(payload)
          setStageModalData(undefined)
          setHasEdited(true)
          setShowStageModal(false)
        }}
      />
    </Modal>
  )

  return (
    <>
      {addStageModal}
      <Box className="w-full">
        <Box className="mt-6 mb-4 flex">
          <Button
            onClick={() => {
              setShowStageModal(true)
              setModalData(undefined)
            }}
            title="Add Stage"
            type="secondary"
            size="small"
          />
        </Box>
        <Table
          tableHeading={['Title', 'Description', 'Holding Video', '']}
          rows={stages?.map((stage, index) => [
            stage.title,
            stage.description ?? '',
            stage.holdingVideoUrl ?? '',
            <TableRowActions
              key={index}
              confirmModal={{
                title: 'Are you sure?',
                content:
                  'Are you sure you want to delete this? This cannot be undone.',
              }}
              editClicked={() => {
                setStageModalData({
                  title: stage.title,
                  editIndex: index,
                  class: stage.class,
                  ...(stage.description && { description: stage.description }),
                  ...(stage.holdingVideoUrl && {
                    holdingVideoUrl: stage.holdingVideoUrl,
                  }),
                })
                setShowStageModal(true)
              }}
              deleteClicked={() => {
                setHasEdited(true)
                setFormData({
                  ...formData,
                  stages: stages.filter((s) => s.title !== stage.title),
                })
              }}
            />,
          ])}
        />
        {noStages && (
          <Box>
            <Box className="text-sm mt-8 text-center">
              {'No stages have been created'}
            </Box>
            <hr className="my-6 border-gray-600 opacity-50" />
          </Box>
        )}
      </Box>
    </>
  )
}

StagesForm.Layout = CreateEventLayout

export default StagesForm
