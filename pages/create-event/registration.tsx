import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { DropdownInput } from '@components/inputs/DropdownInput'
import { PriceInput } from '@components/inputs/PriceInput'
import { TextInput } from '@components/inputs/TextInput'
import Modal from '@components/base/Modal'
import {
  EventDetails,
  EventTicket,
  RegistrationFieldInput,
  TicketType,
} from '@graphql/__generated/graphql'
import CreateEventLayout from '@layouts/CreateEventLayout'
import { CreateEventContext } from '@libs/CreateEventContext'
import React, { useContext, useEffect, useState } from 'react'
import Table from '@components/base/Table'
import TableRowActions from '@components/event/TableRowActions'
import currencies from '@libs/currencies'
import { ErrorType } from '@libs/ErrorHandler/error.type'

const TicketsForm = ({ currency }: { currency: string }) => {
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showFieldModal, setShowFieldModal] = useState(false)

  const { formData, setFormData } = useContext(CreateEventContext)

  const currencyDetails = currencies[currency.toUpperCase()]

  const [ticketModalData, setTicketModalData] = useState<
    Partial<EventTicket & { editIndex?: number }> | undefined
  >(undefined)

  const [fieldModalData, setFieldModalData] = useState<
    (RegistrationFieldInput & { editIndex?: number }) | undefined
  >(undefined)

  const { registrationFields } = formData ?? {}

  const tickets = (() => {
    const payload: (Omit<EventTicket, 'adminFee'> & { remaining: number })[] =
      []

    formData?.tickets?.forEach((t) => {
      const availableTicket = formData.availableTickets?.tickets?.find(
        (at) => at.ticketTitle === t.title
      )
      payload.push({
        ...t,
        remaining: availableTicket?.remaining
          ? parseInt(availableTicket?.remaining)
          : 0,
      })
    })

    return payload
  })()

  useEffect(() => {
    const payload = {
      ...formData,
      event: { ...formData?.event, currency: currency } as EventDetails,
    }
    if (formData?.event?.currency !== currency) setFormData(payload)
    // eslint-disable-next-line
  }, [currency])

  const noTickets = tickets == undefined || tickets.length === 0
  const noFields =
    registrationFields == undefined || registrationFields.length === 0

  const [errors, setErrors] = useState<ErrorType | undefined>(undefined)

  const addTicketModal = (
    <Modal
      show={showTicketModal}
      setShow={setShowTicketModal}
      title={`${
        ticketModalData?.editIndex !== undefined ? 'Edit' : 'Create'
      } Ticket`}
    >
      <TextInput
        validations={{
          minLength: {
            value: 1,
            message: 'Ticket name must be at least 1 character',
          },
          maxLength: {
            value: 70,
            message: 'Ticket name must be at most 70 characters',
          },
        }}
        required
        label="Title"
        placeholder="VIP Ticket"
        value={ticketModalData?.title}
        onChange={(data) => {
          setTicketModalData({ ...ticketModalData, title: data })
        }}
      />
      <TextInput
        required
        label="Available Tickets"
        placeholder="50"
        type="number"
        value={ticketModalData?.quantity}
        validations={{
          minLength: {
            value: 1,
            message: 'Tickets available must be at least 1 ',
          },
          maxLength: {
            value: 4,
            message: 'Tickets available must be at most 9999',
          },
        }}
        onChange={(data) => {
          setTicketModalData({ ...ticketModalData, quantity: data })
        }}
      />
      <DropdownInput
        label="Ticket Type"
        options={[
          { value: TicketType.Paid, label: 'Paid' },
          { value: TicketType.Free, label: 'Free' },
        ]}
        required
        placeholder="Select a ticket type"
        onChange={(data) => {
          setTicketModalData({ ...ticketModalData, ticketType: data })
        }}
        value={ticketModalData?.ticketType}
      />

      {ticketModalData?.ticketType === TicketType.Paid ? (
        <PriceInput
          required
          label="Price"
          currencySymbol={currencyDetails.symbol}
          value={ticketModalData?.price}
          onChange={(data) => {
            setTicketModalData({
              ...ticketModalData,
              price: data,
            })
          }}
          placeholder="14.99"
        />
      ) : (
        <></>
      )}
      <Button
        className="my-4"
        title={`${
          ticketModalData?.editIndex !== undefined ? 'Edit' : 'Create'
        } Ticket`}
        type="primary"
        onClick={(e) => {
          e.preventDefault()

          const ticketData = {
            title: ticketModalData?.title ?? '',
            ticketType: ticketModalData?.ticketType ?? TicketType.Free,
            price: parseFloat(ticketModalData?.price?.toString() ?? '0.00'),
            quantity: parseInt(ticketModalData?.quantity?.toString() ?? '0'),
          }

          const payload = [...(formData?.tickets ?? [])]

          if (ticketModalData?.editIndex)
            payload[ticketModalData.editIndex] = ticketData
          else payload.push(ticketData)

          setFormData({
            ...formData,
            tickets: payload,
          })

          setShowTicketModal(false)
          setTicketModalData(undefined)
        }}
      />
    </Modal>
  )

  const addFieldModal = (
    <Modal
      show={showFieldModal}
      setShow={setShowFieldModal}
      title={`${
        fieldModalData?.editIndex !== undefined ? 'Edit' : 'Create'
      } Field`}
    >
      <TextInput
        validations={{
          minLength: {
            value: 1,
            message: 'Field name must be at least 1 character',
          },
          maxLength: {
            value: 70,
            message: 'Field name must be at most 70 characters',
          },
        }}
        required
        label="Field Name"
        placeholder="E.g. Year of Graduation"
        value={fieldModalData?.name}
        onChange={(data) => {
          setFieldModalData({ ...fieldModalData, name: data })
        }}
      />

      <Button
        className="my-4"
        title={`${
          fieldModalData?.editIndex !== undefined ? 'Edit' : 'Create'
        } Field`}
        type="primary"
        onClick={(e) => {
          e.preventDefault()

          if (!fieldModalData?.name)
            return setErrors({
              message: 'You must provide a name for registration fields.',
            })

          const fieldData = {
            name: fieldModalData?.name!,
          }

          const payload = [...(formData?.registrationFields ?? [])]

          if (fieldModalData?.editIndex === 0 || fieldModalData?.editIndex)
            payload[fieldModalData!.editIndex!] = fieldData
          else payload.push(fieldData)

          setFormData({
            ...formData,
            registrationFields: payload,
          })

          setShowFieldModal(false)
          setFieldModalData({ ...fieldModalData, name: '' })
        }}
      />
    </Modal>
  )

  const hasPaidTicket =
    tickets?.filter((ticket) => ticket.ticketType === 'PAID').length > 0

  return (
    <>
      {addTicketModal}
      {addFieldModal}
      <Box className="w-full">
        {errors ? (
          <Box
            ignoreTheme
            className={`transition-all my-2 ${
              errors.message ? 'opacity-100' : 'opacity-0'
            } text-red-500 text-sm font-bold`}
          >
            {errors.message ?? ''}
          </Box>
        ) : null}
        <Box className="flex items-center space-x-2 mb-4 mt-6">
          <Box className="text-xl">Tickets List</Box>
          <Button
            onClick={() => {
              setTicketModalData(undefined)
              setShowTicketModal(true)
            }}
            title="Add Ticket"
            type="secondary"
            size="small"
          />
        </Box>
        <Table
          tableHeading={[
            'Title',
            'Ticket Type',
            'Price',
            'Quantity',
            'Available',
            '',
          ]}
          rows={tickets.map((ticket, index) => [
            ticket.title,
            ticket.ticketType,
            `${currencyDetails.symbol}${ticket.price!.toFixed(2)}`,
            ticket.quantity,
            ticket?.remaining || ticket.quantity,
            <TableRowActions
              key={index}
              editClicked={() => {
                setTicketModalData({
                  title: ticket.title,
                  ticketType: ticket.ticketType,
                  quantity: ticket.quantity,
                  price: ticket.price,
                  editIndex: index,
                })
                setShowTicketModal(true)
              }}
              deleteClicked={() => {
                setFormData({
                  ...formData,
                  tickets: formData?.tickets?.filter((_, i) => i !== index),
                })
              }}
            />,
          ])}
        />
        <Box show={noTickets}>
          <Box className="text-sm mt-8 text-center mb-8">
            {'No tickets have been created yet'}
          </Box>
        </Box>

        <Box className="flex items-center space-x-2 mt-12">
          <Box className="text-xl">Registration Details</Box>
          <Button
            onClick={() => {
              setFieldModalData(undefined)
              setShowFieldModal(true)
            }}
            title="Add Field"
            type="secondary"
            size="small"
          />
        </Box>
        <Box className="mt-4 mb-4 text-sm">
          Need to capture some information from your attendees? Add information
          fields that you wish to capture from attendees
        </Box>
        <Table
          tableHeading={['Field Name', '']}
          rows={registrationFields?.map((field, index) => [
            field.name,
            <TableRowActions
              key={index}
              confirmModal={{
                title: 'Are you sure?',
                content:
                  'Are you sure you want to delete this? This cannot be undone.',
              }}
              editClicked={() => {
                setFieldModalData({
                  name: field.name,
                  editIndex: index,
                })
                setShowFieldModal(true)
              }}
              deleteClicked={() => {
                setFormData({
                  ...formData,
                  registrationFields: registrationFields?.filter(
                    (_, i) => i !== index
                  ),
                })
              }}
            />,
          ])}
        />
        <Box show={noFields}>
          <Box className="text-sm mt-8 text-center mb-8">
            {'No custom fields have been created'}
          </Box>
          <hr className="my-6 border-gray-600 opacity-50" />
        </Box>
      </Box>
    </>
  )
}

TicketsForm.Layout = CreateEventLayout

export default TicketsForm
