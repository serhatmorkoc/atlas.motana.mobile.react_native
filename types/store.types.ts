/**
 * Store related types
 */

export interface Store {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  deliveryFee: string;
  distance: string; // Can be calculated or placeholder
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  minimumOrder?: number;
  storeCategoriesId?: number;
  latitude?: number;
  longitude?: number;
  // New fields
  isAvailable?: boolean;
  serviceFee?: number;
  taxRate?: number;
}

/**
 * Store delivery settings for fee calculation
 */
export interface StoreDeliverySettings {
  id: string;
  storeId: string;
  earningBaseFee: number;
  earningPerKm: number;
  earningMinimum: number;
  searchRadiusKm: number;
  maxCouriersQueue: number;
  requestTimeoutSeconds: number;
  useGoogleMaps: boolean;
  googleMapsApiKey?: string;
  surgeActive: boolean;
  surgeMultiplier: number;
}

export interface StoreDetails extends Store {
  description?: string;
  address?: string;
  phone?: string;
  openingHours?: OpeningHours;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
}

