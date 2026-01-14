// Apollo Error Link
// This file will be used when GraphQL is integrated

/*
import { onError } from '@apollo/client/link/error';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});
*/

export const errorLink = null; // Placeholder

