import { gql } from '@apollo/client';

export const DELETE_USER_ADDRESS_MUTATION = gql`
  mutation DeleteUserAddressMutation($id: UUID!) {
    deleteFromuser_addressesCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;
