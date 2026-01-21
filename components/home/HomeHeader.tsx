import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { User, Bell, MapPin, ChevronDown } from "lucide-react-native";
import { router } from "expo-router";
import { EdgeInsets } from "react-native-safe-area-context";

interface HomeHeaderProps {
  insets: EdgeInsets;
  selectedAddress?: {
    title: string;
    address: string;
  } | null;
}

export function HomeHeader({ insets, selectedAddress }: HomeHeaderProps) {
  const addressDisplay = selectedAddress
    ? `${selectedAddress.title}, ${selectedAddress.address}`
    : "Select delivery address";

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top + 8, backgroundColor: "#FF6B35" },
      ]}
    >
      <View style={styles.headerBackground} />
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={() => router.push("/(tabs)/account" as any)}
        >
          <User color="#FFFFFF" size={20} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addressContainer}
          onPress={() => router.push("/account/addresses" as any)}
        >
          <MapPin color="#FFFFFF" size={14} />
          <Text style={styles.addressText} numberOfLines={1}>{addressDisplay}</Text>
          <ChevronDown color="#FFFFFF" size={14} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={() => router.push("/notifications-modal" as any)}
        >
          <Bell color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 10,
    zIndex: 10,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FF6B35",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  addressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginHorizontal: 12,
  },
  addressText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    flexShrink: 1,
  },
});
