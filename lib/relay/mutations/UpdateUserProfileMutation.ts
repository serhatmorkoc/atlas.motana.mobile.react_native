import { graphql } from 'react-relay';

export const updateUserProfileMutation = graphql`
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
