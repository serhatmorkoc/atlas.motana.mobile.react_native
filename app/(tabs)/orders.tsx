import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Package,
  RotateCcw,
} from "lucide-react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Order, DBOrderStatus } from "@/types/order.types";
import { formatDate } from "@/utils/formatters";
import { useOrders } from "@/hooks/useOrders";
import { useOrdersSubscription } from "@/hooks/useOrdersSubscription";
import LoadingScreen from "@/components/common/LoadingScreen";
import { RefreshControl } from "react-native";
import { ORDER_STATUS_COLORS } from "@/constants/orderStatus";
import { optimizeImageUrl } from "@/utils/helpers";

type FilterType = "all" | "in_progress" | "delivered" | "cancelled";

const filterOptions: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_progress", label: "Active" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  
  const { orders, loading, error, refetch } = useOrders();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [minLoadingElapsed, setMinLoadingElapsed] = useState(false);

  // Subscribe to realtime orders changes
  // Use useCallback to prevent subscription recreation on every render
  const handleOrdersChange = useCallback(() => {
    // Refetch orders when realtime change detected
    if (!isInitialLoad) {
      refetch();
    }
  }, [isInitialLoad, refetch]);

  // Setup subscription function
  const setupSubscription = useOrdersSubscription({
    onOrdersChange: handleOrdersChange,
    enabled: true,
  });

  // Subscribe when screen is focused, unsubscribe when blurred
  useFocusEffect(
    useCallback(() => {
      // Setup subscription when tab is focused
      const cleanup = setupSubscription();

      // Cleanup subscription when tab loses focus
      return cleanup;
    }, [setupSubscription])
  );

  // Minimum loading duration to prevent flash (300ms)
  useEffect(() => {
    if (loading && isInitialLoad) {
      const timer = setTimeout(() => {
        setMinLoadingElapsed(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, isInitialLoad]);

  // Refetch orders when screen comes into focus (tab navigation)
  // This ensures status changes are visible without requiring pull-to-refresh
  useFocusEffect(
    useCallback(() => {
      if (!isInitialLoad) {
        // Silently refetch in background after initial load
        refetch();
      }
    }, [isInitialLoad, refetch])
  );

  // Mark initial load as complete when data is ready
  useEffect(() => {
    if (isInitialLoad && !loading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
        setMinLoadingElapsed(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad, loading]);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Show loading only on initial load, not on subsequent refetches
  // Also ensure minimum loading duration has elapsed to prevent flash
  const showLoading = (loading && isInitialLoad && !refreshing) || (isInitialLoad && !minLoadingElapsed);
  
  if (showLoading) {
    return <LoadingScreen title="Loading orders..." subtitle="Please wait" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load orders</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getStatusIcon = (order: Order) => {
    // Use rawStatus for icon color if available
    if (order.rawStatus) {
      const colors = ORDER_STATUS_COLORS[order.rawStatus];
      if (order.rawStatus === 'DELIVERED') {
        return <CheckCircle size={16} color={colors.textDark} />;
      }
      if (order.rawStatus === 'CANCELLED') {
        return <XCircle size={16} color={colors.textDark} />;
      }
      // For active statuses, use Clock icon
      return <Clock size={16} color={colors.textDark} />;
    }
    
    // Fallback to mapped status
    switch (order.status) {
      case "in_progress":
        return <Clock size={16} color="#F59E0B" />;
      case "delivered":
        return <CheckCircle size={16} color="#10B981" />;
      case "cancelled":
        return <XCircle size={16} color="#EF4444" />;
    }
  };

  const getStatusText = (order: Order) => {
    // Use raw DB status if available, otherwise use mapped status
    if (order.rawStatus) {
      // Format DB status for display
      const statusMap: Record<string, string> = {
        'PENDING': 'Pending',
        'CONFIRMED': 'Confirmed',
        'PREPARING': 'Preparing',
        'READY': 'Ready',
        'ON_WAY': 'On Way',
        'DELIVERED': 'Delivered',
        'CANCELLED': 'Cancelled',
      };
      return statusMap[order.rawStatus] || order.rawStatus;
    }
    
    // Fallback to mapped status
    switch (order.status) {
      case "in_progress":
        return "In Progress";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
    }
  };

  const getStatusStyle = (order: Order) => {
    // Use rawStatus for colors if available
    if (order.rawStatus && ORDER_STATUS_COLORS[order.rawStatus]) {
      const colors = ORDER_STATUS_COLORS[order.rawStatus];
      return {
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border,
      };
    }
    
    // Fallback to mapped status
    switch (order.status) {
      case "in_progress":
        return { backgroundColor: "#FEF3C7", color: "#92400E", borderColor: "rgba(234, 179, 8, 0.2)" };
      case "delivered":
        return { backgroundColor: "#D1FAE5", color: "#065F46", borderColor: "rgba(34, 197, 94, 0.2)" };
      case "cancelled":
        return { backgroundColor: "#FEE2E2", color: "#991B1B", borderColor: "rgba(239, 68, 68, 0.2)" };
    }
  };

  // formatDate moved to @/utils/formatters

  const handleOrderClick = (order: Order) => {
    if (order.status === "in_progress") {
      router.push({
        pathname: "/order/tracking" as any,
        params: {
          orderId: order.id,
          storeName: order.storeName,
          storeImage: order.storeImage,
          total: order.totalPrice.replace("₺", ""),
          address: "Delivery address here",
          estimatedTime: order.estimatedTime?.replace(" min", "") || "30",
          itemCount: order.items.length.toString(),
        },
      });
    }
  };

  const renderOrderCard = (order: Order) => {
    const statusStyle = getStatusStyle(order);
    return (
      <TouchableOpacity
        key={order.id}
        style={styles.orderCard}
        activeOpacity={0.7}
        onPress={() => handleOrderClick(order)}
      >
        <View style={styles.orderHeader}>
          <Image
            source={{ uri: optimizeImageUrl(order.storeImage) }}
            style={styles.storeImage}
            contentFit="cover"
            cachePolicy="none"
          />
          <View style={styles.orderHeaderInfo}>
            <View style={styles.storeNameRow}>
              <Text style={styles.storeName}>{order.storeName}</Text>
              {order.orderCode && (
                <Text style={styles.orderCode}>{order.orderCode}</Text>
              )}
            </View>
            <Text style={styles.orderDate}>{formatDate(order.date, 'en-US')}</Text>
            <View
              style={[
                styles.statusBadge,
                { 
                  backgroundColor: statusStyle.backgroundColor,
                  borderColor: statusStyle.borderColor || 'transparent',
                  borderWidth: 1,
                },
              ]}
            >
              {getStatusIcon(order)}
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {getStatusText(order)}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>

        <View style={styles.orderDivider} />

        <View style={styles.orderItems}>
          {order.items.slice(0, 2).map((item) => (
            <Text key={item.id} style={styles.itemText} numberOfLines={1}>
              {item.quantity}x {item.name}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text style={styles.moreItems}>
              +{order.items.length - 2} more items
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{order.totalPrice}</Text>
          </View>

          {order.status === "in_progress" && order.estimatedTime && (
            <View style={styles.etaContainer}>
              <Clock size={14} color="#FF6B35" />
              <Text style={styles.etaText}>{order.estimatedTime}</Text>
            </View>
          )}

          {order.status === "delivered" && (
            <TouchableOpacity style={styles.reorderButton}>
              <RotateCcw size={14} color="#FF6B35" />
              <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>My Orders</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                activeFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredOrders.length > 0 ? (
          <>
            {filteredOrders.map(renderOrderCard)}
            <View style={styles.screenLabel}>
              <Text style={styles.screenLabelText}>Orders Screen</Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Package size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              You don&apos;t have any {activeFilter !== "all" ? activeFilter.replace("_", " ") : ""} orders yet
            </Text>
          </View>
        )}
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 16,
  },
  filterContainer: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterButtonActive: {
    backgroundColor: "#FF6B35",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6B7280",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  storeImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  orderHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  storeNameRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 2,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
    flex: 1,
  },
  orderCode: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  orderDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    alignSelf: "flex-start" as const,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  orderDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  orderItems: {
    gap: 4,
  },
  itemText: {
    fontSize: 13,
    color: "#6B7280",
  },
  moreItems: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600" as const,
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  totalContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  totalLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  etaContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    backgroundColor: "#FFF5F2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  etaText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FF6B35",
  },
  reorderButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    backgroundColor: "#FFF5F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reorderText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FF6B35",
  },
  emptyState: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center" as const,
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
  screenLabel: {
    paddingVertical: 12,
    alignItems: "center" as const,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
});
