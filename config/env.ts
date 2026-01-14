/**
 * Environment configuration
 */

export const config = {
  // GraphQL URL (will be used when GraphQL is integrated)
  graphqlUrl: process.env.EXPO_PUBLIC_GRAPHQL_URL || 'https://api.motana.com/graphql',
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDev: __DEV__,
  
  // API timeout
  apiTimeout: 10000,
  
  // App version
  appVersion: '1.0.0',
} as const;

export type Config = typeof config;

