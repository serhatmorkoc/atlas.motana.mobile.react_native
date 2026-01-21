import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query GetOrders($userId: UUID!, $first: Int, $offset: Int) {
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
          service_fee
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

export const GET_ORDER = gql`
  query GetOrder($id: UUID!) {
    ordersCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          order_code
          user_id
          store_id
          courier_id
          delivery_address
          payment_method
          payment_status
          order_status
          sub_total
          delivery_fee
          service_fee
          tax_amount
          tip_amount
          total_amount
          note_to_store
          is_picked_up
          created_at
          estimated_delivery_time
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
          quantity
          price
          notes
        }
      }
    }
  }
`;
