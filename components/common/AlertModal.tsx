import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, Animated } from "react-native";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react-native";

export type AlertType = "error" | "success" | "warning" | "info";

interface AlertModalProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  fadeAnim: Animated.Value;
  showCancel?: boolean;
}

export function AlertModal({
  visible,
  type = "info",
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  fadeAnim,
  showCancel = false,
}: AlertModalProps) {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <XCircle size={28} color="#EF4444" />;
      case "success":
        return <CheckCircle size={28} color="#10B981" />;
      case "warning":
        return <AlertCircle size={28} color="#F59E0B" />;
      default:
        return <Info size={28} color="#3B82F6" />;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case "error":
        return "#FEE2E2";
      case "success":
        return "#D1FAE5";
      case "warning":
        return "#FEF3C7";
      default:
        return "#DBEAFE";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "error":
        return styles.confirmErrorButton;
      case "success":
        return styles.confirmSuccessButton;
      case "warning":
        return styles.confirmWarningButton;
      default:
        return styles.confirmInfoButton;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

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
            styles.modalContent,
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
          <View style={[styles.modalIcon, { backgroundColor: getIconBackground() }]}>
            {getIcon()}
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            {showCancel && (
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmButton, getConfirmButtonStyle()]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
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
  modalContent: {
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
  modalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  modalButtons: {
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
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmErrorButton: {
    backgroundColor: "#EF4444",
  },
  confirmSuccessButton: {
    backgroundColor: "#10B981",
  },
  confirmWarningButton: {
    backgroundColor: "#F59E0B",
  },
  confirmInfoButton: {
    backgroundColor: "#3B82F6",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
