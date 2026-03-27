import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, Animated } from "react-native";
import { LogOut } from "lucide-react-native";

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fadeAnim: Animated.Value;
}

export function LogoutModal({ visible, onClose, onConfirm, fadeAnim }: LogoutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.logoutModalContent,
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
          <View style={styles.logoutModalIcon}>
            <LogOut size={28} color="#DC2626" />
          </View>
          <Text style={styles.logoutModalTitle}>Logout</Text>
          <Text style={styles.logoutModalMessage}>
            Are you sure you want to logout? You will need to login again to access your account.
          </Text>
          <View style={styles.logoutModalButtons}>
            <TouchableOpacity
              style={styles.cancelModalButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelModalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmLogoutButton}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <LogOut size={16} color="#FFFFFF" />
              <Text style={styles.confirmLogoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  logoutModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    width: "85%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logoutModalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoutModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  logoutModalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  logoutModalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelModalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  confirmLogoutButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmLogoutButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
