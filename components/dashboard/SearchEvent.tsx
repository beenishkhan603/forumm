import Box from '@components/base/Box'
import { Button } from '@components/inputs/Button'
import { useTheme } from '@libs/useTheme'
import { useEffect, useState } from 'react'

interface SearchEventProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

function SearchEvent({ searchTerm, setSearchTerm }: SearchEventProps) {
  const { theme } = useTheme()
  const [value, setValue] = useState(searchTerm)
  const isDarkTheme = theme.type === 'DARK'

  useEffect(() => {
    if (value.length >= 3) {
      setSearchTerm(value)
    }
    if (value.length === 0) {
      setSearchTerm(value)
    }
  }, [setSearchTerm, value])

  return (
    <Box
      className={`flex p-1 border ${
        isDarkTheme
          ? 'border border-panel-gray'
          : 'border border-forumm-menu-border'
      } rounded-3xl`}
    >
      <input
        type="text"
        placeholder="Find your event"
        className="ml-4 outline-none w-full text-xs sm:text-sm hover:animate-heartbeat"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          backgroundColor: 'transparent',
        }}
      />
      <Button title="Search" className="text-xs sm:text-sm" onClick={() => setSearchTerm(value)} />
    </Box>
  )
}

export default SearchEvent
