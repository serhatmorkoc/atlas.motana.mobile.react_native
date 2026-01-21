// Custom hook for fetching stores using Relay
import { useLazyLoadQuery } from 'react-relay';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { storesQuery } from '@/lib/relay/queries/StoresQuery';
import { storeQuery } from '@/lib/relay/queries/StoreQuery';
import { mapGraphQLStoresToStores, mapGraphQLStoreToStore, GraphQLStore } from '@/lib/relay/utils/store.mapper';
import { Store } from '@/types/store.types';
import { calculateDistance } from '@/utils/google_maps';
import type { StoresQuery } from '@/__generated__/StoresQuery.graphql';
import type { StoreQuery } from '@/__generated__/StoreQuery.graphql';

export const useStores = (options?: {
  limit?: number;
  offset?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  userLocation?: { latitude: number; longitude: number } | null;
}) => {
  const filter: any = {};
  if (options?.isActive !== undefined) filter.is_active = { eq: options.isActive };
  if (options?.isAvailable !== undefined) filter.is_available = { eq: options.isAvailable };

  const [refetchKey, setRefetchKey] = useState(0);

  const data = useLazyLoadQuery<StoresQuery>(
    storesQuery,
    {
      first: options?.limit,
      offset: options?.offset,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    },
    {
      // Avoid hitting the network on every mount when data is already in Relay store.
      // When caller explicitly refetches (refetchKey > 0), force network.
      fetchPolicy: refetchKey > 0 ? 'network-only' : 'store-or-network',
      fetchKey: `stores-${refetchKey}`,
    }
  );

  const nodes: GraphQLStore[] = data?.storesCollection?.edges?.map((e) => e.node) ?? [];
  const baseStores: Store[] = useMemo(() => nodes.length ? mapGraphQLStoresToStores(nodes) : [], [nodes.length, nodes.map(n => n.id).join(',')]);
  
  const userLocation = useMemo(() => {
    if (!options?.userLocation) return null;
    return { latitude: options.userLocation.latitude, longitude: options.userLocation.longitude };
  }, [options?.userLocation?.latitude, options?.userLocation?.longitude]);

  const [stores, setStores] = useState<Store[]>(baseStores);
  const [calculatingDistances, setCalculatingDistances] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (baseStores.length === 0) { setStores([]); return; }
    if (!userLocation) { setStores(baseStores); return; }

    const calc = async () => {
      if (!cancelled) setCalculatingDistances(true);
      try {
        const storesWithDistances = await Promise.all(baseStores.map(async (store) => {
          if (!store.latitude || !store.longitude) return store;
          try {
            const res = await calculateDistance(userLocation, { latitude: store.latitude, longitude: store.longitude });
            return { ...store, distance: res.distanceText };
          } catch { return store; }
        }));
        if (!cancelled) setStores(storesWithDistances);
      } finally {
        if (!cancelled) setCalculatingDistances(false);
      }
    };
    calc();

    return () => {
      cancelled = true;
    };
  }, [baseStores, userLocation]);

  const refetch = useCallback(async () => {
    setRefetchKey(prev => prev + 1);
  }, []);

  return {
    stores,
    loading: calculatingDistances,
    error: null as Error | null,
    refetch,
  };
};

export const useStore = (id: string) => {
  const [refetchKey, setRefetchKey] = useState(0);

  const data = useLazyLoadQuery<StoreQuery>(
    storeQuery,
    { id },
    {
      fetchPolicy: refetchKey > 0 ? 'network-only' : 'store-or-network',
      fetchKey: `store-${id}-${refetchKey}`,
    }
  );

  const node: GraphQLStore | undefined = data?.storesCollection?.edges?.[0]?.node;
  const store: Store | null = node ? mapGraphQLStoreToStore(node) : null;

  const refetch = useCallback(async () => {
    setRefetchKey(prev => prev + 1);
  }, []);

  return {
    store,
    loading: false,
    error: null as Error | null,
    refetch,
  };
};
