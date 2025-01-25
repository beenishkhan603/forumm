import React, { useState } from 'react'
import { Button } from '@components/inputs/Button'

export interface Attendee {
  fullName: string
  email: string
}

interface Constituent {
  fullName: string
  email: string
}

interface BlackBaudConstituentsProps {
  localAttendees: Attendee[]
  remoteConstituents: Constituent[]
  onSave: (
    updatedConstituents: {
      localEmail: string
      selectedEmail: string
    }[]
  ) => void
  onBack: () => void
}

const BlackBaudConstituents: React.FC<BlackBaudConstituentsProps> = ({
  localAttendees,
  remoteConstituents,
  onSave,
  onBack,
}) => {
  const [selectedConstituents, setSelectedConstituents] = useState<{
    [key: string]: string
  }>({})
  const [approvedAttendees, setApprovedAttendees] = useState<Set<string>>(
    new Set()
  )
  const [visibleAttendees, setVisibleAttendees] = useState(localAttendees)

  // Helper function to check partial name or email match
  const matchesConstituent = (attendee: Attendee, constituent: Constituent) => {
    const [attendeeFirstName, attendeeLastName] = attendee.fullName
      .toLowerCase()
      .split(' ')
    const [constituentFirstName, constituentLastName] = constituent.fullName
      .toLowerCase()
      .split(' ')

    // Check if first name, last name or email matches
    const nameMatch =
      (attendeeFirstName &&
        constituent.fullName.toLowerCase().includes(attendeeFirstName)) ||
      (attendeeLastName &&
        constituent.fullName.toLowerCase().includes(attendeeLastName))

    const emailMatch =
      constituent.email.toLowerCase() === attendee.email.toLowerCase()

    return nameMatch || emailMatch
  }

  // Filtered list of remote constituents based on partial matching
  const getMatchingConstituents = (attendee: Attendee) => {
    return remoteConstituents.filter((constituent) =>
      matchesConstituent(attendee, constituent)
    )
  }

  const handleSelectChange = (attendeeEmail: string, selectedValue: string) => {
    setSelectedConstituents({
      ...selectedConstituents,
      [attendeeEmail]: selectedValue,
    })
  }

  const handleApprove = (attendeeEmail: string) => {
    if (selectedConstituents[attendeeEmail]) {
      setApprovedAttendees((prevApprovedAttendees) => {
        const updatedSet = new Set(prevApprovedAttendees)
        updatedSet.add(attendeeEmail)
        return updatedSet
      })
    }
  }

  const handleReject = (attendeeEmail: string) => {
    setVisibleAttendees(
      visibleAttendees.filter((attendee) => attendee.email !== attendeeEmail)
    )
  }

  const handleSave = () => {
    const curatedList = visibleAttendees
      .filter((attendee) => approvedAttendees.has(attendee.email)) // Only return approved attendees
      .map((attendee) => ({
        localEmail: attendee.email,
        selectedEmail: selectedConstituents[attendee.email], // Return the pairing of local and selected remote email
      }))
    onSave(curatedList)
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-lg">Full Name</th>
              <th className="px-4 py-2 text-left text-lg">Email</th>
              <th className="px-4 py-2 text-left text-lg">Constituent</th>
              <th className="px-4 py-2 text-left text-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleAttendees.map((attendee) => (
              <tr key={attendee.email} className="h-20">
                <td className="px-4 py-2 text-base">{attendee.fullName}</td>
                <td className="px-4 py-2 text-base">{attendee.email}</td>
                <td className="px-4 py-2 text-xs">
                  {approvedAttendees.has(attendee.email) ? (
                    <span>{selectedConstituents[attendee.email]}</span>
                  ) : (
                    <select
                      className="border p-2 rounded w-full"
                      value={selectedConstituents[attendee.email] || ''}
                      onChange={(e) =>
                        handleSelectChange(attendee.email, e.target.value)
                      }
                    >
                      <option value="">Select Constituent</option>
                      {/* Filter the remoteConstituents to show only potential matches */}
                      {getMatchingConstituents(attendee).map((constituent) => (
                        <option
                          key={constituent.email}
                          value={constituent.email}
                        >
                          {`${constituent.fullName} - ${constituent.email}`}
                        </option>
                      ))}
                      <option value="new">Add new constituent</option>
                    </select>
                  )}
                </td>
                <td className="px-4 py-2">
                  {!approvedAttendees.has(attendee.email) && (
                    <div className="flex space-x-2">
                      <Button
                        title="Approve"
                        type="primary"
                        size="small"
                        textColor="white"
                        onClick={() => handleApprove(attendee.email)}
                        disabled={!selectedConstituents[attendee.email]} // Disable if no option is selected
                      />
                      <Button
                        title="Reject"
                        type="danger"
                        size="small"
                        onClick={() => handleReject(attendee.email)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <Button title="Go Back" type="primary" size="small" onClick={onBack} />
        <Button
          title="Confirm"
          type="blackbaud"
          size="small"
          onClick={handleSave}
          className="ml-2"
        />
      </div>
    </div>
  )
}

export const parseAttendees = (attendeesString: string): Attendee[] => {
  if (!attendeesString) return []

  return attendeesString.split(',').map((attendee) => {
    const [fullName, email] = attendee.trim().split(' (')
    return {
      fullName: fullName.trim(),
      email: email?.replace(')', '').trim() || '',
    }
  })
}

export default BlackBaudConstituents
