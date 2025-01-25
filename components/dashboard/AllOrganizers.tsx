import React from 'react'
import { useState } from 'react'
import Box from '@components/base/Box'
import { useRouter } from 'next/router'
import ProfileImage from '@components/base/ProfileImage'
import { useDashboard } from '@libs/useDashboard'
import Modal from '@components/base/Modal'
import moment from 'moment'
import { Button } from '@components/inputs/Button'
import { FaFileCsv } from 'react-icons/fa'
import { stringify } from 'csv-stringify'
import { saveAs } from 'file-saver'
import { User } from '@graphql/__generated/graphql'

export default function AllOrganizers(): JSX.Element {
  const { query } = useRouter()
  const { organizers } = useDashboard()

  const allOrganizers = organizers?.flatMap((o: User) => {
    return {
      email: o?.email!,
      name: o?.name!,
      organisation: o?.company ?? o?.university,
      profileImage: o?.profileImage!,
      userId: o?.userId,
      isActive: o?.isActive,
      lastActive: o?.lastActive,
    }
  })

  const [showModal, setShowModal] = useState(false)
  const [selectedOrganizer, setSelectedOrganizer] = useState<any>(null)

  const downloadCSV = () => {
    const rows =
      allOrganizers?.map((o) => ({
        UserId: o?.userId,
        Name: o?.name,
        Email: o?.email,
        Organisation: o?.organisation,
        LastActive: o?.lastActive,
      })) || []

    const header = ['UserId', 'Name', 'Email', 'Organisation', 'LastActive']

    stringify(rows, { header: true, columns: header }, (err, csvString) => {
      if (err) {
        console.error(err)
        return
      }
      // Save the CSV file to the user's computer
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' })
      saveAs(blob, 'organiser-data.csv')
    })
  }

  const modal = (
    <Modal
      title="Organiser Information"
      show={showModal}
      setShow={setShowModal}
    >
      <Box className="flex flex-col mx-10 text-sm font-light">
        <Box className="flex flex-col items-center">
          <Box className="flex">
            <ProfileImage
              className="rounded-full border border-white border-opacity-50"
              size="lg"
              imageUrl={selectedOrganizer?.profileImage}
            />
          </Box>
          <Box className="py-2 flex font-bold text-2xl">
            {selectedOrganizer?.name}
          </Box>
        </Box>

        <Box className="py-2 flex ">
          <Box className="font-bold mr-2"> Last Active:</Box>
          {selectedOrganizer?.lastActive === undefined
            ? 'Unknown'
            : moment(selectedOrganizer?.lastActive).fromNow()}
        </Box>
        <Box className="py-2 flex">
          <Box className="font-bold mr-2">Email:</Box>
          {selectedOrganizer?.email}
        </Box>
        <Box className=" py-2 flex">
          <Box className="font-bold mr-2">Organisation:</Box>
          {selectedOrganizer?.organisation}
        </Box>
        <Button
          className="mt-4"
          title="View Profile"
          href={`/user/${selectedOrganizer?.userId}`}
        ></Button>
      </Box>
    </Modal>
  )

  return (
    <Box
      color="foregroundColour"
      className="px-6 py-4 h-96 overflow-y-scroll  "
    >
      <Box className="text-white text-md py-4 font-bold flex justify-between  ">
        Organisers
        <FaFileCsv
          className="cursor-pointer text-2xl"
          title="Download CSV"
          onClick={downloadCSV}
        />
      </Box>

      {modal}
      {allOrganizers?.length === 0 ? (
        <Box className="text-white">No Organisers</Box>
      ) : (
        allOrganizers?.map((s: any) => (
          <Box
            onClick={() => {
              setShowModal(true)
              setSelectedOrganizer({
                email: s?.email,
                userId: s?.userId,
                name: s?.name,
                profileImage: s?.profileImage,
                isActive: s?.isActive,
                lastActive: s?.lastActive,
              })
            }}
            key={s?.userId}
            className="grid grid-cols-5 gap-4 items-center p-2 cursor-pointer hover:border hover:scale-100 transition duration-300 ease-in-out"
          >
            <Box className="flex">
              <ProfileImage
                imageUrl={s?.profileImage}
                activityStatus={s?.isAnonymous === 'true' ? false : s?.isActive}
                className="flex-shrink"
              />
            </Box>

            <Box className="text-white text-sm col-span-2">
              {s?.name ?? 'No name on file.'}
            </Box>
            <Box className="text-sm col-span-2 text-left flex ">
              Organisation: {s?.organisation ?? 'No organisation on file.'}
            </Box>
          </Box>
        ))
      )}
    </Box>
  )
}
