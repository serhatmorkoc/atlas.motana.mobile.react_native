import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($id: UUID!, $name: String!, $email: String!) {
    insertIntousersCollection(objects: { 
      id: $id, 
      name: $name, 
      email: $email,
      user_type: "CUSTOMER",
      is_active: true
    }) {
      records {
        id
        name
        email
        phone
        user_type
        is_active
      }
    }
  }
`;
