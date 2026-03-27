import { graphql } from 'react-relay';

export const storesQuery = graphql`
  query StoresQuery($filter: storesFilter, $first: Int, $offset: Int) {
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
        }
      }
    }
  }
`;
