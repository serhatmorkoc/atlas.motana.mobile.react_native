import { gql } from '@apollo/client';

export const CREATE_USER_ADDRESS_MUTATION = gql`
  mutation CreateUserAddressMutation(
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
