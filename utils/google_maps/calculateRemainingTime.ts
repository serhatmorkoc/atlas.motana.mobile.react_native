import { config } from '@/config/env';
import { Coordinates } from './calculateDistance';
import { TravelMode } from './types';

export interface RemainingTimeResult {
  remainingTime: number; // in seconds
  remainingTimeText: string; // formatted (e.g., "15 min")
  estimatedArrival: Date; // estimated arrival time
  estimatedArrivalText: string; // formatted (e.g., "14:30")
  distance: number; // in meters
  distanceText: string; // formatted (e.g., "2.5 km")
  travelMode: TravelMode; // travel mode used
}

/**
 * Calculate remaining time (ETA) with traffic information using Google Maps Directions API
 * @param origin - Origin coordinates (store location)
 * @param destination - Destination coordinates (customer location)
 * @param travelMode - Travel mode: 'driving' (motorlu kurye), 'bicycling' (bisikletli kurye), 'walking' (yürüyüş). Default: 'driving'
 * @returns Remaining time, ETA, and distance information
 */
export async function calculateRemainingTime(
  origin: Coordinates,
  destination: Coordinates,
  travelMode: TravelMode = 'driving'
): Promise<RemainingTimeResult> {
  if (!config.googleMapsApiKey) {
    throw new Error('Google Maps API key is not configured');
  }

  try {
    // Google Maps Directions API endpoint with traffic data
    // Note: Traffic data is only available for 'driving' mode
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;
    
    // For driving mode, include traffic parameters. For other modes, exclude them.
    const trafficParams = travelMode === 'driving' 
      ? '&departure_time=now&traffic_model=best_guess' 
      : '';
    
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=${travelMode}${trafficParams}&key=${config.googleMapsApiKey}&units=metric`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.error_message || data.status}`);
    }

    // Extract route information
    const route = data.routes?.[0];
    if (!route) {
      throw new Error('No route found');
    }

    const leg = route.legs?.[0];
    if (!leg) {
      throw new Error('No leg found in route');
    }

    // Use duration_in_traffic if available (includes traffic for driving mode), otherwise use duration
    const duration = (travelMode === 'driving' && leg.duration_in_traffic?.value) 
      ? leg.duration_in_traffic.value 
      : leg.duration?.value || 0; // in seconds
    const distance = leg.distance?.value || 0; // in meters

    // Calculate estimated arrival time
    const now = new Date();
    const estimatedArrival = new Date(now.getTime() + duration * 1000);

    return {
      remainingTime: duration,
      remainingTimeText: formatDuration(duration),
      estimatedArrival,
      estimatedArrivalText: formatTime(estimatedArrival),
      distance,
      distanceText: formatDistance(distance),
      travelMode,
    };
  } catch (error) {
    console.error('Error calculating remaining time:', error);
    throw error;
  }
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
 * Format date to time string
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
