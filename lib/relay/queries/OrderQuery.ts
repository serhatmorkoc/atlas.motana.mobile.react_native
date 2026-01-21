import { graphql } from 'react-relay';

export const orderQuery = graphql`
  query OrderQuery($id: UUID!) {
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
