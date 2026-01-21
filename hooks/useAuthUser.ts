import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';

/**
 * Hook to get the current authenticated user from Supabase
 * Returns the user ID and user object
 */
export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        // If there's an error, check if it's a critical auth error
        if (error) {
          // If session exists despite error, try to use it (might be a token refresh issue)
          if (session?.user) {
            console.warn('[Auth] Session error but session exists, using existing session:', error.message);
            setUser(session.user);
            setLoading(false);
            return;
          }
          
          // Only clear session if error is critical and no session exists
          const isCriticalError = 
            error.message?.includes('Refresh Token') || 
            error.message?.includes('Invalid') ||
            error.message?.includes('JWT');
          
          if (isCriticalError) {
            console.warn('[Auth] Critical session error, clearing invalid session:', error.message);
            try {
              await supabaseClient.auth.signOut();
            } catch (signOutError) {
              console.debug('[Auth] Error during signOut cleanup:', signOutError);
            }
            setUser(null);
          } else {
            // Non-critical error, just log it
            console.warn('[Auth] Non-critical session error:', error.message);
            setUser(null);
          }
          setLoading(false);
          return;
        }
        
        // No error, use the session
        setUser(session?.user ?? null);
      } catch (error) {
        // Handle unexpected errors
        console.error('[Auth] Unexpected error getting session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          // Token refresh failed, clear session
          console.warn('[Auth] Token refresh failed, clearing session');
          try {
            await supabaseClient.auth.signOut();
          } catch (error) {
            console.debug('[Auth] Error during signOut after token refresh failure:', error);
          }
          setUser(null);
        } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
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
