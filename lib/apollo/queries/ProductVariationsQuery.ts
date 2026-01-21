import { gql } from '@apollo/client';

export const PRODUCT_VARIATIONS_QUERY = gql`
  query ProductVariationsQuery($productId: UUID!) {
    product_variationsCollection(filter: { product_id: { eq: $productId } }) {
      edges {
        node {
          id
          product_id
          title
          price
          discounted_price
          stock_quantity
        }
      }
    }
  }
`;
