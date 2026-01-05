import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import React from "react";
import {
  ShoppingBag,
  Percent,
  Truck,
  Star,
  Gift,
  AlertCircle,
  X,
  Check,
} from "lucide-react-native";

type Notification = {
  id: string;
  type: "order" | "offer" | "delivery" | "review" | "promo" | "alert";
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const notifications: Notification[] = [
  {
    id: "1",
    type: "delivery",
    title: "Order Delivered",
    description: "Your order from Pizza Palace has been delivered. Enjoy your meal!",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "offer",
    title: "50% OFF on your next order",
    description: "Use code SAVE50 at Burger King. Valid until tomorrow.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "order",
    title: "Order Confirmed",
    description: "Your order from Sushi Master is being prepared. Estimated time: 25 min",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "review",
    title: "Rate your recent order",
    description: "How was your experience with Mediterranean Delight?",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "promo",
    title: "New Restaurant Alert!",
    description: "Taco Fiesta just joined Motana. Get 20% off on first order.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "6",
    type: "delivery",
    title: "Delivery in Progress",
    description: "Your driver is 10 minutes away from your location.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "7",
    type: "alert",
    title: "Payment Successful",
    description: "Payment of ₺127.50 processed successfully for order #4523.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "8",
    type: "offer",
    title: "Weekend Special",
    description: "Free delivery on all orders above ₺100 this weekend!",
    time: "3 days ago",
    read: true,
  },
];

const getNotificationIcon = (type: Notification["type"], read: boolean) => {
  const color = read ? "#9CA3AF" : "#FF6B35";
  
  switch (type) {
    case "order":
      return <ShoppingBag size={22} color={color} />;
    case "offer":
      return <Percent size={22} color={color} />;
    case "delivery":
      return <Truck size={22} color={color} />;
    case "review":
      return <Star size={22} color={color} />;
    case "promo":
      return <Gift size={22} color={color} />;
    case "alert":
      return <AlertCircle size={22} color={color} />;
    default:
      return <ShoppingBag size={22} color={color} />;
  }
};

type NotificationItemProps = {
  notification: Notification;
  onPress?: () => void;
};

const NotificationItem = ({ notification, onPress }: NotificationItemProps) => (
  <TouchableOpacity 
    style={[
      styles.notificationItem,
      !notification.read && styles.unreadNotification
    ]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[
      styles.iconContainer,
      !notification.read && styles.unreadIconContainer
    ]}>
      {getNotificationIcon(notification.type, notification.read)}
    </View>
    <View style={styles.notificationContent}>
      <View style={styles.notificationHeader}>
        <Text style={[
          styles.notificationTitle,
          !notification.read && styles.unreadTitle
        ]} numberOfLines={1}>
          {notification.title}
        </Text>
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationDescription} numberOfLines={2}>
        {notification.description}
      </Text>
      <Text style={styles.notificationTime}>{notification.time}</Text>
    </View>
  </TouchableOpacity>
);

export default function NotificationsModal() {
  const insets = useSafeAreaInsets();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X size={20} color="#6B7280" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {unreadCount > 0 && (
        <View style={styles.markAllContainer}>
          <TouchableOpacity style={styles.markAllButton} activeOpacity={0.7}>
            <Check size={16} color="#FF6B35" />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length > 0 ? (
          <>
            {unreadCount > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New</Text>
              </View>
            )}
            {notifications.filter(n => !n.read).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
            
            {notifications.some(n => n.read) && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Earlier</Text>
              </View>
            )}
            {notifications.filter(n => n.read).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}

            <View style={styles.screenLabel}>
              <Text style={styles.screenLabelText}>Notifications Screen</Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <ShoppingBag size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyDescription}>
              You don&apos;t have any notifications yet. We&apos;ll notify you when something comes up!
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
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  headerLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  headerBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  markAllContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  markAllButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FF6B35",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6B7280",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row" as const,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: "#FF6B35",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  unreadIconContainer: {
    backgroundColor: "#FEF3F0",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1F2937",
    flex: 1,
  },
  unreadTitle: {
    fontWeight: "700" as const,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B35",
  },
  notificationDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500" as const,
  },
  emptyContainer: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center" as const,
    lineHeight: 20,
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
});
