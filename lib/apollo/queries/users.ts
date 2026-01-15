import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
  query GetUserById($id: UUID!) {
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

export const GET_USER_ADDRESSES = gql`
  query GetUserAddresses($userId: UUID!) {
    user_addressesCollection(filter: { user_id: { eq: $userId } }) {
      edges {
        node {
          id
          user_id
          label
          delivery_address
          details
          building
          floor
          landmark
          latitude
          longitude
          is_selected
        }
      }
    }
  }
`;

