import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gift } from "lucide-react-native";

export function RewardsCard() {
  return (
    <View style={styles.rewardsCard}>
      <View style={styles.rewardsLeft}>
        <View style={styles.rewardsIcon}>
          <Gift size={22} color="#FF6B35" />
        </View>
        <View>
          <Text style={styles.rewardsTitle}>150 Points</Text>
          <Text style={styles.rewardsSubtitle}>50 more for free delivery</Text>
        </View>
      </View>
      <View style={styles.rewardsProgress}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: "75%" }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rewardsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  rewardsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5F2",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  rewardsSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  rewardsProgress: {
    paddingLeft: 60,
  },
  progressBg: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B35",
    borderRadius: 3,
  },
});
