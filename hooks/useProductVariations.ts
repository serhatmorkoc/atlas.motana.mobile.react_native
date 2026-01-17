import { useLazyLoadQuery } from "react-relay";
import { productVariationsQuery } from "@/lib/relay/queries/ProductVariationsQuery";
import type { MenuItemExtra } from "@/types/menu.types";
import type { ProductVariationsQuery } from "@/__generated__/ProductVariationsQuery.graphql";
import { useCallback, useMemo, useState } from "react";

const safeNumber = (v: any) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

export function useProductVariations(productId?: string) {
  const [refetchKey, setRefetchKey] = useState(0);
  const shouldSkip = !productId;

  const data = useLazyLoadQuery<ProductVariationsQuery>(
    productVariationsQuery,
    { productId: productId || '00000000-0000-0000-0000-000000000000' },
    { fetchPolicy: 'store-and-network', fetchKey: shouldSkip ? 'skip' : `variations-${productId}-${refetchKey}` }
  );

  const extras: MenuItemExtra[] = useMemo(() => 
    (!shouldSkip && data) ? data?.product_variationsCollection?.edges?.map(({ node }) => ({
      id: node.id, name: node.title ?? "Option", price: safeNumber(node.discounted_price ?? node.price),
    })) : [],
    [data, productId, shouldSkip]
  );

  const refetch = useCallback(async () => { setRefetchKey(prev => prev + 1); }, []);

  return { extras, loading: false, error: null, refetch };
}
