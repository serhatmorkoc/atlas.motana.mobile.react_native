import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";

import {
  GET_STORE_PRODUCTS,
  GET_STORE_PRODUCT_CATEGORIES,
} from "@/lib/apollo/queries/products";
import { MenuItem } from "@/types/menu.types";

type Edge<T> = { node: T };

export interface GraphQLProduct {
  id: string;
  product_category_id: string | null;
  store_id: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  price: string;
  old_price: string | null;
  stock_quantity: number | null;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

export interface GraphQLProductCategory {
  id: string;
  store_id: string | null;
  title: string | null;
  sort_order: number | null;
}

interface GetStoreProductsData {
  productsCollection: {
    edges: Array<Edge<GraphQLProduct>>;
  };
}

interface GetStoreProductsVars {
  storeId: string;
  first?: number;
  offset?: number;
}

interface GetStoreProductCategoriesData {
  product_categoriesCollection: {
    edges: Array<Edge<GraphQLProductCategory>>;
  };
}

interface GetStoreProductCategoriesVars {
  storeId: string;
}

const safeNumber = (value: string | null | undefined): number => {
  const n = value ? Number(value) : 0;
  return Number.isFinite(n) ? n : 0;
};

/**
 * Fetches store products + product categories and maps them into MenuItem[] for Store Screen.
 * (Variations/extras can be added later.)
 */
export function useStoreMenu(storeId: string, options?: { first?: number; offset?: number; search?: string }) {
  const productsQuery = useQuery<GetStoreProductsData, GetStoreProductsVars>(GET_STORE_PRODUCTS, {
    variables: { storeId, first: options?.first ?? 200, offset: options?.offset ?? 0 },
    skip: !storeId,
    fetchPolicy: "cache-first", // Use cache first for faster loading
  });

  const categoriesQuery = useQuery<GetStoreProductCategoriesData, GetStoreProductCategoriesVars>(
    GET_STORE_PRODUCT_CATEGORIES,
    {
      variables: { storeId },
      skip: !storeId,
      fetchPolicy: "cache-first", // Use cache first for faster loading
    }
  );

  const { categories, menuItems } = useMemo(() => {
    const categoryEdges = categoriesQuery.data?.product_categoriesCollection?.edges ?? [];
    const categoriesSorted = [...categoryEdges]
      .map((e) => e.node)
      .filter((c) => Boolean(c.title))
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

    const categoryTitleById = new Map<string, string>();
    categoriesSorted.forEach((c) => {
      if (c.id && c.title) categoryTitleById.set(c.id, c.title);
    });

    const productEdges = productsQuery.data?.productsCollection?.edges ?? [];
    const rawProducts = productEdges.map((e) => e.node);

    const search = (options?.search ?? "").trim().toLowerCase();
    const filtered = search
      ? rawProducts.filter((p) => {
          const title = (p.title ?? "").toLowerCase();
          const desc = (p.description ?? "").toLowerCase();
          return title.includes(search) || desc.includes(search);
        })
      : rawProducts;

    const mapped: MenuItem[] = filtered.map((p) => {
      const category =
        (p.product_category_id ? categoryTitleById.get(p.product_category_id) : undefined) ?? "Other";

      return {
        id: p.id,
        storeId: p.store_id ?? storeId,
        name: p.title ?? "Unnamed",
        description: p.description ?? "",
        price: safeNumber(p.price),
        image: p.image ?? "",
        category,
        popular: p.is_popular,
        extras: [], // TODO: load product_variations as extras
      };
    });

    const categoryOrder = categoriesSorted.map((c) => c.title as string);
    if (mapped.some((m) => m.category === "Other")) categoryOrder.push("Other");

    return { categories: categoryOrder, menuItems: mapped };
  }, [categoriesQuery.data, productsQuery.data, options?.search, storeId]);

  return {
    categories,
    menuItems,
    loading: productsQuery.loading || categoriesQuery.loading,
    error: productsQuery.error || categoriesQuery.error,
    refetch: async () => {
      await Promise.all([productsQuery.refetch(), categoriesQuery.refetch()]);
    },
  };
}

