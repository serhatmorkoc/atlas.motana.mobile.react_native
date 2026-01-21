import { router } from "expo-router";
import {
  ChevronLeft,
  CreditCard,
  Plus,
  Check,
  Trash2,
  Wallet,
} from "lucide-react-native";
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

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "cash" | "wallet";
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  label: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    lastFour: "4242",
    expiryDate: "12/26",
    isDefault: true,
    label: "Personal Visa",
  },
  {
    id: "2",
    type: "mastercard",
    lastFour: "8888",
    expiryDate: "08/25",
    isDefault: false,
    label: "Work Card",
  },
  {
    id: "3",
    type: "wallet",
    isDefault: false,
    label: "Motana Wallet",
  },
  {
    id: "4",
    type: "cash",
    isDefault: false,
    label: "Cash on Delivery",
  },
];

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<PaymentMethod | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeletePress = (method: PaymentMethod) => {
    if (method.type === "cash" || method.isDefault) return;
    setCardToDelete(method);
    setDeleteModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirmDelete = () => {
    if (cardToDelete) {
      setPaymentMethods(paymentMethods.filter((m) => m.id !== cardToDelete.id));
    }
    handleCloseDeleteModal();
  };

  const handleCloseDeleteModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setDeleteModalVisible(false);
      setCardToDelete(null);
    });
  };

  const getCardIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "visa":
        return (
          <View style={[styles.cardIconBg, { backgroundColor: "#1A1F71" }]}>
            <Text style={styles.cardBrandText}>VISA</Text>
          </View>
        );
      case "mastercard":
        return (
          <View style={[styles.cardIconBg, { backgroundColor: "#EB001B" }]}>
            <Text style={styles.cardBrandText}>MC</Text>
          </View>
        );
      case "wallet":
        return (
          <View style={[styles.cardIconBg, { backgroundColor: "#FF6B35" }]}>
            <Wallet size={18} color="#FFFFFF" />
          </View>
        );
      case "cash":
        return (
          <View style={[styles.cardIconBg, { backgroundColor: "#10B981" }]}>
            <Text style={styles.cashIcon}>₺</Text>
          </View>
        );
    }
  };

  const renderPaymentCard = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[styles.paymentCard, method.isDefault && styles.paymentCardDefault]}
      onPress={() => handleSetDefault(method.id)}
      activeOpacity={0.7}
    >
      <View style={styles.paymentCardLeft}>
        {getCardIcon(method.type)}
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>{method.label}</Text>
          {method.lastFour && (
            <Text style={styles.paymentDetails}>
              •••• {method.lastFour} · Expires {method.expiryDate}
            </Text>
          )}
          {method.type === "wallet" && (
            <Text style={styles.walletBalance}>Balance: ₺250.00</Text>
          )}
          {method.type === "cash" && (
            <Text style={styles.paymentDetails}>Pay when order arrives</Text>
          )}
        </View>
      </View>
      <View style={styles.paymentCardRight}>
        {method.isDefault && (
          <View style={styles.defaultBadge}>
            <Check size={14} color="#FFFFFF" />
          </View>
        )}
        {!method.isDefault && method.type !== "cash" && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(method)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          {paymentMethods
            .filter((m) => m.type === "visa" || m.type === "mastercard")
            .map(renderPaymentCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Methods</Text>
          {paymentMethods
            .filter((m) => m.type === "wallet" || m.type === "cash")
            .map(renderPaymentCard)}
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('./add-card')}
          activeOpacity={0.7}
        >
          <View style={styles.addIconContainer}>
            <Plus color="#FF6B35" size={20} />
          </View>
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <CreditCard size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            Your payment information is encrypted and secure. We never store your full card details.
          </Text>
        </View>

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account / Payment Methods Screen</Text>
        </View>
      </ScrollView>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseDeleteModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseDeleteModal}
          />
          <Animated.View
            style={[
              styles.deleteModalContent,
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
            <View style={styles.deleteModalIcon}>
              <Trash2 size={28} color="#EF4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Delete Payment Method</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete &quot;{cardToDelete?.label}&quot;? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={handleCloseDeleteModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleConfirmDelete}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color="#FFFFFF" />
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  paymentCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  paymentCardDefault: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF5F2",
  },
  paymentCardLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
  cardIconBg: {
    width: 44,
    height: 32,
    borderRadius: 6,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  cardBrandText: {
    fontSize: 10,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  cashIcon: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  paymentDetails: {
    fontSize: 12,
    color: "#6B7280",
  },
  walletBalance: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600" as const,
  },
  paymentCardRight: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  defaultBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF6B35",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  addButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFF5F2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderStyle: "dashed" as const,
  },
  addIconContainer: {
    width: 44,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FF6B35",
  },
  infoCard: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  deleteModalContent: {
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
  deleteModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 8,
  },
  deleteModalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center" as const,
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteModalButtons: {
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
  confirmDeleteButton: {
    flex: 1,
    flexDirection: "row" as const,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
  },
  confirmDeleteButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
