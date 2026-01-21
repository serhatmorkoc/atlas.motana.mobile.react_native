import { gql } from '@apollo/client';

export const GET_STORE_PRODUCTS = gql`
  query GetStoreProducts($storeId: UUID!, $first: Int, $offset: Int) {
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

export const GET_ORDER_ITEMS = gql`
  query GetOrderItems($orderId: UUID!) {
    order_itemsCollection(filter: { order_id: { eq: $orderId } }) {
      edges {
        node {
          id
          order_id
          product_id
          product_title
          quantity
          price
          total_price
          notes
        }
      }
    }
  }
`;
