// Store type mapper - Maps GraphQL Store to Mobile App Store type
import { Store } from '@/types/store.types';

// GraphQL Store type (from Supabase)
export interface GraphQLStore {
  id: string;
  name: string;
  image: string;
  rating: string; // String in DB, number in mobile
  delivery_time_min: number;
  delivery_time_max: number;
  address: string;
  latitude: string;
  longitude: string;
  minimum_order: string;
  is_available: boolean;
  is_active: boolean;
  review_count: number;
  slug: string;
  store_categories_id: number;
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
  const deliveryTime = `${graphQLStore.delivery_time_min}-${graphQLStore.delivery_time_max}`;
  const cuisine = getCuisineFromCategory(graphQLStore.store_categories_id);
  const distance = calculateDistance(graphQLStore.id, graphQLStore.latitude, graphQLStore.longitude);
  const deliveryFee = calculateDeliveryFee(graphQLStore.id);
  const minimumOrder = Number(graphQLStore.minimum_order);
  
  const lat = graphQLStore.latitude ? parseFloat(graphQLStore.latitude) : undefined;
  const lng = graphQLStore.longitude ? parseFloat(graphQLStore.longitude) : undefined;

  return {
    id: graphQLStore.id,
    name: graphQLStore.name,
    image: graphQLStore.image,
    rating: parseFloat(graphQLStore.rating),
    deliveryTime,
    cuisine,
    deliveryFee,
    distance,
    deliveryTimeMin: graphQLStore.delivery_time_min,
    deliveryTimeMax: graphQLStore.delivery_time_max,
    minimumOrder: Number.isFinite(minimumOrder) ? minimumOrder : undefined,
    storeCategoriesId: typeof graphQLStore.store_categories_id === 'string' 
      ? Number(graphQLStore.store_categories_id) 
      : graphQLStore.store_categories_id,
    latitude: Number.isFinite(lat) ? lat : undefined,
    longitude: Number.isFinite(lng) ? lng : undefined,
  };
};

/**
 * Maps array of GraphQL Stores to Mobile App Stores
 */
export const mapGraphQLStoresToStores = (graphQLStores: GraphQLStore[]): Store[] => {
  return graphQLStores.map(mapGraphQLStoreToStore);
};
