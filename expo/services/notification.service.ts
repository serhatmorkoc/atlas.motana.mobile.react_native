// Notification service for order status updates
import * as Notifications from 'expo-notifications';
import { Platform, AppState } from 'react-native';
import { DBOrderStatus } from '@/types/order.types';
import { logger } from '@/utils/logger';

// Configure notification handler for foreground and background
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Setup notification listeners for background/foreground
if (Platform.OS !== 'web') {
  // Handle notifications received while app is in foreground
  Notifications.addNotificationReceivedListener((notification) => {
    logger.debug('Notification', 'Received in foreground:', notification.request.content.title);
  });

  // Handle user interaction with notifications
  Notifications.addNotificationResponseReceivedListener((response) => {
    logger.debug('Notification', 'User interacted with:', response.notification.request.content.title);
    const data = response.notification.request.content.data;
    if (data?.type === 'order_status_update') {
      // Could navigate to order details here if needed
      logger.debug('Notification', 'Order status update:', data);
    }
  });
}

/**
 * Get notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    logger.info('Notification', 'Notifications not supported on web');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    logger.error('Notification', 'Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Get status change notification message
 */
function getStatusNotificationMessage(
  status: DBOrderStatus,
  orderCode: string | null,
  storeName: string
): { title: string; body: string } {
  const orderRef = orderCode || 'your order';

  switch (status) {
    case 'CONFIRMED':
      return {
        title: 'Order Confirmed! ✅',
        body: `${storeName} has confirmed ${orderRef} and started preparing.`,
      };
    case 'PREPARING':
      return {
        title: 'Order Being Prepared! 👨‍🍳',
        body: `${storeName} is preparing ${orderRef}. It won't be long!`,
      };
    case 'READY':
      return {
        title: 'Order Ready! 🎉',
        body: `${orderRef} from ${storeName} is ready for pickup/delivery.`,
      };
    case 'ON_WAY':
      return {
        title: 'Order On The Way! 🚗',
        body: `${orderRef} from ${storeName} is on its way to you.`,
      };
    case 'DELIVERED':
      return {
        title: 'Order Delivered! 🎊',
        body: `${orderRef} from ${storeName} has been delivered. Enjoy your meal!`,
      };
    case 'CANCELLED':
      return {
        title: 'Order Cancelled ❌',
        body: `${orderRef} from ${storeName} has been cancelled.`,
      };
    default:
      return {
        title: 'Order Status Updated',
        body: `Status of ${orderRef} from ${storeName} has been updated.`,
      };
  }
}

/**
 * Send notification for order status change
 * Works in both foreground and background
 */
export async function sendOrderStatusNotification(
  status: DBOrderStatus,
  orderCode: string | null,
  storeName: string
): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      logger.info('Notification', 'Permission not granted');
      return;
    }

    const { title, body } = getStatusNotificationMessage(status, orderCode, storeName);
    const appState = AppState.currentState;

    // Use scheduleNotificationAsync with null trigger for immediate display
    // This works in both foreground and background
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: {
          type: 'order_status_update',
          status,
          orderCode,
          storeName,
        },
      },
      trigger: null, // Show immediately
    });

    logger.debug('Notification', `Sent (AppState: ${appState}): ${title} - ${body}`);
  } catch (error) {
    logger.error('Notification', 'Error sending notification:', error);
  }
}
