import { graphql } from 'react-relay';

export const createOrderMutation = graphql`
  mutation CreateOrderMutation($order: ordersInsertInput!) {
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
