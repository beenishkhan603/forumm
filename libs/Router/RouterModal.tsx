import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import { Button } from '@components/inputs/Button'
import { Dispatch, SetStateAction, useState } from 'react'

type TRouterModalData =
  | { title: string; message: string; icon?: any; callback?: () => void }
  | undefined

export type TRouterModalTuple = [
  element: JSX.Element,
  executors: {
    setModalOpen: Dispatch<SetStateAction<boolean>>
    setModalData: Dispatch<SetStateAction<TRouterModalData>>
  }
]

const useRouterModal = (): TRouterModalTuple => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<TRouterModalData>()

  const modalElement = (
    <Modal
      title={modalData?.title ?? 'You are Live!'}
      show={modalOpen}
      setShow={setModalOpen}
    >
      <Box className={`flex items-center justify-center pb-0`}>
        {modalData?.icon && (
          <Box
            className={`flex items-center justify-center p-2 bg-red-50 rounded-full`}
          >
            {modalData?.icon}
          </Box>
        )}
      </Box>
      <Box className={`flex flex-col items-center justify-center`}>
        <Box className="text-md mb-2">
          {modalData?.message ??
            'Please end your stream before leaving this page.'}
        </Box>
      </Box>
      <Box
        show={!!modalData?.callback}
        className={`flex flex-row items-center justify-between mt-4`}
      >
        <Button
          size="auto"
          onClick={() => setModalOpen(false)}
          className="flex-1 mx-2"
          title="Cancel"
          type="tertiary"
        />
        <Button
          size="auto"
          onClick={() => {
            if (modalData?.callback) modalData.callback()
            setModalOpen(false)
          }}
          className="flex-1 mx-2"
          title="Confirm"
          type="danger"
        />
      </Box>
    </Modal>
  )

  return [modalElement, { setModalOpen, setModalData }]
}

export default useRouterModal
