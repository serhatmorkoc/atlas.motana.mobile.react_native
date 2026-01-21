import { graphql } from 'react-relay';

export const storeProductCategoriesQuery = graphql`
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
