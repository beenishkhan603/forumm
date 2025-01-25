import { graphql } from '@graphql/__generated'

export const UserFull = graphql(`
  fragment UserFull on User {
    name
    profileImage
    email
    userId
    company
    dateCreated
    location
    university
    registrationFields
    lastActive
    isActive
    isAnonymous
    phoneNumber
    jobTitle
    otherProfiles
    companyTitle
  }
`)
