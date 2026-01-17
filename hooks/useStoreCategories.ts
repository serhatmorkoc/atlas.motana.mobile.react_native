import { useLazyLoadQuery } from 'react-relay';
import { storeCategoriesQuery } from '@/lib/relay/queries/StoreCategoriesQuery';
import React, { useCallback, useState } from 'react';
import type { StoreCategoriesQuery } from '@/__generated__/StoreCategoriesQuery.graphql';

export interface StoreCategory {
  id: number; name: string; icon: string | null; color: string | null; is_active: boolean | null;
}

export const useStoreCategories = () => {
  const [refetchKey, setRefetchKey] = useState(0);

  const data = useLazyLoadQuery<StoreCategoriesQuery>(
    storeCategoriesQuery,
    {},
    { fetchPolicy: 'store-and-network', fetchKey: `categories-${refetchKey}` }
  );

  const categories = React.useMemo(() => {
    return data?.store_categoriesCollection?.edges?.map(e => ({
      id: Number(e.node.id), name: e.node.name, icon: e.node.icon,
      color: e.node.color || '#6B7280', is_active: e.node.is_active ?? true,
    })) || [];
  }, [data]);

  const refetch = useCallback(async () => { setRefetchKey(prev => prev + 1); }, []);

  return { categories, loading: false, error: null, refetch };
};
