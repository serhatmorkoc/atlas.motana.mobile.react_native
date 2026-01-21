// Supabase Client for Realtime subscriptions and Auth
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/config/env';
import { errorHandler } from '@/services/errorHandler';

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

// Validate configuration before creating client
function validateConfig(): { isValid: boolean; error?: Error } {
  const missing: string[] = [];

  if (!config.supabaseUrl || config.supabaseUrl.trim() === '') {
    missing.push('EXPO_PUBLIC_SUPABASE_URL');
  }

  if (!config.supabaseAnonKey || config.supabaseAnonKey.trim() === '') {
    missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (missing.length > 0) {
    return {
      isValid: false,
      error: new Error(
        `Missing required environment variables: ${missing.join(', ')}. ` +
        'Please check your EAS Build configuration and Expo Dashboard secrets.'
      ),
    };
  }

  return { isValid: true };
}

// Create client only if configuration is valid
function createSupabaseClient(): SupabaseClient {
  const validation = validateConfig();
  
  if (!validation.isValid) {
    const error = validation.error!;
    
    // Log error
    errorHandler.handleError(error, true, 'Supabase Client Initialization');
    
    if (__DEV__) {
      console.error('[Supabase]', error.message);
    }
    
    // Throw error to be caught by ErrorBoundary
    throw error;
  }

  try {
    return createClient(
      config.supabaseUrl!,
      config.supabaseAnonKey!,
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
  } catch (error: any) {
    const initError = new Error(
      `Failed to initialize Supabase client: ${error?.message || 'Unknown error'}`
    );
    errorHandler.handleError(initError, true, 'Supabase Client Creation');
    throw initError;
  }
}

// Lazy initialization - create client on first access
let supabaseClientInstance: SupabaseClient | null = null;
let initializationError: Error | null = null;

function getSupabaseClient(): SupabaseClient {
  if (initializationError) {
    throw initializationError;
  }
  
  if (!supabaseClientInstance) {
    try {
      supabaseClientInstance = createSupabaseClient();
    } catch (error: any) {
      initializationError = error;
      throw error;
    }
  }
  
  return supabaseClientInstance;
}

// Export as getter - throws error on first access if config is invalid
// This prevents crash on import, but throws error when client is actually used
// ErrorBoundary will catch the error and show CrashScreen
export const supabaseClient: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
  set(_target, prop: string | symbol, value: any) {
    const client = getSupabaseClient();
    (client as any)[prop] = value;
    return true;
  },
}) as SupabaseClient;
