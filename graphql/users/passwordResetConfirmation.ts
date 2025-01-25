import { graphql } from '@graphql/__generated'

export const PASSWORD_RESET_CONFIRMATION = graphql(`
  mutation passwordResetConfirmation($email: String!, $password: String!) {
    passwordResetConfirmation(email: $email, password: $password) {
      success
    }
  }
`)
