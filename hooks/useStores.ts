// Custom hook for fetching stores using Apollo
import { useQuery } from '@apollo/client/react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { STORES_QUERY } from '@/lib/apollo/queries/StoresQuery';
import { STORE_QUERY } from '@/lib/apollo/queries/StoreQuery';
import { mapGraphQLStoresToStores, mapGraphQLStoreToStore, GraphQLStore } from '@/lib/relay/utils/store.mapper';
import { Store } from '@/types/store.types';
import { calculateDistance } from '@/utils/google_maps';

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

  const { data, loading, error, refetch: apolloRefetch } = useQuery(STORES_QUERY, {
    variables: {
      first: options?.limit,
      offset: options?.offset,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    },
    fetchPolicy: 'cache-and-network', // Similar to Relay's store-and-network
    notifyOnNetworkStatusChange: true,
  });

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
    await apolloRefetch();
  }, [apolloRefetch]);

  return {
    stores,
    loading: loading || calculatingDistances,
    error: error ? error.message : null,
    refetch,
  };
};

export const useStore = (id: string) => {
  const { data, loading, error, refetch: apolloRefetch } = useQuery(STORE_QUERY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const node: GraphQLStore | undefined = data?.storesCollection?.edges?.[0]?.node;
  const store: Store | null = node ? mapGraphQLStoreToStore(node) : null;

  const refetch = useCallback(async () => {
    await apolloRefetch();
  }, [apolloRefetch]);

  return {
    store,
    loading,
    error: error ? error.message : null,
    refetch,
  };
};
