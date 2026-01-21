/**
 * Store service - Direct Supabase queries for store data
 * Used until GraphQL schema is regenerated to include new fields
 */

import { supabaseClient } from './client';
import type { StoreDeliverySettings } from '@/types/store.types';

export interface StoreOrderDetails {
  id: string;
  name: string;
  serviceFee: number;
  taxRate: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isAvailable: boolean;
}

/**
 * Fetch store details including service_fee and tax_rate
 */
export async function getStoreOrderDetails(storeId: string): Promise<StoreOrderDetails | null> {
  const { data, error } = await supabaseClient
    .from('stores')
    .select('id, name, service_fee, tax_rate, delivery_time_min, delivery_time_max, is_available')
    .eq('id', storeId)
    .single();

  if (error || !data) {
    console.error('Error fetching store details:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    serviceFee: parseFloat(data.service_fee ?? '0'),
    taxRate: parseFloat(data.tax_rate ?? '0'),
    deliveryTimeMin: data.delivery_time_min ?? 0,
    deliveryTimeMax: data.delivery_time_max ?? 0,
    isAvailable: data.is_available ?? true,
  };
}

/**
 * Fetch store delivery settings for fee calculation
 */
export async function getStoreDeliverySettings(storeId: string): Promise<StoreDeliverySettings | null> {
  const { data, error } = await supabaseClient
    .from('store_delivery_settings')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (error || !data) {
    // Not all stores have delivery settings, return null
    if (error?.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching delivery settings:', error);
    }
    return null;
  }

  return {
    id: data.id,
    storeId: data.store_id,
    earningBaseFee: parseFloat(data.earning_base_fee ?? '0'),
    earningPerKm: parseFloat(data.earning_per_km ?? '0'),
    earningMinimum: parseFloat(data.earning_minimum ?? '0'),
    searchRadiusKm: data.search_radius_km ?? 0,
    maxCouriersQueue: data.max_couriers_queue ?? 0,
    requestTimeoutSeconds: data.request_timeout_seconds ?? 0,
    useGoogleMaps: data.use_google_maps ?? false,
    googleMapsApiKey: data.google_maps_api_key ?? undefined,
    surgeActive: data.surge_active ?? false,
    surgeMultiplier: parseFloat(data.surge_multiplier ?? '1'),
  };
}

/**
 * Batch fetch store availability status
 */
export async function getStoresAvailability(storeIds: string[]): Promise<Record<string, boolean>> {
  const { data, error } = await supabaseClient
    .from('stores')
    .select('id, is_available')
    .in('id', storeIds);

  if (error || !data) {
    console.error('Error fetching stores availability:', error);
    return {};
  }

  return data.reduce((acc, store) => {
    acc[store.id] = store.is_available ?? true;
    return acc;
  }, {} as Record<string, boolean>);
}

/**
 * Batch fetch stores with service_fee, tax_rate, and is_available
 */
export async function getStoresWithFees(storeIds: string[]): Promise<Record<string, {
  serviceFee: number;
  taxRate: number;
  isAvailable: boolean;
}>> {
  const { data, error } = await supabaseClient
    .from('stores')
    .select('id, service_fee, tax_rate, is_available')
    .in('id', storeIds);

  if (error || !data) {
    console.error('Error fetching stores with fees:', error);
    return {};
  }

  return data.reduce((acc, store) => {
    acc[store.id] = {
      serviceFee: parseFloat(store.service_fee ?? '0'),
      taxRate: parseFloat(store.tax_rate ?? '0'),
      isAvailable: store.is_available ?? true,
    };
    return acc;
  }, {} as Record<string, { serviceFee: number; taxRate: number; isAvailable: boolean }>);
}
