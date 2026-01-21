/**
 * Debug script to check if environment variables are loaded
 * Run this in your app to see what values are available
 */

import { config } from '../config/env';

console.log('=== Environment Variables Check ===');
console.log('EXPO_PUBLIC_SUPABASE_URL:', config.supabaseUrl ? '✅ Loaded' : '❌ Missing');
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', config.supabaseAnonKey ? '✅ Loaded' : '❌ Missing');
console.log('EXPO_PUBLIC_SUPABASE_GRAPHQL_URL:', config.supabaseGraphqlUrl ? '✅ Loaded' : '❌ Missing');
console.log('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY:', config.googleMapsApiKey ? '✅ Loaded' : '❌ Missing');
console.log('===================================');

// In production, you can add this to app startup to debug
if (__DEV__) {
  console.log('Full config:', {
    supabaseUrl: config.supabaseUrl ? `${config.supabaseUrl.substring(0, 20)}...` : 'MISSING',
    supabaseAnonKey: config.supabaseAnonKey ? `${config.supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
    supabaseGraphqlUrl: config.supabaseGraphqlUrl ? `${config.supabaseGraphqlUrl.substring(0, 20)}...` : 'MISSING',
    googleMapsApiKey: config.googleMapsApiKey ? `${config.googleMapsApiKey.substring(0, 10)}...` : 'MISSING',
  });
}
