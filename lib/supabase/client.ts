// Supabase Client for Realtime subscriptions
import { createClient } from '@supabase/supabase-js';
import { config } from '@/config/env';

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Realtime subscriptions will not work.'
  );
}

export const supabaseClient = createClient(
  config.supabaseUrl || '',
  config.supabaseAnonKey || '',
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
