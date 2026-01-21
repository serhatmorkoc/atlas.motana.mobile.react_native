import { gql } from '@apollo/client';

export const STORE_PRODUCT_CATEGORIES_QUERY = gql`
  query StoreProductCategoriesQuery($storeId: UUID!) {
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
