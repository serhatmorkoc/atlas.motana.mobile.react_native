import { router } from "expo-router";
import {
  ChevronLeft,
  Globe,
  Moon,
  Smartphone,
  Shield,
  Trash2,
  ChevronRight,
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

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = ["English", "Türkçe", "ქართული", "Русский"];

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
          <Text style={styles.headerTitle}>App Settings</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Moon size={22} color="#374151" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>
                    Use dark theme
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#E5E7EB", true: "#FDBA74" }}
                thumbColor={darkMode ? "#FF6B35" : "#9CA3AF"}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.settingsList}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={styles.languageItem}
                onPress={() => setSelectedLanguage(language)}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconContainer}>
                    <Globe size={22} color="#374151" />
                  </View>
                  <Text style={styles.settingTitle}>{language}</Text>
                </View>
                {selectedLanguage === language && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Smartphone size={22} color="#374151" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Biometric Login</Text>
                  <Text style={styles.settingDescription}>
                    Use Face ID or fingerprint
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricLogin}
                onValueChange={setBiometricLogin}
                trackColor={{ false: "#E5E7EB", true: "#FDBA74" }}
                thumbColor={biometricLogin ? "#FF6B35" : "#9CA3AF"}
              />
            </View>
            <TouchableOpacity style={styles.settingItemTouchable}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Shield size={22} color="#374151" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Privacy Settings</Text>
                  <Text style={styles.settingDescription}>
                    Manage your data and privacy
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.dangerItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, styles.dangerIconContainer]}>
                  <Trash2 size={22} color="#EF4444" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, styles.dangerText]}>
                    Delete Account
                  </Text>
                  <Text style={styles.settingDescription}>
                    Permanently delete your account and data
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionTitle}>Motana Food</Text>
          <Text style={styles.versionText}>Version 1.0.0 (Build 1)</Text>
        </View>

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account / Settings Screen</Text>
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
  settingItemTouchable: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  languageItem: {
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
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF6B35",
  },
  dangerItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: 16,
  },
  dangerIconContainer: {
    backgroundColor: "#FEE2E2",
  },
  dangerText: {
    color: "#EF4444",
  },
  versionInfo: {
    alignItems: "center" as const,
    paddingVertical: 24,
    gap: 4,
  },
  versionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FF6B35",
  },
  versionText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  screenLabel: {
    paddingVertical: 12,
    alignItems: "center" as const,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
});
