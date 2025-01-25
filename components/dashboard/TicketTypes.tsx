import React, { useEffect, useState } from 'react'
import { IoTicketSharp } from 'react-icons/io5'
import { BiCog, BiRightArrowAlt } from 'react-icons/bi'
import Box from '@components/base/Box'
import { useDashboard } from '@libs/useDashboard'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_MERCHANT } from '@graphql/users/createMerchant'
import { GET_IS_MERCHANT } from '@graphql/users/getMerchantAccount'
import { ErrorType } from '@libs/ErrorHandler/error.type'
import { Button } from '@components/inputs/Button'
import Modal from '@components/base/Modal'
import { useRouter } from 'next/router'

export default function TicketTypes({
  selectedOption,
}: {
  selectedOption: string | undefined
}): JSX.Element {
  const { events, eventsByYear, eventsByMonth, profile } = useDashboard()
  let selectedEvents
  if (selectedOption === 'All Time Information') {
    selectedEvents = events
  } else if (selectedOption === 'Current Year') {
    selectedEvents = eventsByYear
  } else if (selectedOption === 'Current Month') {
    selectedEvents = eventsByMonth
  }

  const allTicketTypes = selectedEvents
    ?.filter((e) => e.tickets !== (undefined || null))
    .flatMap((e) =>
      e.tickets?.map((t) => ({
        ticketType: t,
        title: e.event?.title!,
      }))
    )

  return (
    <>
      <Box
        color="foregroundColour"
        className="px-6 py-4 h-96 overflow-y-scroll "
      >
        <Box className="flex flex-row w-full justify-between align-center">
          <Box className="text-md py-4 font-semibold  ">Ticket Types</Box>
        </Box>
        <Box
          className="grid grid-cols-5 gap-4 py-2 px-2 items-center"
          color="backgroundColour"
        >
          <Box />
          <Box className="text-sm col-span-2  ">Ticket and Event</Box>
          <Box className=" text-sm text-left ">Quantity</Box>
          <Box className=" text-sm text-left ">Price</Box>
        </Box>
        {allTicketTypes?.length === 0 ? (
          <Box className=" text-md py-4 ">No Tickets</Box>
        ) : (
          allTicketTypes?.map((t) => (
            <Box
              key={`${Math.random()} ${t?.ticketType} ${t?.title} ${
                t?.ticketType.price
              }`}
              className="grid grid-cols-5 gap-4 py-2 px-2 items-center border-b border-gray-100/10  "
            >
              <Box className="bg-midnight-dark p-3 w-12 h-12 flex justify-center rounded items-center">
                <IoTicketSharp className="text-lg  " />
              </Box>

              <Box className=" text-sm col-span-2">
                <Box>{t?.ticketType.title}</Box>
                <Box className="text-xs text-gray-400">Event: {t?.title} </Box>
                <Box className="text-xs text-gray-400">
                  Type: {t?.ticketType.ticketType}
                </Box>
              </Box>
              <Box className=" text-sm text-left col-span-1">
                {t?.ticketType.quantity}
              </Box>
              <Box className=" text-sm text-left">
                £{t?.ticketType.price.toFixed(2)}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </>
  )
}
