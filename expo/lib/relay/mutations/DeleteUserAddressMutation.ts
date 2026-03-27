import { graphql } from 'react-relay';

export const deleteUserAddressMutation = graphql`
  mutation DeleteUserAddressMutation($id: UUID!) {
    deleteFromuser_addressesCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;
