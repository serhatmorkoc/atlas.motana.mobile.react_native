import { router, Stack, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  ChefHat,
  MapPin,
  Navigation,
  Package,
  Store,
  Utensils,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DeliveryCard, EstimateCard, CourierCard, OrderSteps, OrderStep } from "@/components/order-tracking";
import { useOrder } from "@/hooks/useOrder";
import { DBOrderStatus } from "@/types/order.types";
import LoadingScreen from "@/components/common/LoadingScreen";

interface CourierInfo {
  name: string;
  phone: string;
  vehicleType: string;
  plateNumber: string;
}

const COURIER_INFO: CourierInfo = {
  name: "Luke Skywalker",
  phone: "+90 555 123 4567",
  vehicleType: "Motorcycle",
  plateNumber: "34 ABC 123",
};

/**
 * Map DB order status to step index
 * PENDING -> 0 (confirmed)
 * CONFIRMED -> 1 (accepted)
 * PREPARING -> 2 (preparing)
 * READY -> 3 (ready)
 * ON_WAY -> 5 (on_the_way)
 * DELIVERED -> 7 (delivered)
 * CANCELLED -> -1 (show cancelled state)
 */
const getStepIndexFromStatus = (status: DBOrderStatus | null): number => {
  if (!status) return 0;
  
  switch (status) {
    case 'PENDING':
      return 0; // Order Confirmed
    case 'CONFIRMED':
      return 1; // Store Accepted
    case 'PREPARING':
      return 2; // Preparing Your Order
    case 'READY':
      return 3; // Order Ready
    case 'ON_WAY':
      return 5; // On The Way (skip picked_up step 4)
    case 'DELIVERED':
      return 7; // Delivered
    case 'CANCELLED':
      return -1; // Cancelled
    default:
      return 0;
  }
};

