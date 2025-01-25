import { EventTicket, EventType } from '@graphql/__generated/graphql'
import { flatten } from './util'

export type ValidationRule = [
  string,
  null | boolean | ((fieldData: any) => boolean),
  string?
]

export type ValidationRules = ValidationRule[]

export const shouldShowField = (rule?: ValidationRule): boolean => {
  if (!rule) return false
  if (!Array.isArray(rule)) return false

  if (rule[1] === false) return true
  if (rule[1] === true) return true
  if (rule[1] === null) return false

  return false
}

export const isFieldRequired = (rule?: ValidationRule): boolean => {
  if (!rule) return false
  if (!Array.isArray(rule)) return false
  if (typeof rule[1] === 'function') return false

  return !!rule[1]
}

// Rules are formatted as a tuple to denote the target field and its rule
// true   = shown & required
// false  = shown & not required
// null   = hidden & not required
const FundraiserEventRules: ValidationRules = [
  ['event_title', true],
  ['event_shortDescription', true],
  ['event_registrationCloseDateTime', false],
  ['event_startDateTime', false],
  ['event_endDateTime', false],
  ['event_description', false],
  ['event_publiclyListed', false],
  ['event_eventLocation', null],
  ['tickets_*', null],
  ['fundraising_title', true],
  ['fundraising_title', (f: string) => f.length > 0],
  ['fundraising_description', true],
  ['fundraising_description', (f: string) => f.length > 0],
  ['fundraising_goal', true],
  ['fundraising_goal', (f: number) => f > 0],
  ['speakers_*', null],
  ['stages_*', null],
  ['sessions_*', null],
  ['attendees_*', null],
  ['sponsors_*', null],
  ['breakoutRooms_*', null],
  ['communications_socials', false],
  ['communications_announcements', null],
  ['ondemandContent_*', null],
]

const OnlineEventRules: ValidationRules = [
  ['event_title', true, 'Please give your event a title'],
  [
    'event_shortDescription',
    true,
    'Please add a short description of your event',
  ],
  [
    'event_registrationCloseDateTime',
    true,
    'Please add a valid close date & time for your event registration',
  ],
  [
    'event_startDateTime',
    true,
    'Please add a valid start date & time for your event',
  ],
  [
    'event_endDateTime',
    true,
    'Please add a valid end date & time for your event',
  ],
  ['event_description', false],
  ['event_publiclyListed', false],
  ['event_eventLocation', null],
  ['tickets_*', true, 'Please add atleast 1 ticket for this event'],
  [
    'tickets_*',
    (f: Omit<EventTicket, 'adminFee'>[]) => f.length > 0,
    'Please add atleast 1 ticket for this event',
  ],
  ['fundraising_title', null],
  ['fundraising_description', null],
  ['fundraising_goal', null],
  ['speakers_*', false],
  ['stages_*', false],
  ['sessions_*', false],
  ['attendees_*', false],
  ['sponsors_*', false],
  ['breakoutRooms_*', false],
  ['communications_socials', false],
  ['communications_announcements', false],
  ['ondemandContent_*', false],
]

const InpersonEventRules: ValidationRules = [
  ['event_title', true, 'Please give your event a title'],
  [
    'event_shortDescription',
    true,
    'Please add a short description of your event',
  ],
  [
    'event_registrationCloseDateTime',
    true,
    'Please add a valid close date & time for your event registration',
  ],
  [
    'event_startDateTime',
    true,
    'Please add a valid start date & time for your event',
  ],
  [
    'event_endDateTime',
    true,
    'Please add a valid end date & time for your event',
  ],
  ['event_description', false],
  ['event_publiclyListed', false],
  ['event_eventLocation', false],
  ['tickets_*', true, 'Please add atleast 1 ticket for this event'],
  [
    'tickets_*',
    (f: Omit<EventTicket, 'adminFee'>[]) => f.length > 0,
    'Please add atleast 1 ticket for this event',
  ],
  ['fundraising_title', null],
  ['fundraising_description', null],
  ['fundraising_goal', null],
  ['speakers_*', false],
  ['stages_*', false],
  ['sessions_*', false],
  ['attendees_*', false],
  ['sponsors_*', false],
  ['breakoutRooms_*', null],
  ['communications_socials', false],
  ['communications_announcements', false],
  ['ondemandContent_*', null],
]

