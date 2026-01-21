import { config } from '@/config/env';
import { TravelMode } from './types';
import { Platform } from 'react-native';

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
    if (Platform.OS === 'web') {
      return await calculateDistanceWeb(origin, destination, travelMode);
    } else {
      return await calculateDistanceNative(origin, destination, travelMode);
    }
  } catch (error) {
    console.error('Error calculating distance:', error);
    throw error;
  }
}

async function calculateDistanceNative(
  origin: Coordinates,
  destination: Coordinates,
  travelMode: TravelMode
): Promise<DistanceResult> {
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

  const element = data.rows?.[0]?.elements?.[0];
  if (!element || element.status !== 'OK') {
    throw new Error(`No route found: ${element?.status || 'UNKNOWN_ERROR'}`);
  }

  const distance = element.distance?.value || 0;
  const duration = element.duration?.value || 0;

  return {
    distance,
    distanceText: formatDistance(distance),
    duration,
    durationText: formatDuration(duration),
    travelMode,
  };
}

async function calculateDistanceWeb(
  origin: Coordinates,
  destination: Coordinates,
  travelMode: TravelMode
): Promise<DistanceResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !(window as any).google) {
      loadGoogleMapsScript()
        .then(() => calculateDistanceWithGoogleMaps(origin, destination, travelMode))
        .then(resolve)
        .catch(reject);
    } else {
      calculateDistanceWithGoogleMaps(origin, destination, travelMode)
        .then(resolve)
        .catch(reject);
    }
  });
}

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    if ((window as any).google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
}

function calculateDistanceWithGoogleMaps(
  origin: Coordinates,
  destination: Coordinates,
  travelMode: TravelMode
): Promise<DistanceResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !(window as any).google) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const google = (window as any).google;
    const service = new google.maps.DistanceMatrixService();
    
    const originLatLng = new google.maps.LatLng(origin.latitude, origin.longitude);
    const destLatLng = new google.maps.LatLng(destination.latitude, destination.longitude);

    const travelModeMap: { [key: string]: any } = {
      driving: google.maps.TravelMode.DRIVING,
      bicycling: google.maps.TravelMode.BICYCLING,
      walking: google.maps.TravelMode.WALKING,
      transit: google.maps.TravelMode.TRANSIT,
    };

    service.getDistanceMatrix(
      {
        origins: [originLatLng],
        destinations: [destLatLng],
        travelMode: travelModeMap[travelMode] || google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response: any, status: any) => {
        if (status !== 'OK') {
          reject(new Error(`Google Maps API error: ${status}`));
          return;
        }

        const element = response.rows?.[0]?.elements?.[0];
        if (!element || element.status !== 'OK') {
          reject(new Error(`No route found: ${element?.status || 'UNKNOWN_ERROR'}`));
          return;
        }

        const distance = element.distance?.value || 0;
        const duration = element.duration?.value || 0;

        resolve({
          distance,
          distanceText: formatDistance(distance),
          duration,
          durationText: formatDuration(duration),
          travelMode,
        });
      }
    );
  });
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
