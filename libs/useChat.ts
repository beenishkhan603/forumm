import { User } from '@graphql/__generated/graphql'
import { createContext, Dispatch, SetStateAction, useContext } from 'react'

type ChatContextType = {
  eventChats: { chatId: string; title: string }[]
  setEventChats?: Dispatch<
    SetStateAction<
      {
        chatId: string
        title: string
      }[]
    >
  >
  setChatTab?: (title: string) => void
  chatTab?: string
  modalUser?: User
  setModalUser?: (user: User | undefined) => void
  setDmChat?: (
    chat:
      | {
          chatId: string
          user: User
        }
      | undefined,
  ) => void
  call?: (user: User | undefined) => void
  callingUser?: User | undefined
  dmChat?: {
    chatId: string
    user: User
  }
  showDefaultChat: boolean
  setShowDefaultChat: (showDefaultChat: boolean) => void
}

export const ChatContext = createContext<ChatContextType>({
  eventChats: [],
  showDefaultChat: true,
  setShowDefaultChat: () => {},
})

export const useChat = () => {
  const {
    eventChats,
    setEventChats,
    setChatTab,
    chatTab,
    modalUser,
    setModalUser,
    setDmChat,
    dmChat,
    call,
    callingUser,
    showDefaultChat,
    setShowDefaultChat,
  } = useContext<ChatContextType>(ChatContext)

  return {
    eventChats,
    setEventChats,
    setChatTab,
    chatTab,
    modalUser,
    setModalUser,
    setDmChat,
    dmChat,
    call,
    callingUser,
    showDefaultChat,
    setShowDefaultChat,
  }
}
