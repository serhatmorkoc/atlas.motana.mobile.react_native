import { graphql } from 'react-relay';

export const updateUserAddressMutation = graphql`
  mutation UpdateUserAddressMutation(
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
