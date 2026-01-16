// Custom hook for fetching a single order by ID
import { useQuery } from '@apollo/client/react';
import { apolloClient } from '@/lib/apollo/client';
import { GET_ORDER_BY_ID, GET_ORDER_ITEMS_BY_ORDER_ID } from '@/lib/apollo/queries/orders';
import { GET_STORE_BY_ID } from '@/lib/apollo/queries/stores';
import { Order, OrderItem, DBOrderStatus } from '@/types/order.types';
import type { DeliveryAddress } from '@/types/address.types';
import React from 'react';

// GraphQL Order type (from Supabase)
interface GraphQLOrder {
  id: string;
  order_code: string | null;
  user_id: string | null;
  store_id: string | null;
  delivery_address: DeliveryAddress | string | null; // JSONB - can be parsed object or string
  payment_method: string | null;
  payment_status: string | null;
  order_status: string | null;
  sub_total: string | null;
  delivery_fee: string | null;
  tax_amount: string | null;
  tip_amount: string | null;
  total_amount: string | null;
  created_at: string;
  estimated_delivery_time: string | null;
  store?: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        image: string;
      };
    }>;
  };
  order_items?: {
    edges: Array<{
      node: {
        id: string;
        product_id: string | null;
        product_title: string | null;
        quantity: number | null;
        unit_price: string | null;
        total_price: string | null;
        image: string | null;
      };
    }>;
  };
}

interface GraphQLOrderItem {
  id: string;
  product_id: string | null;
  product_title: string | null;
  quantity: number | null;
  unit_price: string | null;
  total_price: string | null;
  image: string | null;
}

interface GetOrderByIdData {
  ordersCollection: {
    edges: Array<{
      node: GraphQLOrder;
    }>;
  };
}

interface GetOrderByIdVariables {
  id: string;
}

/**
 * Map GraphQL order_status (DB status) to OrderStatus type
 */
const mapOrderStatus = (status: string | null): 'delivered' | 'in_progress' | 'cancelled' => {
  if (!status) return 'in_progress';

  const statusUpper = status.toUpperCase();

  if (statusUpper === 'DELIVERED') return 'delivered';
  if (statusUpper === 'CANCELLED') return 'cancelled';
  return 'in_progress';
};

/**
 * Fetch order items by order ID
 */
const fetchOrderItems = async (orderId: string): Promise<GraphQLOrderItem[]> => {
  try {
    const { data } = await apolloClient.query<{
      order_itemsCollection: {
        edges: Array<{
          node: GraphQLOrderItem;
        }>;
      };
    }>({
      query: GET_ORDER_ITEMS_BY_ORDER_ID,
      variables: { orderId },
      fetchPolicy: 'no-cache',
    });

    return data?.order_itemsCollection?.edges?.map((e) => e.node) || [];
  } catch (e) {
    console.error('Failed to fetch order items:', e);
    return [];
  }
};

/**
 * Map GraphQL Order to Mobile App Order type
 */
const mapGraphQLOrderToOrder = async (
  graphQLOrder: GraphQLOrder,
  orderItems: GraphQLOrderItem[]
): Promise<Order | null> => {
  // Get store info
  let storeName = 'Store';
  let storeImage = '';

  if (graphQLOrder.store?.edges?.[0]?.node) {
    const store = graphQLOrder.store.edges[0].node;
    storeName = store.name;
    storeImage = store.image;
  } else if (graphQLOrder.store_id) {
    // Fallback: fetch store separately
    try {
      const { data } = await apolloClient.query<{
        storesCollection: {
          edges: Array<{
            node: {
              id: string;
              name: string;
              image: string;
            };
          }>;
        };
      }>({
        query: GET_STORE_BY_ID,
        variables: { id: graphQLOrder.store_id },
        fetchPolicy: 'no-cache',
      });

      const store = data?.storesCollection?.edges?.[0]?.node;
      if (store) {
        storeName = store.name;
        storeImage = store.image;
      }
    } catch (e) {
      console.error('Failed to fetch store:', e);
    }
  }

  const mappedOrderItems: OrderItem[] = orderItems.map((item) => ({
    id: item.id,
    name: item.product_title || 'Unknown Item',
    quantity: item.quantity || 0,
    price: item.total_price ? `₺${parseFloat(item.total_price).toFixed(2)}` : '₺0.00',
  }));

  // Parse delivery_address JSONB
  let deliveryAddress = 'Address not available';
  try {
    if (graphQLOrder.delivery_address) {
      const addressJson = typeof graphQLOrder.delivery_address === 'string'
        ? JSON.parse(graphQLOrder.delivery_address)
        : graphQLOrder.delivery_address;
      deliveryAddress = addressJson.delivery_address || addressJson.address || deliveryAddress;
    }
  } catch (e) {
    console.error('Failed to parse delivery_address:', e);
  }

  // Calculate estimated time from estimated_delivery_time
  let estimatedTime: string | undefined;
  if (graphQLOrder.estimated_delivery_time) {
    try {
      const estimatedDate = new Date(graphQLOrder.estimated_delivery_time);
      const now = new Date();
      const diffMinutes = Math.round((estimatedDate.getTime() - now.getTime()) / (1000 * 60));
      if (diffMinutes > 0) {
        estimatedTime = `${diffMinutes} min`;
      }
    } catch (e) {
      console.error('Failed to parse estimated_delivery_time:', e);
    }
  }

  const rawStatus = (graphQLOrder.order_status?.toUpperCase() || null) as DBOrderStatus | null;
  const mappedStatus = mapOrderStatus(graphQLOrder.order_status);

  return {
    id: graphQLOrder.id,
    orderCode: graphQLOrder.order_code,
    storeName,
    storeImage,
    items: mappedOrderItems,
    totalPrice: graphQLOrder.total_amount ? `₺${parseFloat(graphQLOrder.total_amount).toFixed(2)}` : '₺0.00',
    status: mappedStatus,
    rawStatus,
    date: graphQLOrder.created_at,
    deliveryAddress,
    estimatedTime,
  };
};

/**
 * Hook to fetch a single order by ID
 */
export const useOrder = (orderId: string | null) => {
  const { data, loading, error, refetch } = useQuery<GetOrderByIdData, GetOrderByIdVariables>(
    GET_ORDER_BY_ID,
    {
      variables: { id: orderId || '' },
      skip: !orderId,
      fetchPolicy: 'no-cache',
    }
  );

  const [order, setOrder] = React.useState<Order | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  React.useEffect(() => {
    const loadOrderDetails = async () => {
      const node = data?.ordersCollection?.edges?.[0]?.node;
      if (!node) {
        setOrder(null);
        return;
      }

      setIsLoadingDetails(true);
      try {
        // Fetch order items if not included in the query
        const orderItems = node.order_items?.edges?.map((e) => e.node) ||
          await fetchOrderItems(node.id);

        const mappedOrder = await mapGraphQLOrderToOrder(node, orderItems);
        setOrder(mappedOrder);
      } catch (e) {
        console.error('Failed to load order details:', e);
        setOrder(null);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    if (data && !loading) {
      loadOrderDetails();
    }
  }, [data, loading]);

  return {
    order,
    loading: loading || isLoadingDetails,
    error,
    refetch,
  };
};
