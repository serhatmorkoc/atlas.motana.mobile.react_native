// Hook to subscribe to order status changes via Supabase Realtime
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabaseClient } from '@/lib/supabase/client';
import { sendOrderStatusNotification } from '@/services/notification.service';
import { DBOrderStatus } from '@/types/order.types';
import { logger } from '@/utils/logger';
import { useAuthUser } from './useAuthUser';

interface OrderStatusUpdate {
  id: string;
  order_code: string | null;
  order_status: string | null;
  store_id: string | null;
}

interface UseOrderStatusSubscriptionOptions {
  userId?: string;
  onStatusChange?: (orderId: string, newStatus: DBOrderStatus | null, orderCode: string | null, storeName?: string) => void;
  enabled?: boolean;
}

/**
 * Hook to subscribe to order status changes for a specific user
 * 
 * @param options Configuration options
 * @returns Object with subscription status and cleanup function
 */
export function useOrderStatusSubscription(options: UseOrderStatusSubscriptionOptions = {}) {
  const { userId: authUserId } = useAuthUser();
  const {
    userId = authUserId || '',
    onStatusChange,
    enabled = true,
  } = options;

  const channelRef = useRef<ReturnType<typeof supabaseClient.channel> | null>(null);
  const previousStatusesRef = useRef<Map<string, string | null>>(new Map());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    /**
     * Polling fallback for background mode
     * Checks order status every 30 seconds when app is in background
     */
    const startPolling = () => {
      if (pollingIntervalRef.current) {
        logger.debug('OrderStatus', 'Polling already active');
        return; // Already polling
      }

      logger.debug('OrderStatus', 'Starting polling (30s interval)');

      // First poll immediately
      pollOrders();

      pollingIntervalRef.current = setInterval(() => {
        pollOrders();
      }, 15000); // Poll every 15 seconds (reduced for testing)
    };

    const pollOrders = async () => {
      try {
        logger.debug('OrderStatus', 'Polling orders...');

        // Fetch latest orders for this user
        const { data, error } = await supabaseClient
          .from('orders')
          .select('id, order_code, order_status, store_id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          logger.error('OrderStatus', 'Polling error:', error);
          return;
        }

        if (!data || data.length === 0) {
          logger.debug('OrderStatus', 'No orders found in polling');
          return;
        }

        logger.debug('OrderStatus', `Polling found ${data.length} orders`);

        // Check for status changes
        for (const order of data) {
          const currentStatus = order.order_status;
          const previousStatus = previousStatusesRef.current.get(order.id);

          // If status changed, send notification
          if (previousStatus !== undefined && previousStatus !== currentStatus) {
            logger.debug(
              'OrderStatus',
              `Polling detected status change for order ${order.order_code || order.id}: ${previousStatus} -> ${currentStatus}`
            );

            // Fetch store name
            let storeName = 'Store';
            try {
              if (order.store_id) {
                const { data: storeData } = await supabaseClient
                  .from('stores')
                  .select('name')
                  .eq('id', order.store_id)
                  .single();

                if (storeData?.name) {
                  storeName = storeData.name;
                }
              }
            } catch (error) {
              logger.error('OrderStatus', 'Failed to fetch store name:', error);
            }

            const newStatus = (currentStatus?.toUpperCase() || null) as DBOrderStatus | null;
            if (newStatus) {
              logger.debug('OrderStatus', `Sending notification for status: ${newStatus}`);
              await sendOrderStatusNotification(newStatus, order.order_code, storeName);
            }

            if (onStatusChange) {
              onStatusChange(order.id, newStatus, order.order_code, storeName);
            }
          }

          // Update tracking (even if status didn't change, to track initial state)
          previousStatusesRef.current.set(order.id, currentStatus);
        }
      } catch (error) {
        logger.error('OrderStatus', 'Polling failed:', error);
      }
    };

    // Listen to app state changes to ensure subscription works in background
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // Only process if state actually changed
      if (appStateRef.current === nextAppState) {
        return;
      }

      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;

      logger.debug('OrderStatus', `AppState changed: ${previousState} -> ${nextAppState}`);

      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Reconnect if app comes to foreground and subscription was lost
      if (nextAppState === 'active' && channelRef.current) {
        // Stop polling when app becomes active (use Realtime instead)
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          logger.debug('OrderStatus', 'Stopped polling, using Realtime subscription');
        }

        // Add a small delay to ensure app is fully active
        reconnectTimeoutRef.current = setTimeout(() => {
          const channel = channelRef.current;
          if (!channel) return;

          // Check subscription status
          const subscriptionState = (channel as unknown as { state?: string }).state || 'unknown';
          logger.debug('OrderStatus', `Channel state: ${subscriptionState}`);

          // Reconnect if needed
          if (subscriptionState === 'closed' || subscriptionState === 'errored' || subscriptionState === 'timed_out') {
            logger.debug('OrderStatus', 'Reconnecting subscription after app became active');
            try {
              channel.subscribe();
            } catch (error) {
              logger.error('OrderStatus', 'Failed to reconnect:', error);
            }
          }
        }, 500);
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Start polling when app goes to background (Realtime WebSocket may be disconnected)
        if (!pollingIntervalRef.current) {
          logger.debug('OrderStatus', 'App went to background, starting polling fallback');
          startPolling();
        }
      }
    });

    // Create a channel for order status updates
    const channel = supabaseClient
      .channel(`order_status:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const newRecord = payload.new as OrderStatusUpdate;
          const oldRecord = payload.old as OrderStatusUpdate;

          // Only process if order_status actually changed
          if (newRecord.order_status !== oldRecord.order_status) {
            const newStatus = (newRecord.order_status?.toUpperCase() || null) as DBOrderStatus | null;
            const previousStatus = previousStatusesRef.current.get(newRecord.id);

            // Update our tracking
            previousStatusesRef.current.set(newRecord.id, newRecord.order_status);

            // Only send notification if status changed (not initial load)
            // previousStatus will be undefined on first load, so we skip notification
            if (previousStatus !== undefined && previousStatus !== newRecord.order_status) {
              logger.debug(
                'OrderStatus',
                `Order ${newRecord.order_code || newRecord.id} status changed: ${oldRecord.order_status} -> ${newRecord.order_status}`
              );

              // Fetch store name for notification
              let storeName = 'Store';
              try {
                if (newRecord.store_id) {
                  const { data: storeData } = await supabaseClient
                    .from('stores')
                    .select('name')
                    .eq('id', newRecord.store_id)
                    .single();

                  if (storeData?.name) {
                    storeName = storeData.name;
                  }
                }
              } catch (error) {
                logger.error('OrderStatus', 'Failed to fetch store name for notification:', error);
              }

              // Send notification if status is meaningful (not null)
              if (newStatus) {
                await sendOrderStatusNotification(
                  newStatus,
                  newRecord.order_code,
                  storeName
                );
              }

              // Call custom callback if provided
              if (onStatusChange) {
                onStatusChange(newRecord.id, newStatus, newRecord.order_code, storeName);
              }
            }
            // If previousStatus is undefined, this is the first time we see this order
            // Just track it, don't send notification
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.debug('OrderStatus', `Subscribed to order updates for user ${userId}`);
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('OrderStatus', 'Channel subscription error');
        } else if (status === 'TIMED_OUT') {
          logger.warn('OrderStatus', 'Channel subscription timed out');
        } else if (status === 'CLOSED') {
          logger.warn('OrderStatus', 'Channel subscription closed');
        }
      });

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      subscription.remove();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (channelRef.current) {
        supabaseClient.removeChannel(channelRef.current);
        logger.debug('OrderStatus', `Unsubscribed from order updates for user ${userId}`);
      }
    };
  }, [userId, enabled, onStatusChange]);

  return {
    isSubscribed: channelRef.current !== null,
  };
}
