import { gql } from '@apollo/client';

export const USER_QUERY = gql`
  query UserQuery($id: UUID!) {
    usersCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          name
          email
          phone
        }
      }
    }
  }
`;
