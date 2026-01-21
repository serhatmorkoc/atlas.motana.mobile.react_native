import { gql } from '@apollo/client';

export const STORE_PRODUCTS_QUERY = gql`
  query StoreProductsQuery($storeId: UUID!, $first: Int, $offset: Int) {
    productsCollection(
      filter: { store_id: { eq: $storeId }, is_active: { eq: true } }
      first: $first
      offset: $offset
    ) {
      edges {
        node {
          id
          product_category_id
          store_id
          title
          description
          image
          price
          old_price
          stock_quantity
          is_popular
          is_active
          created_at
        }
      }
    }
  }
`;
