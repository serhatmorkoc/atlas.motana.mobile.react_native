import { router } from "expo-router";
import {
  ChevronLeft,
  Bell,
  ShoppingBag,
  Tag,
  MessageSquare,
  Mail,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "orders",
      title: "Order Updates",
      description: "Get notified about your order status",
      icon: <ShoppingBag size={22} color="#374151" />,
      enabled: true,
    },
    {
      id: "promotions",
      title: "Promotions & Offers",
      description: "Receive special deals and discounts",
      icon: <Tag size={22} color="#374151" />,
      enabled: true,
    },
    {
      id: "messages",
      title: "Messages",
      description: "Chat messages from restaurants",
      icon: <MessageSquare size={22} color="#374151" />,
      enabled: true,
    },
    {
      id: "email",
      title: "Email Notifications",
      description: "Receive updates via email",
      icon: <Mail size={22} color="#374151" />,
      enabled: false,
    },
  ]);

  const [pushEnabled, setPushEnabled] = useState(true);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.masterToggle}>
          <View style={styles.masterToggleLeft}>
            <View style={styles.masterIconContainer}>
              <Bell size={24} color="#FF6B35" />
            </View>
            <View style={styles.masterInfo}>
              <Text style={styles.masterTitle}>Push Notifications</Text>
              <Text style={styles.masterDescription}>
                {pushEnabled ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: "#E5E7EB", true: "#FDBA74" }}
            thumbColor={pushEnabled ? "#FF6B35" : "#9CA3AF"}
          />
        </View>

        {pushEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Types</Text>
            <View style={styles.settingsList}>
              {settings.map((setting) => (
                <View key={setting.id} style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconContainer}>
                      {setting.icon}
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{setting.title}</Text>
                      <Text style={styles.settingDescription}>
                        {setting.description}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={setting.enabled}
                    onValueChange={() => toggleSetting(setting.id)}
                    trackColor={{ false: "#E5E7EB", true: "#FDBA74" }}
                    thumbColor={setting.enabled ? "#FF6B35" : "#9CA3AF"}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <Bell size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            You can change notification preferences anytime from your device settings.
          </Text>
        </View>

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account / Notification Settings Screen</Text>
        </View>
      </ScrollView>
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
  masterToggle: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
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
  masterToggleLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
  masterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5F2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  masterInfo: {
    flex: 1,
  },
  masterTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  masterDescription: {
    fontSize: 13,
    color: "#6B7280",
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
  settingsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#9CA3AF",
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
});
