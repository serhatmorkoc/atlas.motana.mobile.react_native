import { graphql } from 'react-relay';

export const ordersQuery = graphql`
  query OrdersQuery($userId: UUID!, $first: Int, $offset: Int) {
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
