import { graphql } from 'react-relay';

export const setSelectedAddressMutation = graphql`
  mutation SetSelectedAddressMutation($id: UUID!, $is_selected: Boolean!) {
    updateuser_addressesCollection(
      set: { is_selected: $is_selected }
      filter: { id: { eq: $id } }
    ) {
      records {
        id
        is_selected
      }
    }
  }
`;
