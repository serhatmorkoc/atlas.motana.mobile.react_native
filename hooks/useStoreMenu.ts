import { useMemo, useCallback, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { storeProductsQuery } from "@/lib/relay/queries/StoreProductsQuery";
import { storeProductCategoriesQuery } from "@/lib/relay/queries/StoreProductCategoriesQuery";
import { MenuItem } from "@/types/menu.types";
import type { StoreProductsQuery } from "@/__generated__/StoreProductsQuery.graphql";
import type { StoreProductCategoriesQuery } from "@/__generated__/StoreProductCategoriesQuery.graphql";

export interface GraphQLProduct {
  id: string; product_category_id: string | null; store_id: string | null;
  title: string | null; description: string | null; image: string | null;
  price: string; old_price: string | null; stock_quantity: number | null;
  is_popular: boolean; is_active: boolean; created_at: string;
}

export interface GraphQLProductCategory {
  id: string; store_id: string | null; title: string | null; sort_order: number | null;
}

const safeNumber = (v: any) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

export function useStoreMenu(storeId: string, options?: { first?: number; offset?: number; search?: string }) {
  const [refetchKey, setRefetchKey] = useState(0);
  const shouldSkip = !storeId;

  const productsData = useLazyLoadQuery<StoreProductsQuery>(
    storeProductsQuery,
    { storeId: storeId || '00000000-0000-0000-0000-000000000000', first: options?.first ?? 200, offset: options?.offset ?? 0 },
    { fetchPolicy: 'store-and-network', fetchKey: shouldSkip ? 'skip' : `products-${storeId}-${refetchKey}` }
  );

  const categoriesData = useLazyLoadQuery<StoreProductCategoriesQuery>(
    storeProductCategoriesQuery,
    { storeId: storeId || '00000000-0000-0000-0000-000000000000' },
    { fetchPolicy: 'store-and-network', fetchKey: shouldSkip ? 'skip' : `categories-${storeId}-${refetchKey}` }
  );

  const { categories, menuItems } = useMemo(() => {
    if (shouldSkip || !productsData || !categoriesData) return { categories: [], menuItems: [] };
    const cats = (categoriesData?.product_categoriesCollection?.edges ?? [])
      .map(e => e.node).filter(c => !!c.title).sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
    const catMap = new Map(cats.map(c => [c.id, c.title!]));
    const prods = (productsData?.productsCollection?.edges ?? []).map(e => e.node);
    const search = (options?.search ?? "").trim().toLowerCase();
    const filtered = search ? prods.filter(p => (p.title || "").toLowerCase().includes(search) || (p.description || "").toLowerCase().includes(search)) : prods;
    const mapped: MenuItem[] = filtered.map(p => ({
      id: p.id, storeId: p.store_id ?? storeId, name: p.title ?? "Unnamed", description: p.description ?? "",
      price: safeNumber(p.price), image: p.image ?? "", category: (p.product_category_id ? catMap.get(p.product_category_id) : undefined) ?? "Other",
      popular: p.is_popular, extras: [],
    }));
    const catOrder = cats.map(c => c.title!);
    if (mapped.some(m => m.category === "Other")) catOrder.push("Other");
    return { categories: catOrder, menuItems: mapped };
  }, [categoriesData, productsData, options?.search, storeId, shouldSkip]);

  const refetch = useCallback(async () => { setRefetchKey(prev => prev + 1); }, []);

  return { categories, menuItems, loading: false, error: null, refetch };
}
