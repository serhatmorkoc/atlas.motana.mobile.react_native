import { gql } from '@apollo/client';

export const SET_SELECTED_ADDRESS_MUTATION = gql`
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
