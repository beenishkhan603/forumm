import { useState, useEffect } from 'react'
import Modal from '@components/base/Modal'
import Box from '@components/base/Box'
import { useTheme } from '@libs/useTheme'
import Text from '@components/base/Text'
import { Button } from '@components/inputs/Button'
import { IoClose } from 'react-icons/io5'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import type { OrganizationType } from '@libs/useOrganisationProfile'
import { UPDATE_ORGANISATION } from '@graphql/organisation/updateOrganisation'

const StylingModal = ({
  organisationData,
}: {
  organisationData: OrganizationType
}) => {
  const { push } = useRouter()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [doNotShowAgain, setDoNotShowAgain] = useState<boolean>(false)

  const [updateOrganisation] = useMutation(UPDATE_ORGANISATION)

  useEffect(() => {
    if (organisationData?.name) {
      const doNotShowAgain = organisationData?.dashboardPopupDoNotShowAgain
      if (doNotShowAgain) return
      const hasCustomized = !!(
        organisationData?.bannerImage &&
        organisationData?.logoImage &&
        organisationData?.mainColour
      )
      if (!hasCustomized) {
        setIsOpen(true)
      }
    }
  }, [organisationData])

  const handleSave = async () => {
    if (organisationData?.name) {
      updateOrganisation({
        variables: {
          name: organisationData.name,
          dashboardPopupDoNotShowAgain: doNotShowAgain,
        },
      })
      setIsOpen(false)
    }
  }

  return (
    <Modal
      show={isOpen || false}
      setShow={(val: boolean) => {
        if (setIsOpen) setIsOpen(val)
      }}
      title="Modal Title"
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
              🎨 Enhance Your Brand Identity Now
            </Box>
          </Box>
          <IoClose
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              handleSave()
              setIsOpen(false)
            }}
          />
        </Box>
        <Box className="relative p-10">
          <Text className="mb-5">Let{`'`}s Add Some Color to Your World!</Text>
          <Text className="mb-5">
            We{`'`}ve noticed that your organisation{`'`}s dashboard is still in
            its default attire. It{`'`}s time to dress it up! Customize your
            dashboard now to make it truly yours and resonate with your brand
            {`'`}s unique identity.
          </Text>
          <Text className="mb-5">
            Just a few clicks and you{`'`}ll transform your dashboard from
            generic to iconic.
          </Text>
          <Box className="w-full flex items-center justify-center">
            <Button
              title="Complete your brand identity now!"
              type="primary"
              size="auto"
              onClick={() => {
                handleSave()
                push('/organisation-settings')
              }}
            />
          </Box>
          <Text className="mt-8">
            Let your organisation{`'`}s character shine through every aspect of
            your dashboard. This is more than customization; it{`'`}s about
            creating an experience that aligns with your vision and engages your
            audience.
          </Text>
          <Box className="text-sm mb-1 mt-8">
            <input
              type="checkbox"
              checked={doNotShowAgain}
              onChange={() => setDoNotShowAgain(!doNotShowAgain)}
              className="mr-2 pt-1"
            />
            <span
              className="font-bold cursor-pointer"
              onClick={() => setDoNotShowAgain(!doNotShowAgain)}
            >
              Do not show again
            </span>
          </Box>
          <Box className="w-full flex justify-end">
            <Button
              title="Skip"
              type="secondary"
              size="auto"
              onClick={handleSave}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default StylingModal
