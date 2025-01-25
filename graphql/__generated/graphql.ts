/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};

export type Announcement = {
  __typename?: 'Announcement';
  body: Scalars['String'];
  title: Scalars['String'];
};

export type AnnouncementInput = {
  body: Scalars['String'];
  title: Scalars['String'];
};

export type AttendeeRegistrationData = {
  __typename?: 'AttendeeRegistrationData';
  registered?: Maybe<Array<EventAttendee>>;
  total: Scalars['Float'];
  unregistered?: Maybe<Array<EventAttendee>>;
};

export type AvailableTicketInfo = {
  __typename?: 'AvailableTicketInfo';
  price?: Maybe<Scalars['String']>;
  remaining?: Maybe<Scalars['String']>;
  ticketTitle?: Maybe<Scalars['String']>;
  ticketType?: Maybe<Scalars['String']>;
  totalQuantity?: Maybe<Scalars['String']>;
};

export type AvailableTicketInfoResponse = {
  __typename?: 'AvailableTicketInfoResponse';
  tickets?: Maybe<Array<AvailableTicketInfo>>;
};

export type BlackBaudEventResponse = {
  __typename?: 'BlackBaudEventResponse';
  attendees?: Maybe<Array<Participant>>;
  description?: Maybe<Scalars['String']>;
  end_date?: Maybe<Scalars['String']>;
  end_time?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  speakers?: Maybe<Array<Participant>>;
  start_date?: Maybe<Scalars['String']>;
  start_time?: Maybe<Scalars['String']>;
};

export type Call = {
  __typename?: 'Call';
  from: User;
  to: User;
};

export type ChangePasswordResponse = {
  __typename?: 'ChangePasswordResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type ChannelInfo = {
  __typename?: 'ChannelInfo';
  channelName: Scalars['String'];
  isLive: Scalars['Boolean'];
  totalUsers: Scalars['Float'];
  users: Array<Scalars['String']>;
};

export type ChatOverview = {
  __typename?: 'ChatOverview';
  chatId: Scalars['ID'];
  dateCreated: Scalars['String'];
  lastMessage: Scalars['String'];
  user: User;
};

export type CreateAccountInput = {
  email: Scalars['String'];
  fullName: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
};

export type CreateEventInput = {
  event: EventDetailsInput;
};

export type CreateMerchant = {
  __typename?: 'CreateMerchant';
  redirectUrl: Scalars['String'];
};

export type CreateMerchantInput = {
  userId: Scalars['String'];
};

export type CreateMessageInput = {
  chatId: Scalars['String'];
  message: Scalars['String'];
};

export type DeleteEventByIdInput = {
  eventId: Scalars['ID'];
};

export type DonationInput = {
  amount: Scalars['Float'];
  currency?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  eventId: Scalars['ID'];
  eventName: Scalars['String'];
  firstName: Scalars['String'];
  giftAid: Scalars['Boolean'];
  lastName: Scalars['String'];
  message: Scalars['String'];
  organizationName: Scalars['String'];
  selectedProgram: Scalars['String'];
  statisticId: Scalars['String'];
};

export type DonationPaymentIntentInput = {
  address: Scalars['String'];
  addressCity?: InputMaybe<Scalars['String']>;
  addressCountry?: InputMaybe<Scalars['String']>;
  addressLine1?: InputMaybe<Scalars['String']>;
  addressLine2?: InputMaybe<Scalars['String']>;
  addressLine3?: InputMaybe<Scalars['String']>;
  addressPhone?: InputMaybe<Scalars['String']>;
  addressPostalCode?: InputMaybe<Scalars['String']>;
  allowEmailContact?: InputMaybe<Scalars['Boolean']>;
  allowTelephoneContact?: InputMaybe<Scalars['Boolean']>;
  amount: Scalars['Float'];
  coverFee: Scalars['String'];
  currency?: InputMaybe<Scalars['String']>;
  directDebitConfirmed?: InputMaybe<Scalars['Boolean']>;
  directDebitName?: InputMaybe<Scalars['String']>;
  directDebitNumber?: InputMaybe<Scalars['String']>;
  directDebitPeriod?: InputMaybe<Scalars['String']>;
  directDebitSort?: InputMaybe<Scalars['String']>;
  donationUrl: Scalars['String'];
  donorDob?: InputMaybe<Scalars['String']>;
  donorTitle?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  eventId: Scalars['ID'];
  eventName: Scalars['String'];
  firstName: Scalars['String'];
  giftAid: Scalars['Boolean'];
  homeAddress?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
  message: Scalars['String'];
  organizationName: Scalars['String'];
  paymentMethodId?: InputMaybe<Scalars['String']>;
  paymentMethodRegionCode?: InputMaybe<Scalars['String']>;
  paymentMethodType?: InputMaybe<Scalars['String']>;
  paymentType?: InputMaybe<PaymentType>;
  selectedProgram: Scalars['String'];
  statisticId: Scalars['String'];
  visibility?: InputMaybe<Scalars['String']>;
};

export type EnableEventByIdInput = {
  eventId: Scalars['ID'];
};

export type Event = {
  __typename?: 'Event';
  attendees?: Maybe<Array<EventAttendee>>;
  availableTickets: AvailableTicketInfoResponse;
  breakoutRooms?: Maybe<Array<EventBreakoutRoom>>;
  communications?: Maybe<EventCommunications>;
  dateCreated: Scalars['String'];
  donations?: Maybe<Array<EventDonation>>;
  event?: Maybe<EventDetails>;
  eventId: Scalars['ID'];
  fundraising?: Maybe<EventFundraising>;
  isComplete?: Maybe<Scalars['Boolean']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  messages: Array<Message>;
  notifyOrganiser?: Maybe<Scalars['Boolean']>;
  ondemandContent?: Maybe<Array<EventOndemandContent>>;
  organizerId: Scalars['String'];
  registrationFields?: Maybe<Array<RegistrationField>>;
  sessions?: Maybe<Array<EventSession>>;
  speakers?: Maybe<Array<EventSpeaker>>;
  sponsors?: Maybe<Array<EventSponsor>>;
  stages?: Maybe<Array<EventStage>>;
  status?: Maybe<Scalars['String']>;
  tickets?: Maybe<Array<EventTicket>>;
};

export type EventAttendee = {
  __typename?: 'EventAttendee';
  checkInDatetime?: Maybe<Scalars['String']>;
  checkInStatus?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  invitationSentDatetime?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  registered?: Maybe<Scalars['Boolean']>;
  ticketCode?: Maybe<Scalars['String']>;
  ticketTitle: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
};

export type EventAttendeeInput = {
  checkInDatetime?: InputMaybe<Scalars['String']>;
  checkInStatus?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  invitationSentDatetime?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  profileImage?: InputMaybe<Scalars['String']>;
  registered?: InputMaybe<Scalars['Boolean']>;
  ticketCode?: InputMaybe<Scalars['String']>;
  ticketTitle: Scalars['String'];
  userId?: InputMaybe<Scalars['String']>;
};

export type EventBreakoutRoom = {
  __typename?: 'EventBreakoutRoom';
  channelName: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  maxAttendees: Scalars['Float'];
  thumbnailImage?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  token: Scalars['String'];
  totalUsers: Scalars['Float'];
  users: Array<Scalars['String']>;
};

