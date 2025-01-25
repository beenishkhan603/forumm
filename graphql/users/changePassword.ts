import { graphql } from '@graphql/__generated'

export const CHANGE_PASSWORD = graphql(`
  mutation changePassword($password: String!) {
    changePassword(password: $password) {
      success
    }
  }
`)
