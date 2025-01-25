import {
  Event,
  EventBreakoutRoom,
  EventStage,
  EventType,
  StageType,
  TicketType,
} from '@graphql/__generated/graphql'

export const EVENT_DATA: Event = {
  eventId: '123',
  organizerId: 'b01ee7a7-8cd8-46ed-8974-d32e689e6a79',
  isComplete: true,
  isPublished: true,
  dateCreated: '2024-03-05T11:08:17.094Z',
  availableTickets: {
    tickets: [
      {
        ticketTitle: 'Test',
        totalQuantity: '1',
        remaining: '1',
        __typename: 'AvailableTicketInfo',
      },
    ],
    __typename: 'AvailableTicketInfoResponse',
  },
  ondemandContent: [],
  communications: {
    socials: null,
    announcements: null,
    __typename: 'EventCommunications',
  },
  messages: [],
  event: {
    bannerImage:
      'https://assets.tumblr.com/images/default_header/optica_pattern_11.png',
    description:
      '{"blocks":[{"key":"71mf3","text":"Test X","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":6,"style":"BOLD"},{"offset":5,"length":1,"style":"UNDERLINE"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
    eventMainColour: '#232634',
    eventBackgroundColour: '#232634',
    eventTextColour: '#FFFFFF',
    endDateTime: '2024-04-05T10:08:35.318Z',
    registrationCloseDateTime: '2024-03-19T11:08:35.318Z',
    shortDescription: 'Test2',
    startDateTime: '2024-03-05T11:08:35.318Z',
    title: 'Forumm Demo Event',
    organizationName: 'Forumm',
    thumbnailImage:
      'https://assets.tumblr.com/images/default_header/optica_pattern_11.png',
    publiclyListed: true,
    currency: 'GBP',
    fixedAdminFee: 0,
    eventType: 'ONLINE' as EventType,
    eventLocation: null,
    donationUrl: 'forumm-897094',
    __typename: 'EventDetails',
  },
  registrationFields: [],
  fundraising: {
    id: null,
    title: 'Test',
    description: 'Test',
    goal: 1,
    programs: [],
    media: [],
    raised: 2,
    donors: 1,
    __typename: 'EventFundraising',
  },
  tickets: [
    {
      price: 0,
      ticketType: 'FREE' as TicketType,
      title: 'Test',
      quantity: 1,
      adminFee: 0,
      __typename: 'EventTicket',
    },
  ],
  speakers: [
    {
      email: 'paul.pirie+speakertest@448.studio',
      name: 'Test Speaker',
      organization: 'Dev',
      position: 'Dev',
      profileImage:
        'https://images-qa.forumm.to/user-content/b01ee7a7-8cd8-46ed-8974-d32e689e6a79/312735d7-764c-4a71-b1e9-3b190535a2fb.jpg',
      ticketType: 'FREE' as TicketType,
      bio: 'Dev',
      __typename: 'EventSpeaker',
    },
    {
      email: 'paul.pirie+encodedemail@448.studio',
      name: 'Test Speaker 2',
      organization: 'dev',
      position: 'dev',
      profileImage:
        'https://images-qa.forumm.to/user-content/b01ee7a7-8cd8-46ed-8974-d32e689e6a79/ddfbb572-f03a-4118-ba66-f56242c3e8dd.jpg',
      ticketType: 'FREE' as TicketType,
      bio: 'dev',
      __typename: 'EventSpeaker',
    },
  ],
  stages: [
    {
      class: 'INTERNAL' as StageType,
      description: 'Test',
      holdingVideoUrl: null,
      title: 'Main',
      channelName: 'e7c4e9f2-1b3b-4686-a38a-06704581ac0d-main',
      token:
        '00658c4f0f9fd214f2689591f2bc96368feIAARjNfEmwdjYBnou5hFHnMdr0QK5Dr6OAj7gFB4f1326orI6B4AAAAAIgBpIOLspgbqZQQAAQA2w+hlAgA2w+hlAwA2w+hlBAA2w+hl',
      isLive: false,
      __typename: 'EventStage',
    },
  ],
  sponsors: [],
  sessions: [
    {
      description: 'Test',
      endDateTime: '2024-03-26T00:00:00.000Z',
      speakers: [
        {
          email: 'paul.pirie+encodedemail@448.studio',
          name: 'Test Speaker 2',
          organization: 'dev',
          position: 'dev',
          profileImage:
            'https://images-qa.forumm.to/user-content/b01ee7a7-8cd8-46ed-8974-d32e689e6a79/ddfbb572-f03a-4118-ba66-f56242c3e8dd.jpg',
          ticketType: 'FREE' as TicketType,
          __typename: 'EventSpeaker',
        },
      ],
      stage: {
        class: 'INTERNAL' as StageType,
        description: 'Test',
        holdingVideoUrl: null,
        title: 'Main',
        __typename: 'EventStage',
      } as EventStage,
      startDateTime: '2024-03-22T00:00:00.000Z',
      title: 'Test',
      isBreak: null,
      __typename: 'EventSession',
    },
  ],
  breakoutRooms: [
    {
      thumbnailImage:
        'https://images-qa.forumm.to/user-content/b01ee7a7-8cd8-46ed-8974-d32e689e6a79/2264684_1.jpg',
      description: 'Breakout Room Test',
      maxAttendees: 10,
      title: 'Breakout Room Test',
      channelName: 'e7c4e9f2-1b3b-4686-a38a-06704581ac0d-breakout-room-test',
      token:
        '00658c4f0f9fd214f2689591f2bc96368feIADn1/PXgud6CvjrxEhYrT0odzWWaeEiMxr1zaYZ+2yNQkMQq0gAAAAAIgBpIOLspgbqZQQAAQA2w+hlAgA2w+hlAwA2w+hlBAA2w+hl',
      totalUsers: 0,
      __typename: 'EventBreakoutRoom',
    } as EventBreakoutRoom,
  ],
  attendees: [
    {
      email: 'paul.pirie+noauth@448.studio',
      name: 'Paul NoAuth',
      profileImage: null,
      ticketTitle: 'FUNDRAISER_TICKET',
      invitationSentDatetime: '2024-03-05T11:46:36.197Z',
      registered: true,
      checkInStatus: null,
      checkInDatetime: null,
      ticketCode: 'VEIQHGLHSYQWQOOWALZWOQ',
      __typename: 'EventAttendee',
    },
  ],
  __typename: 'Event',
}
