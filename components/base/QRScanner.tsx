import React, { useEffect, useState, useRef } from 'react'
import { BrowserQRCodeReader } from '@zxing/browser'
import { IoQrCodeOutline } from 'react-icons/io5'
import { Button } from '@components/inputs/Button'
import Box from '@components/base/Box'
import { IoClose } from 'react-icons/io5'
import Modal from '@components/base/Modal'

const QRScanner = ({ onRead }: { onRead: (text: string) => void }) => {
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!isScanning) return

    const codeReader = new BrowserQRCodeReader()

    const startScanning = async () => {
      const devices = await BrowserQRCodeReader.listVideoInputDevices()
      const selectedDeviceId = devices?.[1]?.deviceId ?? devices?.[0]?.deviceId

      if (videoRef.current) {
        const controls = await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error, controls) => {
            if (result) {
              setIsScanning(false)
              onRead(result.getText())
              controls.stop()
            }
            if (error) {
              console.error(error)
            }
          }
        )
      }
    }
    startScanning()
  }, [isScanning, onRead])

  return (
    <div>
      {!isScanning && (
        <Box>
          <Button
            title="Scan Ticket"
            size="auto"
            // TODO: this should be visible, review it after.
            // icon={<IoQrCodeOutline size="1.5em" />}
            onClick={() => setIsScanning(!isScanning)}
            className="ml-1 whitespace-nowrap"
          />
        </Box>
      )}
      <Modal
        show={isScanning}
        title="Attendee QR Code Verification"
        setShow={(val: boolean) => {
          setIsScanning(false)
        }}
      >
        <Box className="w-full relative">
          <Box className="text-xs text-center mb-6">
            Please scan the attendee`s QR code from their registration
            confirmation.
          </Box>
          <video ref={videoRef}></video>
        </Box>
      </Modal>
    </div>
  )
}

export default QRScanner
