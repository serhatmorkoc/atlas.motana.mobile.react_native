import { useQuery, useMutation } from '@apollo/client/react';
import { useAuthUser } from './useAuthUser';
import { USER_QUERY } from '@/lib/apollo/queries/UserQuery';
import { UPDATE_USER_PROFILE_MUTATION } from '@/lib/apollo/mutations/UpdateUserProfileMutation';
import { useCallback, useMemo } from 'react';

/**
 * Hook to fetch and update user profile using Apollo
 */
export const useUser = (userId?: string) => {
  const { userId: authUserId, loading: authLoading } = useAuthUser();
  const finalUserId = userId || authUserId;
  const shouldSkip = authLoading || !finalUserId;
  
  const { data, loading, error, refetch: apolloRefetch } = useQuery(USER_QUERY, {
    variables: { id: finalUserId || '00000000-0000-0000-0000-000000000000' },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [updateProfileMutation, { loading: isUpdating }] = useMutation(UPDATE_USER_PROFILE_MUTATION, {
    refetchQueries: [{ query: USER_QUERY, variables: { id: finalUserId } }],
  });

  const user = useMemo(() => {
    if (shouldSkip) return null;
    return (data as any)?.usersCollection?.edges?.[0]?.node || null;
  }, [data, shouldSkip]);

  const refetch = useCallback(async () => {
    await apolloRefetch();
  }, [apolloRefetch]);

  const updateProfile = useCallback(async (updates: any) => {
    if (!finalUserId) return { success: false, error: 'User ID is required' };
    try {
      const response = await updateProfileMutation({
        variables: { id: finalUserId, ...updates },
      });
      if ((response.data as any)?.updateusersCollection?.records?.[0]) {
        return { success: true, user: (response.data as any).updateusersCollection.records[0] };
      } else {
        return { success: false, error: 'Failed to update profile' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [finalUserId, updateProfileMutation]);

  const isLoading = authLoading || loading;

  return {
    user,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
    updateProfile,
    updating: isUpdating,
  };
};
