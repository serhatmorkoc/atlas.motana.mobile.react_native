import { gql } from '@apollo/client';

export const STORE_CATEGORIES_QUERY = gql`
  query StoreCategoriesQuery {
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
