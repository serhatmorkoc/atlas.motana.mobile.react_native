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
