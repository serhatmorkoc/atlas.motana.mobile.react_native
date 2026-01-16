// Custom hook for fetching stores using GraphQL
import { useQuery } from '@apollo/client/react';
import { useEffect, useState, useMemo } from 'react';
import { GET_STORES, GET_STORE_BY_ID } from '@/lib/apollo/queries/stores';
import { mapGraphQLStoresToStores, mapGraphQLStoreToStore, GraphQLStore } from '@/lib/apollo/utils/store.mapper';
import { Store } from '@/types/store.types';
import { calculateDistance } from '@/utils/google_maps';

interface GetStoresData {
  storesCollection: {
    edges: Array<{
      node: GraphQLStore;
    }>;
  };
}

interface GetStoresVariables {
  first?: number;
  offset?: number;
  filter?: {
    is_active?: { eq?: boolean };
    is_available?: { eq?: boolean };
  };
}

interface GetStoreByIdData {
  storesCollection: {
    edges: Array<{
      node: GraphQLStore;
    }>;
  };
}

interface GetStoreByIdVariables {
  id: string;
}

/**
 * Hook to fetch all stores
 */
export const useStores = (options?: {
  limit?: number;
  offset?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  userLocation?: { latitude: number; longitude: number } | null; // Selected user address coordinates
}) => {
  const { data, loading, error, refetch } = useQuery<GetStoresData, GetStoresVariables>(
    GET_STORES,
    {
      variables: {
        first: options?.limit,
        offset: options?.offset,
        filter: {
          ...(options?.isActive !== undefined && { is_active: { eq: options.isActive } }),
          ...(options?.isAvailable !== undefined && { is_available: { eq: options.isAvailable } }),
        },
      },
      fetchPolicy: 'cache-first', // Use cache first, only fetch from network if cache is empty
    }
  );

  const nodes: GraphQLStore[] = data?.storesCollection?.edges?.map((e) => e.node) ?? [];
  
  // Memoize baseStores to prevent unnecessary recalculations
  const baseStores: Store[] = useMemo(() => 
    nodes.length ? mapGraphQLStoresToStores(nodes) : [],
    [nodes.length, nodes.map(n => n.id).join(',')] // Use length and IDs for comparison
  );
  
  // Memoize userLocation to prevent unnecessary recalculations
  const userLocation = useMemo(() => {
    if (!options?.userLocation) return null;
    return {
      latitude: options.userLocation.latitude,
      longitude: options.userLocation.longitude,
    };
  }, [options?.userLocation?.latitude, options?.userLocation?.longitude]);

  const [stores, setStores] = useState<Store[]>(baseStores);
  const [calculatingDistances, setCalculatingDistances] = useState(false);

  // Calculate distances when stores or user location changes
  useEffect(() => {
    if (baseStores.length === 0) {
      setStores([]);
      return;
    }

    // If no user location, use placeholder distances from mapper
    if (!userLocation) {
      setStores(baseStores);
      return;
    }

    // Calculate real distances for all stores
    const calculateDistances = async () => {
      setCalculatingDistances(true);
      try {
        const storesWithDistances = await Promise.all(
          baseStores.map(async (store) => {
            // Skip if store doesn't have coordinates
            if (!store.latitude || !store.longitude) {
              return store;
            }

            try {
              // Origin: User address, Destination: Store (same as store screen)
              const distanceResult = await calculateDistance(
                { latitude: userLocation.latitude, longitude: userLocation.longitude },
                { latitude: store.latitude, longitude: store.longitude }
              );
              return {
                ...store,
                distance: distanceResult.distanceText,
              };
            } catch (err) {
              console.error(`Error calculating distance for store ${store.id}:`, err);
              // Return store with placeholder distance if calculation fails
              return store;
            }
          })
        );
        setStores(storesWithDistances);
      } catch (err) {
        console.error('Error calculating distances:', err);
        setStores(baseStores);
      } finally {
        setCalculatingDistances(false);
      }
    };

    calculateDistances();
  }, [baseStores, userLocation]);

  return {
    stores,
    loading: loading || calculatingDistances,
    error,
    refetch,
  };
};

/**
 * Hook to fetch a single store by ID
 */
export const useStore = (id: string) => {
  const { data, loading, error, refetch } = useQuery<GetStoreByIdData, GetStoreByIdVariables>(
    GET_STORE_BY_ID,
    {
      variables: { id },
      skip: !id, // Skip query if no ID provided
      fetchPolicy: 'cache-first', // Use cache first for faster loading
    }
  );

  const node: GraphQLStore | undefined = data?.storesCollection?.edges?.[0]?.node;
  const store: Store | null = node ? mapGraphQLStoreToStore(node) : null;

  return {
    store,
    loading,
    error,
    refetch,
  };
};
