import { graphql } from 'react-relay';

export const storeCategoriesQuery = graphql`
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
