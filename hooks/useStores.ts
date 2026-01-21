// Custom hook for fetching stores using Apollo
import { useQuery } from '@apollo/client/react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { GET_STORES, GET_STORE } from '@/lib/apollo/queries/stores';
import { mapGraphQLStoresToStores, mapGraphQLStoreToStore, GraphQLStore } from '@/lib/apollo/utils/store.mapper';
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

  const { data, loading, error, refetch } = useQuery(GET_STORES, {
    variables: {
      first: options?.limit,
      offset: options?.offset,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Debug: Log query status
  useEffect(() => {
    if (__DEV__) {
      console.log('[useStores] Query status:', {
        loading,
        hasData: !!data,
        hasError: !!error,
        dataLength: data?.storesCollection?.edges?.length || 0,
        error: error?.message,
      });
    }
  }, [loading, data, error]);

  const nodes: GraphQLStore[] = useMemo(() => 
    data?.storesCollection?.edges?.map((e: any) => e.node) ?? [], 
    [data?.storesCollection?.edges]
  );
  const nodeIds = useMemo(() => nodes.map(n => n.id).join(','), [nodes]);
  const baseStores: Store[] = useMemo(() => 
    nodes.length ? mapGraphQLStoresToStores(nodes) : [], 
    [nodes]
  );
  
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

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    stores,
    loading: loading || calculatingDistances,
    error: error as Error | null,
    refetch: handleRefetch,
  };
};

export const useStore = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_STORE, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const node: GraphQLStore | undefined = data?.storesCollection?.edges?.[0]?.node;
  const store: Store | null = node ? mapGraphQLStoreToStore(node) : null;

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    store,
    loading,
    error: error as Error | null,
    refetch: handleRefetch,
  };
};
