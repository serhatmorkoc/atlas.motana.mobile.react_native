import { Image } from "expo-image";
import { router } from "expo-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart, CartItem, CartRestaurantGroup } from "@/contexts/CartContext";

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const {
    groupedByRestaurant,
    totalItems,
    updateQuantity,
    clearRestaurantItems,
    getItemPrice,
  } = useCart();

  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [restaurantToClear, setRestaurantToClear] = useState<{ id: string; name: string } | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleClearPress = (restaurantId: string, restaurantName: string) => {
    setRestaurantToClear({ id: restaurantId, name: restaurantName });
    setClearModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirmClear = () => {
    if (restaurantToClear) {
      clearRestaurantItems(restaurantToClear.id);
    }
    handleCloseClearModal();
  };

  const handleCloseClearModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setClearModalVisible(false);
      setRestaurantToClear(null);
    });
  };

  const renderCartItem = (item: CartItem) => {
    const itemTotal = getItemPrice(item);

    return (
      <View key={item.id} style={styles.cartItem}>
        <Image
          source={{ uri: item.menuItem.image }}
          style={styles.itemImage}
          contentFit="cover"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.menuItem.name}
          </Text>
          {item.selectedExtras.length > 0 && (
            <Text style={styles.itemExtras} numberOfLines={1}>
              +{item.selectedExtras.map(e => e.name).join(", ")}
            </Text>
          )}
          <Text style={styles.itemPrice}>₺{itemTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.itemActions}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              {item.quantity === 1 ? (
                <Trash2 size={14} color="#EF4444" strokeWidth={2} />
              ) : (
                <Minus size={14} color="#374151" strokeWidth={2.5} />
              )}
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus size={14} color="#374151" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const DELIVERY_FEE = 9.90;
  const SERVICE_FEE = 4.90;

  const handlePlaceOrder = (group: CartRestaurantGroup) => {
    const restaurantTotal = group.subtotal + DELIVERY_FEE + SERVICE_FEE;
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    
    const orderItems = group.items.map(item => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      price: getItemPrice(item),
      extras: item.selectedExtras.length > 0 
        ? item.selectedExtras.map(e => e.name).join(', ') 
        : undefined,
    }));

    clearRestaurantItems(group.restaurantId);

    router.push({
      pathname: '/order/confirmation' as any,
      params: {
        orderId,
        restaurantName: group.restaurantName,
        total: restaurantTotal.toFixed(2),
        subtotal: group.subtotal.toFixed(2),
        deliveryFee: DELIVERY_FEE.toFixed(2),
        serviceFee: SERVICE_FEE.toFixed(2),
        itemCount: group.items.reduce((sum, i) => sum + i.quantity, 0).toString(),
        items: JSON.stringify(orderItems),
        address: 'Atatürk Mah. Cumhuriyet Cad. No: 45/3, Kadıköy, İstanbul',
      },
    });
  };

  const renderRestaurantGroup = (group: CartRestaurantGroup) => {
    const restaurantTotal = group.subtotal + DELIVERY_FEE + SERVICE_FEE;
    const itemCount = group.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View key={group.restaurantId} style={styles.restaurantGroup}>
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{group.restaurantName}</Text>
            <Text style={styles.itemCount}>{itemCount} items</Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleClearPress(group.restaurantId, group.restaurantName)}
          >
            <X size={16} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.itemsList}>
          {group.items.map(renderCartItem)}
        </View>

        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₺{group.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₺{DELIVERY_FEE.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>₺{SERVICE_FEE.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₺{restaurantTotal.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.placeOrderButton} 
          activeOpacity={0.8}
          onPress={() => handlePlaceOrder(group)}
        >
          <Text style={styles.placeOrderButtonText}>Place Order • ₺{restaurantTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <ShoppingBag size={64} color="#D1D5DB" strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptyDescription}>
        Add items from restaurants to start your order
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight}>
          {totalItems > 0 && (
            <View style={styles.itemsBadge}>
              <Text style={styles.itemsBadgeText}>{totalItems}</Text>
            </View>
          )}
        </View>
      </View>

      {groupedByRestaurant.length === 0 ? (
        renderEmptyCart()
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {groupedByRestaurant.map(renderRestaurantGroup)}
          <View style={styles.screenLabel}>
            <Text style={styles.screenLabelText}>Checkout Screen</Text>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={clearModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseClearModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseClearModal}
          />
          <Animated.View
            style={[
              styles.clearModalContent,
              {
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.clearModalIcon}>
              <Trash2 size={28} color="#EF4444" />
            </View>
            <Text style={styles.clearModalTitle}>Remove Restaurant</Text>
            <Text style={styles.clearModalMessage}>
              Are you sure you want to remove all items from &quot;{restaurantToClear?.name}&quot;? This action cannot be undone.
            </Text>
            <View style={styles.clearModalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={handleCloseClearModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmClearButton}
                onPress={handleConfirmClear}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color="#FFFFFF" />
                <Text style={styles.confirmClearButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  headerRight: {
    alignItems: "center" as const,
  },
  itemsBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemsBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  restaurantGroup: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FAFAFA",
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  itemCount: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  itemsList: {
    paddingVertical: 8,
  },
  cartItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  itemExtras: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FF6B35",
  },
  itemActions: {
    marginLeft: 8,
  },
  quantityControl: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 4,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginHorizontal: 12,
    minWidth: 16,
    textAlign: "center" as const,
  },
  orderSummary: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  summaryRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500" as const,
    flex: 1,
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600" as const,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FF6B35",
  },
  placeOrderButton: {
    backgroundColor: "#10B981",
    marginHorizontal: 14,
    marginBottom: 14,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center" as const,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  placeOrderButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 24,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  clearModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 340,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  clearModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  clearModalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 8,
  },
  clearModalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center" as const,
    lineHeight: 20,
    marginBottom: 24,
  },
  clearModalButtons: {
    flexDirection: "row" as const,
    gap: 12,
    width: "100%",
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  cancelModalButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#6B7280",
  },
  confirmClearButton: {
    flex: 1,
    flexDirection: "row" as const,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
  },
  confirmClearButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
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
