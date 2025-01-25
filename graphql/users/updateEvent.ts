import { graphql } from "@graphql/__generated";

export const ADD_USER_DATA = graphql(`
  mutation AddUserData($input: RegistrationFieldValuesInput!) {
    addUserData(input: $input)
  }
`);
