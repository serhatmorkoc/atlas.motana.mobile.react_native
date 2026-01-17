import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { config } from '@/config/env';

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
function fetchQuery(operation: any, variables: any, cacheConfig: any, uploadables: any) {
  return fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Supabase GraphQL requires apikey header (anon key) even for public queries
      apikey: config.supabaseAnonKey || '',
      // TODO: Add authorization header when auth is implemented
      // authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => {
    return response.json();
  });
}

// Create Relay Environment
export const relayEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
