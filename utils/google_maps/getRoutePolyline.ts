import { config } from '@/config/env';
import { Coordinates } from './calculateDistance';
import { TravelMode } from './types';

export interface RoutePolyline {
  polyline: string; // Encoded polyline string
  coordinates: Array<{ latitude: number; longitude: number }>; // Decoded coordinates
  distance: number; // in meters
  duration: number; // in seconds
  durationText: string;
}

/**
 * Get route polyline from Google Maps Directions API
 * @param origin - Origin coordinates
 * @param destination - Destination coordinates
 * @param travelMode - Travel mode
 * @returns Route polyline and coordinates
 */
export async function getRoutePolyline(
  origin: Coordinates,
  destination: Coordinates,
  travelMode: TravelMode = 'driving'
): Promise<RoutePolyline> {
  if (!config.googleMapsApiKey) {
    throw new Error('Google Maps API key is not configured');
  }

  try {
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;
    
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

    const route = data.routes?.[0];
    if (!route) {
      throw new Error('No route found');
    }

    const leg = route.legs?.[0];
    if (!leg) {
      throw new Error('No leg found in route');
    }

    // Get encoded polyline
    const polyline = route.overview_polyline?.points || '';
    if (!polyline) {
      throw new Error('No polyline found in route');
    }

    // Decode polyline to coordinates
    const coordinates = decodePolyline(polyline);

    const duration = (travelMode === 'driving' && leg.duration_in_traffic?.value) 
      ? leg.duration_in_traffic.value 
      : leg.duration?.value || 0;
    const distance = leg.distance?.value || 0;

    return {
      polyline,
      coordinates,
      distance,
      duration,
      durationText: formatDuration(duration),
    };
  } catch (error) {
    console.error('Error getting route polyline:', error);
    throw error;
  }
}

/**
 * Decode Google Maps encoded polyline to coordinates
 * Algorithm from: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
function decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
  const coordinates: Array<{ latitude: number; longitude: number }> = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    coordinates.push({
      latitude: lat * 1e-5,
      longitude: lng * 1e-5,
    });
  }

  return coordinates;
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
