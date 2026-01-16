import { config } from '@/config/env';
import { TravelMode } from './types';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DistanceResult {
  distance: number; // in meters
  distanceText: string; // formatted (e.g., "2.5 km")
  duration: number; // in seconds
  durationText: string; // formatted (e.g., "15 min")
  travelMode: TravelMode; // travel mode used
}

/**
 * Calculate distance and duration between two coordinates using Google Maps Distance Matrix API
 * @param origin - Origin coordinates (store location)
 * @param destination - Destination coordinates (customer location)
 * @param travelMode - Travel mode: 'driving' (motorlu kurye), 'bicycling' (bisikletli kurye), 'walking' (yürüyüş). Default: 'driving'
 * @returns Distance and duration information
 */
export async function calculateDistance(
  origin: Coordinates,
  destination: Coordinates,
  travelMode: TravelMode = 'driving'
): Promise<DistanceResult> {
  if (!config.googleMapsApiKey) {
    throw new Error('Google Maps API key is not configured');
  }

  try {
    // Google Maps Distance Matrix API endpoint
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destinationStr}&mode=${travelMode}&key=${config.googleMapsApiKey}&units=metric`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.error_message || data.status}`);
    }

    // Extract distance and duration from Distance Matrix API response
    const element = data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== 'OK') {
      throw new Error(`No route found: ${element?.status || 'UNKNOWN_ERROR'}`);
    }

    const distance = element.distance?.value || 0; // in meters
    const duration = element.duration?.value || 0; // in seconds

    return {
      distance,
      distanceText: formatDistance(distance),
      duration,
      durationText: formatDuration(duration),
      travelMode,
    };
  } catch (error) {
    console.error('Error calculating distance:', error);
    throw error;
  }
}

/**
 * Format distance in meters to readable text
 */
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

/**
 * Format duration in seconds to readable text
 */
function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}
