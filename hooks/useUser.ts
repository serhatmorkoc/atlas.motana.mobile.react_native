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
  const { userId: authUserId } = useAuthUser();
  const finalUserId = userId || authUserId || null;
  
  const { data, loading, error, refetch } = useQuery<GetUserByIdData>(
    GET_USER_BY_ID,
    {
      variables: { id: finalUserId || '' },
      fetchPolicy: 'no-cache', // Always fetch fresh data for profile
      skip: !finalUserId, // Skip query if no user ID
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

  return {
    user,
    loading,
    error,
    refetch,
    updateProfile,
    updating,
  };
};
