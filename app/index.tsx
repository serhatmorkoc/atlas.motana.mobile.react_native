import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { Colors } from "@/constants/Colors";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to Login screen after delay
      router.replace("/auth/login" as any);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={['#FFFFFF', '#FFF5F2']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ShoppingBag size={56} color={Colors.primary} strokeWidth={2} />
            </LinearGradient>
          </View>

          <View style={styles.brandContainer}>
            <Text style={styles.title}>motana</Text>
            <Text style={styles.versionText}>v{Constants.expoConfig?.version || "1.0.0"}</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  iconWrapper: {
    marginBottom: 28,
  },
  iconGradient: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  brandContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 3,
    textTransform: "lowercase",
    fontFamily: "System", // Using System font for now as Droid Sans might not be loaded
  },
  versionText: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.6,
    marginTop: 8,
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

});
