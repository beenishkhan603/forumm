import { Event, User } from '@graphql/__generated/graphql'
import { createContext, Dispatch, SetStateAction, useContext } from 'react'

type EventContextType = {
  event?: Event
  refreshBreakoutRooms: {
    startPolling: (pollInterval: number) => void
    stopPolling: () => void
  }
}

export const EventContext = createContext<EventContextType>({
  event: undefined,
  refreshBreakoutRooms: {
    startPolling: () => {},
    stopPolling: () => {},
  },
})

export const useEvent = () => {
  const { event, refreshBreakoutRooms } =
    useContext<EventContextType>(EventContext)

  return { event, refreshBreakoutRooms }
}