export type EventBreakoutRoomInput = {
  description?: InputMaybe<Scalars['String']>;
  maxAttendees: Scalars['Float'];
  thumbnailImage?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EventCommunications = {
  __typename?: 'EventCommunications';
  announcements?: Maybe<Array<Announcement>>;
  socials?: Maybe<Array<SocialInfo>>;
};

export type EventCommunicationsInput = {
  announcements?: InputMaybe<Array<AnnouncementInput>>;
  socials?: InputMaybe<Array<SocialInfoInput>>;
};

export type EventDetails = {
  __typename?: 'EventDetails';
  bannerImage?: Maybe<Scalars['String']>;
  blackbaudFundId?: Maybe<Scalars['String']>;
  blackbaudId?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  donationDescription?: Maybe<Scalars['String']>;
  donationGoal?: Maybe<Scalars['Float']>;
  donationImageUrl?: Maybe<Scalars['String']>;
  donationTitle?: Maybe<Scalars['String']>;
  donationUrl?: Maybe<Scalars['String']>;
  donationVideoUrl?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
  eventBackgroundColour?: Maybe<Scalars['String']>;
  eventLocation?: Maybe<Scalars['String']>;
  eventMainColour?: Maybe<Scalars['String']>;
  eventTextColour?: Maybe<Scalars['String']>;
  eventType?: Maybe<EventType>;
  fixedAdminFee?: Maybe<Scalars['Float']>;
  organizationName: Scalars['String'];
  publiclyListed?: Maybe<Scalars['Boolean']>;
  registrationCloseDateTime?: Maybe<Scalars['String']>;
  reminders?: Maybe<Array<Scalars['String']>>;
  shortDescription?: Maybe<Scalars['String']>;
  showOnLanding?: Maybe<Scalars['Boolean']>;
  startDateTime?: Maybe<Scalars['String']>;
  thumbnailImage?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EventDetailsInput = {
  bannerImage?: InputMaybe<Scalars['String']>;
  blackbaudFundId?: InputMaybe<Scalars['String']>;
  blackbaudId?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  donationDescription?: InputMaybe<Scalars['String']>;
  donationGoal?: InputMaybe<Scalars['Float']>;
  donationImageUrl?: InputMaybe<Scalars['String']>;
  donationTitle?: InputMaybe<Scalars['String']>;
  donationUrl?: InputMaybe<Scalars['String']>;
  donationVideoUrl?: InputMaybe<Scalars['String']>;
  endDateTime?: InputMaybe<Scalars['String']>;
  eventBackgroundColour?: InputMaybe<Scalars['String']>;
  eventLocation?: InputMaybe<Scalars['String']>;
  eventMainColour?: InputMaybe<Scalars['String']>;
  eventTextColour?: InputMaybe<Scalars['String']>;
  eventType?: InputMaybe<EventType>;
  organizationName?: InputMaybe<Scalars['String']>;
  publiclyListed?: InputMaybe<Scalars['Boolean']>;
  registrationCloseDateTime?: InputMaybe<Scalars['String']>;
  reminders?: InputMaybe<Array<Scalars['String']>>;
  shortDescription?: InputMaybe<Scalars['String']>;
  showOnLanding?: InputMaybe<Scalars['Boolean']>;
  startDateTime?: InputMaybe<Scalars['String']>;
  thumbnailImage?: InputMaybe<Scalars['String']>;
  timeZone?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EventDonation = {
  __typename?: 'EventDonation';
  amount: Scalars['Float'];
  avatarUrl?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  fullName?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  selectedProgram?: Maybe<Scalars['String']>;
};

export type EventDonationInput = {
  amount: Scalars['Float'];
  avatarUrl?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  fullName?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
  selectedProgram?: InputMaybe<Scalars['String']>;
};

export type EventFundraising = {
  __typename?: 'EventFundraising';
  description?: Maybe<Scalars['String']>;
  donors?: Maybe<Scalars['Float']>;
  enabled?: Maybe<Scalars['Boolean']>;
  goal?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['String']>;
  media?: Maybe<Array<FundraidingMedia>>;
  programs?: Maybe<Array<FundraisingProgram>>;
  raised?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
  transactions?: Maybe<Array<FundraisingTransaction>>;
};

export type EventFundrasingInput = {
  description?: InputMaybe<Scalars['String']>;
  donors?: InputMaybe<Scalars['Float']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  goal?: InputMaybe<Scalars['Float']>;
  id?: InputMaybe<Scalars['String']>;
  media?: InputMaybe<Array<FundraidingMediaInput>>;
  programs?: InputMaybe<Array<FundraisingProgramInput>>;
  raised?: InputMaybe<Scalars['Float']>;
  title?: InputMaybe<Scalars['String']>;
  transactions?: InputMaybe<Array<FundraisingTransactionInput>>;
};

export type EventOndemandContent = {
  __typename?: 'EventOndemandContent';
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type EventOndemandContentInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type EventSession = {
  __typename?: 'EventSession';
  description?: Maybe<Scalars['String']>;
  endDateTime: Scalars['String'];
  isBreak?: Maybe<Scalars['Boolean']>;
  speakers?: Maybe<Array<EventSpeaker>>;
  stage?: Maybe<EventStage>;
  startDateTime: Scalars['String'];
  title: Scalars['String'];
};

export type EventSessionInput = {
  description?: InputMaybe<Scalars['String']>;
  endDateTime: Scalars['String'];
  isBreak?: InputMaybe<Scalars['Boolean']>;
  speakers?: InputMaybe<Array<EventSpeakerInput>>;
  stage?: InputMaybe<EventStageInput>;
  startDateTime: Scalars['String'];
  title: Scalars['String'];
};

export type EventSpeaker = {
  __typename?: 'EventSpeaker';
  bio?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  organization: Scalars['String'];
  position: Scalars['String'];
  profileImage?: Maybe<Scalars['String']>;
  ticketType: TicketType;
  userId?: Maybe<Scalars['String']>;
};

export type EventSpeakerInput = {
  bio?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  organization: Scalars['String'];
  position: Scalars['String'];
  profileImage?: InputMaybe<Scalars['String']>;
  ticketType: TicketType;
  userId?: InputMaybe<Scalars['String']>;
};

export type EventSponsor = {
  __typename?: 'EventSponsor';
  description?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
  linkedinUrl?: Maybe<Scalars['String']>;
  logoUrl?: Maybe<Scalars['String']>;
  ondemandContent?: Maybe<Array<EventOndemandContent>>;
  title: Scalars['String'];
  twitterUrl?: Maybe<Scalars['String']>;
  websiteUrl?: Maybe<Scalars['String']>;
};

export type EventSponsorInput = {
  description?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  linkedinUrl?: InputMaybe<Scalars['String']>;
  logoUrl?: InputMaybe<Scalars['String']>;
  ondemandContent?: InputMaybe<Array<EventOndemandContentInput>>;
  title: Scalars['String'];
  twitterUrl?: InputMaybe<Scalars['String']>;
  websiteUrl?: InputMaybe<Scalars['String']>;
};

export type EventStage = {
  __typename?: 'EventStage';
  channelName: Scalars['String'];
  class: StageType;
  description?: Maybe<Scalars['String']>;
  grToken: Scalars['String'];
  holdingVideoUrl?: Maybe<Scalars['String']>;
  isLive: Scalars['Boolean'];
  title: Scalars['String'];
  token: Scalars['String'];
};

export type EventStageInput = {
  class: StageType;
  description?: InputMaybe<Scalars['String']>;
  holdingVideoUrl?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type EventTicket = {
  __typename?: 'EventTicket';
  adminFee: Scalars['Float'];
  price: Scalars['Float'];
  quantity: Scalars['Float'];
  ticketType: TicketType;
  title: Scalars['String'];
};

export type EventTicketInput = {
  price: Scalars['Float'];
  quantity: Scalars['Float'];
  ticketType: TicketType;
  title: Scalars['String'];
};

/** Denotes the type of an event. */
export enum EventType {
  Fundraiser = 'FUNDRAISER',
  InPerson = 'IN_PERSON',
  Online = 'ONLINE'
}

export type FundraidingMedia = {
  __typename?: 'FundraidingMedia';
  body: Scalars['String'];
  platform?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  url: Scalars['String'];
};

export type FundraidingMediaInput = {
  body: Scalars['String'];
  platform?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  url: Scalars['String'];
};

export type FundraisingProgram = {
  __typename?: 'FundraisingProgram';
  description?: Maybe<Scalars['String']>;
  goal: Scalars['Float'];
  media?: Maybe<FundraidingMedia>;
  title: Scalars['String'];
};

export type FundraisingProgramInput = {
  description?: InputMaybe<Scalars['String']>;
  goal: Scalars['Float'];
  media?: InputMaybe<FundraidingMediaInput>;
  title: Scalars['String'];
};

export type FundraisingTransaction = {
  __typename?: 'FundraisingTransaction';
  address: Scalars['String'];
  amount?: Maybe<Scalars['Float']>;
  coverFee?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  donation?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  fee?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  giftAid: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  selectedProgram: Scalars['String'];
  total?: Maybe<Scalars['Float']>;
};

export type FundraisingTransactionInput = {
  amount?: InputMaybe<Scalars['Float']>;
  coverFee?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['Float']>;
  currency?: InputMaybe<Scalars['String']>;
  donation?: InputMaybe<Scalars['String']>;
  fee?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  total?: InputMaybe<Scalars['Float']>;
};

export type GetAllUsersInput = {
  company?: InputMaybe<Scalars['String']>;
  emailList?: InputMaybe<Array<Scalars['String']>>;
  emailStartsWith?: InputMaybe<Scalars['String']>;
  getAll?: InputMaybe<Scalars['Boolean']>;
  paginationToken?: InputMaybe<Scalars['String']>;
};

export type GetAvailableTicketsByEventIdInput = {
  eventId: Scalars['ID'];
};

export type GetEventByDonationUrlInput = {
  donationUrl: Scalars['ID'];
};

export type GetEventByIdForUnregisteredUserInput = {
  eventId: Scalars['ID'];
  userEmail: Scalars['String'];
};

export type GetEventByIdInput = {
  eventId: Scalars['ID'];
};

export type GetMerchantAccountInput = {
  company?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type GetMessagesForChatId = {
  chatId: Scalars['ID'];
};

export type GetUserPermissionsInput = {
  userId: Scalars['ID'];
};

export type GetUsersByIdsInput = {
  userIds: Array<Scalars['ID']>;
};

export type GetUsersInGroupInput = {
  groupName: Scalars['String'];
};

export type LinkMerchant = {
  __typename?: 'LinkMerchant';
  error?: Maybe<Scalars['String']>;
  status: Scalars['String'];
};

export type LinkMerchantInput = {
  code: Scalars['String'];
  scope?: InputMaybe<Scalars['String']>;
};

export type MediaUpload = {
  __typename?: 'MediaUpload';
  preSignedUrl: Scalars['String'];
  uploadedFileUrl: Scalars['String'];
};

export type MediaUploadInput = {
  contentType: Scalars['String'];
  eventId?: InputMaybe<Scalars['String']>;
  filename?: InputMaybe<Scalars['String']>;
};

export type MerchantAccountInfo = {
  __typename?: 'MerchantAccountInfo';
  chargesEnabled?: Maybe<Scalars['Boolean']>;
  merchantAccountExists: Scalars['Boolean'];
  required?: Maybe<Array<Scalars['String']>>;
};

export type Message = {
  __typename?: 'Message';
  chatId: Scalars['String'];
  dateCreated: Scalars['String'];
  message: Scalars['String'];
  messageId: Scalars['ID'];
  reactions?: Maybe<Array<Reaction>>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  addOrganisation: Scalars['Boolean'];
  addStatistic: Scalars['Boolean'];
  addUserData: Scalars['Boolean'];
  adminResetPassword: ChangePasswordResponse;
  call: Scalars['Boolean'];
  changePassword: ChangePasswordResponse;
  connectToBlackBaud: UpdateOrganisationResponse;
  createEvent?: Maybe<Event>;
  createMerchant: CreateMerchant;
  createMessageForChatId: Message;
  createUser: Scalars['Boolean'];
  deleteEventById: Scalars['Boolean'];
  enableEventById: Scalars['Boolean'];
  eventDonationCreatePaymentIntent: PaymentIntentResponse;
  eventDonationSendStripeMail: StripeMailResponse;
  getBlackBaudEvent?: Maybe<BlackBaudEventResponse>;
  linkMerchant: LinkMerchant;
  organiserRequestAccess: OrganiserRequestAccessResponse;
  passwordResetConfirmation: PasswordResetConfirmationRespose;
  permanentDeleteEventById: Scalars['Boolean'];
  purchaseTickets: PurchaseTicketsResponse;
  pushToBlackbaud?: Maybe<PushToBlackbaudResponse>;
  reactToMessage: Message;
  requestEarlyAccess: RequestEarlyAccessResponse;
  sendAttendeeEmailsForEvent: Scalars['Boolean'];
  sendConfirmationEmailsForEvent: Scalars['Boolean'];
  setCheckInforAttendee: Scalars['Boolean'];
  setIsAnonymous: Scalars['Boolean'];
  setUserPermissions: Scalars['Boolean'];
  updateChannelInfo: Scalars['Boolean'];
  updateEvent?: Maybe<Event>;
  updateLastActive: Scalars['Boolean'];
  updateOrganisation: UpdateOrganisationResponse;
  uploadMedia: MediaUpload;
};


export type MutationAddOrganisationArgs = {
  bannerImage?: InputMaybe<Scalars['String']>;
  blackBaudAccessToken?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  dashboardPopupDoNotShowAgain?: InputMaybe<Scalars['Boolean']>;
  headerTextOne?: InputMaybe<Scalars['String']>;
  headerTextTwo?: InputMaybe<Scalars['String']>;
  logoImage?: InputMaybe<Scalars['String']>;
  mainColour?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  organisationType?: InputMaybe<Scalars['String']>;
  percentage?: InputMaybe<Scalars['Float']>;
  url?: InputMaybe<Scalars['String']>;
};


export type MutationAddStatisticArgs = {
  anonymousId?: InputMaybe<Scalars['String']>;
  browser?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  ip?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};


export type MutationAddUserDataArgs = {
  input: RegistrationFieldValuesInput;
};


export type MutationAdminResetPasswordArgs = {
  ghostedEmail: Scalars['String'];
};


export type MutationCallArgs = {
  userId: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  password: Scalars['String'];
};


export type MutationConnectToBlackBaudArgs = {
  clientId: Scalars['String'];
  code: Scalars['String'];
  codeVerifier: Scalars['String'];
  name: Scalars['String'];
  redirectUri: Scalars['String'];
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateMerchantArgs = {
  input: CreateMerchantInput;
};


export type MutationCreateMessageForChatIdArgs = {
  input: CreateMessageInput;
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  university: Scalars['String'];
};


export type MutationDeleteEventByIdArgs = {
  input: DeleteEventByIdInput;
};


export type MutationEnableEventByIdArgs = {
  input: EnableEventByIdInput;
};


export type MutationEventDonationCreatePaymentIntentArgs = {
  input: DonationPaymentIntentInput;
};


export type MutationEventDonationSendStripeMailArgs = {
  email?: InputMaybe<Scalars['String']>;
  eventId: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
};


export type MutationGetBlackBaudEventArgs = {
  blackbaudId?: InputMaybe<Scalars['String']>;
  eventId: Scalars['String'];
};


export type MutationLinkMerchantArgs = {
  input: LinkMerchantInput;
};


export type MutationOrganiserRequestAccessArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  organisation: Scalars['String'];
};


export type MutationPasswordResetConfirmationArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPermanentDeleteEventByIdArgs = {
  input: DeleteEventByIdInput;
};


export type MutationPurchaseTicketsArgs = {
  donation?: InputMaybe<DonationInput>;
  input: PurchaseTicketsInput;
};


export type MutationPushToBlackbaudArgs = {
  blackbaudId?: InputMaybe<Scalars['String']>;
  eventId: Scalars['String'];
  fields: Array<Scalars['String']>;
  updatedConstituents?: InputMaybe<Array<UpdatedConstituentInput>>;
};


export type MutationReactToMessageArgs = {
  chatId: Scalars['String'];
  emoji: Scalars['String'];
  messageId: Scalars['String'];
  messageUserId: Scalars['String'];
};


export type MutationRequestEarlyAccessArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
};


export type MutationSendAttendeeEmailsForEventArgs = {
  emails: Array<Scalars['String']>;
  eventId: Scalars['String'];
};


export type MutationSendConfirmationEmailsForEventArgs = {
  eventId: Scalars['String'];
};


export type MutationSetCheckInforAttendeeArgs = {
  checkInStatus: Scalars['String'];
  email: Scalars['String'];
  eventId: Scalars['String'];
};


export type MutationSetIsAnonymousArgs = {
  input: SetIsAnonymousInput;
};


export type MutationSetUserPermissionsArgs = {
  input: SetUserPermissionsInput;
};


export type MutationUpdateChannelInfoArgs = {
  channelName: Scalars['String'];
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationUpdateLastActiveArgs = {
  input: UpdateLastActiveInput;
};


export type MutationUpdateOrganisationArgs = {
  bannerImage?: InputMaybe<Scalars['String']>;
  blackBaudAccessToken?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  dashboardPopupDoNotShowAgain?: InputMaybe<Scalars['Boolean']>;
  headerTextOne?: InputMaybe<Scalars['String']>;
  headerTextTwo?: InputMaybe<Scalars['String']>;
  logoImage?: InputMaybe<Scalars['String']>;
  mainColour?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  organisationType?: InputMaybe<Scalars['String']>;
  percentage?: InputMaybe<Scalars['Float']>;
};


export type MutationUploadMediaArgs = {
  input: MediaUploadInput;
};

export type Organisation = {
  __typename?: 'Organisation';
  bannerImage?: Maybe<Scalars['String']>;
  blackBaudAccessToken?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  dashboardPopupDoNotShowAgain?: Maybe<Scalars['Boolean']>;
  headerTextOne?: Maybe<Scalars['String']>;
  headerTextTwo?: Maybe<Scalars['String']>;
  logoImage?: Maybe<Scalars['String']>;
  mainColour?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  organisationType?: Maybe<Scalars['String']>;
  percentage?: Maybe<Scalars['Float']>;
  url?: Maybe<Scalars['String']>;
};

export type OrganiserRequestAccessResponse = {
  __typename?: 'OrganiserRequestAccessResponse';
  password?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type PaginatedUserResponse = {
  __typename?: 'PaginatedUserResponse';
  items: Array<User>;
  nextToken?: Maybe<Scalars['String']>;
  total: Scalars['Float'];
};

export type Participant = {
  __typename?: 'Participant';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type PasswordResetConfirmationRespose = {
  __typename?: 'PasswordResetConfirmationRespose';
  success?: Maybe<Scalars['Boolean']>;
};

export type PaymentIntentResponse = {
  __typename?: 'PaymentIntentResponse';
  clientSecret: Scalars['String'];
  error?: Maybe<Scalars['String']>;
  nextAction?: Maybe<Scalars['String']>;
};

export enum PaymentType {
  ApplePay = 'APPLE_PAY',
  Card = 'CARD',
  DirectDebit = 'DIRECT_DEBIT',
  GooglePay = 'GOOGLE_PAY'
}

export type PurchaseTicketsInput = {
  accountToCreate?: InputMaybe<CreateAccountInput>;
  donation?: InputMaybe<Array<RegistrationFieldValueInput>>;
  eventId: Scalars['ID'];
  hasBalance?: InputMaybe<Scalars['Boolean']>;
  tickets: Array<TicketPurchaseInput>;
  userData?: InputMaybe<Array<RegistrationFieldValueInput>>;
};

export type PurchaseTicketsResponse = {
  __typename?: 'PurchaseTicketsResponse';
  checkoutUrl: Scalars['String'];
  user?: Maybe<Scalars['String']>;
  userAlreadyExist?: Maybe<Scalars['Boolean']>;
};

export type PushToBlackbaudResponse = {
  __typename?: 'PushToBlackbaudResponse';
  bbPrimaryAccessKey?: Maybe<Scalars['String']>;
  bbServiceInitialized?: Maybe<Scalars['Boolean']>;
  bbUrl?: Maybe<Scalars['String']>;
  blackBaudAccessToken?: Maybe<Scalars['String']>;
  completed?: Maybe<Scalars['Boolean']>;
  currentBlackbaudId?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['Boolean']>;
  eventId?: Maybe<Scalars['String']>;
  eventPostUpdate?: Maybe<Scalars['Boolean']>;
  eventPreUpdate?: Maybe<Scalars['Boolean']>;
  eventUpdated?: Maybe<Scalars['Boolean']>;
  isOrganizer?: Maybe<Scalars['Boolean']>;
  newBlackbaudId?: Maybe<Scalars['String']>;
  orgName?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  eventDonationListTransactions: TransactionsListResponse;
  getAgoraToken: Scalars['String'];
  getAllEvents: Array<Event>;
  getAllEventsByCompany: Array<Event>;
  getAllOrganisations: Array<Organisation>;
  getAllPublicEvents: Array<Event>;
  getAllPublicFundraises: Array<Event>;
  getAllStatistics: Array<Statistic>;
  getAllStatisticsForOrganiser: Array<Statistic>;
  getAllUsers: PaginatedUserResponse;
  getAvailableTicketsByEventId: AvailableTicketInfoResponse;
  getChannelInfo: ChannelInfo;
  getChats: Array<ChatOverview>;
  getEventByDonationUrl: Event;
  getEventById: Event;
  getEventByIdForUnregisteredUser: Event;
  getEventsByCompany: Array<Event>;
  getFundraisingCSV: Scalars['String'];
  getLocation: Scalars['String'];
  getMeetingForChannelName: Scalars['String'];
  getMerchantAccount: MerchantAccountInfo;
  getMessagesForChatId: Array<Message>;
  getMyEvents: Array<Event>;
  getOrderByEventId?: Maybe<TicketOrder>;
  getOrganisationByName?: Maybe<Organisation>;
  getOrganiserByCompany: PaginatedUserResponse;
  getPastEvents: Array<Event>;
  getPublicEventsByOrganisationUrl: Array<Event>;
  getUserById: User;
  getUserPermissions: Array<Scalars['String']>;
  getUsersByIds: PaginatedUserResponse;
  getUsersInCompany: PaginatedUserResponse;
  getUsersInEvent: PaginatedUserResponse;
  getUsersInGroup: PaginatedUserResponse;
  getUsersRegisteredToEvent: RegisteredUsersResponse;
  me: User;
  theme: Theme;
};


export type QueryEventDonationListTransactionsArgs = {
  donationUrl?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  eventName?: InputMaybe<Scalars['String']>;
};


export type QueryGetAgoraTokenArgs = {
  channelName: Scalars['String'];
};


export type QueryGetAllEventsByCompanyArgs = {
  company: Scalars['String'];
};


export type QueryGetAllPublicEventsArgs = {
  showOnLanding?: InputMaybe<Scalars['Boolean']>;
};


export type QueryGetAllPublicFundraisesArgs = {
  showOnLanding?: InputMaybe<Scalars['Boolean']>;
};


export type QueryGetAllUsersArgs = {
  input: GetAllUsersInput;
};


export type QueryGetAvailableTicketsByEventIdArgs = {
  input: GetAvailableTicketsByEventIdInput;
};


export type QueryGetChannelInfoArgs = {
  channelName: Scalars['String'];
};


export type QueryGetEventByDonationUrlArgs = {
  input: GetEventByDonationUrlInput;
};


export type QueryGetEventByIdArgs = {
  input: GetEventByIdInput;
};


export type QueryGetEventByIdForUnregisteredUserArgs = {
  input: GetEventByIdForUnregisteredUserInput;
};


export type QueryGetEventsByCompanyArgs = {
  company: Scalars['String'];
};


export type QueryGetFundraisingCsvArgs = {
  eventId: Scalars['String'];
};


export type QueryGetLocationArgs = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};


export type QueryGetMeetingForChannelNameArgs = {
  channelName: Scalars['String'];
};


export type QueryGetMerchantAccountArgs = {
  input: GetMerchantAccountInput;
};


export type QueryGetMessagesForChatIdArgs = {
  input: GetMessagesForChatId;
};


export type QueryGetOrderByEventIdArgs = {
  eventId: Scalars['String'];
  userId: Scalars['String'];
};


export type QueryGetOrganisationByNameArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type QueryGetOrganiserByCompanyArgs = {
  company: Scalars['String'];
};


export type QueryGetPublicEventsByOrganisationUrlArgs = {
  url: Scalars['String'];
};


export type QueryGetUserByIdArgs = {
  userId: Scalars['String'];
};


export type QueryGetUserPermissionsArgs = {
  input: GetUserPermissionsInput;
};


export type QueryGetUsersByIdsArgs = {
  input: GetUsersByIdsInput;
};


export type QueryGetUsersInCompanyArgs = {
  company: Scalars['String'];
};


export type QueryGetUsersInEventArgs = {
  input: Scalars['String'];
};


export type QueryGetUsersInGroupArgs = {
  input: GetUsersInGroupInput;
};


export type QueryGetUsersRegisteredToEventArgs = {
  input: Scalars['String'];
};


export type QueryThemeArgs = {
  themeId: Scalars['String'];
};

export type Reaction = {
  __typename?: 'Reaction';
  emoji: Scalars['String'];
  users: Array<User>;
};

export type RegisteredUsersResponse = {
  __typename?: 'RegisteredUsersResponse';
  attendee?: Maybe<AttendeeRegistrationData>;
  speaker?: Maybe<SpeakerRegistrationData>;
};

export type RegistrationField = {
  __typename?: 'RegistrationField';
  name: Scalars['String'];
};

export type RegistrationFieldInput = {
  name: Scalars['String'];
};

export type RegistrationFieldValueInput = {
  name: Scalars['String'];
  value: Scalars['String'];
};

export type RegistrationFieldValuesInput = {
  company: Scalars['String'];
  values: Array<RegistrationFieldValueInput>;
};

export type RequestEarlyAccessResponse = {
  __typename?: 'RequestEarlyAccessResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type SetIsAnonymousInput = {
  isAnonymous: Scalars['Boolean'];
};

export type SetUserPermissionsInput = {
  exact?: InputMaybe<Scalars['Boolean']>;
  permissions: Array<Scalars['String']>;
  userId: Scalars['ID'];
};

export type SocialInfo = {
  __typename?: 'SocialInfo';
  platform: Scalars['String'];
  url: Scalars['String'];
};

export type SocialInfoInput = {
  platform: Scalars['String'];
  url: Scalars['String'];
};

export type SpeakerRegistrationData = {
  __typename?: 'SpeakerRegistrationData';
  registered?: Maybe<Array<EventSpeaker>>;
  total: Scalars['Float'];
  unregistered?: Maybe<Array<EventSpeaker>>;
};

export enum StageType {
  External = 'EXTERNAL',
  Internal = 'INTERNAL'
}

export type Statistic = {
  __typename?: 'Statistic';
  anonymousId?: Maybe<Scalars['String']>;
  browser?: Maybe<Scalars['String']>;
  companyId?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  datetime?: Maybe<Scalars['String']>;
  donation?: Maybe<StatisticDonation>;
  email?: Maybe<Scalars['String']>;
  ip?: Maybe<Scalars['String']>;
  loggedUserId?: Maybe<Scalars['String']>;
  metadata?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type StatisticDonation = {
  __typename?: 'StatisticDonation';
  amount?: Maybe<Scalars['Float']>;
  coverFee?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  donation?: Maybe<Scalars['Float']>;
  eventId?: Maybe<Scalars['String']>;
  eventName?: Maybe<Scalars['String']>;
  fee?: Maybe<Scalars['Float']>;
  giftAid?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  organizationName?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type StripeMailResponse = {
  __typename?: 'StripeMailResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  ChannelInfoChanged: ChannelInfo;
  messageChanged: Message;
  receivedCall: Call;
};


export type SubscriptionChannelInfoChangedArgs = {
  channelName: Scalars['String'];
};


export type SubscriptionMessageChangedArgs = {
  chatId: Scalars['String'];
};


export type SubscriptionReceivedCallArgs = {
  userId: Scalars['String'];
};

export type Theme = {
  __typename?: 'Theme';
  color: Scalars['String'];
  logoUrl: Scalars['String'];
  themeId: Scalars['String'];
  url: Scalars['String'];
};

export type TicketOrder = {
  __typename?: 'TicketOrder';
  eventId?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Float']>;
  tickets?: Maybe<Array<TicketPurchase>>;
  userId?: Maybe<Scalars['String']>;
};

export type TicketPurchase = {
  __typename?: 'TicketPurchase';
  email: Scalars['String'];
  fullName: Scalars['String'];
  title: Scalars['ID'];
};

export type TicketPurchaseInput = {
  email?: InputMaybe<Scalars['String']>;
  fullName: Scalars['String'];
  registrationFields?: InputMaybe<Array<RegistrationFieldValueInput>>;
  title: Scalars['ID'];
};

export enum TicketType {
  Free = 'FREE',
  Paid = 'PAID'
}

export type TransactionData = {
  __typename?: 'TransactionData';
  address?: Maybe<Scalars['String']>;
  amount: Scalars['Float'];
  avatarUrl?: Maybe<Scalars['String']>;
  coverFee?: Maybe<Scalars['String']>;
  created: Scalars['Float'];
  currency: Scalars['String'];
  donation?: Maybe<Scalars['Float']>;
  donorDob?: Maybe<Scalars['String']>;
  donorTitle?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  eventId: Scalars['String'];
  eventName: Scalars['String'];
  fee?: Maybe<Scalars['Float']>;
  firstName?: Maybe<Scalars['String']>;
  giftAid: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  selectedProgram: Scalars['String'];
  total: Scalars['Float'];
  visibility?: Maybe<Scalars['String']>;
};

export type TransactionsListResponse = {
  __typename?: 'TransactionsListResponse';
  transactions: Array<TransactionData>;
};

export type UpdateEventInput = {
  attendees?: InputMaybe<Array<EventAttendeeInput>>;
  breakoutRooms?: InputMaybe<Array<EventBreakoutRoomInput>>;
  communications?: InputMaybe<EventCommunicationsInput>;
  donations?: InputMaybe<Array<EventDonationInput>>;
  event?: InputMaybe<EventDetailsInput>;
  eventId: Scalars['ID'];
  fundraising?: InputMaybe<EventFundrasingInput>;
  isPublished?: InputMaybe<Scalars['Boolean']>;
  notifyOrganiser?: InputMaybe<Scalars['Boolean']>;
  ondemandContent?: InputMaybe<Array<EventOndemandContentInput>>;
  registrationFields?: InputMaybe<Array<RegistrationFieldInput>>;
  sessions?: InputMaybe<Array<EventSessionInput>>;
  speakers?: InputMaybe<Array<EventSpeakerInput>>;
  sponsors?: InputMaybe<Array<EventSponsorInput>>;
  stages?: InputMaybe<Array<EventStageInput>>;
  status?: InputMaybe<Scalars['String']>;
  tickets?: InputMaybe<Array<EventTicketInput>>;
};

export type UpdateLastActiveInput = {
  isLoggedIn: Scalars['Boolean'];
};

export type UpdateOrganisationResponse = {
  __typename?: 'UpdateOrganisationResponse';
  success?: Maybe<Scalars['Boolean']>;
};

export type UpdatedConstituentInput = {
  localEmail: Scalars['String'];
  selectedEmail: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  company?: Maybe<Scalars['String']>;
  companyTitle?: Maybe<Scalars['String']>;
  dateCreated: Scalars['String'];
  email: Scalars['String'];
  isActive?: Maybe<Scalars['Boolean']>;
  isAnonymous?: Maybe<Scalars['String']>;
  jobTitle?: Maybe<Scalars['String']>;
  lastActive?: Maybe<Scalars['String']>;
  location: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  otherProfiles?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Scalars['String']>>;
  phoneNumber?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  registrationFields: Scalars['JSON'];
  university?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
};

export type EventFullFragment = { __typename?: 'Event', eventId: string, organizerId: string, isComplete?: boolean | null, isPublished?: boolean | null, dateCreated: string, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', id: string, title?: string | null, description?: string | null, url: string }> | null, communications?: { __typename?: 'EventCommunications', socials?: Array<{ __typename?: 'SocialInfo', platform: string, url: string }> | null, announcements?: Array<{ __typename?: 'Announcement', title: string, body: string }> | null } | null, messages: Array<{ __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null }>, event?: { __typename?: 'EventDetails', bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, registrationCloseDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, publiclyListed?: boolean | null, currency?: string | null, fixedAdminFee?: number | null, eventType?: EventType | null, eventLocation?: string | null, donationUrl?: string | null, blackbaudId?: string | null, timeZone?: string | null } | null, registrationFields?: Array<{ __typename?: 'RegistrationField', name: string }> | null, fundraising?: { __typename?: 'EventFundraising', enabled?: boolean | null, id?: string | null, title?: string | null, description?: string | null, goal?: number | null, programs?: Array<{ __typename?: 'FundraisingProgram', title: string, description?: string | null, goal: number, media?: { __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string } | null }> | null, media?: Array<{ __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string }> | null } | null, tickets?: Array<{ __typename?: 'EventTicket', price: number, ticketType: TicketType, title: string, quantity: number, adminFee: number }> | null, speakers?: Array<{ __typename?: 'EventSpeaker', userId?: string | null, email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType, bio?: string | null }> | null, stages?: Array<{ __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string, channelName: string, token: string, grToken: string, isLive: boolean }> | null, sponsors?: Array<{ __typename?: 'EventSponsor', title: string, description?: string | null, logoUrl?: string | null, websiteUrl?: string | null, twitterUrl?: string | null, linkedinUrl?: string | null, facebookUrl?: string | null, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', url: string, title?: string | null, description?: string | null, id: string }> | null }> | null, sessions?: Array<{ __typename?: 'EventSession', description?: string | null, endDateTime: string, startDateTime: string, title: string, isBreak?: boolean | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType }> | null, stage?: { __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string } | null }> | null, breakoutRooms?: Array<{ __typename?: 'EventBreakoutRoom', thumbnailImage?: string | null, description?: string | null, maxAttendees: number, title: string, channelName: string, token: string, totalUsers: number }> | null, attendees?: Array<{ __typename?: 'EventAttendee', email: string, name?: string | null, profileImage?: string | null, ticketTitle: string, invitationSentDatetime?: string | null, registered?: boolean | null, checkInStatus?: string | null, checkInDatetime?: string | null, ticketCode?: string | null, userId?: string | null }> | null };

export type EventOverviewFragment = { __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, event?: { __typename?: 'EventDetails', eventType?: EventType | null, bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, donationUrl?: string | null, currency?: string | null } | null, attendees?: Array<{ __typename?: 'EventAttendee', name?: string | null }> | null, fundraising?: { __typename?: 'EventFundraising', goal?: number | null, donors?: number | null, raised?: number | null } | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null }> | null };

export type GetEventByDonationUrlQueryVariables = Exact<{
  input: GetEventByDonationUrlInput;
}>;


export type GetEventByDonationUrlQuery = { __typename?: 'Query', getEventByDonationUrl: { __typename: 'Event', eventId: string, isPublished?: boolean | null, organizerId: string, fundraising?: { __typename?: 'EventFundraising', id?: string | null, title?: string | null, description?: string | null, goal?: number | null, programs?: Array<{ __typename?: 'FundraisingProgram', title: string, description?: string | null, goal: number, media?: { __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string } | null }> | null, media?: Array<{ __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string }> | null, transactions?: Array<{ __typename?: 'FundraisingTransaction', selectedProgram: string, fee?: string | null, total?: number | null, email: string, amount?: number | null, created?: number | null, currency?: string | null, coverFee?: string | null, address: string, giftAid: string, firstName?: string | null, lastName?: string | null, donation?: string | null }> | null } | null, event?: { __typename?: 'EventDetails', bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, registrationCloseDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, publiclyListed?: boolean | null, currency?: string | null, fixedAdminFee?: number | null, eventType?: EventType | null, eventLocation?: string | null, donationUrl?: string | null } | null, donations?: Array<{ __typename?: 'EventDonation', email: string, fullName?: string | null, amount: number, message?: string | null, created?: string | null, currency?: string | null, avatarUrl?: string | null, selectedProgram?: string | null }> | null } };

export type EventDataFragment = { __typename?: 'Event', eventId: string, isPublished?: boolean | null, organizerId: string, event?: { __typename?: 'EventDetails', bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, registrationCloseDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, publiclyListed?: boolean | null, currency?: string | null, fixedAdminFee?: number | null, eventType?: EventType | null, eventLocation?: string | null, donationUrl?: string | null } | null, donations?: Array<{ __typename?: 'EventDonation', email: string, fullName?: string | null, amount: number, message?: string | null, created?: string | null, currency?: string | null, avatarUrl?: string | null, selectedProgram?: string | null }> | null };

export type GetEventByIdQueryVariables = Exact<{
  input: GetEventByIdInput;
}>;


export type GetEventByIdQuery = { __typename?: 'Query', getEventById: { __typename?: 'Event', eventId: string, organizerId: string, isComplete?: boolean | null, isPublished?: boolean | null, dateCreated: string, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', id: string, title?: string | null, description?: string | null, url: string }> | null, communications?: { __typename?: 'EventCommunications', socials?: Array<{ __typename?: 'SocialInfo', platform: string, url: string }> | null, announcements?: Array<{ __typename?: 'Announcement', title: string, body: string }> | null } | null, messages: Array<{ __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null }>, event?: { __typename?: 'EventDetails', bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, registrationCloseDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, publiclyListed?: boolean | null, currency?: string | null, fixedAdminFee?: number | null, eventType?: EventType | null, eventLocation?: string | null, donationUrl?: string | null, blackbaudId?: string | null, timeZone?: string | null } | null, registrationFields?: Array<{ __typename?: 'RegistrationField', name: string }> | null, fundraising?: { __typename?: 'EventFundraising', enabled?: boolean | null, id?: string | null, title?: string | null, description?: string | null, goal?: number | null, programs?: Array<{ __typename?: 'FundraisingProgram', title: string, description?: string | null, goal: number, media?: { __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string } | null }> | null, media?: Array<{ __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string }> | null } | null, tickets?: Array<{ __typename?: 'EventTicket', price: number, ticketType: TicketType, title: string, quantity: number, adminFee: number }> | null, speakers?: Array<{ __typename?: 'EventSpeaker', userId?: string | null, email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType, bio?: string | null }> | null, stages?: Array<{ __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string, channelName: string, token: string, grToken: string, isLive: boolean }> | null, sponsors?: Array<{ __typename?: 'EventSponsor', title: string, description?: string | null, logoUrl?: string | null, websiteUrl?: string | null, twitterUrl?: string | null, linkedinUrl?: string | null, facebookUrl?: string | null, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', url: string, title?: string | null, description?: string | null, id: string }> | null }> | null, sessions?: Array<{ __typename?: 'EventSession', description?: string | null, endDateTime: string, startDateTime: string, title: string, isBreak?: boolean | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType }> | null, stage?: { __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string } | null }> | null, breakoutRooms?: Array<{ __typename?: 'EventBreakoutRoom', thumbnailImage?: string | null, description?: string | null, maxAttendees: number, title: string, channelName: string, token: string, totalUsers: number }> | null, attendees?: Array<{ __typename?: 'EventAttendee', email: string, name?: string | null, profileImage?: string | null, ticketTitle: string, invitationSentDatetime?: string | null, registered?: boolean | null, checkInStatus?: string | null, checkInDatetime?: string | null, ticketCode?: string | null, userId?: string | null }> | null } };

export type GetEventByIdForEditorQueryVariables = Exact<{
  input: GetEventByIdInput;
}>;


export type GetEventByIdForEditorQuery = { __typename?: 'Query', getEventById: { __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, dateCreated: string, notifyOrganiser?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, event?: { __typename?: 'EventDetails', bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, registrationCloseDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, publiclyListed?: boolean | null, currency?: string | null, eventLocation?: string | null, donationUrl?: string | null, eventType?: EventType | null, blackbaudId?: string | null, timeZone?: string | null } | null, registrationFields?: Array<{ __typename?: 'RegistrationField', name: string }> | null, fundraising?: { __typename?: 'EventFundraising', enabled?: boolean | null, id?: string | null, title?: string | null, description?: string | null, goal?: number | null, programs?: Array<{ __typename?: 'FundraisingProgram', title: string, description?: string | null, goal: number, media?: { __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string } | null }> | null, media?: Array<{ __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string }> | null } | null, tickets?: Array<{ __typename?: 'EventTicket', price: number, ticketType: TicketType, title: string, quantity: number }> | null, speakers?: Array<{ __typename?: 'EventSpeaker', userId?: string | null, email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType, bio?: string | null }> | null, stages?: Array<{ __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string }> | null, sponsors?: Array<{ __typename?: 'EventSponsor', description?: string | null, facebookUrl?: string | null, linkedinUrl?: string | null, logoUrl?: string | null, title: string, twitterUrl?: string | null, websiteUrl?: string | null, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', url: string, title?: string | null, description?: string | null, id: string }> | null }> | null, sessions?: Array<{ __typename?: 'EventSession', description?: string | null, endDateTime: string, startDateTime: string, title: string, isBreak?: boolean | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType }> | null, stage?: { __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string } | null }> | null, breakoutRooms?: Array<{ __typename?: 'EventBreakoutRoom', thumbnailImage?: string | null, description?: string | null, maxAttendees: number, title: string }> | null, communications?: { __typename?: 'EventCommunications', socials?: Array<{ __typename?: 'SocialInfo', platform: string, url: string }> | null, announcements?: Array<{ __typename?: 'Announcement', title: string, body: string }> | null } | null, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', id: string, url: string, title?: string | null, description?: string | null }> | null, attendees?: Array<{ __typename?: 'EventAttendee', email: string, name?: string | null, profileImage?: string | null, ticketTitle: string, invitationSentDatetime?: string | null, registered?: boolean | null, checkInStatus?: string | null, checkInDatetime?: string | null, ticketCode?: string | null, userId?: string | null }> | null } };

export type GetEventByIdForUnregisteredUserQueryVariables = Exact<{
  input: GetEventByIdForUnregisteredUserInput;
}>;


export type GetEventByIdForUnregisteredUserQuery = { __typename?: 'Query', getEventByIdForUnregisteredUser: { __typename?: 'Event', eventId: string, organizerId: string, isComplete?: boolean | null, isPublished?: boolean | null, dateCreated: string, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', id: string, title?: string | null, description?: string | null, url: string }> | null, communications?: { __typename?: 'EventCommunications', socials?: Array<{ __typename?: 'SocialInfo', platform: string, url: string }> | null, announcements?: Array<{ __typename?: 'Announcement', title: string, body: string }> | null } | null, messages: Array<{ __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null }>, event?: { __typename?: 'EventDetails', bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, registrationCloseDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, publiclyListed?: boolean | null, currency?: string | null, fixedAdminFee?: number | null, eventType?: EventType | null, eventLocation?: string | null, donationUrl?: string | null, blackbaudId?: string | null, timeZone?: string | null } | null, registrationFields?: Array<{ __typename?: 'RegistrationField', name: string }> | null, fundraising?: { __typename?: 'EventFundraising', enabled?: boolean | null, id?: string | null, title?: string | null, description?: string | null, goal?: number | null, programs?: Array<{ __typename?: 'FundraisingProgram', title: string, description?: string | null, goal: number, media?: { __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string } | null }> | null, media?: Array<{ __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string }> | null } | null, tickets?: Array<{ __typename?: 'EventTicket', price: number, ticketType: TicketType, title: string, quantity: number, adminFee: number }> | null, speakers?: Array<{ __typename?: 'EventSpeaker', userId?: string | null, email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType, bio?: string | null }> | null, stages?: Array<{ __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string, channelName: string, token: string, grToken: string, isLive: boolean }> | null, sponsors?: Array<{ __typename?: 'EventSponsor', title: string, description?: string | null, logoUrl?: string | null, websiteUrl?: string | null, twitterUrl?: string | null, linkedinUrl?: string | null, facebookUrl?: string | null, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', url: string, title?: string | null, description?: string | null, id: string }> | null }> | null, sessions?: Array<{ __typename?: 'EventSession', description?: string | null, endDateTime: string, startDateTime: string, title: string, isBreak?: boolean | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType }> | null, stage?: { __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string } | null }> | null, breakoutRooms?: Array<{ __typename?: 'EventBreakoutRoom', thumbnailImage?: string | null, description?: string | null, maxAttendees: number, title: string, channelName: string, token: string, totalUsers: number }> | null, attendees?: Array<{ __typename?: 'EventAttendee', email: string, name?: string | null, profileImage?: string | null, ticketTitle: string, invitationSentDatetime?: string | null, registered?: boolean | null, checkInStatus?: string | null, checkInDatetime?: string | null, ticketCode?: string | null, userId?: string | null }> | null } };

