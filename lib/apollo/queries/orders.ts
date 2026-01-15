import { gql } from '@apollo/client';

// Get orders by user_id (store and order_items will be fetched separately)
export const GET_ORDERS_BY_USER_ID = gql`
  query GetOrdersByUserId($userId: UUID!, $first: Int, $offset: Int) {
    ordersCollection(
      filter: { user_id: { eq: $userId } }
      first: $first
      offset: $offset
      orderBy: { created_at: DescNullsLast }
    ) {
      edges {
        node {
          id
          order_code
          user_id
          store_id
          delivery_address
          payment_method
          payment_status
          order_status
          sub_total
          delivery_fee
          tax_amount
          tip_amount
          total_amount
          created_at
          estimated_delivery_time
        }
      }
    }
  }
`;

// Get order items by order_id
export const GET_ORDER_ITEMS_BY_ORDER_ID = gql`
  query GetOrderItemsByOrderId($orderId: UUID!) {
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

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: UUID!) {
    ordersCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          order_code
          user_id
          store_id
          delivery_address
          payment_method
          payment_status
          order_status
          sub_total
          delivery_fee
          tax_amount
          tip_amount
          total_amount
          created_at
          estimated_delivery_time
        }
      }
    }
  }
`;
