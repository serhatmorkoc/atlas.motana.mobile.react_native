import { Image } from "expo-image";
import { Plus, UtensilsCrossed } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { MenuItem } from "@/mocks/menu-items";

interface MenuItemCardProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onPress }: MenuItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = item.image && !imageError;

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={["#FFFFFF", "#FAFBFC"]}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.menuItemContent}>
          <View style={styles.imageContainer}>
            {hasValidImage ? (
              <Image
                source={{ uri: item.image }}
                style={styles.menuItemImage}
                contentFit="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <LinearGradient
                colors={["#F8F9FA", "#F1F3F4"]}
                style={styles.placeholderImage}
              >
                <UtensilsCrossed size={28} color="#CBD5E1" strokeWidth={1.5} />
              </LinearGradient>
            )}
            {item.popular && (
              <LinearGradient
                colors={["#FF6B35", "#F7553D"]}
                style={styles.popularBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.popularBadgeText}>🔥 Popüler</Text>
              </LinearGradient>
            )}
            <View style={styles.imageOverlay} />
          </View>

          <View style={styles.menuItemInfo}>
            <View>
              <Text style={styles.menuItemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.menuItemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.priceContainer}>
                <Text style={styles.menuItemPrice}>₺{item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => onPress(item)}
              >
                <LinearGradient
                  colors={["#FF6B35", "#E85A2B"]}
                  style={styles.addButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    marginBottom: 12,
    borderRadius: 18,
    shadowColor: "#1F2937",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    overflow: "hidden" as const,
  },
  gradientBg: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  menuItemContent: {
    flexDirection: "row" as const,
    padding: 12,
    gap: 14,
  },
  imageContainer: {
    position: "relative" as const,
  },
  imageOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: "space-between" as const,
  },
  popularBadge: {
    position: "absolute" as const,
    top: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  popularBadgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700" as const,
    letterSpacing: 0.2,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  menuItemDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },
  priceRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginTop: 10,
  },
  priceContainer: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: "#EA580C",
    letterSpacing: -0.3,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  menuItemImage: {
    width: 95,
    height: 95,
    borderRadius: 14,
  },
  placeholderImage: {
    width: 95,
    height: 95,
    borderRadius: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
});
