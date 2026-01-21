import { gql } from '@apollo/client';

export const ORDER_ITEMS_QUERY = gql`
  query OrderItemsQuery($orderId: UUID!) {
    order_itemsCollection(filter: { order_id: { eq: $orderId } }) {
      edges {
        node {
          id
          order_id
          product_id
          product_title
          quantity
          unit_price
          total_price
          image
        }
      }
    }
  }
`;
