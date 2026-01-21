import { gql } from '@apollo/client';

export const GET_STORES = gql`
  query GetStores($filter: storesFilter, $first: Int, $offset: Int) {
    storesCollection(filter: $filter, first: $first, offset: $offset) {
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

export const GET_STORE = gql`
  query GetStore($id: UUID!) {
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
