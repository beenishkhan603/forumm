import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Table from '@components/base/Table'
import TableRowActions from '@components/event/TableRowActions'
import { FileInput } from '@components/inputs/FileInput'
import useFileUploader from '@libs/useFileUploader'
import { TextAreaInput } from '@components/inputs/TextAreaInput'
import { PriceInput } from '@components/inputs/PriceInput'
import currencies from '@libs/currencies'
import { debounce } from '@libs/Utility/util'
import {
  EventType,
  FundraidingMedia,
  FundraisingProgram,
} from '@graphql/__generated/graphql'
import { isFieldRequired } from '@libs/Utility/validation'
import { ToggleInput } from '@components/inputs/ToggleInput'
import { MediaThumbnail } from '@components/ui/MediaThumbnail'
import RichTextEditor from '@components/inputs/RichTextEditor'
import {
  getContentThumbnail,
  getFileTypeFromS3URL,
} from '@libs/Utility/parsers'
import { v4 } from 'uuid'
import { truncateString } from '@libs/Utility/util'

const FundraisingForm = ({ currency }: { currency: string }) => {
  const [showFundraisingMediaModal, setShowFundraisingMediaModal] =
    useState(false)

  const [showFundraisingProgramModal, setShowFundraisingProgramModal] =
    useState(false)

  const { formData, setFormData, validationRules } =
    useContext(CreateEventContext)

  const { fundraising } = formData ?? {}

  const noMedia = fundraising == undefined || fundraising?.media?.length === 0
  const noPrograms =
    fundraising == undefined || fundraising?.programs?.length === 0

  const uploadFile = useFileUploader()

  const [fundraisingProgramData, setFundraisingProgramData] = useState<
    any | undefined
  >(undefined)

  const [fundraisingModalData, setFundraisingModalData] = useState<
    any | undefined
  >(undefined)

  const [fundraisingDetailsData, setFundraisingDetailsData] = useState<
    any | undefined
  >(formData?.fundraising)

  const debouncedSave = useCallback(
    debounce((data: any) => {
      const payload = {
        ...data?.formData?.fundraising,
        title: data?.title ?? '',
        goal: parseFloat(data?.goal ?? 0),
        description: data?.description ?? '',
        programs: data?.formData?.fundraising?.programs ?? [],
        media: data?.formData?.fundraising?.media ?? [],
      }
      /* if ( */
      /*   !!data && */
      /*   JSON.stringify({ ...data.formData }) !== */
      /*     JSON.stringify({ ...data.formData, fundraising: { ...payload } }) */
      /* ) */
      setFormData({ ...data.formData, fundraising: { ...payload } })
    }, 1000),
    []
  )

  useEffect(() => {
    const payload = {
      ...formData?.fundraising,
      title: fundraisingDetailsData?.title ?? formData?.fundraising?.title,
      goal: fundraisingDetailsData?.goal ?? formData?.fundraising?.goal,
      description:
        fundraisingDetailsData?.description ??
        formData?.fundraising?.description,
      formData: formData,
      fundraisingDetailsData: fundraisingDetailsData,
    }
    debouncedSave(payload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundraisingDetailsData])

  const getProgrammeMaxGoal = () => {
    let maxGoal = fundraising?.goal ?? 1
    if (!!fundraising?.programs && fundraising.programs.length > 0) {
      fundraising.programs.forEach((p) => {
        maxGoal -= p.goal ?? 0
      })
    }
    return maxGoal
  }

  const fundraisingProgramModal = useMemo(
    () => (
      <Modal
        show={showFundraisingProgramModal}
        setShow={setShowFundraisingProgramModal}
        title="Manage Fundraising Programmes"
      >
        <TextInput
          validations={{
            minLength: {
              value: 2,
              message: 'Programme title must be at least 2 character',
            },
          }}
          required={isFieldRequired(
            validationRules.find((f) =>
              f[0].includes('fundraising_programme_title')
            )
          )}
          label="Programme Title"
          placeholder="Programme title"
          value={fundraisingProgramData?.programTitle}
          onChange={(data) => {
            setFundraisingProgramData({
              ...fundraisingProgramData,
              programTitle: data,
            })
          }}
        />
        <TextInput
          validations={{
            minLength: {
              value: 2,
              message: 'Programme description must be at least 2 character',
            },
          }}
          required={isFieldRequired(
            validationRules.find((f) =>
              f[0].includes('fundraising_programme_description')
            )
          )}
          label="Programme Description"
          placeholder="Programme description"
          value={fundraisingProgramData?.programDescription}
          onChange={(data) => {
            setFundraisingProgramData({
              ...fundraisingProgramData,
              programDescription: data,
            })
          }}
        />
        <PriceInput
          label="Programme Goal"
          hint={`Cannot be more than your remaining fundraising goal (${
            currencies[currency?.toUpperCase() ?? 'GBP'].symbol
          }${getProgrammeMaxGoal()})`}
          className={`w-full`}
          required={isFieldRequired(
            validationRules.find((f) =>
              f[0].includes('fundraising_programme_goal')
            )
          )}
          currencySymbol={
            currencies[currency?.toUpperCase() ?? 'GBP'].symbol as any
          }
          onChange={(data) => {
            setFundraisingProgramData({ ...fundraisingProgramData, goal: data })
          }}
          value={fundraisingProgramData?.goal ?? 0}
          maxValue={getProgrammeMaxGoal()}
        />
        <FileInput
          className="mt-8"
          uploadFile={uploadFile}
          label="Programme Media"
          hint="Max upload: (200MB)."
          value={fundraisingProgramData?.media?.url}
          crop={true}
          cropAspectRatio={500 / 300}
          onChange={(data) => {
            setFundraisingProgramData({
              ...fundraisingProgramData,
              media: {
                ...fundraisingProgramData?.media,
                url: data as string,
              },
            })
          }}
        />
        {/* Disabled: Dan's request. */}
        {/* <TextInput */}
        {/*   validations={{ */}
        {/*     minLength: { */}
        {/*       value: 2, */}
        {/*       message: 'Programme description must be at least 2 character', */}
        {/*     }, */}
        {/*   }} */}
        {/*   required */}
        {/*   label="Media Title" */}
        {/*   placeholder="Media title" */}
        {/*   value={fundraisingProgramData?.media?.title} */}
        {/*   onChange={(data) => { */}
        {/*     setFundraisingProgramData({ */}
        {/*       ...fundraisingProgramData, */}
        {/*       media: { */}
        {/*         ...fundraisingProgramData.media, */}
        {/*         title: data, */}
        {/*       }, */}
        {/*     }) */}
        {/*   }} */}
        {/* /> */}
        <TextInput
          validations={{
            minLength: {
              value: 2,
              message: 'Programme description must be at least 2 character',
            },
          }}
          label="Alt"
          placeholder="Give a brief description of the media."
          value={fundraisingProgramData?.media?.body}
          onChange={(data) => {
            setFundraisingProgramData({
              ...fundraisingProgramData,
              media: {
                ...fundraisingProgramData.media,
                body: data,
              },
            })
          }}
        />{' '}
        <Button
          className="my-4"
          title={`${
            !!fundraisingProgramData?.editIndex ||
            fundraisingProgramData?.editIndex === 0
              ? 'Update'
              : 'Add'
          } Programme`}
          type="primary"
          onClick={() => {
            const { programTitle, programDescription, goal, editIndex, media } =
              fundraisingProgramData ?? []

            /* Fundraising */
            /* id?: string */
            /* title?: string */
            /* description?: string */
            /* programs?: [FundraisingProgram] */
            /* media?: [FundraidingMedia] */
            /* goal?: number */

            /* Program */
            /* title: string */
            /* description: string */
            /* goal: number */

            let payload = {
              ...formData,
              fundraising: {
                ...(fundraising ?? {}),
                programs: [...(fundraising?.programs ?? [])],
              },
            }

            let newProgram: FundraisingProgram = {
              title: programTitle ?? '',
              description: programDescription ?? '',
              goal: parseInt(goal ?? 0),
            }

            if (media)
              newProgram = {
                ...newProgram,
                media: {
                  title: media.title ?? `Programme-Media-${v4()}`,
                  body: media.body ?? 'Programme Description',
                  url: media.url ?? '',
                },
              }

            if (editIndex === undefined && editIndex !== 0)
              payload.fundraising.programs.push(newProgram)
            else payload.fundraising.programs[editIndex] = newProgram

            setFormData(payload)
            setShowFundraisingProgramModal(false)
          }}
        />
      </Modal>
    ),
    [
      fundraisingProgramData,
      fundraising,
      currency,
      showFundraisingProgramModal,
      setShowFundraisingProgramModal,
    ]
  )

  const [fundraisingMediaType, setFundraisingMediaType] =
    useState<string>('file')

  const fundraisingMediaModal = useMemo(
    () => (
      <Modal
        show={showFundraisingMediaModal}
        setShow={setShowFundraisingMediaModal}
        title="Manage Fundraising Media"
      >
        <ToggleInput
          className="my-2"
          options={['Upload File', 'External URL']}
          callback={(val) => {
            setFundraisingMediaType(
              val.toLowerCase() === 'upload file' ? 'file' : 'url'
            )
          }}
          label="Media Type"
          selected={fundraisingMediaType === 'url' ? 1 : 0}
        />
        {fundraisingMediaType === 'file' ? (
          <FileInput
            className="mt-8"
            uploadFile={uploadFile}
            label="Media Input"
            hint="Max upload: (200MB)."
            required={fundraisingMediaType === 'file'}
            value={fundraisingModalData?.mediaInput}
            onChange={(data) => {
              setFundraisingModalData({
                ...fundraisingModalData,
                mediaInput: data,
              })
            }}
          />
        ) : (
          <TextInput
            validations={{
              isURL: true,
            }}
            label="Url"
            required={fundraisingMediaType === 'url'}
            placeholder="https://youtube.com/...."
            value={fundraisingModalData?.url}
            onChange={(data) => {
              setFundraisingModalData({ ...fundraisingModalData, url: data })
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
          required
          label="Media Title"
          placeholder="Content title"
          value={fundraisingModalData?.mediaTitle}
          onChange={(data) => {
            setFundraisingModalData({
              ...fundraisingModalData,
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
          required
          label="Alt"
          placeholder="Give a brief description of the media."
          value={fundraisingModalData?.mediaDescription}
          onChange={(data) => {
            setFundraisingModalData({
              ...fundraisingModalData,
              mediaDescription: data,
            })
          }}
        />

        <Button
          className="my-4"
          title={`${fundraisingModalData ? 'Update' : 'Save'} Content`}
          type="primary"
          onClick={() => {
            const {
              mediaTitle,
              mediaDescription,
              mediaInput,
              url,
              editIndex,
              media,
              id,
            } = fundraisingModalData ?? []

            /* Fundraising */
            /* id?: string */
            /* title?: string */
            /* description?: string */
            /* programs?: [FundraisingProgram] */
            /* media?: [FundraidingMedia] */
            /* goal?: number */

            /* Media */
            /* title: string */
            /* body: string */
            /* platform?: string */
            /* url: string */

            let payload = {
              ...formData,
              fundraising: {
                ...(fundraising ?? {}),
                media: [...(fundraising?.media ?? [])],
              },
            }

            let newMedia = {
              title: mediaTitle ?? `Fundraising-Media-Title-${v4()}`,
              body: mediaDescription ?? `Fundraising-Media-Description-${v4()}`,
              platform: url ? 'Youtube' : undefined,
              url: (fundraisingMediaType === 'file' ? mediaInput : url) ?? url,
            }

            if (editIndex === undefined)
              payload.fundraising.media.push(newMedia)
            if (editIndex !== undefined)
              payload.fundraising.media[editIndex] = newMedia

            setFormData(payload)
            setShowFundraisingMediaModal(false)
            setFundraisingModalData(undefined)
          }}
        />
      </Modal>
    ),
    [
      fundraisingModalData,
      fundraising,
      fundraisingMediaType,
      showFundraisingMediaModal,
    ]
  )

  return (
    <>
      {fundraisingMediaModal}
      {fundraisingProgramModal}
      <Box className="w-full">
        <TextInput
          show={formData?.event?.eventType !== EventType.Fundraiser}
          testid={'name-input'}
          validations={{
            maxLength: {
              value: 150,
              message: 'Title must be 150 characters or less',
            },
          }}
          required={isFieldRequired(
            validationRules.find((f) => f[0].includes('fundraising_title'))
          )}
          hint="Maximum of 150 characters"
          label="Fundraiser Title"
          placeholder="Fundraiser Title"
          className="flex-1 mr-2"
          value={fundraisingDetailsData?.title}
          onChange={(data) => {
            setFundraisingDetailsData({
              ...fundraisingDetailsData,
              title: data,
            })
          }}
        />
        <PriceInput
          label="Goal"
          className={`w-full`}
          required={isFieldRequired(
            validationRules.find((f) => f[0].includes('fundraising_goal'))
          )}
          currencySymbol={
            currencies[currency?.toUpperCase() ?? 'GBP'].symbol as any
          }
          onChange={(data) => {
            setFundraisingDetailsData({ ...fundraisingDetailsData, goal: data })
          }}
          value={fundraisingDetailsData?.goal ?? 0}
        />
        <RichTextEditor
          show={formData?.event?.eventType !== EventType.Fundraiser}
          testid="description-input"
          validations={{
            maxLength: {
              value: 1500,
              message: 'Description must be 1500 characters or less',
            },
          }}
          className="mt-2"
          required={isFieldRequired(
            validationRules.find((f) =>
              f[0].includes('fundraising_description')
            )
          )}
          hint="(Maximum of 1500 characters)"
          label="Description"
          placeholder={`Write all of the details of your ${
            formData?.event?.eventType === EventType.Fundraiser
              ? 'fundraiser'
              : 'event'
          }...`}
          value={fundraisingDetailsData?.description}
          onChange={(jsonString) => {
            const payload = {
              ...fundraisingDetailsData,
              description: jsonString,
            }
            setFundraisingDetailsData(payload)
          }}
        />
        <Box className="text-xl mb-6">Fundraising Programmes</Box>
        <Box className="mb-6 max-w-2xl">
          Let attendees choose what their donation goes towards with fundraising
          programmes. To enable fundraising programmes, add one now!
        </Box>
        <div className="flex items-center">
          <Button
            onClick={() => {
              setShowFundraisingProgramModal(true)
              setFundraisingProgramData(undefined)
            }}
            title="Add Programme"
            type="secondary"
            size="small"
          />
        </div>
        <hr className="my-6 border-gray-600 opacity-50" />

        <Box className="text-xl mb-6">Your Fundraising Programmes</Box>
        <Table
          tableHeading={['', 'Title', 'Description', 'Goal', '']}
          rows={fundraising?.programs?.map((content, index) => [
            <MediaThumbnail
              media={content.media?.url!}
              key={`media-key-${index}`}
            />,
            content.title ?? 'Title',
            truncateString(content.description ?? 'Description', 15),
            content.goal ?? 0,
            <TableRowActions
              key={index}
              confirmModal={{
                title: 'Are you sure?',
                content:
                  'Are you sure you want to delete this? This cannot be undone.',
              }}
              editClicked={() => {
                setFundraisingProgramData({
                  programTitle: content.title ?? '',
                  programDescription: content.description ?? '',
                  goal: content.goal ?? 0,
                  media: content.media,
                  editIndex: index,
                })
                setShowFundraisingProgramModal(true)
              }}
              deleteClicked={() => {
                setFormData({
                  ...formData,
                  fundraising: {
                    programs: fundraising?.programs?.filter(
                      (_, i) => index !== i
                    ),
                  },
                })
              }}
            />,
          ])}
        />
        <Box show={noPrograms}>
          <Box className="text-sm mt-8 text-center">
            {'No fundraiding programmes have been created'}
          </Box>
        </Box>
        <hr className="my-6 border-gray-600 opacity-50" />
      </Box>

      <Box className="text-xl mb-6">Fundraising Media</Box>
      <Box className="mb-6 max-w-2xl">
        Want to provide attendees with some additional content? Upload media
        content here for all attendees to view on the donation page.
      </Box>
      <div className="flex items-center">
        <Button
          onClick={() => {
            setFundraisingModalData(undefined)
            setShowFundraisingMediaModal(true)
          }}
          title="Upload Media"
          type="secondary"
          size="small"
        />
      </div>
      <hr className="my-6 border-gray-600 opacity-50" />

      <Box className="text-xl mb-6">Your Fundraising Media</Box>
      <Table
        tableHeading={['Media', 'Title', 'Description', '']}
        rows={fundraising?.media?.map((content, index) => [
          // <video
          //   key={content.title}
          //   width={128}
          //   height={72}
          //   src={content.url}
          // />,
          <MediaThumbnail
            size="md"
            className="mx-auto"
            key={`table-media-key-${index}`}
            media={content.url}
          />,
          content.title ?? 'Title',
          content.body ?? 'Description',
          <TableRowActions
            key={index}
            confirmModal={{
              title: 'Are you sure?',
              content:
                'Are you sure you want to delete this? This cannot be undone.',
            }}
            editClicked={() => {
              setFundraisingModalData({
                mediaTitle: content.title ?? '',
                mediaDescription: content.body ?? '',
                url: content.url ?? '',
                editIndex: index,
              })
              setShowFundraisingMediaModal(true)
            }}
            deleteClicked={() => {
              setFormData({
                ...formData,
                fundraising: {
                  ...formData?.fundraising,
                  ...fundraisingModalData,
                  media: fundraising?.media?.filter((_, i) => index !== i),
                },
              })
            }}
          />,
        ])}
      />
      <Box show={noMedia}>
        <Box className="text-sm mt-8 text-center">
          {'No media content have been created'}
        </Box>
      </Box>
      <hr className="my-6 border-gray-600 opacity-50" />
    </>
  )
}

FundraisingForm.Layout = CreateEventLayout

export default FundraisingForm
