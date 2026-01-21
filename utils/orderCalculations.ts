/**
 * Order calculation utilities
 * Calculates delivery fee, service fee, tax, and total amounts
 */

import { StoreDeliverySettings } from '@/types/store.types';

export interface OrderCalculationResult {
  subTotal: number;
  deliveryFee: number;
  serviceFee: number;
  taxAmount: number;
  totalAmount: number;
}

export interface StoreOrderInfo {
  serviceFee: number;
  taxRate: number;
}

/**
 * Calculates delivery fee based on distance and store delivery settings
 * Formula: MAX(base_fee + (km * per_km), minimum)
 * If surge is active, multiply by surge_multiplier
 */
export const calculateDeliveryFee = (
  distanceKm: number,
  settings: StoreDeliverySettings | null
): number => {
  if (!settings) {
    // Fallback to default delivery fee if no settings available
    return 9.90;
  }

  const baseFee = settings.earningBaseFee;
  const perKm = settings.earningPerKm;
  const minimum = settings.earningMinimum;

  // Formula: MAX(base + (km * perKm), minimum)
  let calculated = baseFee + (distanceKm * perKm);
  calculated = Math.max(calculated, minimum);

  // Apply surge multiplier if active
  if (settings.surgeActive && settings.surgeMultiplier > 1) {
    calculated = calculated * settings.surgeMultiplier;
  }

  // Round to 2 decimal places
  return Math.round(calculated * 100) / 100;
};

/**
 * Calculates the complete order total
 */
export const calculateOrderTotal = (
  subtotal: number,
  distanceKm: number,
  storeInfo: StoreOrderInfo,
  deliverySettings: StoreDeliverySettings | null,
  tipAmount: number = 0
): OrderCalculationResult => {
  // 1. Delivery Fee (Courier earning)
  const deliveryFee = calculateDeliveryFee(distanceKm, deliverySettings);

  // 2. Service Fee (Platform fee from store)
  const serviceFee = storeInfo.serviceFee;

  // 3. Tax (calculated on subtotal)
  const taxRate = storeInfo.taxRate / 100; // Convert percentage to decimal
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;

  // 4. Total
  const totalAmount = Math.round((subtotal + deliveryFee + serviceFee + taxAmount + tipAmount) * 100) / 100;

  return {
    subTotal: subtotal,
    deliveryFee,
    serviceFee,
    taxAmount,
    totalAmount,
  };
};

/**
 * Format delivery fee for display
 */
export const formatDeliveryFee = (fee: number): string => {
  if (fee === 0) {
    return 'Free';
  }
  return `₺${fee.toFixed(2)}`;
};

/**
 * Parse distance string to kilometers
 * Handles formats like "1.5 km", "1,5 km", "2.3km"
 */
export const parseDistanceToKm = (distanceStr: string): number => {
  if (!distanceStr) return 0;
  
  // Remove "km" suffix and trim
  const cleaned = distanceStr.toLowerCase().replace('km', '').trim();
  
  // Handle both comma and dot as decimal separator
  const normalized = cleaned.replace(',', '.');
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};
