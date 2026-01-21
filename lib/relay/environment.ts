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
const graphqlUrl = (() => {
  if (config.supabaseGraphqlUrl) return ensureHttp(config.supabaseGraphqlUrl);
  if (config.supabaseUrl) return `${stripTrailingSlash(ensureHttp(config.supabaseUrl))}/graphql/v1`;
  return '';
})();

if (!graphqlUrl) {
  console.warn(
    '[Relay] GraphQL URL is empty. Set EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY (recommended) ' +
      'or EXPO_PUBLIC_SUPABASE_GRAPHQL_URL.'
  );
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 500,  // Start with 500ms
  maxDelayMs: 5000,     // Max 5 seconds between retries
  backoffMultiplier: 2, // Double the delay each retry
};

// Helper to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Check if error is retryable (network errors, 5xx errors)
const isRetryableError = (error: any, status?: number): boolean => {
  // Network errors (no response)
  if (error?.message?.toLowerCase().includes('network')) return true;
  if (error?.message?.toLowerCase().includes('failed to fetch')) return true;
  if (error?.message?.toLowerCase().includes('timeout')) return true;
  
  // Server errors (5xx)
  if (status && status >= 500 && status < 600) return true;
  
  // Rate limiting (429)
  if (status === 429) return true;
  
  return false;
};

// Single fetch attempt
async function attemptFetch(operation: any, variables: any): Promise<Response> {
  return fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.supabaseAnonKey || '',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });
}

// Network layer for Relay with retry logic
async function fetchQuery(operation: any, variables: any, cacheConfig: any, uploadables: any) {
  if (!graphqlUrl) {
    return Promise.reject(new Error('GraphQL URL is not configured'));
  }

  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt <= RETRY_CONFIG.maxRetries) {
    try {
      if (attempt > 0 && __DEV__) {
        console.log(`[Relay] Retry attempt ${attempt}/${RETRY_CONFIG.maxRetries} for ${operation.name}`);
      }

      const response = await attemptFetch(operation, variables);

      if (!response.ok) {
        const status = response.status;
        
        // Check if we should retry this error
        if (isRetryableError(null, status) && attempt < RETRY_CONFIG.maxRetries) {
          const delay = Math.min(
            RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
            RETRY_CONFIG.maxDelayMs
          );
          
          if (__DEV__) {
            console.warn(`[Relay] HTTP ${status} error, retrying in ${delay}ms...`);
          }
          
          await wait(delay);
          attempt++;
          continue;
        }
        
        throw new Error(`HTTP error! status: ${status}`);
      }

      const json = await response.json();
      
      // Check for GraphQL errors that might be retryable
      if (json.errors?.some((e: any) => e.message?.toLowerCase().includes('timeout'))) {
        if (attempt < RETRY_CONFIG.maxRetries) {
          const delay = Math.min(
            RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
            RETRY_CONFIG.maxDelayMs
          );
          await wait(delay);
          attempt++;
          continue;
        }
      }

      return json;
      
    } catch (error: any) {
      lastError = error;
      
      // Check if we should retry this error
      if (isRetryableError(error) && attempt < RETRY_CONFIG.maxRetries) {
        const delay = Math.min(
          RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
          RETRY_CONFIG.maxDelayMs
        );
        
        if (__DEV__) {
          console.warn(`[Relay] Network error: ${error.message}, retrying in ${delay}ms...`);
        }
        
        await wait(delay);
        attempt++;
        continue;
      }
      
      // Non-retryable error or max retries reached
      break;
    }
  }

  // All retries exhausted
  if (__DEV__) {
    console.error('[Relay] All retry attempts failed for:', operation.name);
    console.error('[Relay] Last error:', lastError?.message);
  }
  
  throw lastError || new Error('Request failed after multiple retries');
}

// Create Relay Environment
export const relayEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
