import { useLazyLoadQuery, useMutation } from 'react-relay';
import { useAuthUser } from './useAuthUser';
import { userQuery } from '@/lib/relay/queries/UserQuery';
import { updateUserProfileMutation } from '@/lib/relay/mutations/UpdateUserProfileMutation';
import { useCallback, useMemo, useState } from 'react';
import type { UserQuery } from '@/__generated__/UserQuery.graphql';
import type { UpdateUserProfileMutation } from '@/__generated__/UpdateUserProfileMutation.graphql';

/**
 * Hook to fetch and update user profile using Relay
 */
export const useUser = (userId?: string) => {
  const { userId: authUserId, loading: authLoading } = useAuthUser();
  const finalUserId = userId || authUserId;
  const shouldSkip = authLoading || !finalUserId;
  
  const [refetchKey, setRefetchKey] = useState(0);

  const data = useLazyLoadQuery<UserQuery>(
    userQuery,
    { id: finalUserId || '00000000-0000-0000-0000-000000000000' },
    { 
      fetchPolicy: 'store-and-network',
      fetchKey: shouldSkip ? 'skip' : `${finalUserId}-${refetchKey}`,
    }
  );

  const [commitUpdateProfile, isUpdating] = useMutation<UpdateUserProfileMutation>(updateUserProfileMutation);

  const user = useMemo(() => {
    if (shouldSkip) return null;
    return data?.usersCollection?.edges?.[0]?.node || null;
  }, [data, shouldSkip]);

  const refetch = useCallback(async () => {
    setRefetchKey(prev => prev + 1);
  }, []);

  const updateProfile = useCallback(async (updates: { name?: string; phone?: string; avatar?: string }) => {
    if (!finalUserId) return { success: false, error: 'User ID is required' };
    return new Promise<{ success: boolean; error?: string; user?: unknown }>((resolve) => {
      commitUpdateProfile({
        variables: { id: finalUserId, ...updates },
        onCompleted: (response) => {
          if (response?.updateusersCollection?.records?.[0]) {
            resolve({ success: true, user: response.updateusersCollection.records[0] });
          } else resolve({ success: false, error: 'Failed to update profile' });
        },
        onError: (error) => resolve({ success: false, error: error.message || 'Unknown error' }),
      });
    });
  }, [finalUserId, commitUpdateProfile]);

  const isLoading = authLoading || (shouldSkip ? false : !data);

  return {
    user,
    loading: isLoading,
    error: null,
    refetch,
    updateProfile,
    updating: isUpdating,
  };
};
