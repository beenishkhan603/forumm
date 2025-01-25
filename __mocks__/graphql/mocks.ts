import {
  GET_MESSAGES_FOR_CHAT_ID_MOCK,
  MESSAGE_CHANGED_MOCK,
} from './Chat/Message'
import { RECEIVED_CALL_MOCK } from './Chat/ReceivedCall'
import { GET_EVENT_BY_ID_MOCK } from './Event/getEventById'
import { GET_EVENTS_BY_COMPANY_MOCK } from './Event/getEventsByCompany'
import {
  GET_MY_EVENTS_MOCK,
  GET_MY_EVENTS_OVERVIEW_MOCK,
} from './Event/getMyEvents'
import { GET_PAST_EVENTS_MOCK } from './Event/getPathEvents'
import { GET_PUBLIC_EVENTS_MOCK } from './Event/getPublicEvents'
import { GET_ORGANISATION_BY_NAME_MOCK } from './Hooks/GetOrganisationByName'
import { ADD_STATISTIC_MOCK } from './Hooks/Statistics'
import { GET_THEME_MOCK } from './Hooks/Theme'
import { UPDATE_ORGANISATION_MOCK } from './Org/UpdateOrganisation'
import { GET_ALL_USERS_MOCK } from './User/getAllUsers'
import { GET_USERS_BY_IDS_MOCK } from './User/getUsersByIds'
import { ME_MOCK } from './User/Me'

const EventMocks = [
  GET_EVENTS_BY_COMPANY_MOCK,
  GET_EVENT_BY_ID_MOCK,
  GET_PAST_EVENTS_MOCK,
  GET_PUBLIC_EVENTS_MOCK,
  GET_MY_EVENTS_OVERVIEW_MOCK,
  GET_MY_EVENTS_MOCK,
]

const HookMocks = [
  GET_THEME_MOCK,
  GET_ORGANISATION_BY_NAME_MOCK,
  ADD_STATISTIC_MOCK,
]

const ChatMocks = [
  MESSAGE_CHANGED_MOCK,
  GET_MESSAGES_FOR_CHAT_ID_MOCK,
  RECEIVED_CALL_MOCK,
]

const UserMocks = [ME_MOCK, GET_ALL_USERS_MOCK, GET_USERS_BY_IDS_MOCK]

const OrgMocks = [UPDATE_ORGANISATION_MOCK]

const mocks = [
  ...EventMocks,
  ...HookMocks,
  ...ChatMocks,
  ...UserMocks,
  ...OrgMocks,
]
export default mocks
