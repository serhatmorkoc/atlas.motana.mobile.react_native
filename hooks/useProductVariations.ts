import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_VARIATIONS } from "@/lib/apollo/queries/products";
import type { MenuItemExtra } from "@/types/menu.types";

type Edge<T> = { node: T };

export interface GraphQLProductVariation {
  id: string;
  product_id: string;
  title: string | null;
  price: string;
  discounted_price: string | null;
  stock_quantity: number | null;
}

interface GetProductVariationsData {
  product_variationsCollection: {
    edges: Array<Edge<GraphQLProductVariation>>;
  };
}

interface GetProductVariationsVars {
  productId: string;
}

const safeNumber = (value: string | null | undefined): number => {
  const n = value ? Number(value) : 0;
  return Number.isFinite(n) ? n : 0;
};

export function useProductVariations(productId?: string) {
  const { data, loading, error, refetch } = useQuery<GetProductVariationsData, GetProductVariationsVars>(
    GET_PRODUCT_VARIATIONS,
    {
      variables: productId ? { productId } : (undefined as any),
      skip: !productId,
      fetchPolicy: "cache-and-network",
    }
  );

  const extras: MenuItemExtra[] =
    data?.product_variationsCollection?.edges?.map(({ node }) => ({
      id: node.id,
      name: node.title ?? "Option",
      price: safeNumber(node.discounted_price ?? node.price),
    })) ?? [];

  return { extras, loading, error, refetch };
}

