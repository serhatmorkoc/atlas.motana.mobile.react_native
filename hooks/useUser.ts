import { useQuery, useMutation } from '@apollo/client/react';
import { useAuthUser } from './useAuthUser';
import { GET_USER } from '@/lib/apollo/queries/user';
import { UPDATE_USER_PROFILE } from '@/lib/apollo/mutations/user';
import { useCallback, useMemo } from 'react';

/**
 * Hook to fetch and update user profile using Apollo
 */
export const useUser = (userId?: string) => {
  const { userId: authUserId, loading: authLoading } = useAuthUser();
  const finalUserId = userId || authUserId;
  const shouldSkip = authLoading || !finalUserId;
  
  const { data, loading, error, refetch: refetchQuery } = useQuery(GET_USER, {
    variables: { id: finalUserId || '00000000-0000-0000-0000-000000000000' },
    skip: shouldSkip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const [updateProfileMutation, { loading: isUpdating }] = useMutation(UPDATE_USER_PROFILE, {
    refetchQueries: [{ query: GET_USER, variables: { id: finalUserId } }],
  });

  const user = useMemo(() => {
    if (shouldSkip) return null;
    return data?.usersCollection?.edges?.[0]?.node || null;
  }, [data, shouldSkip]);

  const refetch = useCallback(async () => {
    await refetchQuery();
  }, [refetchQuery]);

  const updateProfile = useCallback(async (updates: { name?: string; phone?: string; avatar?: string }) => {
    if (!finalUserId) return { success: false, error: 'User ID is required' };
    try {
      const { data: response } = await updateProfileMutation({
        variables: { 
          id: finalUserId, 
          full_name: updates.name,
          phone: updates.phone,
          avatar_url: updates.avatar,
        },
      });
      if (response?.updateusersCollection?.records?.[0]) {
        return { success: true, user: response.updateusersCollection.records[0] };
      } else {
        return { success: false, error: 'Failed to update profile' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }, [finalUserId, updateProfileMutation]);

  const isLoading = authLoading || (shouldSkip ? false : loading);

  return {
    user,
    loading: isLoading,
    error: error as Error | null,
    refetch,
    updateProfile,
    updating: isUpdating,
  };
};