export type GetOrderByEventIdQueryVariables = Exact<{
  eventId: Scalars['String'];
  userId: Scalars['String'];
}>;


export type GetOrderByEventIdQuery = { __typename?: 'Query', getOrderByEventId?: { __typename?: 'TicketOrder', userId?: string | null, eventId?: string | null, quantity?: number | null, tickets?: Array<{ __typename?: 'TicketPurchase', title: string, email: string, fullName: string }> | null } | null };

export type ChannelInfoChangedSubscriptionVariables = Exact<{
  channelName: Scalars['String'];
}>;


export type ChannelInfoChangedSubscription = { __typename?: 'Subscription', ChannelInfoChanged: { __typename?: 'ChannelInfo', channelName: string, isLive: boolean, totalUsers: number, users: Array<string> } };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent?: { __typename?: 'Event', eventId: string } | null };

export type DeleteEventByIdMutationVariables = Exact<{
  input: DeleteEventByIdInput;
}>;


export type DeleteEventByIdMutation = { __typename?: 'Mutation', deleteEventById: boolean };

export type EventDonationCreatePaymentIntentMutationVariables = Exact<{
  input: DonationPaymentIntentInput;
}>;


export type EventDonationCreatePaymentIntentMutation = { __typename?: 'Mutation', eventDonationCreatePaymentIntent: { __typename?: 'PaymentIntentResponse', clientSecret: string, nextAction?: string | null, error?: string | null } };

