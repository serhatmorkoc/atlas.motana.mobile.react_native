// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { Suspense, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { CartProvider } from "@/contexts/CartContext";
import { apolloClient } from "@/lib/apollo/client";
import LoadingScreen from "@/components/common/LoadingScreen";
import {
  initializeNotificationChannels,
  requestNotificationPermissions,
  registerNotificationListeners,
  getPushNotificationToken,
  sendOrderStatusNotification,
} from "@/utils/notifications";
import { logger } from "@/utils/logger";
import { supabaseClient } from "@/lib/supabase/client";
import { DBOrderStatus } from "@/types/order.types";
import { STORE_QUERY } from "@/lib/apollo/queries/StoreQuery";


// Prevent the splash screen from auto-hiding before asset loading is complete.
ExpoSplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen
        name="search-modal"
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />

      <Stack.Screen
        name="account"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="store"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="order/confirmation"
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          animation: "slide_from_bottom",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="order/tracking"
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="test-maps"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    ExpoSplashScreen.hideAsync();
    
    let globalOrderSubscription: ReturnType<typeof supabaseClient.channel> | null = null;
    let subscriptions: ReturnType<typeof registerNotificationListeners> | null = null;
    
    // Initialize notifications and global order status listener
    const initNotifications = async () => {
      await initializeNotificationChannels();
      await requestNotificationPermissions();
      
      // Register notification listeners (for push notifications from backend)
      subscriptions = registerNotificationListeners();
      
      // Get push notification token and log it
      // TODO: Send this token to your backend and store it for the user
      // Backend should send push notifications when order status changes
      const token = await getPushNotificationToken();
      if (token) {
        logger.debug("Notification", "Push token:", token);
        // TODO: Send token to backend API
        // Example: await supabaseClient.from('user_push_tokens').upsert({ user_id, token });
      }
      
      // Get current user for global order status subscription
      const { data: { session } } = await supabaseClient.auth.getSession();
      const userId = session?.user?.id;
      
      if (userId) {
        // Setup global order status subscription - works from any screen
        globalOrderSubscription = supabaseClient
          .channel(`global-orders:${userId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE', // Only listen to UPDATE events for status changes
              schema: 'public',
              table: 'orders',
              filter: `user_id=eq.${userId}`,
            },
            async (payload) => {
              try {
                const newOrder = payload.new as {
                  id?: string;
                  order_code?: string | null;
                  order_status?: string | null;
                  store_id?: string | null;
                };
                const oldOrder = payload.old as {
                  order_status?: string | null;
                };
                
                // Only send notification if status actually changed
                if (
                  newOrder.order_status &&
                  newOrder.order_status !== oldOrder.order_status &&
                  newOrder.id
                ) {
                  const newStatus = newOrder.order_status as DBOrderStatus;
                  
                  // Fetch store name from GraphQL (we need it for notification)
                  try {
                    const { data } = await apolloClient.query({
                      query: STORE_QUERY,
                      variables: { id: newOrder.store_id },
                      fetchPolicy: 'cache-first',
                    });
                    
                    const storeName = (data as any)?.storesCollection?.edges?.[0]?.node?.name || 'Restoran';
                    
                    // Send notification - works from any screen!
                    await sendOrderStatusNotification(
                      newStatus,
                      storeName,
                      newOrder.order_code,
                      newOrder.id
                    );
                    
                    logger.debug("Notification", `Global notification sent for order ${newOrder.id}: ${newStatus}`);
                  } catch (error) {
                    logger.error("Notification", "Error fetching store for notification:", error);
                    // Send notification with generic store name if fetch fails
                    await sendOrderStatusNotification(
                      newStatus,
                      "Restoran",
                      newOrder.order_code,
                      newOrder.id
                    );
                  }
                }
              } catch (error) {
                logger.error("Notification", "Error handling order status change:", error);
              }
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              logger.debug("Notification", `Global order status subscription active for user ${userId}`);
            } else if (status === 'CHANNEL_ERROR') {
              logger.error("Notification", "Global order subscription error");
            }
          });
      }
      
      return () => {
        if (subscriptions) {
          subscriptions.foregroundSubscription.remove();
          subscriptions.responseSubscription.remove();
        }
        if (globalOrderSubscription) {
          supabaseClient.removeChannel(globalOrderSubscription);
          globalOrderSubscription = null;
        }
      };
    };
    
    const cleanup = initNotifications();
    
    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Suspense fallback={<LoadingScreen title="Loading…" subtitle="Please wait" />}>
              <RootLayoutNav />
            </Suspense>
          </GestureHandlerRootView>
        </CartProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
