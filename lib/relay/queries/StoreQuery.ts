import { graphql } from 'react-relay';

export const storeQuery = graphql`
  query StoreQuery($id: UUID!) {
    storesCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          name
          image
          rating
          delivery_time_min
          delivery_time_max
          address
          latitude
          longitude
          minimum_order
          is_available
          is_active
          review_count
          slug
          store_categories_id
          service_fee
          tax_rate
        }
      }
    }
  }
`;
