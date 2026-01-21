import { graphql } from 'react-relay';

export const storeDeliverySettingsQuery = graphql`
  query StoreDeliverySettingsQuery($storeId: UUID!) {
    store_delivery_settingsCollection(filter: { store_id: { eq: $storeId } }, first: 1) {
      edges {
        node {
          id
          store_id
          earning_base_fee
          earning_per_km
          earning_minimum
          search_radius_km
          max_couriers_queue
          request_timeout_seconds
          use_google_maps
          google_maps_api_key
          surge_active
          surge_multiplier
        }
      }
    }
  }
`;
