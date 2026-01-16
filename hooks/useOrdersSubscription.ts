/**
 * Hook to subscribe to orders table changes via Supabase Realtime
 * Listens for INSERT, UPDATE, DELETE events and triggers refetch
 */
import { useRef, useCallback, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { logger } from '@/utils/logger';

const HARDCODE_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02";

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
  const {
    userId = HARDCODE_USER_ID,
    onOrdersChange,
    enabled = true,
  } = options;

  const channelRef = useRef<ReturnType<typeof supabaseClient.channel> | null>(null);
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
      supabaseClient.removeChannel(channelRef.current);
      channelRef.current = null;
    }

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
          logger.debug('Orders', `Subscribed to orders changes for user ${userId}`);
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Orders', 'Channel subscription error');
        } else if (status === 'TIMED_OUT') {
          logger.warn('Orders', 'Channel subscription timed out');
        } else if (status === 'CLOSED') {
          logger.warn('Orders', 'Channel subscription closed');
        }
      });

    channelRef.current = channel;

    // Return cleanup function
    return () => {
      if (channelRef.current) {
        supabaseClient.removeChannel(channelRef.current);
        channelRef.current = null;
        logger.debug('Orders', `Unsubscribed from orders changes for user ${userId}`);
      }
    };
  }, [userId, enabled]);

  return setupSubscription;
}
