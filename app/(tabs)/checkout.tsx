import { Image } from "expo-image";
import { router } from "expo-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";
import { apolloClient } from "@/lib/apollo/client";

import { useCart, CartItem, CartStoreGroup } from "@/contexts/CartContext";
import { formatPrice, DELIVERY_FEE, SERVICE_FEE } from "@/utils";
import { CREATE_ORDER, CREATE_ORDER_ITEMS } from "@/lib/apollo/mutations/orders";
import { GET_USER_BY_ID, GET_USER_ADDRESSES } from "@/lib/apollo/queries/users";
import { GET_STORE_BY_ID } from "@/lib/apollo/queries/stores";

const HARDCODE_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02";

type Edge<T> = { node: T };
type User = { id: string; name: string | null; email: string | null; phone: string | null };
type UserAddress = {
  id: string;
  user_id: string | null;
  label: string | null;
  delivery_address: string | null;
  details: string | null;
  building: string | null;
  floor: string | null;
  landmark: string | null;
  latitude: string | null;
  longitude: string | null;
  is_selected: boolean | null;
};

type GetUserByIdData = { usersCollection: { edges: Array<Edge<User>> } };
type GetUserByIdVars = { id: string };

type GetUserAddressesData = { user_addressesCollection: { edges: Array<Edge<UserAddress>> } };
type GetUserAddressesVars = { userId: string };

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const {
    groupedByStore,
    totalItems,
    updateQuantity,
    clearStoreItems,
    getItemPrice,
  } = useCart();

  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [storeToClear, setStoreToClear] = useState<{ id: string; name: string } | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [placingStoreId, setPlacingStoreId] = useState<string | null>(null);

  type CreateOrderData = {
    insertIntoordersCollection: {
      records: Array<{
        id: string;
        order_code: string | null;
        user_id: string | null;
        store_id: string | null;
        courier_id: string | null;
        delivery_address: any;
        payment_method: string | null;
        payment_status: string | null;
        order_status: string | null;
        sub_total: string | null;
        delivery_fee: string | null;
        tax_amount: string | null;
        tip_amount: string | null;
        total_amount: string | null;
        note_to_store: string | null;
        is_picked_up: boolean | null;
        created_at: string;
        estimated_delivery_time: string | null;
      }>;
    };
  };

  type CreateOrderVars = { order: any };

  type CreateOrderItemsData = {
    insertIntoorder_itemsCollection: {
      records: Array<{
        id: string;
        order_id: string | null;
        product_id: string | null;
        product_title: string | null;
        quantity: number | null;
        unit_price: string | null;
        total_price: string | null;
        image: string | null;
      }>;
    };
  };

  type CreateOrderItemsVars = { items: any[] };

  type GraphQLStore = {
    id: string;
    delivery_time_min: number;
    delivery_time_max: number;
  };

  type GetStoreByIdData = {
    storesCollection: {
      edges: Array<{
        node: GraphQLStore;
      }>;
    };
  };

  type GetStoreByIdVars = { id: string };

  const [createOrder] = useMutation<CreateOrderData, CreateOrderVars>(CREATE_ORDER);
  const [createOrderItems] = useMutation<CreateOrderItemsData, CreateOrderItemsVars>(CREATE_ORDER_ITEMS);

  const userQuery = useQuery<GetUserByIdData, GetUserByIdVars>(GET_USER_BY_ID, {
    variables: { id: HARDCODE_USER_ID },
    fetchPolicy: "cache-and-network",
  });

  const addressesQuery = useQuery<GetUserAddressesData, GetUserAddressesVars>(GET_USER_ADDRESSES, {
    variables: { userId: HARDCODE_USER_ID },
    fetchPolicy: "cache-and-network",
  });

  const handleClearPress = (storeId: string, storeName: string) => {
    setStoreToClear({ id: storeId, name: storeName });
    setClearModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirmClear = () => {
    if (storeToClear) {
      clearStoreItems(storeToClear.id);
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
      setStoreToClear(null);
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
          <Text style={styles.itemPrice}>{formatPrice(itemTotal)}</Text>
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


  const handlePlaceOrder = async (group: CartStoreGroup) => {
    if (placingStoreId) return;

    const storeTotal = group.subtotal + DELIVERY_FEE + SERVICE_FEE;
    const orderCode = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const user: User | undefined = userQuery.data?.usersCollection?.edges?.[0]?.node;
    const addresses: UserAddress[] =
      addressesQuery.data?.user_addressesCollection?.edges?.map((e) => e.node) ?? [];

    const selectedAddress =
      addresses.find((a) => a.is_selected) ??
      addresses[0];

    if (!selectedAddress?.delivery_address) {
      Alert.alert("Address missing", "This user has no selected delivery address in DB.");
      return;
    }

    try {
      setPlacingStoreId(group.storeId);

      // Fetch store to get delivery_time_min and delivery_time_max for estimated_delivery_time
      const { data: storeData } = await apolloClient.query<GetStoreByIdData, GetStoreByIdVars>({
        query: GET_STORE_BY_ID,
        variables: { id: group.storeId },
        fetchPolicy: 'network-only', // Always fetch fresh data
      });

      const store = storeData?.storesCollection?.edges?.[0]?.node;
      
      // Calculate estimated_delivery_time: current time + delivery_time_max (in minutes)
      let estimatedDeliveryTime: string | null = null;
      if (store?.delivery_time_max) {
        const now = new Date();
        const estimatedMinutes = store.delivery_time_max;
        const estimatedTime = new Date(now.getTime() + estimatedMinutes * 60 * 1000);
        estimatedDeliveryTime = estimatedTime.toISOString();
      }

      const deliveryAddressJson: Record<string, any> = {};
      
      if (selectedAddress.id) deliveryAddressJson.address_id = selectedAddress.id;
      if (selectedAddress.label) deliveryAddressJson.label = selectedAddress.label;
      if (selectedAddress.delivery_address) deliveryAddressJson.delivery_address = selectedAddress.delivery_address;
      if (selectedAddress.details) deliveryAddressJson.details = selectedAddress.details;
      if (selectedAddress.building) deliveryAddressJson.building = selectedAddress.building;
      if (selectedAddress.floor) deliveryAddressJson.floor = selectedAddress.floor;
      if (selectedAddress.landmark) deliveryAddressJson.landmark = selectedAddress.landmark;
      
      if (selectedAddress.latitude) {
        const latNum = parseFloat(selectedAddress.latitude);
        if (!isNaN(latNum)) deliveryAddressJson.latitude = latNum;
      }
      if (selectedAddress.longitude) {
        const lngNum = parseFloat(selectedAddress.longitude);
        if (!isNaN(lngNum)) deliveryAddressJson.longitude = lngNum;
      }

      const deliveryAddressForMutation = Object.keys(deliveryAddressJson).length > 0 
        ? JSON.stringify(deliveryAddressJson) // Convert to JSON string for Supabase GraphQL
        : null; // Send null if empty instead of empty object

      console.log("deliveryAddressForMutation (as JSON string):", deliveryAddressForMutation);
      console.log("deliveryAddressForMutation type:", typeof deliveryAddressForMutation);

      const orderRes = await createOrder({
        variables: {
          order: {
            order_code: orderCode, // text
            user_id: HARDCODE_USER_ID, // uuid
            store_id: group.storeId, // uuid
            courier_id: null, // uuid null - will be assigned later
            delivery_address: deliveryAddressForMutation, // jsonb (as JSON string)
            payment_method: "CASH", // text
            payment_status: "PENDING", // text (default 'PENDING')
            order_status: "PENDING", // text (default 'PENDING')
            sub_total: group.subtotal.toFixed(2), // numeric(10, 2) as string
            delivery_fee: DELIVERY_FEE.toFixed(2), // numeric(10, 2) as string
            tax_amount: "0.00", // numeric(10, 2) as string
            tip_amount: "0.00", // numeric(10, 2) as string
            total_amount: storeTotal.toFixed(2), // numeric(10, 2) as string
            note_to_store: null, // text null
            is_picked_up: false, // boolean (default false)
            estimated_delivery_time: estimatedDeliveryTime, // timestamp with time zone (ISO string)
          },
        },
      });

      const created = orderRes.data?.insertIntoordersCollection?.records?.[0];
      const dbOrderId: string | undefined = created?.id;
      const dbOrderCode: string | null = created?.order_code || orderCode;

      if (!dbOrderId) {
        throw new Error("Order insert succeeded but no order id returned.");
      }

      // 2) Create order items - all fields according to order_items table schema
      const itemsPayload = group.items.map((item) => {
        const totalPrice = getItemPrice(item);
        const unitPrice = totalPrice / item.quantity;
        const extrasText =
          item.selectedExtras.length > 0 ? ` (Varyant: ${item.selectedExtras.map((e) => e.name).join(", ")})` : "";

        return {
          order_id: dbOrderId, // uuid
          product_id: item.menuItem.id, // uuid
          product_title: `${item.menuItem.name}${extrasText}`, // text
          quantity: item.quantity, // integer
          unit_price: unitPrice.toFixed(2), // numeric(10, 2) as string
          total_price: totalPrice.toFixed(2), // numeric(10, 2) as string
          image: item.menuItem.image || null, // text null
        };
      });

      await createOrderItems({
        variables: {
          items: itemsPayload,
        },
      });

      // 3) Clear cart for store and navigate
      clearStoreItems(group.storeId);

      const orderItemsForUi = group.items.map((item) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: getItemPrice(item),
        extras: item.selectedExtras.length > 0 ? item.selectedExtras.map((e) => e.name).join(", ") : undefined,
      }));

      router.push({
        pathname: "/order/confirmation" as any,
        params: {
          orderId: dbOrderId,
          orderCode: dbOrderCode || orderCode, // Use order_code instead of id
          storeName: group.storeName,
          total: formatPrice(storeTotal).replace("₺", ""),
          subtotal: formatPrice(group.subtotal).replace("₺", ""),
          deliveryFee: formatPrice(DELIVERY_FEE).replace("₺", ""),
          serviceFee: formatPrice(SERVICE_FEE).replace("₺", ""),
          itemCount: group.items.reduce((sum, i) => sum + i.quantity, 0).toString(),
          items: JSON.stringify(orderItemsForUi),
          address: selectedAddress.delivery_address,
        },
      });
    } catch (e: any) {
      console.error("Place order failed:", e);
      Alert.alert("Order failed", e?.message ?? "Unknown error");
    } finally {
      setPlacingStoreId(null);
    }
  };

  const renderStoreGroup = (group: CartStoreGroup) => {
    const storeTotal = group.subtotal + DELIVERY_FEE + SERVICE_FEE;
    const itemCount = group.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View key={group.storeId} style={styles.storeGroup}>
        <View style={styles.storeHeader}>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{group.storeName}</Text>
            <Text style={styles.itemCount}>{itemCount} items</Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleClearPress(group.storeId, group.storeName)}
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
            <Text style={styles.summaryValue}>{formatPrice(group.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatPrice(DELIVERY_FEE)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>{formatPrice(SERVICE_FEE)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(storeTotal)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.placeOrderButton} 
          activeOpacity={0.8}
          onPress={() => handlePlaceOrder(group)}
          disabled={placingStoreId === group.storeId}
        >
          <Text style={styles.placeOrderButtonText}>
            {placingStoreId === group.storeId ? "Placing…" : `Place Order • ${formatPrice(storeTotal)}`}
          </Text>
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
        Add items from stores to start your order
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

      {groupedByStore.length === 0 ? (
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
          {groupedByStore.map(renderStoreGroup)}
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
            <Text style={styles.clearModalTitle}>Remove Store</Text>
            <Text style={styles.clearModalMessage}>
              Are you sure you want to remove all items from &quot;{storeToClear?.name}&quot;? This action cannot be undone.
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
  storeGroup: {
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
  storeHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FAFAFA",
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
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
