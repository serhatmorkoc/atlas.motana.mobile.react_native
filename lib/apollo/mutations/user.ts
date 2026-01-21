import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($user: usersInsertInput!) {
    insertIntousersCollection(objects: [$user]) {
      records {
        id
        email
        full_name
        phone
        avatar_url
        created_at
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: UUID!, $full_name: String, $phone: String, $avatar_url: String) {
    updateusersCollection(
      set: { full_name: $full_name, phone: $phone, avatar_url: $avatar_url }
      filter: { id: { eq: $id } }
    ) {
      records {
        id
        email
        full_name
        phone
        avatar_url
        created_at
      }
    }
  }
`;
