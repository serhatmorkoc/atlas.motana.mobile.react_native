import { graphql } from 'relay-runtime';

export const userQuery = graphql`
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