export type EventDonationListTransactionsQueryVariables = Exact<{
  eventId?: InputMaybe<Scalars['String']>;
  donationUrl?: InputMaybe<Scalars['String']>;
  eventName?: InputMaybe<Scalars['String']>;
}>;


export type EventDonationListTransactionsQuery = { __typename?: 'Query', eventDonationListTransactions: { __typename?: 'TransactionsListResponse', transactions: Array<{ __typename?: 'TransactionData', firstName?: string | null, lastName?: string | null, amount: number, currency: string, eventId: string, eventName: string, message?: string | null, coverFee?: string | null, fee?: number | null, donation?: number | null, total: number, created: number, address?: string | null, giftAid: string, selectedProgram: string, email: string, visibility?: string | null, donorDob?: string | null }> } };

export type EventDonationSendStripeMailMutationVariables = Exact<{
  eventId: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
}>;


export type EventDonationSendStripeMailMutation = { __typename?: 'Mutation', eventDonationSendStripeMail: { __typename?: 'StripeMailResponse', success?: boolean | null } };

export type GetAgoraTokenQueryVariables = Exact<{
  channelName: Scalars['String'];
}>;


export type GetAgoraTokenQuery = { __typename?: 'Query', getAgoraToken: string };

export type GetAllEventOverviewsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllEventOverviewsQuery = { __typename?: 'Query', getAllPublicEvents: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, event?: { __typename?: 'EventDetails', eventType?: EventType | null, bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, donationUrl?: string | null, currency?: string | null } | null, attendees?: Array<{ __typename?: 'EventAttendee', name?: string | null }> | null, fundraising?: { __typename?: 'EventFundraising', goal?: number | null, donors?: number | null, raised?: number | null } | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null }> | null }> };

