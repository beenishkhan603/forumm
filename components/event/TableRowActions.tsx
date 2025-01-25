import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'

const TableRowActions = ({
  deleteClicked,
  editClicked,
  confirmModal,
  disabled = false,
}: {
  editClicked?: () => void
  deleteClicked?: () => void
  confirmModal?: { title: string; content: string }
  disabled?: boolean
}) => {
  return (
    <Box className="flex">
      {editClicked && (
        <Button
          onClick={editClicked}
          className="ml-auto mr-2"
          size="small"
          title="Edit"
          disabled={disabled}
        />
      )}
      {deleteClicked && (
        <Button
          onClick={deleteClicked}
          size="small"
          title="Remove"
          confirmationModal={!!confirmModal ? confirmModal : undefined}
          disabled={disabled}
        />
      )}
    </Box>
  )
}

export default TableRowActions
