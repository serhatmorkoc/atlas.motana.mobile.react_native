import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Animated, Linking, Platform } from "react-native";
import { Phone, MessageCircle } from "lucide-react-native";

interface CourierInfo {
  name: string;
  phone: string;
  vehicleType: string;
  plateNumber: string;
}

interface CourierCardProps {
  courier: CourierInfo;
  slideAnim: Animated.Value;
}

export function CourierCard({ courier, slideAnim }: CourierCardProps) {
  const handleCallCourier = () => {
    if (Platform.OS !== "web") {
      Linking.openURL(`tel:${courier.phone}`);
    }
  };

  const handleMessageCourier = () => {
    if (Platform.OS !== "web") {
      Linking.openURL(`sms:${courier.phone}`);
    }
  };

  return (
    <Animated.View
      style={[
        styles.courierCard,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.courierHeader}>
        <Text style={styles.courierHeaderTitle}>Your Courier</Text>
      </View>
      
      <View style={styles.courierBody}>
        <View style={styles.courierDetails}>
          <Text style={styles.courierName}>{courier.name}</Text>
          <Text style={styles.courierVehicle}>
            {courier.vehicleType} • {courier.plateNumber}
          </Text>
        </View>
        <View style={styles.courierActions}>
          <TouchableOpacity
            style={styles.courierActionButton}
            onPress={handleCallCourier}
            activeOpacity={0.7}
          >
            <Phone size={18} color="#10B981" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.courierActionButton}
            onPress={handleMessageCourier}
            activeOpacity={0.7}
          >
            <MessageCircle size={18} color="#10B981" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  courierCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  courierHeader: {
    marginBottom: 12,
  },
  courierHeaderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  courierBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  courierDetails: {
    flex: 1,
  },
  courierName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  courierVehicle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  courierActions: {
    flexDirection: "row",
    gap: 10,
  },
  courierActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
});