export default function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    orderId: string;
    storeName?: string;
    storeImage?: string;
    total?: string;
    address?: string;
    estimatedTime?: string;
    itemCount?: string;
  }>();

  // Fetch order data from DB
  const { order, loading, error, refetch } = useOrder(params.orderId || null);

  // Refetch order when screen comes into focus (e.g., navigating back from another screen)
  useFocusEffect(
    useCallback(() => {
      if (params.orderId) {
        console.log('[Order Tracking] Screen focused, refetching order...');
        refetch();
      }
    }, [params.orderId, refetch])
  );

  // Calculate step index from order status
  const currentStepIndex = useMemo(() => {
    if (!order?.rawStatus) return 0;
    return getStepIndexFromStatus(order.rawStatus);
  }, [order?.rawStatus]);

  // Calculate estimated minutes from order data
  const estimatedMinutes = useMemo(() => {
    if (order?.estimatedTime) {
      const minutes = parseInt(order.estimatedTime.replace(' min', ''), 10);
      return isNaN(minutes) ? 30 : minutes;
    }
    return parseInt(params.estimatedTime || "30", 10);
  }, [order?.estimatedTime, params.estimatedTime]);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const courierSlideAnim = useRef(new Animated.Value(50)).current;

  // Use order data from DB, fallback to params
  const displayOrderCode = order?.orderCode || `ORD-${params.orderId?.slice(-6).toUpperCase() || 'N/A'}`;
  const displayStoreName = order?.storeName || params.storeName || 'Store';
  const displayStoreImage = order?.storeImage || params.storeImage || '';
  const displayTotal = order?.totalPrice?.replace('₺', '') || params.total || '0';
  const displayAddress = order?.deliveryAddress || params.address || 'Address not available';
  const displayItemCount = order?.items.length.toString() || params.itemCount || '0';

  const orderSteps: OrderStep[] = [
    {
      id: "confirmed",
      title: "Order Confirmed",
      subtitle: "Your order has been received",
      icon: <CheckCircle2 size={20} color="#FFFFFF" strokeWidth={2.5} />,
      time: "Just now",
      isCompleted: currentStepIndex > 0,
      isActive: currentStepIndex === 0,
    },
    {
      id: "accepted",
      title: "Store Accepted",
      subtitle: "The store is preparing your order",
      icon: <Store size={20} color="#FFFFFF" strokeWidth={2} />,
      time: currentStepIndex >= 1 ? "2 min ago" : undefined,
      isCompleted: currentStepIndex > 1,
      isActive: currentStepIndex === 1,
    },
    {
      id: "preparing",
      title: "Preparing Your Order",
      subtitle: "The chef is cooking your food",
      icon: <ChefHat size={20} color="#FFFFFF" strokeWidth={2} />,
      time: currentStepIndex >= 2 ? "5 min ago" : undefined,
      isCompleted: currentStepIndex > 2,
      isActive: currentStepIndex === 2,
    },
    {
      id: "ready",
      title: "Order Ready",
      subtitle: "Waiting for courier pickup",
      icon: <Package size={20} color="#FFFFFF" strokeWidth={2} />,
      time: currentStepIndex >= 3 ? "8 min ago" : undefined,
      isCompleted: currentStepIndex > 3,
      isActive: currentStepIndex === 3,
    },
    {
      id: "picked_up",
      title: "Courier Picked Up",
      subtitle: `${COURIER_INFO.name} has your order`,
      icon: <Bike size={20} color="#FFFFFF" strokeWidth={2} />,
      time: currentStepIndex >= 4 ? "12 min ago" : undefined,
      isCompleted: currentStepIndex > 4,
      isActive: currentStepIndex === 4,
    },
    {
      id: "on_the_way",
      title: "On The Way",
      subtitle: "Your order is en route to you",
      icon: <Navigation size={20} color="#FFFFFF" strokeWidth={2} />,
      time: currentStepIndex >= 5 ? "15 min ago" : undefined,
      isCompleted: currentStepIndex > 5,
      isActive: currentStepIndex === 5,
    },
    {
      id: "arriving",
      title: "Almost There",
      subtitle: "Courier is nearby",
      icon: <MapPin size={20} color="#FFFFFF" strokeWidth={2} />,
      time: currentStepIndex >= 6 ? "Just now" : undefined,
      isCompleted: currentStepIndex > 6,
      isActive: currentStepIndex === 6,
    },
    {
      id: "delivered",
      title: "Delivered",
      subtitle: "Enjoy your meal!",
      icon: <Utensils size={20} color="#FFFFFF" strokeWidth={2} />,
      time: currentStepIndex >= 7 ? "Now" : undefined,
      isCompleted: currentStepIndex >= 7,
      isActive: currentStepIndex === 7,
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStepIndex / (orderSteps.length - 1),
      duration: 800,
      useNativeDriver: false,
    }).start();

    if (currentStepIndex >= 4) {
      Animated.spring(courierSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  // Update estimated minutes countdown
  useEffect(() => {
    const interval = setInterval(() => {
      // Countdown is handled by estimated_delivery_time calculation
      // No need to manually decrement
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const showCourierInfo = currentStepIndex >= 4 && currentStepIndex < 7;
  const canCancel = currentStepIndex >= 0 && currentStepIndex < 2 && order?.rawStatus !== 'CANCELLED';
  const isCancelled = order?.rawStatus === 'CANCELLED';
  const isDelivered = order?.rawStatus === 'DELIVERED';

  if (loading) {
    return <LoadingScreen title="Loading order..." subtitle="Please wait" />;
  }

  if (error || !order) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color="#1F2937" strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Order Tracking</Text>
          </View>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load order</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#1F2937" strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Order #{displayOrderCode}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {isCancelled ? 'Cancelled' : isDelivered ? 'Delivered' : 'Live Tracking'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 16, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <DeliveryCard address={displayAddress} />

        <EstimateCard 
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          progressAnim={progressAnim}
          estimatedMinutes={estimatedMinutes}
          storeName={displayStoreName}
          storeImage={displayStoreImage}
          itemCount={displayItemCount}
          total={displayTotal}
        />

        {showCourierInfo && (
          <CourierCard 
            courier={COURIER_INFO}
            slideAnim={courierSlideAnim}
          />
        )}

        <OrderSteps steps={orderSteps} pulseAnim={pulseAnim} />

        {canCancel && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                router.dismissAll();
              }}
              activeOpacity={0.7}
            >
              <X size={18} color="#EF4444" strokeWidth={2} />
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Order Tracking Screen</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#10B981",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  screenLabel: {
    paddingVertical: 12,
    alignItems: "center" as const,
    marginTop: 16,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 32,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center" as const,
  },
  retryButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
