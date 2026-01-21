import { gql } from '@apollo/client';

export const CREATE_ORDER_ITEMS_MUTATION = gql`
  mutation CreateOrderItemsMutation($items: [order_itemsInsertInput!]!) {
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