export type GetAllEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllEventsQuery = { __typename?: 'Query', getAllEvents: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isComplete?: boolean | null, isPublished?: boolean | null, dateCreated: string, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', id: string, title?: string | null, description?: string | null, url: string }> | null, communications?: { __typename?: 'EventCommunications', socials?: Array<{ __typename?: 'SocialInfo', platform: string, url: string }> | null, announcements?: Array<{ __typename?: 'Announcement', title: string, body: string }> | null } | null, messages: Array<{ __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null }>, event?: { __typename?: 'EventDetails', bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, registrationCloseDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, publiclyListed?: boolean | null, currency?: string | null, fixedAdminFee?: number | null, eventType?: EventType | null, eventLocation?: string | null, donationUrl?: string | null, blackbaudId?: string | null, timeZone?: string | null } | null, registrationFields?: Array<{ __typename?: 'RegistrationField', name: string }> | null, fundraising?: { __typename?: 'EventFundraising', enabled?: boolean | null, id?: string | null, title?: string | null, description?: string | null, goal?: number | null, programs?: Array<{ __typename?: 'FundraisingProgram', title: string, description?: string | null, goal: number, media?: { __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string } | null }> | null, media?: Array<{ __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string }> | null } | null, tickets?: Array<{ __typename?: 'EventTicket', price: number, ticketType: TicketType, title: string, quantity: number, adminFee: number }> | null, speakers?: Array<{ __typename?: 'EventSpeaker', userId?: string | null, email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType, bio?: string | null }> | null, stages?: Array<{ __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string, channelName: string, token: string, grToken: string, isLive: boolean }> | null, sponsors?: Array<{ __typename?: 'EventSponsor', title: string, description?: string | null, logoUrl?: string | null, websiteUrl?: string | null, twitterUrl?: string | null, linkedinUrl?: string | null, facebookUrl?: string | null, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', url: string, title?: string | null, description?: string | null, id: string }> | null }> | null, sessions?: Array<{ __typename?: 'EventSession', description?: string | null, endDateTime: string, startDateTime: string, title: string, isBreak?: boolean | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType }> | null, stage?: { __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string } | null }> | null, breakoutRooms?: Array<{ __typename?: 'EventBreakoutRoom', thumbnailImage?: string | null, description?: string | null, maxAttendees: number, title: string, channelName: string, token: string, totalUsers: number }> | null, attendees?: Array<{ __typename?: 'EventAttendee', email: string, name?: string | null, profileImage?: string | null, ticketTitle: string, invitationSentDatetime?: string | null, registered?: boolean | null, checkInStatus?: string | null, checkInDatetime?: string | null, ticketCode?: string | null, userId?: string | null }> | null }> };

export type GetAllEventsByCompanyQueryVariables = Exact<{
  company: Scalars['String'];
}>;


export type GetAllEventsByCompanyQuery = { __typename?: 'Query', getAllEventsByCompany: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null, ticketType?: string | null, price?: string | null }> | null }, event?: { __typename?: 'EventDetails', eventType?: EventType | null, bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, donationUrl?: string | null, currency?: string | null } | null, attendees?: Array<{ __typename?: 'EventAttendee', name?: string | null, email: string, profileImage?: string | null, ticketTitle: string, invitationSentDatetime?: string | null, registered?: boolean | null, checkInStatus?: string | null, checkInDatetime?: string | null, ticketCode?: string | null }> | null, fundraising?: { __typename?: 'EventFundraising', title?: string | null, goal?: number | null, donors?: number | null, raised?: number | null, media?: Array<{ __typename?: 'FundraidingMedia', url: string }> | null, transactions?: Array<{ __typename?: 'FundraisingTransaction', firstName?: string | null, lastName?: string | null, amount?: number | null, currency?: string | null, selectedProgram: string, coverFee?: string | null, fee?: string | null, donation?: string | null, total?: number | null, created?: number | null }> | null } | null, breakoutRooms?: Array<{ __typename?: 'EventBreakoutRoom', title: string, totalUsers: number, thumbnailImage?: string | null, users: Array<string>, maxAttendees: number, channelName: string }> | null, speakers?: Array<{ __typename?: 'EventSpeaker', name: string, email?: string | null, profileImage?: string | null, position: string, organization: string, ticketType: TicketType, bio?: string | null }> | null, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', id: string, title?: string | null, description?: string | null, url: string }> | null }> };

export type GetAllFundraisesOverviewsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllFundraisesOverviewsQuery = { __typename?: 'Query', getAllPublicFundraises: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, event?: { __typename?: 'EventDetails', eventType?: EventType | null, bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, donationUrl?: string | null, currency?: string | null } | null, attendees?: Array<{ __typename?: 'EventAttendee', name?: string | null }> | null, fundraising?: { __typename?: 'EventFundraising', goal?: number | null, donors?: number | null, raised?: number | null } | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null }> | null }> };

export type GetAvailableTicketsByEventIdQueryVariables = Exact<{
  input: GetAvailableTicketsByEventIdInput;
}>;


export type GetAvailableTicketsByEventIdQuery = { __typename?: 'Query', getAvailableTicketsByEventId: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null } };

export type GetBlackBaudEventMutationVariables = Exact<{
  eventId: Scalars['String'];
  blackbaudId?: InputMaybe<Scalars['String']>;
}>;


export type GetBlackBaudEventMutation = { __typename?: 'Mutation', getBlackBaudEvent?: { __typename?: 'BlackBaudEventResponse', id?: number | null, name?: string | null, description?: string | null, start_date?: string | null, start_time?: string | null, end_date?: string | null, end_time?: string | null, attendees?: Array<{ __typename?: 'Participant', name?: string | null, email?: string | null }> | null, speakers?: Array<{ __typename?: 'Participant', name?: string | null, email?: string | null }> | null } | null };

export type GetBreakoutUserCountQueryVariables = Exact<{
  input: GetEventByIdInput;
}>;


export type GetBreakoutUserCountQuery = { __typename?: 'Query', getEventById: { __typename?: 'Event', eventId: string, breakoutRooms?: Array<{ __typename?: 'EventBreakoutRoom', title: string, channelName: string, totalUsers: number, maxAttendees: number }> | null } };

export type GetChannelInfoQueryVariables = Exact<{
  channelName: Scalars['String'];
}>;


export type GetChannelInfoQuery = { __typename?: 'Query', getChannelInfo: { __typename?: 'ChannelInfo', channelName: string, isLive: boolean, totalUsers: number, users: Array<string> } };

export type GetEventsByCompanyOverviewsQueryVariables = Exact<{
  company: Scalars['String'];
}>;


export type GetEventsByCompanyOverviewsQuery = { __typename?: 'Query', getEventsByCompany: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, event?: { __typename?: 'EventDetails', eventType?: EventType | null, bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, donationUrl?: string | null, currency?: string | null } | null, attendees?: Array<{ __typename?: 'EventAttendee', name?: string | null }> | null, fundraising?: { __typename?: 'EventFundraising', goal?: number | null, donors?: number | null, raised?: number | null } | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null }> | null }> };

export type GetFundraisingCsvQueryVariables = Exact<{
  eventId: Scalars['String'];
}>;


export type GetFundraisingCsvQuery = { __typename?: 'Query', getFundraisingCSV: string };

export type GetMyEventOverviewsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEventOverviewsQuery = { __typename?: 'Query', getMyEvents: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, event?: { __typename?: 'EventDetails', eventType?: EventType | null, bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, donationUrl?: string | null, currency?: string | null } | null, attendees?: Array<{ __typename?: 'EventAttendee', name?: string | null }> | null, fundraising?: { __typename?: 'EventFundraising', goal?: number | null, donors?: number | null, raised?: number | null } | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null }> | null }> };

