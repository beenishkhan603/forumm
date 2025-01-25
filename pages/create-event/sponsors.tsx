import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext, EventCreation } from '@libs/CreateEventContext'
import React, { useContext, useMemo, useState } from 'react'
import Table from '@components/base/Table'
import { FileInput } from '@components/inputs/FileInput'
import useFileUploader from '@libs/useFileUploader'
import { v4 } from 'uuid'
import { isYoutubeUrl } from '@libs/Utility/parsers'
import { ToggleInput } from '@components/inputs/ToggleInput'
import useAutosave from '@libs/useAutosave'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { MediaThumbnail } from '@components/ui/MediaThumbnail'
import { MdOutlineImage } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useTheme } from '@libs/useTheme'

const SponsorsForm = () => {
  const [modalStage, setModalStage] = useState('details')
  const [showModal, setShowModal] = useState(false)
  const [mediaType, setMediaType] = useState<'upload' | 'external' | string>(
    'upload'
  )
  const [initialModalData, setInitialModalData] = useState<any>()
  const { formData, setFormData } = useContext(CreateEventContext)
  const { sponsors } = formData ?? {}
  const noData = sponsors == undefined || sponsors.length === 0
  const uploadFile = useFileUploader()
  const { setHasEdited } = useAutosave()
  const { StaticColours } = useTheme()

  const [sponsorModalData, setSponsorModalData] = useState<any | undefined>(
    undefined
  )

  const handleSubmitModal = () => {
    const {
      title,
      websiteUrl,
      logoUpload,
      description,
      facebookUrl,
      twitterUrl,
      linkedinUrl,
      mediaTitle,
      mediaDescription,
      mediaInput,
      externalMediaUrl,
      editIndex,
    } = sponsorModalData ?? []

    let payload = {
      ...formData,
      sponsors: [...(sponsors ?? [])],
    }
    const newSponsor = {
      title: title ?? `Partner ${payload.sponsors.length + 1}`,
      websiteUrl: websiteUrl ?? null,
      logoUrl: logoUpload ?? null,
      description: description ?? null,
      facebookUrl: facebookUrl ?? null,
      twitterUrl: twitterUrl ?? null,
      linkedinUrl: linkedinUrl ?? null,
      ondemandContent:
        externalMediaUrl || mediaInput
          ? [
              {
                id: sponsorModalData.id ?? v4(),
                title: mediaTitle ?? 'Default Media Title',
                description: mediaDescription ?? 'Default Media Description',
                url: mediaType === 'url' ? externalMediaUrl : mediaInput,
              },
            ]
          : null,
    }
    if (editIndex === undefined) payload.sponsors.push(newSponsor)
    if (editIndex !== undefined) payload.sponsors[editIndex] = newSponsor

    setFormData(payload)
    setHasEdited(true)
    setShowModal(false)
    setModalStage('details')
    setSponsorModalData(undefined)
    setInitialModalData(undefined)
  }

  const modal = (
    <Modal
      show={showModal}
      setShow={(val) => {
        setShowModal(val)
        setModalStage('details')
      }}
      title={`${
        sponsorModalData?.editIndex !== undefined ? 'Update' : 'Add'
      } Partner`}
    >
      <Box show={modalStage === 'details'}>
        <TextInput
          label="Title"
          placeholder="Forumm"
          className="mb-2"
          required
          value={sponsorModalData?.title}
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              title: data,
            })
          }}
        />
        <FileInput
          uploadFile={uploadFile}
          label="Logo Upload"
          hint="(Optional) recommended size 500x500px"
          value={sponsorModalData?.logoUpload ?? sponsorModalData?.logoUrl}
          className="mt-5"
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              logoUpload: data,
              logoUrl: data,
            })
          }}
        />
        <TextInput
          label="Website Url"
          placeholder="https://forumm.events/"
          value={sponsorModalData?.websiteUrl}
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              websiteUrl: data,
            })
          }}
        />
        <TextAreaInput
          className="mt-6"
          label="Description"
          placeholder="Write your description"
          value={sponsorModalData?.description}
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              description: data,
            })
          }}
        />
        <TextInput
          label="Facebook Url"
          placeholder="https://facebook.com/.."
          value={sponsorModalData?.facebookUrl}
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              facebookUrl: data,
            })
          }}
        />
        <TextInput
          label="Twitter Url"
          placeholder="https://twitter.com/.."
          value={sponsorModalData?.twitterUrl}
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              twitterUrl: data,
            })
          }}
        />
        <TextInput
          label="Linkedin Url"
          placeholder="https://linkedin.com/.."
          value={sponsorModalData?.linkedinUrl}
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              linkedinUrl: data,
            })
          }}
        />
        <Button
          className="my-4 ml-auto"
          // title={sponsorModalData?.editIndex !== undefined ? 'Update' : 'Add'}
          title={'Next'}
          type="primary"
          buttonType="button"
          // onClick={handleSubmitModal}
          onClick={() => setModalStage('media')}
        />
      </Box>
      <Box show={modalStage === 'media'}>
        <ToggleInput
          className="my-2"
          options={['Upload', 'URL']}
          callback={(val) => {
            setMediaType(val.toLowerCase())
          }}
          label="Media Type"
          selected={mediaType === 'url' ? 1 : 0}
        />
        {mediaType === 'upload' ? (
          <FileInput
            className="mt-8"
            uploadFile={uploadFile}
            label="Media Input"
            hint="Max upload: (200MB)."
            value={sponsorModalData?.mediaInput}
            onChange={(data) => {
              setSponsorModalData({
                ...sponsorModalData,
                mediaInput: data,
              })
            }}
          />
        ) : (
          <TextInput
            validations={{
              isURL: true,
            }}
            label="External Media Url"
            placeholder="https://youtube.com/..."
            value={sponsorModalData?.externalMediaUrl}
            onChange={(data) => {
              setSponsorModalData({
                ...sponsorModalData,
                externalMediaUrl: data,
              })
            }}
          />
        )}

        <TextInput
          validations={{
            minLength: {
              value: 2,
              message: 'Media title must be at least 2 character',
            },
          }}
          label="Media Title"
          placeholder="Content title"
          value={sponsorModalData?.mediaTitle}
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              mediaTitle: data,
            })
          }}
        />
        <TextInput
          validations={{
            minLength: {
              value: 2,
              message: 'Media description must be at least 2 character',
            },
          }}
          label="Media Description"
          placeholder="Content description"
          value={sponsorModalData?.mediaDescription}
          onChange={(data) => {
            setSponsorModalData({
              ...sponsorModalData,
              mediaDescription: data,
            })
          }}
        />
        <Box className="flex flex-row w-full justify-between items-center">
          <Button
            className="my-4"
            title="Back"
            type="primary"
            buttonType="button"
            onClick={() => setModalStage('details')}
          />
          <Button
            className="my-4"
            title={`${
              initialModalData?.editIndex !== undefined ? 'Update' : 'Add'
            } Partner`}
            type="primary"
            onClick={handleSubmitModal}
          />
        </Box>
      </Box>
    </Modal>
  )

  return (
    <>
      {modal}
      <Box className="w-full">
        <Box className="mt-6 mb-4 flex">
          <Button
            onClick={() => {
              setModalStage('details')
              setSponsorModalData(undefined)
              setInitialModalData(undefined)
              setShowModal(true)
            }}
            title="Add Partner"
            type="secondary"
            size="small"
          />
        </Box>
        <Table
          tableHeading={[
            <MdOutlineImage key={'LogoHeader'} className={`mx-auto`} />,
            'Partner Name',
            'Socials',
            'Media',
            '',
          ]}
          rows={sponsors?.map((sponsor, index) => [
            <MediaThumbnail
              key={`partner-media-key-${index}`}
              media={sponsor.logoUrl}
              className={`mx-auto rounded`}
            />,
            sponsor.title,
            sponsor.twitterUrl || sponsor.facebookUrl || sponsor.linkedinUrl ? (
              <AiOutlineCheck className="inline-block h-4 w-4 ml-4" />
            ) : (
              <AiOutlineClose className="inline-block h-4 w-4 ml-4 fill-red" />
            ),
            sponsor.ondemandContent && sponsor.ondemandContent?.length > 0 ? (
              <AiOutlineCheck className="inline-block h-4 w-4 ml-4" />
            ) : (
              <AiOutlineClose className="inline-block h-4 w-4 ml-4 fill-red" />
            ),
            <Box key={index} className={'flex'}>
              <Button
                onClick={() => {
                  const odc =
                    sponsor.ondemandContent &&
                    sponsor.ondemandContent.length > 0
                      ? sponsor.ondemandContent[0]
                      : false
                  const isYoutube = odc && isYoutubeUrl(odc.url)
                  const initData = {
                    ...sponsor,
                    mediaTitle: odc ? odc.title : '',
                    mediaDescription: odc ? odc.description : '',
                    mediaInput: odc && !isYoutube ? odc.url : undefined,
                    externalMediaUrl: isYoutube ? odc.url : undefined,
                    logoUpload: sponsor.logoUrl ?? '',
                    editIndex: index,
                  }
                  setMediaType(isYoutube ? 'url' : 'upload')
                  setSponsorModalData(initData)
                  setModalStage('details')
                  setShowModal(true)
                }}
                className="ml-auto mr-2"
                type="secondary"
                size="small"
                title="Edit"
              />
              <Button
                key={index}
                confirmationModal={{
                  title: 'Are you sure?',
                  content:
                    'Are you sure you want to delete this? This cannot be undone.',
                }}
                onClick={() => {
                  setHasEdited(true)
                  setFormData({
                    ...formData,
                    sponsors: sponsors.filter((t) => t.title !== sponsor.title),
                  })
                }}
                className="mr-2"
                type="danger"
                size="small"
                // title="Remove"
                iconColor={StaticColours.forumm_red}
                icon={<RiDeleteBinLine />}
              />
            </Box>,
          ])}
        />
        {noData && (
          <Box>
            <Box className="text-sm mt-8 text-center">
              {'No partners have been created'}
            </Box>
            <hr className="my-6 border-gray-600 opacity-50" />
          </Box>
        )}
      </Box>
    </>
  )
}

SponsorsForm.Layout = CreateEventLayout

export default SponsorsForm
