// Store type mapper - Maps GraphQL Store to Mobile App Store type
import { Store, StoreDeliverySettings } from '@/types/store.types';

// GraphQL Store type (from Supabase)
export interface GraphQLStore {
  id: string;
  name?: string | null;
  image?: string | null;
  rating?: string | null; // String in DB, number in mobile
  delivery_time_min?: number | null;
  delivery_time_max?: number | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  minimum_order?: string | null;
  is_available?: boolean | null;
  is_active?: boolean | null;
  review_count?: number | null;
  slug?: string | null;
  store_categories_id?: number | string | null;
  service_fee?: string | null;
  tax_rate?: string | null;
}

// GraphQL StoreDeliverySettings type (from Supabase)
export interface GraphQLStoreDeliverySettings {
  id: string;
  store_id?: string | null;
  earning_base_fee?: string | null;
  earning_per_km?: string | null;
  earning_minimum?: string | null;
  search_radius_km?: number | null;
  max_couriers_queue?: number | null;
  request_timeout_seconds?: number | null;
  use_google_maps?: boolean | null;
  google_maps_api_key?: string | null;
  surge_active?: boolean | null;
  surge_multiplier?: string | null;
}

// Store category mapping (you'll need to fetch this from store-categories)
// For now, we'll use a simple mapping
const getCuisineFromCategory = (categoryId: number): string => {
  // This is a placeholder - you should fetch actual category name from GraphQL
  const categoryMap: Record<number, string> = {
    1: 'Italian, Pizza',
    2: 'Fast Food, Burgers',
    3: 'Japanese, Sushi',
    4: 'Turkish, Kebab',
    5: 'Italian, Pasta',
    6: 'Mexican, Tacos',
    7: 'Asian, Noodles',
    8: 'Steakhouse, BBQ',
    9: 'Healthy, Vegan',
    10: 'Seafood, Fish',
  };
  return categoryMap[categoryId] || 'Restaurant';
};

// Calculate distance (placeholder - you'll need user location)
// Using deterministic hash based on store ID to ensure consistent values
const calculateDistance = (storeId: string, lat: string, lng: string): string => {
  // TODO: Implement actual distance calculation using user location
  // For now, return a deterministic distance based on store ID
  const distances = ['0.8 km', '1.2 km', '1.5 km', '2.1 km', '2.8 km', '3.5 km', '4.2 km', '5.0 km'];
  // Simple hash function to get consistent index
  let hash = 0;
  for (let i = 0; i < storeId.length; i++) {
    hash = ((hash << 5) - hash) + storeId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % distances.length;
  return distances[index];
};

// Calculate delivery fee (placeholder - you'll need actual delivery fee logic)
// Using deterministic hash based on store ID to ensure consistent values
const calculateDeliveryFee = (storeId: string): string => {
  // TODO: Implement actual delivery fee calculation
  // For now, return a deterministic fee based on store ID
  const fees = ['₺8', '₺10', '₺12', '₺15', '₺18', '₺20', '₺22', '₺25'];
  // Simple hash function to get consistent index
  let hash = 0;
  for (let i = 0; i < storeId.length; i++) {
    hash = ((hash << 5) - hash) + storeId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % fees.length;
  return fees[index];
};

/**
 * Maps GraphQL Store to Mobile App Store type
 */
export const mapGraphQLStoreToStore = (graphQLStore: GraphQLStore): Store => {
  const deliveryMin = graphQLStore.delivery_time_min ?? 0;
  const deliveryMax = graphQLStore.delivery_time_max ?? 0;
  const deliveryTime = `${deliveryMin}-${deliveryMax}`;

  const categoryIdRaw = graphQLStore.store_categories_id ?? 0;
  const categoryId =
    typeof categoryIdRaw === 'string' ? Number(categoryIdRaw) : Number(categoryIdRaw);
  const cuisine = getCuisineFromCategory(Number.isFinite(categoryId) ? categoryId : 0);

  const distance = calculateDistance(
    graphQLStore.id,
    graphQLStore.latitude ?? '0',
    graphQLStore.longitude ?? '0'
  );
  const deliveryFee = calculateDeliveryFee(graphQLStore.id);
  const minimumOrder = Number(graphQLStore.minimum_order ?? '0');
  
  const lat = graphQLStore.latitude ? parseFloat(graphQLStore.latitude) : undefined;
  const lng = graphQLStore.longitude ? parseFloat(graphQLStore.longitude) : undefined;
  
  const serviceFee = parseFloat(graphQLStore.service_fee ?? '0');
  const taxRate = parseFloat(graphQLStore.tax_rate ?? '0');

  return {
    id: graphQLStore.id,
    name: graphQLStore.name ?? '',
    image: graphQLStore.image ?? '',
    rating: parseFloat(graphQLStore.rating ?? '0'),
    deliveryTime,
    cuisine,
    deliveryFee,
    distance,
    deliveryTimeMin: deliveryMin,
    deliveryTimeMax: deliveryMax,
    minimumOrder: Number.isFinite(minimumOrder) ? minimumOrder : undefined,
    storeCategoriesId: Number.isFinite(categoryId) ? categoryId : 0,
    latitude: Number.isFinite(lat) ? lat : undefined,
    longitude: Number.isFinite(lng) ? lng : undefined,
    isAvailable: graphQLStore.is_available ?? true,
    serviceFee: Number.isFinite(serviceFee) ? serviceFee : 0,
    taxRate: Number.isFinite(taxRate) ? taxRate : 0,
  };
};

/**
 * Maps array of GraphQL Stores to Mobile App Stores
 */
export const mapGraphQLStoresToStores = (graphQLStores: GraphQLStore[]): Store[] => {
  return graphQLStores.map(mapGraphQLStoreToStore);
};

/**
 * Maps GraphQL StoreDeliverySettings to Mobile App type
 */
export const mapGraphQLStoreDeliverySettings = (
  settings: GraphQLStoreDeliverySettings
): StoreDeliverySettings => {
  return {
    id: settings.id,
    storeId: settings.store_id ?? '',
    earningBaseFee: parseFloat(settings.earning_base_fee ?? '0'),
    earningPerKm: parseFloat(settings.earning_per_km ?? '0'),
    earningMinimum: parseFloat(settings.earning_minimum ?? '0'),
    searchRadiusKm: settings.search_radius_km ?? 0,
    maxCouriersQueue: settings.max_couriers_queue ?? 0,
    requestTimeoutSeconds: settings.request_timeout_seconds ?? 0,
    useGoogleMaps: settings.use_google_maps ?? false,
    googleMapsApiKey: settings.google_maps_api_key ?? undefined,
    surgeActive: settings.surge_active ?? false,
    surgeMultiplier: parseFloat(settings.surge_multiplier ?? '1'),
  };
};
