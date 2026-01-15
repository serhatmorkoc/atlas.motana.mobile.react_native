import { gql } from "@apollo/client";

// Supabase GraphQL v1 uses insertInto{table}Collection
export const CREATE_ORDER = gql`
  mutation CreateOrder($order: ordersInsertInput!) {
    insertIntoordersCollection(objects: [$order]) {
      records {
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
`;

export const CREATE_ORDER_ITEMS = gql`
  mutation CreateOrderItems($items: [order_itemsInsertInput!]!) {
    insertIntoorder_itemsCollection(objects: $items) {
      records {
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
`;
