import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($id: UUID!) {
    usersCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          email
          full_name
          phone
          avatar_url
          created_at
        }
      }
    }
  }
`;
