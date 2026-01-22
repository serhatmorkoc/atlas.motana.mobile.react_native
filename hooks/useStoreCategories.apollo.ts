import { useQuery } from '@apollo/client/react';
import { STORE_CATEGORIES_QUERY } from '@/lib/apollo/queries/StoreCategoriesQuery';
import React, { useCallback } from 'react';

export interface StoreCategory {
  id: number; name: string; icon: string | null; color: string | null; is_active: boolean | null;
}

export const useStoreCategories = () => {
  const { data, loading, error, refetch: apolloRefetch } = useQuery(STORE_CATEGORIES_QUERY, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const categories = React.useMemo(() => {
    return (data as any)?.store_categoriesCollection?.edges?.map((e: any) => ({
      id: Number(e.node.id), name: e.node.name, icon: e.node.icon,
      color: e.node.color || '#6B7280', is_active: e.node.is_active ?? true,
    })) || [];
  }, [data]);

  const refetch = useCallback(async () => {
    await apolloRefetch();
  }, [apolloRefetch]);

  return { categories, loading, error: error ? error.message : null, refetch };
};
