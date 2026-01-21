import { useQuery } from '@apollo/client/react';
import { GET_STORE_CATEGORIES } from '@/lib/apollo/queries/storeCategories';
import React, { useCallback } from 'react';

export interface StoreCategory {
  id: number; name: string; icon: string | null; color: string | null; is_active: boolean | null;
}

export const useStoreCategories = () => {
  const { data, loading, error, refetch } = useQuery(GET_STORE_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const categories = React.useMemo(() => {
    return data?.store_categoriesCollection?.edges?.map((e: any) => ({
      id: Number(e.node.id), name: e.node.name, icon: e.node.icon,
      color: e.node.color || '#6B7280', is_active: e.node.is_active ?? true,
    })) || [];
  }, [data]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return { categories, loading, error: error as Error | null, refetch: handleRefetch };
};
