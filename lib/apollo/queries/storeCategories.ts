import { gql } from '@apollo/client';

export const GET_STORE_CATEGORIES = gql`
  query GetStoreCategories {
    store_categoriesCollection(filter: { is_active: { eq: true } }, orderBy: { id: AscNullsLast }) {
      edges {
        node {
          id
          name
          icon
          color
          is_active
        }
      }
    }
  }
`;

export const GET_STORE_PRODUCT_CATEGORIES = gql`
  query GetStoreProductCategories($storeId: UUID!) {
    product_categoriesCollection(
      filter: { store_id: { eq: $storeId }, is_active: { eq: true } }
      orderBy: { id: AscNullsLast }
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
