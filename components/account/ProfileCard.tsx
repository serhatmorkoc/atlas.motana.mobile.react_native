import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { User, Sparkles, Phone, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { useUser } from "@/hooks/useUser";

export function ProfileCard() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View style={styles.profileCard}>
        <ActivityIndicator color="#FF6B35" />
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.profileCard}
      onPress={() => router.push("/account/edit-profile" as any)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          <User size={24} color="#FF6B35" strokeWidth={2} />
        </View>
        <View style={styles.verifiedBadge}>
          <Sparkles size={8} color="#FFFFFF" />
        </View>
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{user?.name || "User"}</Text>
        <View style={styles.phoneRow}>
          <Phone size={12} color="#9CA3AF" />
          <Text style={styles.profilePhone}>{user?.phone || "No phone number"}</Text>
        </View>
      </View>
      
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
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
  avatarWrapper: {
    position: "relative",
    marginRight: 14,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF5F2",
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  profilePhone: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});
