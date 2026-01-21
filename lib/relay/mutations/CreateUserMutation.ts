import { graphql } from 'relay-runtime';

export const createUserMutation = graphql`
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
