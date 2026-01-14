// Apollo Auth Link
// This file will be used when GraphQL is integrated

/*
import { setContext } from '@apollo/client/link/context';
import { useAuthStore } from '@/stores/useAuthStore';

export const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
*/

export const authLink = null; // Placeholder

