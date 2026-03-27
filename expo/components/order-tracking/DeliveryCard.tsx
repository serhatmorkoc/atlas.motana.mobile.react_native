import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MapPin } from "lucide-react-native";

interface DeliveryCardProps {
  address: string;
}

export function DeliveryCard({ address }: DeliveryCardProps) {
  return (
    <View style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <MapPin size={18} color="#FF6B35" strokeWidth={2} />
        <Text style={styles.deliveryLabel}>Delivery Address</Text>
      </View>
      <Text style={styles.deliveryAddress}>{address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  deliveryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  deliveryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  deliveryAddress: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
    lineHeight: 22,
  },
});
