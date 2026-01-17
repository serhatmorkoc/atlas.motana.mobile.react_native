import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USER_BY_ID } from "@/lib/apollo/queries/users";
import { UPDATE_USER_PROFILE } from "@/lib/apollo/mutations/users";
import React from "react";
import { useAuthUser } from "./useAuthUser";

interface UserNode {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface GetUserByIdData {
  usersCollection: {
    edges: Array<{
      node: UserNode;
    }>;
  };
}

interface UpdateUserProfileData {
  updateusersCollection: {
    records: UserNode[];
  };
}

/**
 * Hook to fetch and update user profile
 */
export const useUser = (userId?: string) => {
  const { userId: authUserId, loading: authLoading } = useAuthUser();
  const finalUserId = userId || authUserId;
  
  // If user is logged in, we MUST have a userId. Only skip if auth is still loading
  // or if we explicitly don't have a userId (user not logged in)
  const shouldSkip = authLoading || !finalUserId;
  
  const { data, loading, error, refetch } = useQuery<GetUserByIdData>(
    GET_USER_BY_ID,
    {
      variables: { id: finalUserId || '' }, // Will only be used if shouldSkip is false
      fetchPolicy: 'no-cache', // Always fetch fresh data for profile
      skip: shouldSkip, // Skip query if auth is loading or no user ID
    }
  );

  const [updateProfileMutation, { loading: updating }] = useMutation<UpdateUserProfileData>(
    UPDATE_USER_PROFILE
  );

  const user = React.useMemo(() => {
    return data?.usersCollection?.edges?.[0]?.node || null;
  }, [data]);

  const updateProfile = async (updates: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    if (!finalUserId) {
      return { success: false, error: 'User ID is required' };
    }

    try {
      const { data: result } = await updateProfileMutation({
        variables: {
          id: finalUserId,
          ...updates,
        },
      });
      
      if (result?.updateusersCollection?.records?.[0]) {
        await refetch();
        return { success: true, user: result.updateusersCollection.records[0] };
      }
      return { success: false, error: 'Failed to update profile' };
    } catch (e) {
      console.error('Error updating profile:', e);
      return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
    }
  };

  // Combine auth loading with query loading
  const isLoading = authLoading || loading;

  return {
    user,
    loading: isLoading,
    error,
    refetch,
    updateProfile,
    updating,
  };
};
