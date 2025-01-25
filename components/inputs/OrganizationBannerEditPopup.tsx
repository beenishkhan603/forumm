import { MdEdit } from 'react-icons/md'
import { useState, useEffect } from 'react'
import Modal from '@components/base/Modal'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import { IoClose } from 'react-icons/io5'
import { TextInput } from '@components/inputs/TextInput'
import { getContrastColor } from '@libs/Utility/util'

const OrganizationBannerEditPopup = ({
  onSave,
  headerTextOne,
  headerTextTwo,
}: {
  onSave: (title: string, subtitle: string) => void
  headerTextOne?: string
  headerTextTwo?: string
}) => {
  const { theme } = useTheme()
  const [form, setForm] = useState<{
    title?: string
    subtitle: string
  }>({
    title: '',
    subtitle: '',
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleSave = () => {
    const hasTitle =
      form.title && form.title.length >= 5 && form.title.length < 200
    const hasSubtitle =
      form.subtitle && form.subtitle.length >= 5 && form.subtitle.length < 200
    if (hasTitle && hasSubtitle) {
      onSave(form?.title ?? '', form?.subtitle ?? '')
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...form,
        title: headerTextOne ?? '',
        subtitle: headerTextTwo ?? '',
      })
    }
  }, [isOpen])

  const textEditModal = (
    <Modal
      show={isOpen || false}
      setShow={(val: boolean) => {
        if (setIsOpen) setIsOpen(val)
      }}
      className="p-0"
      version
    >
      <Box
        className={`overflow-auto scrollbar-hide rounded rounded-xl ${
          theme.type === 'DARK' ? 'bg-midnight-dark' : 'bg-white'
        }`}
      >
        <Box
          className="sticky top-0 z-10 flex justify-between items-center p-4 rounded-tl-xl rounded-tr-xl"
          style={{
            backgroundColor: theme.foregroundColour,
          }}
        >
          <Box className="flex items-center justify-start">
            <Box className="text-md font-bold">
              Configure your organisation heading text
            </Box>
          </Box>
          <IoClose
            className="w-6 h-6 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </Box>
        <Box className="relative p-10 pt-3 pb-6">
          <Text>
            <TextInput
              value={form?.title}
              onChange={(title: string) => setForm({ ...form, title })}
              validations={{
                minLength: {
                  value: 5,
                  message: `The Title must be at least 5 characters`,
                },
                maxLength: {
                  value: 200,
                  message: `The Title must be less than 200 characters`,
                },
              }}
              label="Banner Title"
              placeholder="Your Banner Title"
              required
            />
          </Text>
          <Text className="mb-5">
            <TextInput
              value={form?.subtitle}
              onChange={(subtitle: string) => setForm({ ...form, subtitle })}
              validations={{
                minLength: {
                  value: 5,
                  message: `The Subtitle must be at least 5 characters`,
                },
                maxLength: {
                  value: 200,
                  message: `The Subtitle must be less than 200 characters`,
                },
              }}
              label="Banner Subtitle"
              placeholder="Your Banner Subtitle"
              required
            />
          </Text>
          <Box className="w-full flex justify-end">
            <Button
              title="Save"
              type="secondary"
              size="auto"
              onClick={handleSave}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  )

  const contrastColor = getContrastColor(theme.highlightColour)

  return (
    <Box
      onClick={() => setIsOpen(true)}
      className="absolute top-5 -right-5  sm:top-0 sm:right-0 !h-[33px] !w-[33px] inline-block rounded-full items-center cursor-pointer text-white ml-2 transform"
      style={{
        backgroundColor: theme.highlightColour,
      }}
    >
      <MdEdit
        className="absolute top-[8px] left-[9px] h-4 w-4 inline-block hover:animate-heartbeat"
        style={{ color: contrastColor }}
      />
      {textEditModal}
    </Box>
  )
}

export default OrganizationBannerEditPopup
