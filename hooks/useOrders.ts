// Custom hook for fetching orders using Apollo
import React, { useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { apolloClient } from '@/lib/apollo/client';
import { ORDERS_QUERY } from '@/lib/apollo/queries/OrdersQuery';
import { ORDER_ITEMS_QUERY } from '@/lib/apollo/queries/OrderItemsQuery';
import { STORE_QUERY } from '@/lib/apollo/queries/StoreQuery';
import { DBOrderStatus, Order, OrderItem, OrderStatus } from '@/types/order.types';
import type { DeliveryAddress } from '@/types/address.types';
import { useAuthUser } from './useAuthUser';

interface GraphQLOrder {
  id: string; order_code: string | null; user_id: string | null; store_id: string | null;
  delivery_address: DeliveryAddress | string | null; payment_method: string | null;
  payment_status: string | null; order_status: string | null; sub_total: string | null;
  delivery_fee: string | null; tax_amount: string | null; tip_amount: string | null;
  total_amount: string | null; created_at: string; estimated_delivery_time: string | null;
}

const isDBOrderStatus = (v: string | null | undefined): v is DBOrderStatus => {
  if (!v) return false;
  return (
    v === 'PENDING' ||
    v === 'CONFIRMED' ||
    v === 'PREPARING' ||
    v === 'READY' ||
    v === 'ON_WAY' ||
    v === 'DELIVERED' ||
    v === 'CANCELLED'
  );
};

const mapOrderStatus = (status: string | null): OrderStatus => {
  if (!status) return 'in_progress';
  const s = status.toUpperCase();
  if (['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ON_WAY'].includes(s)) return 'in_progress';
  if (s === 'DELIVERED') return 'delivered';
  if (s === 'CANCELLED') return 'cancelled';
  return 'in_progress';
};

const fetchStore = async (id: string | null) => {
  if (!id) return null;
  try {
    const { data } = await apolloClient.query({
      query: STORE_QUERY,
      variables: { id },
      fetchPolicy: 'cache-first',
    });
    return (data as any)?.storesCollection?.edges?.[0]?.node || null;
  } catch { return null; }
};

const fetchOrderItems = async (orderId: string) => {
  try {
    const { data } = await apolloClient.query({
      query: ORDER_ITEMS_QUERY,
      variables: { orderId },
      fetchPolicy: 'cache-first',
    });
    return (data as any)?.order_itemsCollection?.edges?.map((e: any) => e.node) || [];
  } catch { return []; }
};

const mapGraphQLOrderToOrder = async (order: GraphQLOrder, store: any, items: any[]): Promise<Order | null> => {
  if (!store) return null;
  const mappedItems: OrderItem[] = items.map((i) => ({
    id: i.id,
    name: i.product_title || 'Unknown Item',
    quantity: i.quantity || 0,
    price: i.total_price || '0.00',
  }));

  let deliveryAddressText = '';
  try {
    const addr =
      order.delivery_address
        ? (typeof order.delivery_address === 'string'
            ? JSON.parse(order.delivery_address)
            : order.delivery_address)
        : null;
    if (addr && typeof addr === 'object') {
      deliveryAddressText =
        (addr as any).delivery_address ||
        (addr as any).address ||
        (addr as any).label ||
        '';
    }
  } catch {
    // ignore parse errors; keep empty string
  }

  const rawStatus: DBOrderStatus | null =
    isDBOrderStatus(order.order_status) ? order.order_status : null;

  const total = Number(order.total_amount ?? 0);
  const totalPrice = `₺${Number.isFinite(total) ? total.toFixed(2) : '0.00'}`;

  return {
    id: order.id,
    orderCode: order.order_code,
    storeName: store.name,
    storeImage: store.image,
    items: mappedItems,
    totalPrice,
    status: mapOrderStatus(order.order_status),
    rawStatus,
    date: order.created_at,
    deliveryAddress: deliveryAddressText,
    estimatedTime: order.estimated_delivery_time
      ? new Date(order.estimated_delivery_time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : undefined,
  };
};

export const useOrders = (options?: { limit?: number; offset?: number; userId?: string; }) => {
  const { userId: authUserId, loading: authLoading } = useAuthUser();
  const finalUserId = options?.userId || authUserId;
  const shouldSkip = authLoading || !finalUserId;

  const { data, loading, error, refetch: apolloRefetch } = useQuery(ORDERS_QUERY, {
    variables: { userId: finalUserId || '00000000-0000-0000-0000-000000000000', first: options?.limit, offset: options?.offset },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (shouldSkip) {
        if (!cancelled) setOrders([]);
        return;
      }
      const nodes: GraphQLOrder[] = (data as any)?.ordersCollection?.edges?.map((e: any) => e.node) ?? [];
      if (nodes.length === 0) {
        if (!cancelled) setOrders([]);
        return;
      }
      if (!cancelled) setIsLoadingDetails(true);
      try {
        const res = await Promise.all(nodes.map(async (o) => {
          const s = await fetchStore(o.store_id);
          const i = await fetchOrderItems(o.id);
          return mapGraphQLOrderToOrder(o, s, i);
        }));
        if (!cancelled) setOrders(res.filter((o): o is Order => o !== null));
      } finally {
        if (!cancelled) setIsLoadingDetails(false);
      }
    };
    if (data && !shouldSkip) load();

    return () => {
      cancelled = true;
    };
  }, [data, shouldSkip]);

  const refetch = useCallback(async () => {
    await apolloRefetch();
  }, [apolloRefetch]);

  return { orders, loading: authLoading || loading || isLoadingDetails, error: error ? error.message : null, refetch };
};
