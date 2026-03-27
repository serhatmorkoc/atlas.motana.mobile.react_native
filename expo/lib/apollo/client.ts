import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
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
    '[Apollo] GraphQL URL is empty. Set EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY (recommended) ' +
      'or EXPO_PUBLIC_SUPABASE_GRAPHQL_URL.'
  );
}

// HTTP Link
const httpLink = createHttpLink({
  uri: graphqlUrl,
});

// Auth Link - adds authorization header
const authLink = setContext(async (_, { headers }) => {
  // Get current session token for authorization
  let authToken: string | null = null;
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    authToken = session?.access_token || null;
  } catch (error) {
    // If session fetch fails, continue without auth token
    // The query might still work if RLS allows it
    console.debug('[Apollo] Failed to get session token:', error);
  }

  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      // Supabase GraphQL requires apikey header (anon key) even for public queries
      apikey: config.supabaseAnonKey || '',
      // Add authorization header if we have a token
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  };
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add field policies for better cache control if needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network', // Similar to Relay's store-and-network
    },
    query: {
      fetchPolicy: 'cache-first', // Similar to Relay's store-or-network
    },
  },
});