export type GetMyEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEventsQuery = { __typename?: 'Query', getMyEvents: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isComplete?: boolean | null, isPublished?: boolean | null, dateCreated: string, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', id: string, title?: string | null, description?: string | null, url: string }> | null, communications?: { __typename?: 'EventCommunications', socials?: Array<{ __typename?: 'SocialInfo', platform: string, url: string }> | null, announcements?: Array<{ __typename?: 'Announcement', title: string, body: string }> | null } | null, messages: Array<{ __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null }>, event?: { __typename?: 'EventDetails', bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, registrationCloseDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, publiclyListed?: boolean | null, currency?: string | null, fixedAdminFee?: number | null, eventType?: EventType | null, eventLocation?: string | null, donationUrl?: string | null, blackbaudId?: string | null, timeZone?: string | null } | null, registrationFields?: Array<{ __typename?: 'RegistrationField', name: string }> | null, fundraising?: { __typename?: 'EventFundraising', enabled?: boolean | null, id?: string | null, title?: string | null, description?: string | null, goal?: number | null, programs?: Array<{ __typename?: 'FundraisingProgram', title: string, description?: string | null, goal: number, media?: { __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string } | null }> | null, media?: Array<{ __typename?: 'FundraidingMedia', title: string, body: string, platform?: string | null, url: string }> | null } | null, tickets?: Array<{ __typename?: 'EventTicket', price: number, ticketType: TicketType, title: string, quantity: number, adminFee: number }> | null, speakers?: Array<{ __typename?: 'EventSpeaker', userId?: string | null, email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType, bio?: string | null }> | null, stages?: Array<{ __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string, channelName: string, token: string, grToken: string, isLive: boolean }> | null, sponsors?: Array<{ __typename?: 'EventSponsor', title: string, description?: string | null, logoUrl?: string | null, websiteUrl?: string | null, twitterUrl?: string | null, linkedinUrl?: string | null, facebookUrl?: string | null, ondemandContent?: Array<{ __typename?: 'EventOndemandContent', url: string, title?: string | null, description?: string | null, id: string }> | null }> | null, sessions?: Array<{ __typename?: 'EventSession', description?: string | null, endDateTime: string, startDateTime: string, title: string, isBreak?: boolean | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null, name: string, organization: string, position: string, profileImage?: string | null, ticketType: TicketType }> | null, stage?: { __typename?: 'EventStage', class: StageType, description?: string | null, holdingVideoUrl?: string | null, title: string } | null }> | null, breakoutRooms?: Array<{ __typename?: 'EventBreakoutRoom', thumbnailImage?: string | null, description?: string | null, maxAttendees: number, title: string, channelName: string, token: string, totalUsers: number }> | null, attendees?: Array<{ __typename?: 'EventAttendee', email: string, name?: string | null, profileImage?: string | null, ticketTitle: string, invitationSentDatetime?: string | null, registered?: boolean | null, checkInStatus?: string | null, checkInDatetime?: string | null, ticketCode?: string | null, userId?: string | null }> | null }> };

export type GetPastEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPastEventsQuery = { __typename?: 'Query', getPastEvents: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, event?: { __typename?: 'EventDetails', eventType?: EventType | null, bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, donationUrl?: string | null, currency?: string | null } | null, attendees?: Array<{ __typename?: 'EventAttendee', name?: string | null }> | null, fundraising?: { __typename?: 'EventFundraising', goal?: number | null, donors?: number | null, raised?: number | null } | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null }> | null }> };

export type GetPublicEventsByOrganisationUrlOverviewsQueryVariables = Exact<{
  url: Scalars['String'];
}>;


export type GetPublicEventsByOrganisationUrlOverviewsQuery = { __typename?: 'Query', getPublicEventsByOrganisationUrl: Array<{ __typename?: 'Event', eventId: string, organizerId: string, isPublished?: boolean | null, isComplete?: boolean | null, availableTickets: { __typename?: 'AvailableTicketInfoResponse', tickets?: Array<{ __typename?: 'AvailableTicketInfo', ticketTitle?: string | null, totalQuantity?: string | null, remaining?: string | null }> | null }, event?: { __typename?: 'EventDetails', eventType?: EventType | null, bannerImage?: string | null, description?: string | null, eventMainColour?: string | null, eventBackgroundColour?: string | null, eventTextColour?: string | null, endDateTime?: string | null, shortDescription?: string | null, startDateTime?: string | null, title: string, organizationName: string, thumbnailImage?: string | null, donationUrl?: string | null, currency?: string | null } | null, attendees?: Array<{ __typename?: 'EventAttendee', name?: string | null }> | null, fundraising?: { __typename?: 'EventFundraising', goal?: number | null, donors?: number | null, raised?: number | null } | null, speakers?: Array<{ __typename?: 'EventSpeaker', email?: string | null }> | null }> };

export type PurchaseTicketsMutationVariables = Exact<{
  input: PurchaseTicketsInput;
  donation?: InputMaybe<DonationInput>;
}>;


export type PurchaseTicketsMutation = { __typename?: 'Mutation', purchaseTickets: { __typename?: 'PurchaseTicketsResponse', checkoutUrl: string, user?: string | null, userAlreadyExist?: boolean | null } };

export type PushToBlackbaudMutationVariables = Exact<{
  eventId: Scalars['String'];
  blackbaudId?: InputMaybe<Scalars['String']>;
  fields: Array<Scalars['String']> | Scalars['String'];
  updatedConstituents?: InputMaybe<Array<UpdatedConstituentInput> | UpdatedConstituentInput>;
}>;


export type PushToBlackbaudMutation = { __typename?: 'Mutation', pushToBlackbaud?: { __typename?: 'PushToBlackbaudResponse', success?: boolean | null, completed?: boolean | null, error?: boolean | null, isOrganizer?: boolean | null, blackBaudAccessToken?: string | null, orgName?: string | null, currentBlackbaudId?: string | null, newBlackbaudId?: string | null, bbServiceInitialized?: boolean | null, bbPrimaryAccessKey?: string | null, bbUrl?: string | null, eventPreUpdate?: boolean | null, eventPostUpdate?: boolean | null, eventUpdated?: boolean | null, eventId?: string | null } | null };

export type SendAttendeeEmailsForEventMutationVariables = Exact<{
  emails: Array<Scalars['String']> | Scalars['String'];
  eventId: Scalars['String'];
}>;


export type SendAttendeeEmailsForEventMutation = { __typename?: 'Mutation', sendAttendeeEmailsForEvent: boolean };

export type SetCheckInforAttendeeMutationVariables = Exact<{
  email: Scalars['String'];
  eventId: Scalars['String'];
  checkInStatus: Scalars['String'];
}>;


export type SetCheckInforAttendeeMutation = { __typename?: 'Mutation', setCheckInforAttendee: boolean };

export type UpdateChannelInfoMutationVariables = Exact<{
  channelName: Scalars['String'];
}>;


export type UpdateChannelInfoMutation = { __typename?: 'Mutation', updateChannelInfo: boolean };

export type UpdateEventMutationVariables = Exact<{
  input: UpdateEventInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent?: { __typename?: 'Event', eventId: string } | null };

export type GetLocationQueryVariables = Exact<{
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
}>;


export type GetLocationQuery = { __typename?: 'Query', getLocation: string };

export type UploadMediaMutationVariables = Exact<{
  input: MediaUploadInput;
}>;


export type UploadMediaMutation = { __typename?: 'Mutation', uploadMedia: { __typename?: 'MediaUpload', preSignedUrl: string, uploadedFileUrl: string } };

export type MessageFullFragment = { __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null };

export type CallUserMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type CallUserMutation = { __typename?: 'Mutation', call: boolean };

export type CreateMessageForChatIdMutationVariables = Exact<{
  input: CreateMessageInput;
}>;


export type CreateMessageForChatIdMutation = { __typename?: 'Mutation', createMessageForChatId: { __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null } };

export type GetChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsQuery = { __typename?: 'Query', getChats: Array<{ __typename?: 'ChatOverview', chatId: string, lastMessage: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null } }> };

export type GetMeetingForChannelNameQueryVariables = Exact<{
  channelName: Scalars['String'];
}>;


export type GetMeetingForChannelNameQuery = { __typename?: 'Query', getMeetingForChannelName: string };

export type GetMessagesForChatIdQueryVariables = Exact<{
  input: GetMessagesForChatId;
}>;


export type GetMessagesForChatIdQuery = { __typename?: 'Query', getMessagesForChatId: Array<{ __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null }> };

export type MessageChangedSubscriptionVariables = Exact<{
  input: Scalars['String'];
}>;


export type MessageChangedSubscription = { __typename?: 'Subscription', messageChanged: { __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null } };

export type ReactToMessageMutationVariables = Exact<{
  emoji: Scalars['String'];
  messageUserId: Scalars['String'];
  chatId: Scalars['String'];
  messageId: Scalars['String'];
}>;


export type ReactToMessageMutation = { __typename?: 'Mutation', reactToMessage: { __typename?: 'Message', messageId: string, chatId: string, message: string, dateCreated: string, user: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, reactions?: Array<{ __typename?: 'Reaction', emoji: string, users: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> }> | null } };

export type ReceivedCallSubscriptionVariables = Exact<{
  myUserId: Scalars['String'];
}>;


export type ReceivedCallSubscription = { __typename?: 'Subscription', receivedCall: { __typename?: 'Call', from: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }, to: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null } } };

export type ConnectToBlackBaudMutationVariables = Exact<{
  name: Scalars['String'];
  code: Scalars['String'];
  codeVerifier: Scalars['String'];
  clientId: Scalars['String'];
  redirectUri: Scalars['String'];
}>;


export type ConnectToBlackBaudMutation = { __typename?: 'Mutation', connectToBlackBaud: { __typename?: 'UpdateOrganisationResponse', success?: boolean | null } };

export type GetOrganisationByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetOrganisationByNameQuery = { __typename?: 'Query', getOrganisationByName?: { __typename?: 'Organisation', name?: string | null, organisationType?: string | null, bannerImage?: string | null, logoImage?: string | null, mainColour?: string | null, currency?: string | null, percentage?: number | null, headerTextOne?: string | null, headerTextTwo?: string | null, dashboardPopupDoNotShowAgain?: boolean | null, blackBaudAccessToken?: string | null, url?: string | null } | null };

export type GetAllOrganisationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOrganisationsQuery = { __typename?: 'Query', getAllOrganisations: Array<{ __typename?: 'Organisation', name?: string | null, organisationType?: string | null, bannerImage?: string | null, logoImage?: string | null, mainColour?: string | null, currency?: string | null, percentage?: number | null }> };

export type UpdateOrganisationMutationVariables = Exact<{
  name: Scalars['String'];
  organisationType?: InputMaybe<Scalars['String']>;
  mainColour?: InputMaybe<Scalars['String']>;
  bannerImage?: InputMaybe<Scalars['String']>;
  logoImage?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  percentage?: InputMaybe<Scalars['Float']>;
  headerTextOne?: InputMaybe<Scalars['String']>;
  headerTextTwo?: InputMaybe<Scalars['String']>;
  dashboardPopupDoNotShowAgain?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateOrganisationMutation = { __typename?: 'Mutation', updateOrganisation: { __typename?: 'UpdateOrganisationResponse', success?: boolean | null } };

export type AddStatisticMutationVariables = Exact<{
  anonymousId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  ip?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  browser?: InputMaybe<Scalars['String']>;
}>;


export type AddStatisticMutation = { __typename?: 'Mutation', addStatistic: boolean };

export type GetAllStatisticsForOrganiserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllStatisticsForOrganiserQuery = { __typename?: 'Query', getAllStatisticsForOrganiser: Array<{ __typename?: 'Statistic', anonymousId?: string | null, userId?: string | null, name?: string | null, country?: string | null, url?: string | null, companyId?: string | null, loggedUserId?: string | null, datetime?: string | null, donation?: { __typename?: 'StatisticDonation', coverFee?: string | null, giftAid?: string | null, eventId?: string | null, organizationName?: string | null, eventName?: string | null, url?: string | null, currency?: string | null, amount?: number | null, fee?: number | null, donation?: number | null } | null }> };

export type ThemeQueryVariables = Exact<{
  themeId: Scalars['String'];
}>;


export type ThemeQuery = { __typename?: 'Query', theme: { __typename?: 'Theme', themeId: string, color: string, logoUrl: string, url: string } };

export type GetUsersByIdsQueryVariables = Exact<{
  input: GetUsersByIdsInput;
}>;


export type GetUsersByIdsQuery = { __typename?: 'Query', getUsersByIds: { __typename?: 'PaginatedUserResponse', total: number, nextToken?: string | null, items: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> } };

export type UserFullFragment = { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null };

export type AdminResetPasswordMutationVariables = Exact<{
  ghostedEmail: Scalars['String'];
}>;


export type AdminResetPasswordMutation = { __typename?: 'Mutation', adminResetPassword: { __typename?: 'ChangePasswordResponse', success?: boolean | null } };

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'ChangePasswordResponse', success?: boolean | null } };

export type CreateMerchantMutationVariables = Exact<{
  input: CreateMerchantInput;
}>;


export type CreateMerchantMutation = { __typename?: 'Mutation', createMerchant: { __typename?: 'CreateMerchant', redirectUrl: string } };

export type CreateUserMutationVariables = Exact<{
  university: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: boolean };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: { __typename?: 'PaginatedUserResponse', total: number, items: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> } };

export type GetFullOrganiserByCompanyQueryVariables = Exact<{
  company: Scalars['String'];
}>;


export type GetFullOrganiserByCompanyQuery = { __typename?: 'Query', getOrganiserByCompany: { __typename?: 'PaginatedUserResponse', total: number, nextToken?: string | null, items: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> } };

export type GetMerchantAccountQueryVariables = Exact<{
  input: GetMerchantAccountInput;
}>;


