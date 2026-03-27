import { graphql } from 'react-relay';

export const productVariationsQuery = graphql`
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
