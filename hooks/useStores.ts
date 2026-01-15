// Custom hook for fetching stores using GraphQL
import { useQuery } from '@apollo/client/react';
import { GET_STORES, GET_STORE_BY_ID } from '@/lib/apollo/queries/stores';
import { mapGraphQLStoresToStores, mapGraphQLStoreToStore, GraphQLStore } from '@/lib/apollo/utils/store.mapper';
import { Store } from '@/types/store.types';

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
}) => {
  const { data, loading, error, refetch } = useQuery<GetStoresData, GetStoresVariables>(
    GET_STORES,
    {
      variables: {
        first: options?.limit,
        offset: options?.offset,
        filter: {
          is_active: { eq: options?.isActive ?? true },
          is_available: { eq: options?.isAvailable ?? true },
        },
      },
      fetchPolicy: 'cache-first', // Use cache first, only fetch from network if cache is empty
    }
  );

  const nodes: GraphQLStore[] = data?.storesCollection?.edges?.map((e) => e.node) ?? [];
  const stores: Store[] = nodes.length ? mapGraphQLStoresToStores(nodes) : [];

  return {
    stores,
    loading,
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
