import { Store, StoreDeliverySettings } from '@/types/store.types';

export interface GraphQLStore {
  id: string;
  name: string;
  image: string;
  rating: number;
  delivery_time_min: number;
  delivery_time_max: number;
  address: string;
  latitude: string | null;
  longitude: string | null;
  minimum_order: string | null;
  is_available: boolean | null;
  is_active: boolean | null;
  review_count: number;
  slug: string;
  store_categories_id: number | null;
  service_fee: string | null;
  tax_rate: string | null;
}

export interface GraphQLStoreDeliverySettings {
  id: string;
  store_id: string;
  earning_base_fee: string;
  earning_per_km: string;
  earning_minimum: string;
  search_radius_km: string;
  max_couriers_queue: number;
  request_timeout_seconds: number;
  use_google_maps: boolean;
  google_maps_api_key: string | null;
  surge_active: boolean;
  surge_multiplier: string;
}

export const mapGraphQLStoreToStore = (graphQLStore: GraphQLStore): Store => {
  const deliveryTimeMin = graphQLStore.delivery_time_min ?? 0;
  const deliveryTimeMax = graphQLStore.delivery_time_max ?? 0;
  const deliveryTime = deliveryTimeMin === deliveryTimeMax 
    ? `${deliveryTimeMin}` 
    : `${deliveryTimeMin}-${deliveryTimeMax}`;

  const latitude = graphQLStore.latitude ? parseFloat(graphQLStore.latitude) : undefined;
  const longitude = graphQLStore.longitude ? parseFloat(graphQLStore.longitude) : undefined;
  const minimumOrder = graphQLStore.minimum_order ? parseFloat(graphQLStore.minimum_order) : undefined;
  const serviceFee = parseFloat(graphQLStore.service_fee ?? '0');
  const taxRate = parseFloat(graphQLStore.tax_rate ?? '0');

  return {
    id: graphQLStore.id,
    name: graphQLStore.name,
    image: graphQLStore.image,
    rating: graphQLStore.rating,
    deliveryTime,
    deliveryTimeMin,
    deliveryTimeMax,
    cuisine: graphQLStore.slug || 'Restaurant',
    deliveryFee: 'Free', // Will be calculated dynamically
    distance: 'Calculating...', // Will be calculated dynamically
    minimumOrder,
    storeCategoriesId: graphQLStore.store_categories_id ?? undefined,
    latitude,
    longitude,
    isAvailable: graphQLStore.is_available ?? true,
    serviceFee: Number.isFinite(serviceFee) ? serviceFee : 0,
    taxRate: Number.isFinite(taxRate) ? taxRate : 0,
  };
};

export const mapGraphQLStoresToStores = (graphQLStores: GraphQLStore[]): Store[] => {
  return graphQLStores.map(mapGraphQLStoreToStore);
};

export const mapGraphQLStoreDeliverySettings = (
  graphQLSettings: GraphQLStoreDeliverySettings
): StoreDeliverySettings => {
  return {
    earningBaseFee: parseFloat(graphQLSettings.earning_base_fee),
    earningPerKm: parseFloat(graphQLSettings.earning_per_km),
    earningMinimum: parseFloat(graphQLSettings.earning_minimum),
    searchRadiusKm: parseFloat(graphQLSettings.search_radius_km),
    maxCouriersQueue: graphQLSettings.max_couriers_queue,
    requestTimeoutSeconds: graphQLSettings.request_timeout_seconds,
    useGoogleMaps: graphQLSettings.use_google_maps,
    googleMapsApiKey: graphQLSettings.google_maps_api_key ?? undefined,
    surgeActive: graphQLSettings.surge_active,
    surgeMultiplier: parseFloat(graphQLSettings.surge_multiplier),
  };
};