export const DonationRules: ValidationRules = [
  ['currency', false],
  ['amount', true],
  ['donator_dob', false],
  ['donator_title', false],
  ['donator_firstName', true],
  ['donator_lastName', true],
  ['donator_email', true],
  ['message', false],
  ['donatedAt', false],
  ['program', false],
  ['payment_method', true],
  ['payment_isRecurring', false],
  ['payment_coverPlatformFee', false],
  ['payment_coverTrxFee', false],
  ['payment_giftAid', false],
  ['payment_giftAidConfirm', false],
  ['payment_card_details_number', false],
  ['payment_card_details_exp_date', false],
  ['payment_card_details_CVC', false],
  ['payment_card_details_post_code', false],
  ['payment_card_details_address', false],
  ['paymentType', false],
  ['selectedRecurrency', false],
  ['homeAddress', true],
  ['visibility', true],
  ['directDebit_name', false],
  ['directDebit_number', false],
  ['directDebit_sort', false],
  ['directDebit_confirmDirectDebit', false],
  ['addressLine1', true],
  ['addressCity', true],
  ['addressPostalCode', true],
  ['addressCountry', true],
  ['addressPhone', false],
  ['allowEmailContact', false],
  ['allowTelephoneContact', false],
]

type ValidationType = EventType | 'Donation'

export const getValidationRules = (type?: ValidationType): ValidationRules => {
  if (!type) return OnlineEventRules
  if (type === EventType.Online) return OnlineEventRules
  if (type === EventType.InPerson) return InpersonEventRules
  if (type === EventType.Fundraiser) return FundraiserEventRules
  if (type === 'Donation') return DonationRules
  return OnlineEventRules
}

export const validate = (data: any, rules: ValidationRules) => {
  if (!data || !rules)
    return {
      error: {
        step: 'Unknown',
        message: 'Please complete all required fields.',
      },
    }

  const fieldsToValidate = flatten(data)

  for (let rulePair of rules) {
    const ruleKey = rulePair[0]
    const rule = rulePair[1]
    const errorMessage = rulePair[2] ?? 'Please complete all required fields.'
    const isPattern = ruleKey.endsWith('*')
    let keysToCheck = isPattern
      ? Object.keys(fieldsToValidate).filter((key) =>
          key.startsWith(ruleKey.slice(0, -1))
        )
      : [ruleKey]

    if (isPattern) {
      const originalKey = ruleKey.slice(0, -2)
      if (
        typeof rule !== 'function' &&
        rule === true &&
        data.hasOwnProperty(originalKey) &&
        Array.isArray(data[originalKey]) &&
        data[originalKey].length === 0
      ) {
        return {
          error: {
            step: originalKey,
            message: errorMessage,
          },
        }
      }
    }

    for (let key of keysToCheck) {
      const target = fieldsToValidate[key]
      // console.log(`[${key}]: ${target} => ${typeof target}`)
      if (typeof target === 'boolean' || !!target) {
        if (typeof rule === 'boolean') {
          if (rule && target.length < 1) {
            return {
              error: {
                step: key.split('_')[0],
                message: errorMessage,
              },
            }
          }
        }
        if (typeof rule === 'function') {
          if (!rule(target.toString())) {
            return {
              error: {
                step: key.split('_')[0],
                message: errorMessage,
              },
            }
          }
        }
      } else if (!isPattern) {
        if (rule) {
          return {
            error: {
              step: key.split('_')[0],
              message: errorMessage,
            },
          }
        }
      }
    }
  }
  return {
    error: undefined,
  }
}

export enum CreateEventSection {
  DETAILS = 'Details',
  REGISTRATION = 'Registration',
  FUNDRAISING = 'Fundraising',
  SPEAKERS = 'Speakers',
  STAGES = 'Stages',
  SESSIONS = 'Sessions',
  ATTENDEES = 'Attendees',
  PARTNERS = 'Partners',
  BREAKOUT_ROOMS = 'Breakout Rooms',
  COMMUNICATIONS = 'Communications',
  ON_DEMAND_CONTENT = 'On Demand Content',
}

interface CreateEventError {
  section: CreateEventSection | undefined
  error: string
}

