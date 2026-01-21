import { RelayEnvironmentProvider } from "react-relay";
import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { Suspense, useEffect, useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { CartProvider } from "@/contexts/CartContext";
import { relayEnvironment } from "@/lib/relay/environment";
import LoadingScreen from "@/components/common/LoadingScreen";
import NoNetworkScreen from "@/components/common/NoNetworkScreen";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { errorHandler } from "@/services/errorHandler";
import useNetworkStatus from "@/hooks/useNetworkStatus";

// Prevent the splash screen from auto-hiding before asset loading is complete.
ExpoSplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="notifications-modal"
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
      <Stack.Screen
        name="debug-env"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="debug-errors"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

function AppContent() {
  const { isConnected, isChecking, refresh } = useNetworkStatus();

  const handleRetry = useCallback(async () => {
    const connected = await refresh();
    if (__DEV__) {
      console.log("[App] Network retry result:", connected);
    }
  }, [refresh]);

  // Show loading while checking initial network status
  if (isChecking) {
    return <LoadingScreen title="Checking connection..." subtitle="Please wait" />;
  }

  // Show no network screen if not connected
  if (!isConnected) {
    return <NoNetworkScreen onRetry={handleRetry} />;
  }

  // Show main app content
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <CartProvider>
        <Suspense fallback={<LoadingScreen title="Loading…" subtitle="Please wait" />}>
          <RootLayoutNav />
        </Suspense>
      </CartProvider>
    </RelayEnvironmentProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Initialize global error handler
    errorHandler.initialize();
    
    // Debug: Check environment variables (works in both dev and production)
    const { config } = require('@/config/env');
    const envStatus = {
      supabaseUrl: config.supabaseUrl ? '✅' : '❌',
      supabaseAnonKey: config.supabaseAnonKey ? '✅' : '❌',
      supabaseGraphqlUrl: config.supabaseGraphqlUrl ? '✅' : '❌',
      googleMapsApiKey: config.googleMapsApiKey ? '✅' : '❌',
    };
    
    // Log in both dev and production (for debugging)
    console.log('[App] Environment check:', envStatus);
    
    // In production, you can also access this via /debug-env route
    
    ExpoSplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppContent />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
