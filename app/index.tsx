import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    router.push("/auth/login" as any);
  };

  const handleRegister = () => {
    router.push("/auth/register" as any);
  };

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
              <ShoppingBag size={56} color="#FF6B35" strokeWidth={2} />
            </LinearGradient>
          </View>

          <View style={styles.brandContainer}>
            <Text style={styles.title}>motana</Text>
            <Text style={styles.versionText}>v{Constants.expoConfig?.version || "1.0.0"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Yeni Hesap Oluştur</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
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
    fontSize: 36,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 2,
    textTransform: "lowercase" as const,
    fontFamily: "Droid Sans",
  },

  bottomContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    alignItems: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FF6B35",
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  versionText: {
    fontSize: 10,
    color: "#FFFFFF",
    opacity: 0.4,
    marginTop: 8,
    fontFamily: "Droid Sans",
    letterSpacing: 0.3,
  },
});
