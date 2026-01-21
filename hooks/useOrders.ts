// Custom hook for fetching orders using Relay
import React, { useCallback, useMemo, useState } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { relayEnvironment } from '@/lib/relay/environment';
import { ordersQuery } from '@/lib/relay/queries/OrdersQuery';
import { orderItemsQuery } from '@/lib/relay/queries/OrderItemsQuery';
import { storeQuery } from '@/lib/relay/queries/StoreQuery';
import { fetchQuery } from 'relay-runtime';
import { DBOrderStatus, Order, OrderItem, OrderStatus } from '@/types/order.types';
import type { DeliveryAddress } from '@/types/address.types';
import { useAuthUser } from './useAuthUser';
import type { OrdersQuery } from '@/__generated__/OrdersQuery.graphql';
import type { OrderItemsQuery } from '@/__generated__/OrderItemsQuery.graphql';
import type { StoreQuery } from '@/__generated__/StoreQuery.graphql';

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
    const data = await fetchQuery<StoreQuery>(relayEnvironment, storeQuery, { id }).toPromise();
    return data?.storesCollection?.edges?.[0]?.node || null;
  } catch (error: any) {
    if (__DEV__) {
      console.error('Error fetching store:', error?.message || error);
    }
    return null;
  }
};

const fetchOrderItems = async (orderId: string) => {
  try {
    const data = await fetchQuery<OrderItemsQuery>(relayEnvironment, orderItemsQuery, { orderId }).toPromise();
    return data?.order_itemsCollection?.edges?.map((e) => e.node) || [];
  } catch (error: any) {
    if (__DEV__) {
      console.error('Error fetching order items:', error?.message || error);
    }
    return [];
  }
};

const mapGraphQLOrderToOrder = async (order: GraphQLOrder, store: any, items: any[]): Promise<Order | null> => {
  if (!store) return null;
  const mappedItems: OrderItem[] = items.map((i) => ({
    id: i.id,
    name: i.product_title || 'Unknown Item',
    quantity: i.quantity || 0,
    price: i.total_price || '0.00',
  }));

  // `Order.deliveryAddress` is a string for UI. Try to extract a useful string from json/object.
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
  
  const [refetchKey, setRefetchKey] = useState(0);
  const [error, setError] = React.useState<Error | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  // useLazyLoadQuery will throw for Suspense - errors are caught by ErrorBoundary
  const data = useLazyLoadQuery<OrdersQuery>(
    ordersQuery,
    { userId: finalUserId || '00000000-0000-0000-0000-000000000000', first: options?.limit, offset: options?.offset },
    { fetchPolicy: 'store-and-network', fetchKey: shouldSkip ? 'skip' : `${finalUserId}-${refetchKey}` }
  );

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (shouldSkip) {
        if (!cancelled) setOrders([]);
        return;
      }
      const nodes: GraphQLOrder[] = data?.ordersCollection?.edges?.map((e) => e.node) ?? [];
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
        if (!cancelled) {
          setOrders(res.filter((o): o is Order => o !== null));
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e);
          if (__DEV__) {
            console.error('Error loading order details:', e?.message || e);
          }
        }
      } finally {
        if (!cancelled) setIsLoadingDetails(false);
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [data, shouldSkip]);

  const refetch = useCallback(async () => {
    setError(null);
    setRefetchKey(prev => prev + 1);
  }, []);

  return { orders, loading: authLoading || isLoadingDetails, error, refetch };
};
