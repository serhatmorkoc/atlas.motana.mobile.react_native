/**
 * Transportation modes for Google Maps API
 */
export type TravelMode = 'driving' | 'bicycling' | 'walking' | 'transit';

/**
 * Courier types mapped to travel modes
 */
export enum CourierType {
  MOTORCYCLE = 'driving', // Motorlu kurye
  BICYCLE = 'bicycling',  // Bisikletli kurye
  WALKING = 'walking',    // Yürüyüş (genelde kullanılmaz)
}

/**
 * Get travel mode from courier type
 */
export function getTravelModeFromCourierType(courierType: CourierType | string): TravelMode {
  if (courierType === CourierType.MOTORCYCLE) {
    return 'driving';
  }
  if (courierType === CourierType.BICYCLE) {
    return 'bicycling';
  }
  if (courierType === CourierType.WALKING) {
    return 'walking';
  }
  // Default to driving
  return 'driving';
}
