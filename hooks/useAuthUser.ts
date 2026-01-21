import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

/**
 * Hook to get the current authenticated user from Supabase
 * Returns the user ID and user object
 */
export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) {
          if (__DEV__) {
            console.error('Error getting session:', error.message);
          }
          if (mounted) setUser(null);
        } else {
          if (mounted) setUser(session?.user ?? null);
        }
      } catch (error: any) {
        // Handle network errors gracefully
        if (__DEV__) {
          console.error('Auth network error:', error?.message || error);
        }
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data } = supabaseClient.auth.onAuthStateChange(
        (_event, session) => {
          if (mounted) {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        }
      );
      subscription = data.subscription;
    } catch (error: any) {
      if (__DEV__) {
        console.error('Auth listener error:', error?.message || error);
      }
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Ensure userId is a valid non-empty string, otherwise return null
  const userId = user?.id && typeof user.id === 'string' && user.id.trim() !== '' 
    ? user.id 
    : null;

  return {
    user,
    userId,
    loading,
    isAuthenticated: !!user && !!userId,
  };
};
