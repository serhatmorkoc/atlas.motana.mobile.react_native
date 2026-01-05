import * as Notifications from "expo-notifications";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Package,
  Phone,
  X,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  extras?: string;
}

export default function OrderConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    orderId: string;
    restaurantName: string;
    total: string;
    subtotal: string;
    deliveryFee: string;
    serviceFee: string;
    itemCount: string;
    items: string;
    address: string;
  }>();

  const orderItems: OrderItem[] = (() => {
    try {
      if (!params.items) return [];
      
      if (Array.isArray(params.items)) {
        return params.items as OrderItem[];
      }
      
      if (typeof params.items === 'string') {
        console.log('Parsing items string:', params.items.substring(0, 100));
        const decoded = decodeURIComponent(params.items);
        return JSON.parse(decoded);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to parse order items:', error, 'Raw value:', params.items);
      return [];
    }
  })();
  const estimatedTime = Math.floor(Math.random() * 15) + 25;

  const handleTrackOrder = () => {
    router.push({
      pathname: "/order/tracking" as any,
      params: {
        orderId: params.orderId,
        restaurantName: params.restaurantName,
        total: params.total,
        address: params.address,
        estimatedTime: String(estimatedTime),
        itemCount: params.itemCount,
      },
    });
  };

  useEffect(() => {
    sendOrderNotification();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOrderNotification = async () => {
    try {
      if (Platform.OS === "web") {
        console.log("Notifications not supported on web");
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Notification permission not granted");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Order Confirmed! 🎉",
          body: `Motana Food - Your order from ${params.restaurantName} has been received. Estimated delivery: ${estimatedTime}-${estimatedTime + 10} minutes`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3,
        },
      });

      console.log("First notification scheduled for 3 seconds");

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Restaurant Accepted! 👨‍🍳",
          body: `Motana Food - ${params.restaurantName} has accepted your order and started preparing.`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 300,
        },
      });

      console.log("Second notification scheduled for 5 minutes");
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.dismissAll()}
          activeOpacity={0.7}
        >
          <X size={22} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Confirmation</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successBanner}>
          <View style={styles.successIconContainer}>
            <CheckCircle size={28} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <View style={styles.successTextContainer}>
            <Text style={styles.successTitle}>Order Received!</Text>
            <Text style={styles.successSubtitle}>Your order has been successfully placed</Text>
          </View>
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View style={styles.orderIdContainer}>
              <Package size={18} color="#FF6B35" strokeWidth={2} />
              <Text style={styles.orderIdLabel}>Order No</Text>
            </View>
            <Text style={styles.orderId}>#{params.orderId}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.restaurantSection}>
            <Text style={styles.sectionLabel}>Restaurant</Text>
            <Text style={styles.restaurantName}>{params.restaurantName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemsSection}>
            <Text style={styles.sectionLabel}>Order Details</Text>
            {orderItems.map((item, index) => (
              <View key={index} style={styles.orderItemVertical}>
                <View style={styles.orderItemHeader}>
                  <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                </View>
                {item.extras && (
                  <Text style={styles.orderItemExtras}>{item.extras}</Text>
                )}
                <Text style={styles.orderItemPrice}>₺{item.price.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>₺{params.subtotal}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>₺{params.deliveryFee}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee</Text>
              <Text style={styles.priceValue}>₺{params.serviceFee}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₺{params.total}</Text>
          </View>
        </View>

        <View style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <Clock size={18} color="#10B981" strokeWidth={2} />
            <Text style={styles.deliveryTitle}>Estimated Delivery Time</Text>
          </View>
          <View style={styles.deliveryTimeContainer}>
            <Text style={styles.deliveryTimeNumber}>{estimatedTime}-{estimatedTime + 10}</Text>
            <Text style={styles.deliveryTimeUnit}>minutes</Text>
          </View>
          
          <View style={styles.addressSection}>
            <View style={styles.addressHeader}>
              <MapPin size={16} color="#FF6B35" strokeWidth={2} />
              <Text style={styles.addressTitle}>Delivery Address</Text>
            </View>
            <Text style={styles.addressText}>{params.address}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.trackOrderButton}
          onPress={handleTrackOrder}
          activeOpacity={0.8}
        >
          <Navigation size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.trackOrderButtonText}>Track Order</Text>
        </TouchableOpacity>

        <View style={styles.supportSection}>
          <Text style={styles.supportText}>Need help?</Text>
          <TouchableOpacity style={styles.supportButton} activeOpacity={0.7}>
            <Phone size={16} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.supportButtonText}>Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Order Confirmation Screen</Text>
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
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  headerPlaceholder: {
    width: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  successBanner: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,
    marginBottom: 16,
  },
  successIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  successSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  orderIdContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  orderIdLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500" as const,
    st: "uppercase" as const,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },
  restaurantSection: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  itemsSection: {
    gap: 14,
  },
  orderItemVertical: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
  },
  orderItemHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#FF6B35",
    backgroundColor: "#FFF0EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    flex: 1,
  },
  orderItemExtras: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
    marginLeft: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginLeft: 2,
  },
  priceBreakdown: {
    gap: 10,
  },
  priceRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  priceValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600" as const,
  },
  totalSection: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: "#FF6B35",
  },
  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  deliveryHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginBottom: 12,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
  },
  deliveryTimeContainer: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
    gap: 6,
    marginBottom: 16,
  },
  deliveryTimeNumber: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#10B981",
  },
  deliveryTimeUnit: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#10B981",
  },
  addressSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
  },
  addressHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#374151",
  },
  addressText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  trackOrderButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
    marginBottom: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  trackOrderButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  supportSection: {
    alignItems: "center" as const,
    paddingVertical: 16,
  },
  supportText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 10,
  },
  supportButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#3B82F6",
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
