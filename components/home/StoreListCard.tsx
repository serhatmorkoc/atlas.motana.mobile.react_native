import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react-native";

import { optimizeImageUrl } from "@/utils/helpers";

interface Store {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  deliveryFee: string;
  distance: string;
}

interface SimpleMenuItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface StoreListCardProps {
  store: Store;
  menuItems?: SimpleMenuItem[];
}

export function StoreListCard({ store, menuItems = [] }: StoreListCardProps) {
  const handleHeaderPress = () => {
    router.push(`/store/${store.id}` as any);
  };

  const handleMenuItemPress = () => {
    router.push(`/store/${store.id}` as any);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleHeaderPress}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: optimizeImageUrl(store.image) }}
              style={styles.logo}
              contentFit="cover"
              cachePolicy="none"
            />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.name} numberOfLines={1}>
              {store.name}
            </Text>
            <Text style={styles.cuisine} numberOfLines={1}>
              {store.cuisine}
            </Text>
            <View style={styles.headerInfo}>
              <View style={styles.ratingBadge}>
                <Star size={11} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
                <Text style={styles.ratingText}>{store.rating}</Text>
              </View>
              <View style={styles.infoDot} />
              <View style={styles.infoItem}>
                <MapPin size={12} color="#64748B" strokeWidth={2.5} />
                <Text style={styles.infoText}>{store.distance}</Text>
              </View>
              <View style={styles.infoDot} />
              <View style={styles.infoItem}>
                <Clock size={12} color="#64748B" strokeWidth={2.5} />
                <Text style={styles.infoText}>{store.deliveryTime} dk</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <ChevronRight size={20} color="#94A3B8" strokeWidth={2} />
        </View>
      </TouchableOpacity>

      {menuItems.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuItemsContainer}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItemCard}
              onPress={handleMenuItemPress}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: optimizeImageUrl(item.image) }}
                style={styles.menuItemImage}
                contentFit="cover"
                cachePolicy="none"
              />
              <View style={styles.menuItemOverlay}>
                <Text style={styles.menuItemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.menuItemPrice}>₺{item.price.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingBadge: {
    backgroundColor: "#FFB800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  infoDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#94A3B8",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
  arrowContainer: {
    marginLeft: 12,
  },
  menuItemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  menuItemCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginRight: 12,
  },
  menuItemImage: {
    width: "100%",
    height: "100%",
  },
  menuItemOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
  },
  menuItemName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  menuItemPrice: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

