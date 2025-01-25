export type ProfileInfo = {
  email?: string
  profileImageUrl?: string
  fullName?: string
  jobTitle?: string
  companyTitle?: string
  isAnonymous?: string
  phoneNumber?: string
  isOnboarded?: string
  acceptedTcPp?: boolean
  userId?: string
  university?: string
  otherProfiles?: {
    facebookAccount?: string
    twitterAccount?: string
    instagramAccount?: string
    linkedinAccount?: string
  }
  company?: string
  groups?: string[]
  changedPassword?: string
  permissions?: { [type: string]: { [action: string]: string[] } }
  organizer_eligible?: boolean
}

export type AuthContextType = {
  profile?: ProfileInfo
  setProfile: (profileInfo: ProfileInfo) => void
}
