import {
  Event,
  EventBreakoutRoom,
  EventCommunications,
  EventFundraising,
  EventOndemandContent,
  EventSponsor,
  EventStage,
  EventTicket,
} from '@graphql/__generated/graphql'
import { CreateEventStage } from '@layouts/CreateEventLayout'
import { Maybe } from 'graphql/jsutils/Maybe'
import { createContext } from 'react'
import { ValidationRules } from './Utility/validation'

export interface EventCreation
  extends Omit<Event, 'stages' | 'breakoutRooms' | 'tickets' | 'sponsors'> {
  breakoutRooms?: Maybe<
    Array<
      Omit<EventBreakoutRoom, 'channelName' | 'token' | 'users' | 'totalUsers'>
    >
  >
  stages?: Maybe<
    Array<Omit<EventStage, 'channelName' | 'token' | 'grToken' | 'isLive'>>
  >
  tickets?: Maybe<Array<Omit<EventTicket, 'adminFee'>>>
  sponsors?: Maybe<Array<EventSponsor>>
  communications?: Maybe<EventCommunications>
  ondemandContent?: Maybe<Array<EventOndemandContent>>
  fundraising?: Maybe<EventFundraising>
}

export interface CreateEventStageInfo {
  stage: keyof CreateEventStage | string
  skipPreview?: boolean
}

export type CreateEventContextProps = {
  formData: Partial<EventCreation> | undefined
  setFormData: (data: Partial<EventCreation>) => void
  createEventStage?: CreateEventStageInfo
  setCreateEventStage: (data: CreateEventStageInfo) => void
  errors?: { step: string; message: string }
  setErrors: (data: { step: string; message: string }) => void
  validationRules: ValidationRules
}

export const CreateEventContext = createContext<CreateEventContextProps>({
  setFormData: () => {},
  formData: {
    tickets: [],
    registrationFields: [],
    speakers: [],
    stages: [],
    sessions: [],
    attendees: [],
    sponsors: [],
    breakoutRooms: [],
    communications: {},
    ondemandContent: [],
    fundraising: {},
  },
  setCreateEventStage: () => {},
  createEventStage: undefined,
  setErrors: () => {},
  errors: undefined,
  validationRules: [],
})
