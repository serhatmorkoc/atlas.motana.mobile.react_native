import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { Image } from "expo-image";
import { Clock, Store } from "lucide-react-native";

interface EstimateCardProps {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  pulseAnim: Animated.Value;
  progressAnim: Animated.Value;
  estimatedMinutes: number;
  restaurantName: string;
  restaurantImage?: string;
  itemCount: string;
  total: string;
}

export function EstimateCard({
  fadeAnim,
  slideAnim,
  pulseAnim,
  progressAnim,
  estimatedMinutes,
  restaurantName,
  restaurantImage,
  itemCount,
  total,
}: EstimateCardProps) {
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={[
        styles.estimateCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.estimateHeader}>
        <Clock size={20} color="#10B981" strokeWidth={2} />
        <Text style={styles.estimateLabel}>Estimated Delivery</Text>
      </View>
      <View style={styles.estimateTimeRow}>
        <Animated.Text
          style={[
            styles.estimateTime,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          {estimatedMinutes}
        </Animated.Text>
        <Text style={styles.estimateUnit}>min</Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg} />
        <Animated.View
          style={[styles.progressBarFill, { width: progressWidth }]}
        />
      </View>
      
      <View style={styles.restaurantRow}>
        {restaurantImage ? (
          <Image
            source={{ uri: restaurantImage }}
            style={styles.restaurantThumb}
          />
        ) : (
          <View style={styles.restaurantThumbPlaceholder}>
            <Store size={16} color="#9CA3AF" strokeWidth={2} />
          </View>
        )}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <Text style={styles.itemCount}>{itemCount} items • ₺{total}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  estimateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  estimateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  estimateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  estimateTimeRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 16,
  },
  estimateTime: {
    fontSize: 48,
    fontWeight: "800",
    color: "#10B981",
  },
  estimateUnit: {
    fontSize: 20,
    fontWeight: "600",
    color: "#10B981",
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 20,
    position: "relative",
  },
  progressBarBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
  },
  progressBarFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  restaurantThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  restaurantThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  itemCount: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
});