export type GetMerchantAccountQuery = { __typename?: 'Query', getMerchantAccount: { __typename?: 'MerchantAccountInfo', merchantAccountExists: boolean, chargesEnabled?: boolean | null, required?: Array<string> | null } };

export type GetOrganiserByCompanyQueryVariables = Exact<{
  company: Scalars['String'];
}>;


export type GetOrganiserByCompanyQuery = { __typename?: 'Query', getOrganiserByCompany: { __typename?: 'PaginatedUserResponse', total: number, nextToken?: string | null, items: Array<{ __typename?: 'User', email: string }> } };

export type GetUserPermissionsQueryVariables = Exact<{
  input: GetUserPermissionsInput;
}>;


export type GetUserPermissionsQuery = { __typename?: 'Query', getUserPermissions: Array<string> };

export type GetUsersInCompanyQueryVariables = Exact<{
  company: Scalars['String'];
}>;


export type GetUsersInCompanyQuery = { __typename?: 'Query', getUsersInCompany: { __typename?: 'PaginatedUserResponse', total: number, items: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> } };

export type GetUsersInEventQueryVariables = Exact<{
  input: Scalars['String'];
}>;


export type GetUsersInEventQuery = { __typename?: 'Query', getUsersInEvent: { __typename?: 'PaginatedUserResponse', total: number, items: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> } };

export type GetUsersInGroupQueryVariables = Exact<{
  input: GetUsersInGroupInput;
}>;


export type GetUsersInGroupQuery = { __typename?: 'Query', getUsersInGroup: { __typename?: 'PaginatedUserResponse', total: number, items: Array<{ __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null }> } };

export type LinkMerchantMutationVariables = Exact<{
  input: LinkMerchantInput;
}>;


