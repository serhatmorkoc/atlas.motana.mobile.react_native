// Apollo Client setup
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { ApolloLink } from '@apollo/client/link';
import { HttpLink } from '@apollo/client/link/http';
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client/errors';
import { config } from '@/config/env';

const ensureHttp = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  // Supabase URLs should be https; add scheme if user pasted only the host
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
  return ensureHttp(config.graphqlUrl);
})();

if (!graphqlUrl) {
  console.warn(
    '[Apollo] GraphQL URL is empty. Set EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY (recommended) ' +
      'or EXPO_PUBLIC_SUPABASE_GRAPHQL_URL.'
  );
}

// HTTP Link
const httpLink = new HttpLink({ uri: graphqlUrl });

// Error Link
const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Op: ${operation.operationName}, Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
    return;
  }

  if (CombinedProtocolErrors.is(error)) {
    error.errors.forEach(({ message, extensions }) => {
      console.error(
        `[GraphQL protocol error]: Op: ${operation.operationName}, Message: ${message}, Extensions: ${JSON.stringify(extensions)}`
      );
    });
    return;
  }

  console.error(`[Network/Unknown error]: Op: ${operation.operationName}`, error);
});

// Retry transient errors in the background (network flakiness, timeouts, etc.)
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3, // total attempts (1 initial + 2 retries)
    retryIf: (error) => {
      // Retry only for network/transport errors; do NOT retry GraphQL validation/business errors.
      return !CombinedGraphQLErrors.is(error) && !CombinedProtocolErrors.is(error);
    },
  },
});

// Auth Link
// TODO: Implement auth store when authentication is added
// import { useAuthStore } from '@/stores/useAuthStore';
const authLink = new ApolloLink((operation, forward) => {
  // TODO: Get token from auth store when authentication is implemented
  // const token = useAuthStore.getState().token;
  const token: string | null = null;

  operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      // Supabase GraphQL requires apikey header (anon key) even for public queries
      apikey: config.supabaseAnonKey || "",
    },
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, retryLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          storesCollection: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
