import { gql } from "@apollo/client";

export const GET_STORE_PRODUCTS = gql`
  query GetStoreProducts($storeId: UUID!, $first: Int, $offset: Int) {
    productsCollection(
      filter: { store_id: { eq: $storeId }, is_active: { eq: true } }
      first: $first
      offset: $offset
    ) {
      edges {
        node {
          id
          product_category_id
          store_id
          title
          description
          image
          price
          old_price
          stock_quantity
          is_popular
          is_active
          created_at
        }
      }
    }
  }
`;

export const GET_STORE_PRODUCT_CATEGORIES = gql`
  query GetStoreProductCategories($storeId: UUID!) {
    product_categoriesCollection(
      filter: { store_id: { eq: $storeId } }
      orderBy: { sort_order: AscNullsLast }
    ) {
      edges {
        node {
          id
          store_id
          title
          sort_order
        }
      }
    }
  }
`;

export const GET_PRODUCT_VARIATIONS = gql`
  query GetProductVariations($productId: UUID!) {
    product_variationsCollection(filter: { product_id: { eq: $productId } }) {
      edges {
        node {
          id
          product_id
          title
          price
          discounted_price
          stock_quantity
        }
      }
    }
  }
`;

