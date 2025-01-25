import { graphql } from '@graphql/__generated'

export const ADMIN_RESET_PASSWORD = graphql(`
  mutation adminResetPassword($ghostedEmail: String!) {
    adminResetPassword(ghostedEmail: $ghostedEmail) {
      success
    }
  }
`)
