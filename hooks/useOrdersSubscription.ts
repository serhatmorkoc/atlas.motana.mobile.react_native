/**
 * Hook to subscribe to orders table changes via Supabase Realtime
 * Listens for INSERT, UPDATE, DELETE events and triggers refetch
 */
import { useRef, useCallback, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { logger } from '@/utils/logger';
import { useAuthUser } from './useAuthUser';

interface UseOrdersSubscriptionOptions {
  userId?: string;
  onOrdersChange?: () => void; // Callback when orders change (for refetch)
  enabled?: boolean;
}

/**
 * Hook to subscribe to orders table changes for a specific user
 * Note: This hook returns a setup function that should be called in useFocusEffect
 * 
 * @param options Configuration options
 * @returns Function to setup subscription (call in useFocusEffect)
 */
export function useOrdersSubscription(
  options: UseOrdersSubscriptionOptions = {}
): () => () => void {
  const { userId: authUserId } = useAuthUser();
  const {
    userId = authUserId || '',
    onOrdersChange,
    enabled = true,
  } = options;

  const channelRef = useRef<ReturnType<typeof supabaseClient.channel> | null>(null);
  const intentionalCloseRef = useRef(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  // Store callback in ref to avoid recreating subscription on every render
  const onOrdersChangeRef = useRef(onOrdersChange);

  // Update ref when callback changes (keep render phase pure)
  useEffect(() => {
    onOrdersChangeRef.current = onOrdersChange;
  }, [onOrdersChange]);

  // Function to setup subscription - memoized with useCallback
  const setupSubscription = useCallback(() => {
    // Cleanup existing subscription if any
    if (channelRef.current) {
      intentionalCloseRef.current = true;
      supabaseClient.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    retryCountRef.current = 0;

    if (!enabled || !userId) {
      return () => { }; // No-op cleanup
    }

    // Create a channel for orders changes
    const channel = supabaseClient
      .channel(`orders:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const orderId = (payload.new as { id?: string })?.id || (payload.old as { id?: string })?.id;

          logger.debug('Orders', `${payload.eventType} event for order:`, orderId);

          // Trigger refetch when orders change
          // Use ref to get latest callback without recreating subscription
          const callback = onOrdersChangeRef.current;
          if (callback) {
            // Call directly to avoid delayed calls after screen blur/unmount
            callback();
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          retryCountRef.current = 0;
          logger.debug('Orders', `Subscribed to orders changes for user ${userId}`);
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Orders', 'Channel subscription error');
        } else if (status === 'TIMED_OUT') {
          logger.warn('Orders', 'Channel subscription timed out');
        } else if (status === 'CLOSED') {
          // `CLOSED` can happen during normal cleanup (screen blur/unmount).
          // Don't spam WARN logs for expected teardown.
          if (intentionalCloseRef.current) {
            intentionalCloseRef.current = false;
            logger.debug('Orders', 'Channel subscription closed (intentional)');
            return;
          }

          // If it's unexpected, try to resubscribe with a simple backoff.
          logger.warn('Orders', 'Channel subscription closed');
          const attempt = retryCountRef.current + 1;
          retryCountRef.current = attempt;
          const delayMs = Math.min(30000, 500 * Math.pow(2, attempt - 1)); // 0.5s, 1s, 2s, ... max 30s

          if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = setTimeout(() => {
            // Only retry if we still have a channel ref and subscription is enabled for this user.
            if (!enabled || !userId) return;
            const ch = channelRef.current;
            if (!ch) return;
            try {
              logger.debug('Orders', `Retrying subscription (attempt ${attempt})...`);
              ch.subscribe();
            } catch (e) {
              logger.error('Orders', 'Failed to retry subscription:', e);
            }
          }, delayMs);
        }
      });

    channelRef.current = channel;

    // Return cleanup function
    return () => {
      if (channelRef.current) {
        intentionalCloseRef.current = true;
        supabaseClient.removeChannel(channelRef.current);
        channelRef.current = null;
        logger.debug('Orders', `Unsubscribed from orders changes for user ${userId}`);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      retryCountRef.current = 0;
    };
  }, [userId, enabled]);

  return setupSubscription;
}