const CreateEventSectionError = {
  [CreateEventSection.DETAILS]: {
    section: CreateEventSection.DETAILS,
    error: 'Please complete the event details section before moving on.',
  },
  [CreateEventSection.REGISTRATION]: {
    section: CreateEventSection.REGISTRATION,
    error: 'Please complete the registration section before moving on.',
  },
  [CreateEventSection.FUNDRAISING]: {
    section: CreateEventSection.FUNDRAISING,
    error: 'Please complete the fundraising section before moving on.',
  },
  [CreateEventSection.SPEAKERS]: {
    section: CreateEventSection.SPEAKERS,
    error: 'Please add atleast one speaker before moving on.',
  },
  [CreateEventSection.STAGES]: {
    section: CreateEventSection.STAGES,
    error: 'Please add ateleast one stage before moving on.',
  },
  [CreateEventSection.SESSIONS]: {
    section: CreateEventSection.SESSIONS,
    error: 'Please add atleast one session before moving on.',
  },
  [CreateEventSection.ATTENDEES]: {
    section: CreateEventSection.ATTENDEES,
    error: 'Please complete the attendee section before moving on.',
  },
  [CreateEventSection.PARTNERS]: {
    section: CreateEventSection.PARTNERS,
    error: 'Please complete the partner section before moving on.',
  },
  [CreateEventSection.BREAKOUT_ROOMS]: {
    section: CreateEventSection.BREAKOUT_ROOMS,
    error: 'Please complete the breakout room section before moving on.',
  },
  [CreateEventSection.COMMUNICATIONS]: {
    section: CreateEventSection.COMMUNICATIONS,
    error: 'Please complete the communication section before moving on.',
  },
  [CreateEventSection.ON_DEMAND_CONTENT]: {
    section: CreateEventSection.ON_DEMAND_CONTENT,
    error: 'Please complete the on-demand content section before moving on.',
  },
}

const CreateEventSectionPrerequisites: Record<
  CreateEventSection,
  CreateEventError[]
> = {
  [CreateEventSection.DETAILS]: [],
  [CreateEventSection.REGISTRATION]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
  ],
  [CreateEventSection.FUNDRAISING]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
  ],
  [CreateEventSection.SPEAKERS]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
  ],
  [CreateEventSection.STAGES]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
    CreateEventSectionError[CreateEventSection.SPEAKERS],
  ],
  [CreateEventSection.SESSIONS]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
    CreateEventSectionError[CreateEventSection.SPEAKERS],
    CreateEventSectionError[CreateEventSection.STAGES],
  ],
  [CreateEventSection.ATTENDEES]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
  ],
  [CreateEventSection.PARTNERS]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
  ],
  [CreateEventSection.BREAKOUT_ROOMS]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
  ],
  [CreateEventSection.COMMUNICATIONS]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
  ],
  [CreateEventSection.ON_DEMAND_CONTENT]: [
    CreateEventSectionError[CreateEventSection.DETAILS],
  ],
}

export const getCreateEventError = (
  section: CreateEventSection,
  formData: any
): CreateEventError[] => {
  const defaultError = {
    section: undefined,
    error: 'Please complete the previous section before moving forward.',
  }

  const payload: CreateEventError[] = []

  const completedSections = {
    [CreateEventSection.DETAILS]: false,
    [CreateEventSection.REGISTRATION]: false,
    [CreateEventSection.FUNDRAISING]: false,
    [CreateEventSection.SPEAKERS]: false,
    [CreateEventSection.STAGES]: false,
    [CreateEventSection.SESSIONS]: false,
    [CreateEventSection.ATTENDEES]: false,
    [CreateEventSection.PARTNERS]: false,
    [CreateEventSection.BREAKOUT_ROOMS]: false,
    [CreateEventSection.COMMUNICATIONS]: false,
    [CreateEventSection.ON_DEMAND_CONTENT]: false,
  }

  if (!section || !formData) return [defaultError]

  if (formData?.event?.title)
    completedSections[CreateEventSection.DETAILS] = true

  if (formData?.tickets && formData?.tickets?.length > 0)
    completedSections[CreateEventSection.REGISTRATION] = true

  if (formData?.fundraising && formData?.fundraising?.goal)
    completedSections[CreateEventSection.FUNDRAISING] = true

  if (formData?.speakers && formData?.speakers?.length > 0)
    completedSections[CreateEventSection.SPEAKERS] = true

  if (formData?.stages && formData?.stages?.length > 0)
    completedSections[CreateEventSection.STAGES] = true

  if (formData?.sessions && formData.sessions.length > 0)
    completedSections[CreateEventSection.SESSIONS] = true

  if (formData?.attendees && formData.attendees.length > 0)
    completedSections[CreateEventSection.ATTENDEES] = true

  if (formData?.sponsors && formData.sponsors.length > 0)
    completedSections[CreateEventSection.PARTNERS] = true

  if (formData?.breakoutRooms && formData.breakoutRooms.length > 0)
    completedSections[CreateEventSection.BREAKOUT_ROOMS] = true

  if (formData?.ondemandContent && formData.ondemandContent.length > 0)
    completedSections[CreateEventSection.ON_DEMAND_CONTENT] = true

  if (CreateEventSectionPrerequisites[section].length > 0) {
    CreateEventSectionPrerequisites[section].forEach((val) => {
      if (!completedSections[val.section!]) payload.push(val)
    })
  }
  return payload
}
