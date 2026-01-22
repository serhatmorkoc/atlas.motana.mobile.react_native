/**
 * Notification utility for sending local notifications
 * Supports background notifications when app is in background
 * 
 * IMPORTANT: For background notifications to work in production,
 * you need to send push notifications from your backend when order status changes.
 * This file handles receiving and displaying those notifications.
 */
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { logger } from "./logger";
import { DBOrderStatus } from "@/types/order.types";
import Constants from "expo-constants";

// Configure notification handler for background notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 * @returns true if permission granted, false otherwise
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === "web") {
      logger.info("Notification", "Notifications not supported on web");
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      logger.warn("Notification", "Notification permission not granted");
      return false;
    }

    logger.debug("Notification", "Notification permission granted");
    return true;
  } catch (error) {
    logger.error("Notification", "Error requesting notification permissions:", error);
    return false;
  }
}

/**
 * Get notification message for order status change
 */
function getOrderStatusNotification(
  status: DBOrderStatus,
  storeName: string,
  orderCode?: string | null
): { title: string; body: string } {
  const orderRef = orderCode || "siparişiniz";

  switch (status) {
    case "CONFIRMED":
      return {
        title: "Sipariş Onaylandı! ✅",
        body: `${storeName} siparişinizi onayladı ve hazırlamaya başladı.`,
      };
    case "PREPARING":
      return {
        title: "Sipariş Hazırlanıyor 👨‍🍳",
        body: `${storeName} siparişinizi hazırlıyor.`,
      };
    case "READY":
      return {
        title: "Sipariş Hazır! 📦",
        body: `${storeName} siparişiniz hazır. Kurye yola çıkıyor.`,
      };
    case "ON_WAY":
      return {
        title: "Kurye Yolda! 🚗",
        body: `${storeName} siparişiniz yolda. Kurye yakında sizde olacak.`,
      };
    case "DELIVERED":
      return {
        title: "Sipariş Teslim Edildi! 🎉",
        body: `${storeName} siparişiniz teslim edildi. Afiyet olsun!`,
      };
    case "CANCELLED":
      return {
        title: "Sipariş İptal Edildi ❌",
        body: `${storeName} siparişiniz iptal edildi.`,
      };
    case "PENDING":
    default:
      return {
        title: "Sipariş Durumu Güncellendi",
        body: `${storeName} siparişinizin durumu güncellendi.`,
      };
  }
}

/**
 * Send a local notification for order status change
 * Works in both foreground and background
 */
export async function sendOrderStatusNotification(
  status: DBOrderStatus,
  storeName: string,
  orderCode?: string | null,
  orderId?: string
): Promise<void> {
  try {
    if (Platform.OS === "web") {
      logger.info("Notification", "Notifications not supported on web");
      return;
    }

    // Request permissions if not granted
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      logger.warn("Notification", "Cannot send notification: permission not granted");
      return;
    }

    const { title, body } = getOrderStatusNotification(status, storeName, orderCode);

    // Send immediate notification (works in background too)
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: {
          orderId,
          orderCode,
          status,
          type: "order_status_change",
        },
      },
      trigger: null, // null = immediate notification
    });

    logger.debug("Notification", `Order status notification sent: ${status} for order ${orderId}`);
  } catch (error) {
    logger.error("Notification", "Error sending order status notification:", error);
  }
}

/**
 * Initialize notification channels (Android)
 */
export async function initializeNotificationChannels(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF6B35",
      sound: "default",
      enableVibrate: true,
      showBadge: false,
    });

    logger.debug("Notification", "Android notification channel initialized");
  } catch (error) {
    logger.error("Notification", "Error initializing notification channels:", error);
  }
}

/**
 * Get Expo Push Notification Token
 * This token should be sent to your backend and stored for each user
 * Backend will use this token to send push notifications when order status changes
 * 
 * Note: projectId is required for push notifications. In Expo Go or development builds
 * without EAS configuration, this will return null. This is OK - foreground notifications
 * will still work via Supabase Realtime.
 * 
 * @returns Push notification token or null if not available
 */
export async function getPushNotificationToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      logger.info("Notification", "Push notifications not supported on web");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      logger.warn("Notification", "Push notification permission not granted");
      return null;
    }

    // Try to get projectId from various sources
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId ||
      Constants.expoConfig?.extra?.projectId;

    if (!projectId) {
      // In Expo Go or development builds without EAS, projectId might not be available
      // This is OK - foreground notifications via Supabase Realtime will still work
      logger.info(
        "Notification",
        "No projectId found. Push notifications require EAS build with projectId configured. " +
        "Foreground notifications via Supabase Realtime will still work."
      );
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    logger.debug("Notification", "Push notification token obtained");
    return tokenData.data;
  } catch (error: any) {
    // Handle projectId error gracefully
    if (error?.message?.includes("projectId")) {
      logger.info(
        "Notification",
        "Push notification token unavailable (projectId not configured). " +
        "This is normal in Expo Go. Foreground notifications via Supabase Realtime will still work."
      );
    } else {
      logger.warn("Notification", "Error getting push notification token:", error?.message || error);
    }
    return null;
  }
}

/**
 * Register push notification listeners
 * Call this in your app initialization (e.g., _layout.tsx)
 */
export function registerNotificationListeners() {
  // Handle notification received while app is in foreground
  const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
    logger.debug("Notification", "Notification received in foreground:", notification);
    // You can handle the notification here if needed
  });

  // Handle notification tapped/opened
  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as {
      type?: string;
      orderId?: string;
      orderCode?: string;
      status?: string;
    };
    logger.debug("Notification", "Notification tapped:", data);

    // Navigate to order tracking if it's an order status notification
    if (data.type === "order_status_change" && data.orderId) {
      // Import router dynamically to avoid circular dependencies
      import("expo-router").then(({ router }) => {
        router.push({
          pathname: "/order/tracking" as any,
          params: {
            orderId: data.orderId as string,
          },
        });
      });
    }
  });

  return {
    foregroundSubscription,
    responseSubscription,
  };
}
