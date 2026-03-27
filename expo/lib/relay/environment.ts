import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { config } from '@/config/env';
import { supabaseClient } from '@/lib/supabase/client';

const ensureHttp = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

// GraphQL endpoint
// Priority:
// 1) EXPO_PUBLIC_SUPABASE_GRAPHQL_URL (full URL)
// 2) EXPO_PUBLIC_SUPABASE_URL + /graphql/v1
// 3) EXPO_PUBLIC_GRAPHQL_URL (legacy)
const graphqlUrl = (() => {
  if (config.supabaseGraphqlUrl) return ensureHttp(config.supabaseGraphqlUrl);
  if (config.supabaseUrl) return `${stripTrailingSlash(ensureHttp(config.supabaseUrl))}/graphql/v1`;
  return ensureHttp(config.graphqlUrl || '');
})();

if (!graphqlUrl) {
  console.warn(
    '[Relay] GraphQL URL is empty. Set EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY (recommended) ' +
      'or EXPO_PUBLIC_SUPABASE_GRAPHQL_URL.'
  );
}

// Network layer for Relay
async function fetchQuery(operation: any, variables: any, cacheConfig: any, uploadables: any) {
  // Get current session token for authorization
  let authToken: string | null = null;
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    authToken = session?.access_token || null;
  } catch (error) {
    // If session fetch fails, continue without auth token
    // The query might still work if RLS allows it
    console.debug('[Relay] Failed to get session token:', error);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Supabase GraphQL requires apikey header (anon key) even for public queries
    apikey: config.supabaseAnonKey || '',
  };

  // Add authorization header if we have a token
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  return response.json();
}

// Create Relay Environment
export const relayEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
