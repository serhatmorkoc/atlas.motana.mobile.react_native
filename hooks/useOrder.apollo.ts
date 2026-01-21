// Custom hook for fetching a single order by ID using Apollo
import { useQuery } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/client';
import { ORDER_QUERY } from '@/lib/apollo/queries/OrderQuery';
import { ORDER_ITEMS_QUERY } from '@/lib/apollo/queries/OrderItemsQuery';
import { STORE_QUERY } from '@/lib/apollo/queries/StoreQuery';
import { DBOrderStatus, Order, OrderItem } from '@/types/order.types';
import type { DeliveryAddress } from '@/types/address.types';
import React, { useCallback } from 'react';

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

const mapOrderStatus = (status: string | null): 'delivered' | 'in_progress' | 'cancelled' => {
  if (!status) return 'in_progress';
  const s = status.toUpperCase();
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
    return data?.storesCollection?.edges?.[0]?.node || null;
  } catch { return null; }
};

const fetchOrderItems = async (orderId: string) => {
  try {
    const { data } = await apolloClient.query({
      query: ORDER_ITEMS_QUERY,
      variables: { orderId },
      fetchPolicy: 'cache-first',
    });
    return data?.order_itemsCollection?.edges?.map((e: any) => e.node) || [];
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
    // ignore
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

export const useOrder = (id: string) => {
  const { data, loading, error, refetch: apolloRefetch } = useQuery(ORDER_QUERY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [order, setOrder] = React.useState<Order | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const node: GraphQLOrder | undefined = data?.ordersCollection?.edges?.[0]?.node;
      if (!node) {
        if (!cancelled) setOrder(null);
        return;
      }
      if (!cancelled) setIsLoadingDetails(true);
      try {
        const s = await fetchStore(node.store_id);
        const i = await fetchOrderItems(node.id);
        const mapped = await mapGraphQLOrderToOrder(node, s, i);
        if (!cancelled) setOrder(mapped);
      } finally {
        if (!cancelled) setIsLoadingDetails(false);
      }
    };
    if (data) load();

    return () => {
      cancelled = true;
    };
  }, [data]);

  const refetch = useCallback(async () => {
    await apolloRefetch();
  }, [apolloRefetch]);

  return { order, loading: loading || isLoadingDetails, error: error ? error.message : null, refetch };
};
