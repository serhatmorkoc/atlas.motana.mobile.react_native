// Apollo Client setup
// This file will be used when GraphQL is integrated
// Currently, this is a placeholder structure

/*
import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { authLink } from './links/authLink';
import { errorLink } from './links/errorLink';
import { httpLink } from './links/httpLink';

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
*/

export const apolloClient = null; // Placeholder - will be implemented when GraphQL is integrated

