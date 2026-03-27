import { graphql } from 'react-relay';

export const userAddressesQuery = graphql`
  query UserAddressesQuery($userId: UUID!) {
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
