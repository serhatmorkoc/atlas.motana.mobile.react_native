import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink, FetchPolicy } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { config } from '@/config/env';
import { errorHandler } from '@/services/errorHandler';

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
const graphqlUrl = (() => {
  if (config.supabaseGraphqlUrl) return ensureHttp(config.supabaseGraphqlUrl);
  if (config.supabaseUrl) return `${stripTrailingSlash(ensureHttp(config.supabaseUrl))}/graphql/v1`;
  return '';
})();

// Validate GraphQL URL
if (!graphqlUrl || graphqlUrl.trim() === '') {
  const error = new Error(
    '[Apollo] GraphQL URL is not configured. ' +
    'Set EXPO_PUBLIC_SUPABASE_GRAPHQL_URL or EXPO_PUBLIC_SUPABASE_URL in your environment variables.'
  );
  errorHandler.handleError(error, true, 'Apollo Client Initialization');
  console.error('[Apollo]', error.message);
}

// Validate API key
if (!config.supabaseAnonKey || config.supabaseAnonKey.trim() === '') {
  const error = new Error(
    '[Apollo] Supabase API key is not configured. ' +
    'Set EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
  );
  errorHandler.handleError(error, true, 'Apollo Client Initialization');
  console.error('[Apollo]', error.message);
}

// Retry logic is handled in the fetch function below

// HTTP Link
const httpLink = createHttpLink({
  uri: graphqlUrl || 'http://localhost/graphql/v1', // Fallback to prevent crash
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    // Validate GraphQL URL before fetch
    if (!graphqlUrl || graphqlUrl.trim() === '') {
      const error = new Error(
        `[Apollo] CRITICAL: GraphQL URL is empty! Operation: ${(init as any)?.operationName || 'unknown'}. ` +
        'Check EXPO_PUBLIC_SUPABASE_GRAPHQL_URL or EXPO_PUBLIC_SUPABASE_URL in Expo Dashboard Secrets.'
      );
      errorHandler.handleError(error, true, 'Apollo Fetch - Empty URL');
      throw error;
    }

    // Validate API key
    if (!config.supabaseAnonKey || config.supabaseAnonKey.trim() === '') {
      const error = new Error(
        `[Apollo] CRITICAL: Supabase API key is empty! Operation: ${(init as any)?.operationName || 'unknown'}. ` +
        'Check EXPO_PUBLIC_SUPABASE_ANON_KEY in Expo Dashboard Secrets.'
      );
      errorHandler.handleError(error, true, 'Apollo Fetch - Empty API Key');
      throw error;
    }

    // Debug: Log request details
    if (__DEV__) {
      try {
        const body = init?.body ? JSON.parse(init.body as string) : null;
        console.log('[Apollo] Fetching:', {
          url: graphqlUrl,
          operation: body?.operationName || 'unknown',
          hasApiKey: !!config.supabaseAnonKey,
        });
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Retry logic with exponential backoff
    let attempt = 0;
    const maxRetries = 3;
    const initialDelay = 500;
    
    while (attempt < maxRetries) {
      try {
        const response = await fetch(input, init);
        
        // Debug: Log response
        if (__DEV__) {
          try {
            const clonedResponse = response.clone();
            const responseText = await clonedResponse.text();
            try {
              const responseJson = JSON.parse(responseText);
              console.log('[Apollo] Response:', {
                status: response.status,
                operation: (init as any)?.operationName || 'unknown',
                hasData: !!responseJson?.data,
                hasErrors: !!responseJson?.errors,
                errors: responseJson?.errors,
                attempt: attempt + 1,
              });
            } catch {
              console.log('[Apollo] Response (non-JSON):', response.status, responseText.substring(0, 200));
            }
          } catch (e) {
            // Ignore clone errors
          }
        }

        // Retry on 5xx or 429 errors
        if (response.status >= 500 || response.status === 429) {
          if (attempt < maxRetries - 1) {
            attempt++;
            const delay = initialDelay * Math.pow(2, attempt - 1);
            if (__DEV__) {
              console.warn(`[Apollo] Retrying after ${delay}ms (attempt ${attempt}/${maxRetries})...`);
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }

        return response;
      } catch (fetchError: any) {
        attempt++;
        
        // Check if it's a network error and we should retry
        const isNetworkError = 
          fetchError?.message?.toLowerCase().includes('network') ||
          fetchError?.message?.toLowerCase().includes('failed to fetch') ||
          fetchError?.message?.toLowerCase().includes('timeout');
        
        if (isNetworkError && attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt - 1);
          if (__DEV__) {
            console.warn(`[Apollo] Network error, retrying after ${delay}ms (attempt ${attempt}/${maxRetries})...`, fetchError.message);
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (__DEV__) {
          console.error('[Apollo] Fetch error:', {
            url: graphqlUrl,
            error: fetchError.message,
            operation: (init as any)?.operationName || 'unknown',
            attempt,
          });
        }
        throw fetchError;
      }
    }
    
    throw new Error('Max retries exceeded');
  },
});

// Auth Link - Add API key to headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      apikey: config.supabaseAnonKey || '',
    },
  };
});

// Error Link
const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, networkError, operation } = errorResponse;
  
  if (graphQLErrors) {
    graphQLErrors.forEach((error: any) => {
      const err = new Error(
        `[Apollo] GraphQL error: ${error.message} at ${error.path?.join('.')}`
      );
      errorHandler.handleError(err, false, `GraphQL Error: ${operation?.operationName || 'unknown'}`);
      
      if (__DEV__) {
        console.error(
          `[Apollo] GraphQL error: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`
        );
      }
    });
  }

  if (networkError) {
    const err = new Error(
      `[Apollo] Network error: ${networkError.message}`
    );
    errorHandler.handleError(err, false, `Network Error: ${operation?.operationName || 'unknown'}`);
    
    if (__DEV__) {
      console.error(`[Apollo] Network error:`, networkError);
    }
  }
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          storesCollection: {
            merge(existing = { edges: [] }, incoming = { edges: [] }) {
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network' as FetchPolicy,
      errorPolicy: 'all' as const,
    },
    query: {
      fetchPolicy: 'cache-and-network' as FetchPolicy,
      errorPolicy: 'all' as const,
    },
    mutate: {
      errorPolicy: 'all' as const,
    },
  },
});
