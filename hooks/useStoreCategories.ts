import { useQuery } from '@apollo/client/react';
import { GET_STORE_CATEGORIES } from '@/lib/apollo/queries/store-categories';
import React from 'react';

export interface StoreCategory {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
  is_active: boolean | null;
}

interface GraphQLStoreCategory {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  is_active: boolean | null;
}

interface GetStoreCategoriesData {
  store_categoriesCollection: {
    edges: Array<{
      node: GraphQLStoreCategory;
    }>;
  };
}

/**
 * Hook to fetch store categories
 */
export const useStoreCategories = () => {
  const { data, loading, error, refetch } = useQuery<GetStoreCategoriesData>(
    GET_STORE_CATEGORIES,
    {
      fetchPolicy: 'cache-first',
    }
  );

  const categories = React.useMemo(() => {
    return data?.store_categoriesCollection?.edges?.map(edge => ({
      id: Number(edge.node.id),
      name: edge.node.name,
      icon: edge.node.icon,
      color: edge.node.color || '#6B7280',
      is_active: edge.node.is_active ?? true,
    })) || [];
  }, [data]);

  return {
    categories,
    loading,
    error,
    refetch,
  };
};
