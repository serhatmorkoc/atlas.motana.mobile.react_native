// template
import { Tabs } from "expo-router";
import { Home, Search, ShoppingBag, User, ShoppingCart } from "lucide-react-native";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCart } from "@/contexts/CartContext";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabaseClient } from "@/lib/supabase/client";

export default function TabLayout() {
  const { totalItems } = useCart();
  const { userId, loading: authLoading } = useAuthUser();
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof supabaseClient.channel> | null>(null);

  const fetchActiveOrdersCount = useCallback(async () => {
    if (!userId) {
      setActiveOrdersCount(0);
      return;
    }

    // Active statuses for UI "in_progress"
    const activeStatuses = ["PENDING", "CONFIRMED", "PREPARING", "READY", "ON_WAY"];

    const { data, error } = await supabaseClient
      .from("orders")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .in("order_status", activeStatuses);

    if (error) {
      // Don't spam logs; just keep badge silent on errors.
      return;
    }

    // Supabase returns rows in data, count may not be present depending on settings.
    setActiveOrdersCount(Array.isArray(data) ? data.length : 0);
  }, [userId]);

  // Keep Orders badge in sync without suspending Tabs layout.
  useEffect(() => {
    let cancelled = false;

    if (authLoading) return;

    // Reset any existing channel.
    if (channelRef.current) {
      supabaseClient.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // No user -> no badge.
    if (!userId) {
      setActiveOrdersCount(0);
      return;
    }

    // Initial fetch
    fetchActiveOrdersCount().catch(() => {
      // ignore
    });

    const channel = supabaseClient
      .channel(`orders_badge:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          if (cancelled) return;
          fetchActiveOrdersCount().catch(() => {
            // ignore
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabaseClient.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [authLoading, userId, fetchActiveOrdersCount]);

  return (
    <Suspense fallback={<LoadingScreen title="Loading…" subtitle="Please wait" />}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FF6B35",
          tabBarInactiveTintColor: "#9CA3AF",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
            height: 85,
            paddingTop: 8,
            paddingBottom: 28,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500" as const,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size }) => (
              <View>
                <ShoppingBag color={color} size={size} />
                {activeOrdersCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{activeOrdersCount}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="checkout"
          options={{
            title: "Checkout",
            tabBarIcon: ({ color, size }) => (
              <View>
                <ShoppingCart color={color} size={size} />
                {totalItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalItems}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute" as const,
    top: -4,
    right: -8,
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700" as const,
  },
});
