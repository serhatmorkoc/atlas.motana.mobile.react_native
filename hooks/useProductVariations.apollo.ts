import { useQuery } from "@apollo/client";
import { PRODUCT_VARIATIONS_QUERY } from "@/lib/apollo/queries/ProductVariationsQuery";
import type { MenuItemExtra } from "@/types/menu.types";
import { useCallback, useMemo } from "react";

const safeNumber = (v: any) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

export function useProductVariations(productId?: string) {
  const shouldSkip = !productId;

  const { data, loading, error, refetch: apolloRefetch } = useQuery(PRODUCT_VARIATIONS_QUERY, {
    variables: { productId: productId || '00000000-0000-0000-0000-000000000000' },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const extras: MenuItemExtra[] = useMemo(() => 
    (!shouldSkip && data) ? data?.product_variationsCollection?.edges?.map(({ node }: any) => ({
      id: node.id, name: node.title ?? "Option", price: safeNumber(node.discounted_price ?? node.price),
    })) : [],
    [data, productId, shouldSkip]
  );

  const refetch = useCallback(async () => {
    await apolloRefetch();
  }, [apolloRefetch]);

  return { extras, loading, error: error ? error.message : null, refetch };
}
