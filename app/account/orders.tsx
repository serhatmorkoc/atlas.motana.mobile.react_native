import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Package,
  RotateCcw,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { orders, Order } from "@/mocks/orders";
import { formatDate } from "@/utils/formatters";

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

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "in_progress":
        return <Clock size={16} color="#F59E0B" />;
      case "delivered":
        return <CheckCircle size={16} color="#10B981" />;
      case "cancelled":
        return <XCircle size={16} color="#EF4444" />;
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
    }
  };

  const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
      case "in_progress":
        return { backgroundColor: "#FEF3C7", color: "#92400E" };
      case "delivered":
        return { backgroundColor: "#D1FAE5", color: "#065F46" };
      case "cancelled":
        return { backgroundColor: "#FEE2E2", color: "#991B1B" };
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
    const statusStyle = getStatusStyle(order.status);
    return (
      <TouchableOpacity
        key={order.id}
        style={styles.orderCard}
        activeOpacity={0.7}
        onPress={() => handleOrderClick(order)}
      >
        <View style={styles.orderHeader}>
          <Image
            source={{ uri: order.storeImage }}
            style={styles.storeImage}
            contentFit="cover"
          />
          <View style={styles.orderHeaderInfo}>
            <Text style={styles.storeName}>{order.storeName}</Text>
            <Text style={styles.orderDate}>{formatDate(order.date, 'en-US')}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusStyle.backgroundColor },
              ]}
            >
              {getStatusIcon(order.status)}
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {getStatusText(order.status)}
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
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft color="#1F2937" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerSpacer} />
        </View>

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
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map(renderOrderCard)
        ) : (
          <View style={styles.emptyState}>
            <Package size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              You don&apos;t have any {activeFilter !== "all" ? activeFilter.replace("_", " ") : ""} orders yet
            </Text>
          </View>
        )}

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account / Orders Screen</Text>
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  headerSpacer: {
    width: 36,
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
  storeName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 2,
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
