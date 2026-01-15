export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseGraphqlUrl: process.env.EXPO_PUBLIC_SUPABASE_GRAPHQL_URL || '',
  graphqlUrl: process.env.EXPO_PUBLIC_GRAPHQL_URL || '',
  env: process.env.NODE_ENV || 'development',
  isDev: __DEV__,
  apiTimeout: 10000,
  appVersion: '1.0.0',
} as const;

export type Config = typeof config;

