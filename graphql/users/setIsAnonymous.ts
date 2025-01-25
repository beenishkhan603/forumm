import { graphql } from '@graphql/__generated'

export const SET_IS_ANONYMOUS = graphql(`
  mutation SetIsAnonymous($input: SetIsAnonymousInput!) {
    setIsAnonymous(input: $input){

  }
  }
`)
