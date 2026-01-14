import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import React from "react";

import {
  ShoppingBag,
  CreditCard,
  MapPin,
  Heart,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react-native";

import { MenuItem, ProfileCard, RewardsCard, LogoutModal } from "@/components/account";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);
  const fadeAnim = React.useState(new Animated.Value(0))[0];

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirmLogout = () => {
    console.log("User logged out");
    handleCloseLogoutModal();
  };

  const handleCloseLogoutModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setLogoutModalVisible(false);
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >

        <ProfileCard />

        <RewardsCard />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<ShoppingBag size={20} color="#6B7280" />}
              iconBg="#F3F4F6"
              title="My Orders"
              subtitle="Track and view order history"
              showBadge
              badgeCount={2}
              onPress={() => router.push("/account/orders" as any)}
            />
            <MenuItem
              icon={<CreditCard size={20} color="#6B7280" />}
              iconBg="#F3F4F6"
              title="Payment Methods"
              subtitle="Manage your cards and wallets"
              onPress={() => router.push("/account/payment-methods" as any)}
            />
            <MenuItem
              icon={<MapPin size={20} color="#6B7280" />}
              iconBg="#F3F4F6"
              title="Delivery Addresses"
              subtitle="Add or edit your addresses"
              onPress={() => router.push("/account/addresses" as any)}
            />
            <MenuItem
              icon={<Heart size={20} color="#6B7280" />}
              iconBg="#F3F4F6"
              title="Favorite Stores"
              subtitle="Your saved places"
              onPress={() => router.push("/account/favorites" as any)}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<Bell size={20} color="#6B7280" />}
              iconBg="#F3F4F6"
              title="Notifications"
              subtitle="Manage push notifications"
              onPress={() => router.push("/account/notification-settings" as any)}
            />
            <MenuItem
              icon={<Settings size={20} color="#6B7280" />}
              iconBg="#F3F4F6"
              title="App Settings"
              subtitle="Language, theme and more"
              onPress={() => router.push("/account/settings" as any)}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<HelpCircle size={20} color="#6B7280" />}
              iconBg="#F3F4F6"
              title="Help Center"
              subtitle="FAQ and customer support"
              onPress={() => router.push("/account/help" as any)}
              isLast
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress} activeOpacity={0.7}>
          <View style={styles.logoutIconContainer}>
            <LogOut size={18} color="#DC2626" />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
          <ChevronRight size={18} color="#DC2626" />
        </TouchableOpacity>

        <Text style={styles.versionText}>Motana Food Delivery · v1.0.0</Text>

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account Screen</Text>
        </View>
      </ScrollView>

      <LogoutModal
        visible={logoutModalVisible}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
        fadeAnim={fadeAnim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  menuGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  logoutText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#DC2626",
  },
  versionText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
  },
  screenLabel: {
    paddingVertical: 12,
    alignItems: "center",
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500",
  },
});
