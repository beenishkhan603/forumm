import React, { useState, useEffect } from 'react'
import Box from '@components/base/Box'
import Modal from '@components/base/Modal'
import BlackBaudIcon from '@public/images/BlackBaudIcon.svg'
import ForummIcon from '@public/images/forummIcon.svg'
import { TbArrowsDiff } from 'react-icons/tb'
import { Button } from '@components/inputs/Button'
import BlackBaudConstituents, {
  parseAttendees,
} from '@components/event/BlackBaudConstituents'

interface EventDataItem {
  label: string
  content: string
}

interface EventData {
  local: EventDataItem[]
  remote: EventDataItem[]
}

export interface UpdatedConstituentItem {
  localEmail: string
  selectedEmail: string
}

interface BlackBaudEventModalProps {
  data: EventData
  show: boolean
  onSave: (
    selection: string[],
    updatedConstituents: UpdatedConstituentItem[] | undefined
  ) => void
  setShow: (show: boolean) => void
}

const BlackBaudEventModal: React.FC<BlackBaudEventModalProps> = ({
  data,
  show,
  onSave,
  setShow,
}) => {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({})
  const [constituentsVisible, setConstituentsVisible] = useState<boolean>(false)
  const [disabledState, setDisabledState] = useState<Record<string, boolean>>(
    {}
  )
  const [error, setError] = useState<String | undefined>()
  const [updatedConstituents, setUpdatedConstituents] = useState<
    UpdatedConstituentItem[] | undefined
  >()

  useEffect(() => {
    if (data?.local) {
      const initialCheckedState: Record<string, boolean> = {}
      const initialDisabledState: Record<string, boolean> = {}

      data.local.forEach((item) => {
        const key = item.label.toLowerCase().replace(/\s+/g, '')
        initialDisabledState[key] = !item.content // Disable if content is falsy
        initialCheckedState[key] = !!item.content && !initialDisabledState[key] // Only check if content is present and it's not disabled
      })

      // If it's the first-time sync, enforce "name" and "description" to be checked
      if (!data.remote) {
        if (initialDisabledState['name']) {
          initialCheckedState['name'] = true
          initialDisabledState['name'] = false
        }
        if (initialDisabledState['description']) {
          initialCheckedState['description'] = true
          initialDisabledState['description'] = false
        }
      }

      setCheckedState(initialCheckedState)
      setDisabledState(initialDisabledState)
    }
  }, [data])

  if (!data?.local) {
    return null
  }

  const handleCheckboxChange = (label: string) => {
    const key = label.toLowerCase().replace(/\s+/g, '')
    setCheckedState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }))
  }

  const handleConfirm = () => {
    setError(undefined)
    const isAnyOptionChecked = Object.values(checkedState).some(
      (value) => value === true
    )
    if (!isAnyOptionChecked) {
      setError('At least one option is required')
      return
    }
    if (!data.remote && (!checkedState.title || !checkedState.description)) {
      setError(
        'Please provide both a name and a description for the initial save'
      )
      return
    }
    const selection = Object.keys(checkedState).filter(
      (key) => checkedState[key]
    )
    onSave(selection, updatedConstituents)
    setTimeout(() => {
      setUpdatedConstituents(undefined)
    }, 0)
  }

  const compareFields = (localContent: string, remoteContent: string) => {
    if (!remoteContent || remoteContent === '' || remoteContent === 'Not set')
      return <span className="text-green-600 text-sm">New</span>
    if (localContent === remoteContent) {
      return <span className="text-green-600 text-sm">Equals</span>
    }
    return <span className="text-red-600 text-sm">Changed</span>
  }

  const handleMarkAll = () => {
    const newCheckedState: Record<string, boolean> = {}
    Object.keys(checkedState).forEach((key) => {
      if (!disabledState[key]) {
        newCheckedState[key] = true
      } else {
        newCheckedState[key] = checkedState[key]
      }
    })
    setCheckedState(newCheckedState)
  }

  const handleSyncAttendees = () => {
    setConstituentsVisible(true)
  }

  if (constituentsVisible) {
    // Extracting local and remote attendees from the data
    const localAttendeesString =
      data.local.find((item) => item.label === 'Attendees')?.content || ''
    const remoteAttendeesString =
      (data?.remote ?? []).find((item) => item.label === 'Attendees')
        ?.content || ''
    const localAttendees = parseAttendees(localAttendeesString)
    const remoteConstituents = parseAttendees(remoteAttendeesString)
    return (
      <Modal show={show} setShow={setShow} title="Sync With BlackBaud">
        <BlackBaudConstituents
          onSave={(diffConstituents) => {
            setUpdatedConstituents(
              diffConstituents as unknown as UpdatedConstituentItem[]
            )
            setConstituentsVisible(false)
          }}
          onBack={() => setConstituentsVisible(false)}
          localAttendees={localAttendees}
          remoteConstituents={remoteConstituents}
        />
      </Modal>
    )
  }

  const generateUpdateMessage = (
    updatedConstituents?: UpdatedConstituentItem[]
  ) => {
    if (!updatedConstituents || updatedConstituents.length === 0) {
      return ''
    }

    const updates = updatedConstituents.map((constituent) => {
      if (constituent.selectedEmail === 'new') {
        return `A new constituent will be created for "${constituent.localEmail}".`
      }
      return `${constituent.selectedEmail} will be updated with attendee "${constituent.localEmail}".`
    })

    const updateCount = updates.length
    const message = `${updateCount} update${
      updateCount > 1 ? 's' : ''
    } will be pushed:\n${updates.join('\n')}`

    return message
  }

  const getAttendeeDiff = () => {
    if (updatedConstituents && updatedConstituents.length > 0) {
      return <span className="text-green-600 text-sm">Review Done</span>
    }
    return <span className="text-yellow-600 text-sm">Needs Review</span>
  }

  const renderMultiline = (label: string) => {
    return (
      <div>
        {label.split(',').map((line, index) => (
          <p key={index}>{line.trim()}</p>
        ))}
      </div>
    )
  }

  const getBlackBaudDisplayText = (defaultText: string) => {
    if (updatedConstituents && updatedConstituents.length > 0) {
      const message = generateUpdateMessage(updatedConstituents)
      return (
        <div className="text-green-600 text-xs">
          {message.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )
    }
    return (
      <p className="text-gray-600 text-xs">{renderMultiline(defaultText)}</p>
    )
  }

  return (
    <Modal show={show} setShow={setShow} title="Sync With BlackBaud">
      <Box className="w-full relative p-2 min">
        <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[620px] scrollbar-custom">
          {/* Column Headers */}
          <div>
            <h3 className="font-semibold mb-4">
              <ForummIcon
                className="float-left mr-1"
                viewBox="0 0 43 46"
                preserveAspectRatio="xMidYMid meet"
                height="24px"
                width="24px"
              />
              Forumm
            </h3>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Blackbaud</h3>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Differences</h3>
          </div>

          {/* Data Rows */}
          {(data.local ?? []).map((localItem, index) => {
            const key = localItem.label.toLowerCase().replace(/\s+/g, '')

            const remoteItem = data.remote?.find(
              (remoteItem) => remoteItem.label === localItem.label
            )
            const remoteContent = remoteItem?.content || 'Not set'

            const bbDisplayText =
              localItem.label === 'Attendees' ? (
                getBlackBaudDisplayText(remoteContent)
              ) : (
                <p className="text-gray-600 text-xs">{remoteContent}</p>
              )

            const localContet = localItem.content || 'Not set'

            return (
              <React.Fragment key={index}>
                {/* Forumm Column */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={checkedState[key]}
                    onChange={() => handleCheckboxChange(localItem.label)}
                    className="mr-4 mt-1 h-[15px] w-[15px] text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={disabledState[key]}
                  />
                  <div>
                    <h4 className="font-medium text-gray-700">
                      {localItem.label}
                    </h4>
                    <p className="text-gray-600 text-xs">
                      {localItem.label === 'Attendees'
                        ? renderMultiline(localContet)
                        : localContet}
                    </p>
                  </div>
                </div>

                {/* Blackbaud Column */}
                <div className="flex items-start">
                  <div>
                    <h4 className="font-medium text-gray-700 text-sm">
                      {localItem.label}
                    </h4>
                    {bbDisplayText}
                  </div>
                </div>

                {/* Diff Column */}
                <div className="flex items-start">
                  <div>
                    {key === 'attendees'
                      ? getAttendeeDiff()
                      : compareFields(localItem.content, remoteContent)}
                  </div>
                  {key === 'attendees' && (
                    <Button
                      className="ml-4 -mt-1"
                      onClick={handleSyncAttendees}
                      title="Review"
                      type="blackbaud"
                      size="small"
                      loading={false}
                    />
                  )}
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </Box>
      <Box className="flex flex-row w-full justify-end items-center">
        {error && <span className="text-red-600 font-semibold">{error}</span>}
        <>
          {' '}
          <Button
            className="ml-4"
            onClick={handleMarkAll}
            title="Mark all"
            type="primary"
            size="small"
            loading={false}
          />
          <Button
            className="ml-4"
            onClick={handleConfirm}
            title="Confirm"
            type="blackbaud"
            size="small"
            loading={false}
          />
        </>
      </Box>
    </Modal>
  )
}

export default BlackBaudEventModal