export type LinkMerchantMutation = { __typename?: 'Mutation', linkMerchant: { __typename?: 'LinkMerchant', status: string, error?: string | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', name?: string | null, profileImage?: string | null, email: string, userId: string, company?: string | null, dateCreated: string, location: string, university?: string | null, registrationFields: any, lastActive?: string | null, isActive?: boolean | null, isAnonymous?: string | null, phoneNumber?: string | null, jobTitle?: string | null, otherProfiles?: string | null, companyTitle?: string | null } };

export type OrganiserRequestAccessMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  organisation: Scalars['String'];
  email: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
}>;


export type OrganiserRequestAccessMutation = { __typename?: 'Mutation', organiserRequestAccess: { __typename?: 'OrganiserRequestAccessResponse', success?: boolean | null, password?: string | null } };

export type PasswordResetConfirmationMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type PasswordResetConfirmationMutation = { __typename?: 'Mutation', passwordResetConfirmation: { __typename?: 'PasswordResetConfirmationRespose', success?: boolean | null } };

export type RequestEarlyAccessMutationVariables = Exact<{
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
}>;


export type RequestEarlyAccessMutation = { __typename?: 'Mutation', requestEarlyAccess: { __typename?: 'RequestEarlyAccessResponse', success?: boolean | null } };

export type AddUserDataMutationVariables = Exact<{
  input: RegistrationFieldValuesInput;
}>;


export type AddUserDataMutation = { __typename?: 'Mutation', addUserData: boolean };

export type UpdateLastActiveMutationVariables = Exact<{
  input: UpdateLastActiveInput;
}>;


export type UpdateLastActiveMutation = { __typename?: 'Mutation', updateLastActive: boolean };

export const UserFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"dateCreated"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"university"}},{"kind":"Field","name":{"kind":"Name","value":"registrationFields"}},{"kind":"Field","name":{"kind":"Name","value":"lastActive"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isAnonymous"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"jobTitle"}},{"kind":"Field","name":{"kind":"Name","value":"otherProfiles"}},{"kind":"Field","name":{"kind":"Name","value":"companyTitle"}}]}}]} as unknown as DocumentNode<UserFullFragment, unknown>;
export const MessageFullFragmentDoc = {"kind":"Document", "definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"dateCreated"}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emoji"}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<MessageFullFragment, unknown>;
export const EventFullFragmentDoc = {"kind":"Document", "definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"organizerId"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"dateCreated"}},{"kind":"Field","name":{"kind":"Name","value":"availableTickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticketTitle"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"remaining"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ondemandContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"communications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"socials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"announcements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerImage"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventMainColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventBackgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventTextColour"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"registrationCloseDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImage"}},{"kind":"Field","name":{"kind":"Name","value":"publiclyListed"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"fixedAdminFee"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventLocation"}},{"kind":"Field","name":{"kind":"Name","value":"donationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"blackbaudId"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrationFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundraising"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"programs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"ticketType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"adminFee"}}]}},{"kind":"Field","name":{"kind":"Name","value":"speakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"ticketType"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"holdingVideoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"channelName"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"grToken"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sponsors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"ondemandContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"linkedinUrl"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"speakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"ticketType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"holdingVideoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isBreak"}}]}},{"kind":"Field","name":{"kind":"Name","value":"breakoutRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnailImage"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"maxAttendees"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"channelName"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"ticketTitle"}},{"kind":"Field","name":{"kind":"Name","value":"invitationSentDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"registered"}},{"kind":"Field","name":{"kind":"Name","value":"checkInStatus"}},{"kind":"Field","name":{"kind":"Name","value":"checkInDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"ticketCode"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}},...MessageFullFragmentDoc.definitions]} as unknown as DocumentNode<EventFullFragment, unknown>;
export const EventOverviewFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventOverview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"organizerId"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"availableTickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticketTitle"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"remaining"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventMainColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventBackgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventTextColour"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImage"}},{"kind":"Field","name":{"kind":"Name","value":"donationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundraising"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"donors"}},{"kind":"Field","name":{"kind":"Name","value":"raised"}}]}},{"kind":"Field","name":{"kind":"Name","value":"speakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<EventOverviewFragment, unknown>;
export const EventDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"organizerId"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerImage"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventMainColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventBackgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventTextColour"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"registrationCloseDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImage"}},{"kind":"Field","name":{"kind":"Name","value":"publiclyListed"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"fixedAdminFee"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"eventLocation"}},{"kind":"Field","name":{"kind":"Name","value":"donationUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"donations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"selectedProgram"}}]}}]}}]} as unknown as DocumentNode<EventDataFragment, unknown>;
export const GetEventByDonationUrlDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEventByDonationUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetEventByDonationUrlInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEventByDonationUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventData"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"fundraising"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"programs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectedProgram"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"coverFee"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"giftAid"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"donation"}}]}}]}}]}}]}},...EventDataFragmentDoc.definitions]} as unknown as DocumentNode<GetEventByDonationUrlQuery, GetEventByDonationUrlQueryVariables>;
export const GetEventByIdDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEventById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetEventByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEventById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},...EventFullFragmentDoc.definitions]} as unknown as DocumentNode<GetEventByIdQuery, GetEventByIdQueryVariables>;
export const GetEventByIdForEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEventByIdForEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetEventByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEventById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"organizerId"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"dateCreated"}},{"kind":"Field","name":{"kind":"Name","value":"notifyOrganiser"}},{"kind":"Field","name":{"kind":"Name","value":"availableTickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticketTitle"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"remaining"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerImage"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventMainColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventBackgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventTextColour"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"registrationCloseDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImage"}},{"kind":"Field","name":{"kind":"Name","value":"publiclyListed"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"eventLocation"}},{"kind":"Field","name":{"kind":"Name","value":"donationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"blackbaudId"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrationFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundraising"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"programs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"ticketType"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"speakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"ticketType"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"holdingVideoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sponsors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"linkedinUrl"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"ondemandContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"speakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"ticketType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"holdingVideoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isBreak"}}]}},{"kind":"Field","name":{"kind":"Name","value":"breakoutRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnailImage"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"maxAttendees"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"communications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"socials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"announcements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ondemandContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"ticketTitle"}},{"kind":"Field","name":{"kind":"Name","value":"invitationSentDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"registered"}},{"kind":"Field","name":{"kind":"Name","value":"checkInStatus"}},{"kind":"Field","name":{"kind":"Name","value":"checkInDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"ticketCode"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventByIdForEditorQuery, GetEventByIdForEditorQueryVariables>;
export const GetEventByIdForUnregisteredUserDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEventByIdForUnregisteredUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetEventByIdForUnregisteredUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEventByIdForUnregisteredUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},...EventFullFragmentDoc.definitions]} as unknown as DocumentNode<GetEventByIdForUnregisteredUserQuery, GetEventByIdForUnregisteredUserQueryVariables>;
export const GetOrderByEventIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrderByEventId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrderByEventId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderByEventIdQuery, GetOrderByEventIdQueryVariables>;
export const ChannelInfoChangedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ChannelInfoChanged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ChannelInfoChanged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelName"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"users"}}]}}]}}]} as unknown as DocumentNode<ChannelInfoChangedSubscription, ChannelInfoChangedSubscriptionVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const DeleteEventByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteEventById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteEventByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEventById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteEventByIdMutation, DeleteEventByIdMutationVariables>;
export const EventDonationCreatePaymentIntentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eventDonationCreatePaymentIntent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DonationPaymentIntentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventDonationCreatePaymentIntent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientSecret"}},{"kind":"Field","name":{"kind":"Name","value":"nextAction"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<EventDonationCreatePaymentIntentMutation, EventDonationCreatePaymentIntentMutationVariables>;
export const EventDonationListTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"eventDonationListTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"donationUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventDonationListTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"donationUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"donationUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"eventName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"coverFee"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"donation"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"giftAid"}},{"kind":"Field","name":{"kind":"Name","value":"selectedProgram"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"donorDob"}}]}}]}}]}}]} as unknown as DocumentNode<EventDonationListTransactionsQuery, EventDonationListTransactionsQueryVariables>;
export const EventDonationSendStripeMailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"eventDonationSendStripeMail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventDonationSendStripeMail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<EventDonationSendStripeMailMutation, EventDonationSendStripeMailMutationVariables>;
export const GetAgoraTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAgoraToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAgoraToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}}}]}]}}]} as unknown as DocumentNode<GetAgoraTokenQuery, GetAgoraTokenQueryVariables>;
export const GetAllEventOverviewsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllEventOverviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllPublicEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventOverview"}}]}}]}},...EventOverviewFragmentDoc.definitions]} as unknown as DocumentNode<GetAllEventOverviewsQuery, GetAllEventOverviewsQueryVariables>;
export const GetAllEventsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},...EventFullFragmentDoc.definitions]} as unknown as DocumentNode<GetAllEventsQuery, GetAllEventsQueryVariables>;
export const GetAllEventsByCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllEventsByCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllEventsByCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"organizerId"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"isComplete"}},{"kind":"Field","name":{"kind":"Name","value":"availableTickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticketTitle"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"remaining"}},{"kind":"Field","name":{"kind":"Name","value":"ticketType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventMainColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventBackgroundColour"}},{"kind":"Field","name":{"kind":"Name","value":"eventTextColour"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImage"}},{"kind":"Field","name":{"kind":"Name","value":"donationUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"ticketTitle"}},{"kind":"Field","name":{"kind":"Name","value":"invitationSentDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"registered"}},{"kind":"Field","name":{"kind":"Name","value":"checkInStatus"}},{"kind":"Field","name":{"kind":"Name","value":"checkInDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"ticketCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundraising"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"donors"}},{"kind":"Field","name":{"kind":"Name","value":"raised"}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"selectedProgram"}},{"kind":"Field","name":{"kind":"Name","value":"coverFee"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"donation"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"selectedProgram"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"breakoutRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailImage"}},{"kind":"Field","name":{"kind":"Name","value":"users"}},{"kind":"Field","name":{"kind":"Name","value":"maxAttendees"}},{"kind":"Field","name":{"kind":"Name","value":"channelName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"speakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profileImage"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"organization"}},{"kind":"Field","name":{"kind":"Name","value":"ticketType"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ondemandContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllEventsByCompanyQuery, GetAllEventsByCompanyQueryVariables>;
export const GetAllFundraisesOverviewsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllFundraisesOverviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllPublicFundraises"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventOverview"}}]}}]}},...EventOverviewFragmentDoc.definitions]} as unknown as DocumentNode<GetAllFundraisesOverviewsQuery, GetAllFundraisesOverviewsQueryVariables>;
export const GetAvailableTicketsByEventIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAvailableTicketsByEventId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAvailableTicketsByEventIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAvailableTicketsByEventId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticketTitle"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"remaining"}}]}}]}}]}}]} as unknown as DocumentNode<GetAvailableTicketsByEventIdQuery, GetAvailableTicketsByEventIdQueryVariables>;
export const GetBlackBaudEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"getBlackBaudEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"blackbaudId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBlackBaudEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"blackbaudId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"blackbaudId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"start_time"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_time"}},{"kind":"Field","name":{"kind":"Name","value":"attendees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"speakers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<GetBlackBaudEventMutation, GetBlackBaudEventMutationVariables>;
export const GetBreakoutUserCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBreakoutUserCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetEventByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEventById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"breakoutRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"channelName"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"maxAttendees"}}]}}]}}]}}]} as unknown as DocumentNode<GetBreakoutUserCountQuery, GetBreakoutUserCountQueryVariables>;
export const GetChannelInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChannelInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChannelInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channelName"}},{"kind":"Field","name":{"kind":"Name","value":"isLive"}},{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"users"}}]}}]}}]} as unknown as DocumentNode<GetChannelInfoQuery, GetChannelInfoQueryVariables>;
export const GetEventsByCompanyOverviewsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventsByCompanyOverviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEventsByCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventOverview"}}]}}]}},...EventOverviewFragmentDoc.definitions]} as unknown as DocumentNode<GetEventsByCompanyOverviewsQuery, GetEventsByCompanyOverviewsQueryVariables>;
export const GetFundraisingCsvDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFundraisingCSV"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFundraisingCSV"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}]}]}}]} as unknown as DocumentNode<GetFundraisingCsvQuery, GetFundraisingCsvQueryVariables>;
export const GetMyEventOverviewsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyEventOverviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventOverview"}}]}}]}},...EventOverviewFragmentDoc.definitions]} as unknown as DocumentNode<GetMyEventOverviewsQuery, GetMyEventOverviewsQueryVariables>;
export const GetMyEventsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFull"}}]}}]}},...EventFullFragmentDoc.definitions]} as unknown as DocumentNode<GetMyEventsQuery, GetMyEventsQueryVariables>;
export const GetPastEventsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPastEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPastEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventOverview"}}]}}]}},...EventOverviewFragmentDoc.definitions]} as unknown as DocumentNode<GetPastEventsQuery, GetPastEventsQueryVariables>;
export const GetPublicEventsByOrganisationUrlOverviewsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicEventsByOrganisationUrlOverviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPublicEventsByOrganisationUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventOverview"}}]}}]}},...EventOverviewFragmentDoc.definitions]} as unknown as DocumentNode<GetPublicEventsByOrganisationUrlOverviewsQuery, GetPublicEventsByOrganisationUrlOverviewsQueryVariables>;
export const PurchaseTicketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PurchaseTickets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PurchaseTicketsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"donation"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DonationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"purchaseTickets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"donation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"donation"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkoutUrl"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"userAlreadyExist"}}]}}]}}]} as unknown as DocumentNode<PurchaseTicketsMutation, PurchaseTicketsMutationVariables>;
export const PushToBlackbaudDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"pushToBlackbaud"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"blackbaudId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updatedConstituents"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatedConstituentInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pushToBlackbaud"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"blackbaudId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"blackbaudId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}},{"kind":"Argument","name":{"kind":"Name","value":"updatedConstituents"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updatedConstituents"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"isOrganizer"}},{"kind":"Field","name":{"kind":"Name","value":"blackBaudAccessToken"}},{"kind":"Field","name":{"kind":"Name","value":"orgName"}},{"kind":"Field","name":{"kind":"Name","value":"currentBlackbaudId"}},{"kind":"Field","name":{"kind":"Name","value":"newBlackbaudId"}},{"kind":"Field","name":{"kind":"Name","value":"bbServiceInitialized"}},{"kind":"Field","name":{"kind":"Name","value":"bbPrimaryAccessKey"}},{"kind":"Field","name":{"kind":"Name","value":"bbUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventPreUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"eventPostUpdate"}},{"kind":"Field","name":{"kind":"Name","value":"eventUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}}]}}]}}]} as unknown as DocumentNode<PushToBlackbaudMutation, PushToBlackbaudMutationVariables>;
export const SendAttendeeEmailsForEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendAttendeeEmailsForEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emails"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendAttendeeEmailsForEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emails"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}]}]}}]} as unknown as DocumentNode<SendAttendeeEmailsForEventMutation, SendAttendeeEmailsForEventMutationVariables>;
export const SetCheckInforAttendeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setCheckInforAttendee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkInStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCheckInforAttendee"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"checkInStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkInStatus"}}}]}]}}]} as unknown as DocumentNode<SetCheckInforAttendeeMutation, SetCheckInforAttendeeMutationVariables>;
export const UpdateChannelInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateChannelInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChannelInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}}}]}]}}]} as unknown as DocumentNode<UpdateChannelInfoMutation, UpdateChannelInfoMutationVariables>;
export const UpdateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventId"}}]}}]}}]} as unknown as DocumentNode<UpdateEventMutation, UpdateEventMutationVariables>;
export const GetLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"latitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"longitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}}}]}]}}]} as unknown as DocumentNode<GetLocationQuery, GetLocationQueryVariables>;
export const UploadMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MediaUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preSignedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"uploadedFileUrl"}}]}}]}}]} as unknown as DocumentNode<UploadMediaMutation, UploadMediaMutationVariables>;
export const CallUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CallUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"call"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}]}}]} as unknown as DocumentNode<CallUserMutation, CallUserMutationVariables>;
export const CreateMessageForChatIdDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMessageForChatId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMessageForChatId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFull"}}]}}]}},...MessageFullFragmentDoc.definitions]} as unknown as DocumentNode<CreateMessageForChatIdMutation, CreateMessageForChatIdMutationVariables>;
export const GetChatsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"}},{"kind":"Field","name":{"kind":"Name","value":"dateCreated"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<GetChatsQuery, GetChatsQueryVariables>;
export const GetMeetingForChannelNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeetingForChannelName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMeetingForChannelName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"channelName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelName"}}}]}]}}]} as unknown as DocumentNode<GetMeetingForChannelNameQuery, GetMeetingForChannelNameQueryVariables>;
export const GetMessagesForChatIdDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMessagesForChatId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetMessagesForChatId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMessagesForChatId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFull"}}]}}]}},...MessageFullFragmentDoc.definitions]} as unknown as DocumentNode<GetMessagesForChatIdQuery, GetMessagesForChatIdQueryVariables>;
export const MessageChangedDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MessageChanged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageChanged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFull"}}]}}]}},...MessageFullFragmentDoc.definitions]} as unknown as DocumentNode<MessageChangedSubscription, MessageChangedSubscriptionVariables>;
export const ReactToMessageDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReactToMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emoji"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reactToMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emoji"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emoji"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageFull"}}]}}]}},...MessageFullFragmentDoc.definitions]} as unknown as DocumentNode<ReactToMessageMutation, ReactToMessageMutationVariables>;
export const ReceivedCallDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ReceivedCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"myUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"receivedCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"myUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"to"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<ReceivedCallSubscription, ReceivedCallSubscriptionVariables>;
export const ConnectToBlackBaudDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"connectToBlackBaud"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"codeVerifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirectUri"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectToBlackBaud"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"codeVerifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"codeVerifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirectUri"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirectUri"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ConnectToBlackBaudMutation, ConnectToBlackBaudMutationVariables>;
export const GetOrganisationByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrganisationByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrganisationByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organisationType"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"}},{"kind":"Field","name":{"kind":"Name","value":"logoImage"}},{"kind":"Field","name":{"kind":"Name","value":"mainColour"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"headerTextOne"}},{"kind":"Field","name":{"kind":"Name","value":"headerTextTwo"}},{"kind":"Field","name":{"kind":"Name","value":"dashboardPopupDoNotShowAgain"}},{"kind":"Field","name":{"kind":"Name","value":"blackBaudAccessToken"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<GetOrganisationByNameQuery, GetOrganisationByNameQueryVariables>;
export const GetAllOrganisationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllOrganisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organisationType"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImage"}},{"kind":"Field","name":{"kind":"Name","value":"logoImage"}},{"kind":"Field","name":{"kind":"Name","value":"mainColour"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]} as unknown as DocumentNode<GetAllOrganisationsQuery, GetAllOrganisationsQueryVariables>;
export const UpdateOrganisationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateOrganisation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organisationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mainColour"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bannerImage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"logoImage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"percentage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"headerTextOne"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"headerTextTwo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dashboardPopupDoNotShowAgain"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganisation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"organisationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organisationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"mainColour"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mainColour"}}},{"kind":"Argument","name":{"kind":"Name","value":"bannerImage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bannerImage"}}},{"kind":"Argument","name":{"kind":"Name","value":"logoImage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"logoImage"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}},{"kind":"Argument","name":{"kind":"Name","value":"percentage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"percentage"}}},{"kind":"Argument","name":{"kind":"Name","value":"headerTextOne"},"value":{"kind":"Variable","name":{"kind":"Name","value":"headerTextOne"}}},{"kind":"Argument","name":{"kind":"Name","value":"headerTextTwo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"headerTextTwo"}}},{"kind":"Argument","name":{"kind":"Name","value":"dashboardPopupDoNotShowAgain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dashboardPopupDoNotShowAgain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateOrganisationMutation, UpdateOrganisationMutationVariables>;
export const AddStatisticDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addStatistic"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"anonymousId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"browser"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addStatistic"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"anonymousId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"anonymousId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}},{"kind":"Argument","name":{"kind":"Name","value":"ip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ip"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"browser"},"value":{"kind":"Variable","name":{"kind":"Name","value":"browser"}}}]}]}}]} as unknown as DocumentNode<AddStatisticMutation, AddStatisticMutationVariables>;
export const GetAllStatisticsForOrganiserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllStatisticsForOrganiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllStatisticsForOrganiser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anonymousId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"donation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coverFee"}},{"kind":"Field","name":{"kind":"Name","value":"giftAid"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"eventName"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"donation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"companyId"}},{"kind":"Field","name":{"kind":"Name","value":"loggedUserId"}},{"kind":"Field","name":{"kind":"Name","value":"datetime"}}]}}]}}]} as unknown as DocumentNode<GetAllStatisticsForOrganiserQuery, GetAllStatisticsForOrganiserQueryVariables>;
export const ThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Theme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"themeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"themeId"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<ThemeQuery, ThemeQueryVariables>;
export const GetUsersByIdsDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetUsersByIdsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersByIds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<GetUsersByIdsQuery, GetUsersByIdsQueryVariables>;
export const AdminResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ghostedEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminResetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ghostedEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ghostedEmail"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AdminResetPasswordMutation, AdminResetPasswordMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMerchantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redirectUrl"}}]}}]}}]} as unknown as DocumentNode<CreateMerchantMutation, CreateMerchantMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"university"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"university"},"value":{"kind":"Variable","name":{"kind":"Name","value":"university"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const GetAllUsersDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"getAll"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetFullOrganiserByCompanyDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFullOrganiserByCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrganiserByCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<GetFullOrganiserByCompanyQuery, GetFullOrganiserByCompanyQueryVariables>;
export const GetMerchantAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMerchantAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetMerchantAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMerchantAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchantAccountExists"}},{"kind":"Field","name":{"kind":"Name","value":"chargesEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"required"}}]}}]}}]} as unknown as DocumentNode<GetMerchantAccountQuery, GetMerchantAccountQueryVariables>;
export const GetOrganiserByCompanyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganiserByCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrganiserByCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"nextToken"}}]}}]}}]} as unknown as DocumentNode<GetOrganiserByCompanyQuery, GetOrganiserByCompanyQueryVariables>;
export const GetUserPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetUserPermissionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>;
export const GetUsersInCompanyDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersInCompany"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"company"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersInCompany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"company"},"value":{"kind":"Variable","name":{"kind":"Name","value":"company"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<GetUsersInCompanyQuery, GetUsersInCompanyQueryVariables>;
export const GetUsersInEventDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersInEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersInEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<GetUsersInEventQuery, GetUsersInEventQueryVariables>;
export const GetUsersInGroupDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsersInGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetUsersInGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersInGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<GetUsersInGroupQuery, GetUsersInGroupQueryVariables>;
export const LinkMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LinkMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LinkMerchantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<LinkMerchantMutation, LinkMerchantMutationVariables>;
export const MeDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFull"}}]}}]}},...UserFullFragmentDoc.definitions]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const OrganiserRequestAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"organiserRequestAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organisation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organiserRequestAccess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"organisation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organisation"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"password"}}]}}]}}]} as unknown as DocumentNode<OrganiserRequestAccessMutation, OrganiserRequestAccessMutationVariables>;
export const PasswordResetConfirmationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"passwordResetConfirmation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordResetConfirmation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<PasswordResetConfirmationMutation, PasswordResetConfirmationMutationVariables>;
export const RequestEarlyAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestEarlyAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestEarlyAccess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RequestEarlyAccessMutation, RequestEarlyAccessMutationVariables>;
export const AddUserDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddUserData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegistrationFieldValuesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUserData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddUserDataMutation, AddUserDataMutationVariables>;
export const UpdateLastActiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLastActive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLastActiveInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLastActive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateLastActiveMutation, UpdateLastActiveMutationVariables>;