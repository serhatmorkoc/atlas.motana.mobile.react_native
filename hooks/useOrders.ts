// Custom hook for fetching orders using GraphQL
import React from 'react';
import { useQuery } from '@apollo/client/react';
import { apolloClient } from '@/lib/apollo/client';
import { GET_ORDERS_BY_USER_ID, GET_ORDER_ITEMS_BY_ORDER_ID } from '@/lib/apollo/queries/orders';
import { GET_STORE_BY_ID } from '@/lib/apollo/queries/stores';
import { Order, OrderItem, OrderStatus, DBOrderStatus } from '@/types/order.types';

const HARDCODE_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02";

// GraphQL Order type (from Supabase)
interface GraphQLOrder {
  id: string;
  order_code: string | null;
  user_id: string | null;
  store_id: string | null;
  delivery_address: any; // JSONB
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
}

interface GraphQLStore {
  id: string;
  name: string;
  image: string;
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

interface GetOrdersByUserIdData {
  ordersCollection: {
    edges: Array<{
      node: GraphQLOrder;
    }>;
  };
}

interface GetOrdersByUserIdVariables {
  userId: string;
  first?: number;
  offset?: number;
}

/**
 * Map GraphQL order_status (DB status) to Mobile App OrderStatus type
 * DB Statuses: PENDING, CONFIRMED, PREPARING, READY, ON_WAY, DELIVERED, CANCELLED
 * Mobile Statuses: in_progress, delivered, cancelled
 */
const mapOrderStatus = (status: string | null): OrderStatus => {
  if (!status) return 'in_progress';
  
  const statusUpper = status.toUpperCase();
  
  // Active/In Progress statuses
  if (
    statusUpper === 'PENDING' ||
    statusUpper === 'CONFIRMED' ||
    statusUpper === 'PREPARING' ||
    statusUpper === 'READY' ||
    statusUpper === 'ON_WAY'
  ) {
    return 'in_progress';
  }
  
  // Delivered
  if (statusUpper === 'DELIVERED') {
    return 'delivered';
  }
  
  // Cancelled
  if (statusUpper === 'CANCELLED') {
    return 'cancelled';
  }
  
  // Default to in_progress for unknown statuses
  return 'in_progress';
};

/**
 * Fetch store by ID
 */
const fetchStore = async (storeId: string | null): Promise<GraphQLStore | null> => {
  if (!storeId) return null;
  
  try {
    const { data } = await apolloClient.query({
      query: GET_STORE_BY_ID,
      variables: { id: storeId },
      fetchPolicy: 'no-cache',
    });
    
    return data?.storesCollection?.edges?.[0]?.node || null;
  } catch (e) {
    console.error('Failed to fetch store:', e);
    return null;
  }
};

/**
 * Fetch order items by order ID
 */
const fetchOrderItems = async (orderId: string): Promise<GraphQLOrderItem[]> => {
  try {
    const { data } = await apolloClient.query({
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
  store: GraphQLStore | null,
  orderItems: GraphQLOrderItem[]
): Promise<Order | null> => {
  if (!store) return null;

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
      deliveryAddress = addressJson.delivery_address || deliveryAddress;
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
    orderCode: graphQLOrder.order_code, // Order number (e.g., ORD-849078)
    storeName: store.name,
    storeImage: store.image,
    items: mappedOrderItems,
    totalPrice: graphQLOrder.total_amount ? `₺${parseFloat(graphQLOrder.total_amount).toFixed(2)}` : '₺0.00',
    status: mappedStatus,
    rawStatus, // Store original DB status
    date: graphQLOrder.created_at,
    deliveryAddress,
    estimatedTime,
  };
};

/**
 * Hook to fetch orders by user_id
 */
export const useOrders = (options?: {
  limit?: number;
  offset?: number;
}) => {
  const { data, loading, error, refetch } = useQuery<GetOrdersByUserIdData, GetOrdersByUserIdVariables>(
    GET_ORDERS_BY_USER_ID,
    {
      variables: {
        userId: HARDCODE_USER_ID,
        first: options?.limit,
        offset: options?.offset,
      },
      fetchPolicy: 'no-cache',
    }
  );

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  React.useEffect(() => {
    const loadOrderDetails = async () => {
      const nodes: GraphQLOrder[] = data?.ordersCollection?.edges?.map((e) => e.node) ?? [];
      if (nodes.length === 0) {
        setOrders([]);
        return;
      }

      setIsLoadingDetails(true);
      try {
        // Fetch store and order items for each order
        const ordersWithDetails = await Promise.all(
          nodes.map(async (order) => {
            const store = await fetchStore(order.store_id);
            const orderItems = await fetchOrderItems(order.id);
            return mapGraphQLOrderToOrder(order, store, orderItems);
          })
        );

        const validOrders = ordersWithDetails.filter((order): order is Order => order !== null);
        setOrders(validOrders);
      } catch (e) {
        console.error('Failed to load order details:', e);
        setOrders([]);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    if (data && !loading) {
      loadOrderDetails();
    }
  }, [data, loading]);

  return {
    orders,
    loading: loading || isLoadingDetails,
    error,
    refetch,
  };
};
