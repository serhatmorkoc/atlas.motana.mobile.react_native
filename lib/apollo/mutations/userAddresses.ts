import { gql } from '@apollo/client';

export const CREATE_USER_ADDRESS = gql`
  mutation CreateUserAddress(
    $user_id: UUID!
    $label: String!
    $delivery_address: String!
    $details: String
    $building: String
    $floor: String
    $landmark: String
    $latitude: BigFloat
    $longitude: BigFloat
    $is_selected: Boolean
  ) {
    insertIntouser_addressesCollection(
      objects: {
        user_id: $user_id
        label: $label
        delivery_address: $delivery_address
        details: $details
        building: $building
        floor: $floor
        landmark: $landmark
        latitude: $latitude
        longitude: $longitude
        is_selected: $is_selected
      }
    ) {
      records {
        id
        user_id
        label
        delivery_address
        details
        building
        floor
        landmark
        latitude
        longitude
        is_selected
      }
    }
  }
`;

export const UPDATE_USER_ADDRESS = gql`
  mutation UpdateUserAddress(
    $id: UUID!
    $label: String
    $delivery_address: String
    $details: String
    $building: String
    $floor: String
    $landmark: String
    $latitude: BigFloat
    $longitude: BigFloat
  ) {
    updateuser_addressesCollection(
      set: {
        label: $label
        delivery_address: $delivery_address
        details: $details
        building: $building
        floor: $floor
        landmark: $landmark
        latitude: $latitude
        longitude: $longitude
      }
      filter: { id: { eq: $id } }
    ) {
      records {
        id
        user_id
        label
        delivery_address
        details
        building
        floor
        landmark
        latitude
        longitude
        is_selected
      }
    }
  }
`;

export const DELETE_USER_ADDRESS = gql`
  mutation DeleteUserAddress($id: UUID!) {
    deleteFromuser_addressesCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

export const SET_SELECTED_ADDRESS = gql`
  mutation SetSelectedAddress($id: UUID!, $is_selected: Boolean!) {
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
