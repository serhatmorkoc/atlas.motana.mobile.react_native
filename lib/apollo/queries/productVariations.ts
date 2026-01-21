import { gql } from '@apollo/client';

export const GET_PRODUCT_VARIATIONS = gql`
  query GetProductVariations($productId: UUID!) {
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
