// Apollo Cache configuration
// This file will be used when GraphQL is integrated

/*
import { InMemoryCache } from '@apollo/client';

export const cacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        stores: {
          keyArgs: ['filter'],
          merge(existing = [], incoming, { args }) {
            if (args?.offset === 0) {
              return incoming;
            }
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
};
*/

export const cacheConfig = {}; // Placeholder

