import { gql } from '@apollo/client';

export const UPDATE_USER_PROFILE_MUTATION = gql`
  mutation UpdateUserProfileMutation($id: UUID!, $name: String, $email: String, $phone: String) {
    updateusersCollection(
      set: { name: $name, email: $email, phone: $phone }
      filter: { id: { eq: $id } }
    ) {
      records {
        id
        name
        email
        phone
      }
    }
  }
`;
