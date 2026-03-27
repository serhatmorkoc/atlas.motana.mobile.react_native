import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { User, Sparkles, Phone, ChevronRight, Mail } from "lucide-react-native";
import { router } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { useAuthUser } from "@/hooks/useAuthUser";

export function ProfileCard() {
  const { user, loading } = useUser();
  const { user: authUser } = useAuthUser();

  if (loading) {
    return (
      <View style={styles.profileCard}>
        <ActivityIndicator color="#FF6B35" />
      </View>
    );
  }

  // Don't render if user data is not available - wait for it to load
  if (!user) {
    return null;
  }

  // Prefer DB name, but if DB has an invalid value (e.g. name == email),
  // fall back to Supabase auth metadata.
  const metaFullName =
    (authUser as any)?.user_metadata?.full_name ??
    (authUser as any)?.user_metadata?.name ??
    "";

  const dbName = user.name ?? "";
  const dbEmail = user.email ?? "";
  const displayName = metaFullName && dbEmail && dbName === dbEmail ? metaFullName : dbName;

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
        {!!displayName && <Text style={styles.profileName}>{displayName}</Text>}

        {!!dbEmail && (
          <View style={styles.metaRow}>
            <Mail size={12} color="#9CA3AF" />
            <Text style={styles.profileMeta}>{dbEmail}</Text>
          </View>
        )}

        {user.phone && user.phone !== displayName && user.phone !== dbEmail && (
          <View style={styles.metaRow}>
            <Phone size={12} color="#9CA3AF" />
            <Text style={styles.profileMeta}>{user.phone}</Text>
          </View>
        )}
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  profileMeta: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});
