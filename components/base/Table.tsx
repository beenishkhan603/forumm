import { useTheme } from '@libs/useTheme'
import { v4 } from 'uuid'

const Table = ({
  tableHeading,
  rows,
}: {
  tableHeading: (JSX.Element | string | number)[]
  rows?: (JSX.Element | string | number)[][]
}) => {
  const { theme } = useTheme()
  const random_id = v4()
  return (
    <table className="w-full table-auto text-left rounded-lg border border-midnight-gray">
      <thead className="">
        <tr
          style={{ backgroundColor: theme.foregroundColour }}
          className="border-b-midnight-gray border-b"
          key={`table-head-${random_id}-container`}
        >
          {tableHeading.map((t) => (
            <th
              className="p-3"
              key={`table-head-${random_id}-${t.toString().length > 0 ? t.toString() : v4()}`}
            >
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map((row, index) => {
          return (
            <tr
              key={`table-row-${random_id}-${index}`}
              className={`py-2 border-b-midnight-gray border-b`}
            >
              {row.map((t, index) => (
                <td className="p-3" key={`table-data-${random_id}-${index}`}>
                  {index === 3 && t === 'Break' ? (
                    <span className="rounded border border-orange-200 text-orange-200 py-0.5 px-1 text-sm">
                      Break
                    </span>
                  ) : (
                    t
                  )}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table
