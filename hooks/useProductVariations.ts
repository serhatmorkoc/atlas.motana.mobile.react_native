import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_VARIATIONS } from "@/lib/apollo/queries/productVariations";
import type { MenuItemExtra } from "@/types/menu.types";
import { useCallback, useMemo } from "react";

const safeNumber = (v: any) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

export function useProductVariations(productId?: string) {
  const shouldSkip = !productId;

  const { data, loading, error, refetch: refetchQuery } = useQuery(GET_PRODUCT_VARIATIONS, {
    variables: { productId: productId || '00000000-0000-0000-0000-000000000000' },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const extras: MenuItemExtra[] = useMemo(() => 
    (!shouldSkip && data) ? data?.product_variationsCollection?.edges?.map(({ node }: any) => ({
      id: node.id, name: node.title ?? "Option", price: safeNumber(node.discounted_price ?? node.price),
    })) : [],
    [data, productId, shouldSkip]
  );

  const refetch = useCallback(async () => {
    await refetchQuery();
  }, [refetchQuery]);

  return { extras, loading, error: error as Error | null, refetch };
}
