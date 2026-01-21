import { useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_STORE_PRODUCTS } from "@/lib/apollo/queries/products";
import { GET_STORE_PRODUCT_CATEGORIES } from "@/lib/apollo/queries/storeCategories";
import { MenuItem } from "@/types/menu.types";

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
  const shouldSkip = !storeId;

  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useQuery(GET_STORE_PRODUCTS, {
    variables: { storeId: storeId || '00000000-0000-0000-0000-000000000000', first: options?.first ?? 200, offset: options?.offset ?? 0 },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery(GET_STORE_PRODUCT_CATEGORIES, {
    variables: { storeId: storeId || '00000000-0000-0000-0000-000000000000' },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { categories, menuItems } = useMemo(() => {
    if (shouldSkip || !productsData || !categoriesData) return { categories: [], menuItems: [] };
    const cats = (categoriesData?.product_categoriesCollection?.edges ?? [])
      .map((e: any) => e.node).filter((c: any) => !!c.title).sort((a: any, b: any) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
    const catMap = new Map(cats.map((c: any) => [c.id, c.title!]));
    const prods = (productsData?.productsCollection?.edges ?? []).map((e: any) => e.node);
    const search = (options?.search ?? "").trim().toLowerCase();
    const filtered = search ? prods.filter((p: any) => (p.title || "").toLowerCase().includes(search) || (p.description || "").toLowerCase().includes(search)) : prods;
    const mapped: MenuItem[] = filtered.map((p: any) => ({
      id: p.id, storeId: p.store_id ?? storeId, name: p.title ?? "Unnamed", description: p.description ?? "",
      price: safeNumber(p.price), image: p.image ?? "", category: (p.product_category_id ? catMap.get(p.product_category_id) : undefined) ?? "Other",
      popular: p.is_popular, extras: [],
    }));
    const catOrder = cats.map((c: any) => c.title!);
    if (mapped.some(m => m.category === "Other")) catOrder.push("Other");
    return { categories: catOrder, menuItems: mapped };
  }, [categoriesData, productsData, options?.search, storeId, shouldSkip]);

  const refetch = useCallback(async () => {
    await Promise.all([refetchProducts(), refetchCategories()]);
  }, [refetchProducts, refetchCategories]);

  return { categories, menuItems, loading: productsLoading || categoriesLoading, error: null, refetch };
}
