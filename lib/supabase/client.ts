// Supabase Client for Realtime subscriptions and Auth
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/config/env';

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Realtime subscriptions will not work.'
  );
}

// Custom fetch with retry logic
const fetchWithRetry = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const maxRetries = 3;
  const initialDelay = 500;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(input, init);
      
      // Retry on server errors (5xx) or rate limiting (429)
      if ((response.status >= 500 || response.status === 429) && attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), 5000);
        if (__DEV__) {
          console.warn(`[Supabase] HTTP ${response.status}, retrying in ${delay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error: any) {
      lastError = error;
      
      // Retry on network errors
      const isNetworkError = 
        error?.message?.toLowerCase().includes('network') ||
        error?.message?.toLowerCase().includes('failed to fetch');
      
      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), 5000);
        if (__DEV__) {
          console.warn(`[Supabase] Network error, retrying in ${delay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Request failed after retries');
};

export const supabaseClient = createClient(
  config.supabaseUrl || '',
  config.supabaseAnonKey || '',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      fetch: fetchWithRetry,
    },
  }
);
