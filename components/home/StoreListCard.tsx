import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react-native";
import { MenuItem } from "@/types/menu.types";
import { optimizeImageUrl } from "@/utils/helpers";

const { width } = Dimensions.get("window");

interface Store {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  deliveryFee: string;
  distance: string;
  isAvailable?: boolean;
}

interface StoreListCardProps {
  store: Store;
  menuItems?: MenuItem[];
  loadingMenuItems?: boolean;
}

export function StoreListCard({ store, menuItems = [], loadingMenuItems = false }: StoreListCardProps) {
  const isClosed = store.isAvailable === false;

  const handleHeaderPress = () => {
    if (isClosed) return;
    router.push(`/store/${store.id}` as any);
  };

  const handleMenuItemPress = () => {
    if (isClosed) return;
    router.push(`/store/${store.id}` as any);
  };

  return (
    <View style={[styles.container, isClosed && styles.containerClosed]}>
      <TouchableOpacity
        style={[styles.header, isClosed && styles.headerClosed]}
        onPress={handleHeaderPress}
        activeOpacity={isClosed ? 1 : 0.8}
        disabled={isClosed}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.logoContainer, isClosed && styles.logoContainerClosed]}>
            <Image
              source={{ uri: optimizeImageUrl(store.image) }}
              style={[styles.logo, isClosed && styles.logoClosed]}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
              placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
            />
            {isClosed && (
              <View style={styles.closedOverlay}>
                <Text style={styles.closedMiniText}>✕</Text>
              </View>
            )}
          </View>
          <View style={styles.headerContent}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, isClosed && styles.textClosed]} numberOfLines={1}>
                {store.name}
              </Text>
              {isClosed && (
                <View style={styles.closedBadge}>
                  <Text style={styles.closedBadgeText}>CLOSED</Text>
                </View>
              )}
            </View>
            <Text style={[styles.cuisine, isClosed && styles.textClosed]} numberOfLines={1}>
              {store.cuisine}
            </Text>
            <View style={styles.headerInfo}>
              <View style={[styles.ratingBadge, isClosed && styles.ratingBadgeClosed]}>
                <Star size={11} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
                <Text style={styles.ratingText}>{store.rating}</Text>
              </View>
              <View style={styles.infoDot} />
              <View style={styles.infoItem}>
                <MapPin size={12} color={isClosed ? "#9CA3AF" : "#64748B"} strokeWidth={2.5} />
                <Text style={[styles.infoText, isClosed && styles.textClosed]}>{store.distance}</Text>
              </View>
              <View style={styles.infoDot} />
              <View style={styles.infoItem}>
                <Clock size={12} color={isClosed ? "#9CA3AF" : "#64748B"} strokeWidth={2.5} />
                <Text style={[styles.infoText, isClosed && styles.textClosed]}>{store.deliveryTime} dk</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <ChevronRight size={20} color={isClosed ? "#D1D5DB" : "#94A3B8"} strokeWidth={2} />
        </View>
      </TouchableOpacity>

      {loadingMenuItems && menuItems.length === 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuItemsContainer}
        >
          {[0, 1, 2].map((i) => (
            <View key={`skeleton-${store.id}-${i}`} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonOverlay}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

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
                cachePolicy="memory-disk"
                transition={200}
                placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
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
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 9,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  cuisine: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 5,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 6,
  },
  menuItemCard: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginRight: 8,
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
    padding: 5,
  },
  menuItemName: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  menuItemPrice: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  skeletonCard: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginRight: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  skeletonImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  skeletonOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  skeletonLine: {
    height: 10,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    marginBottom: 6,
  },
  skeletonLineShort: {
    width: "65%",
    marginBottom: 0,
  },
  // Closed state styles
  containerClosed: {
    opacity: 0.9,
  },
  headerClosed: {
    backgroundColor: "#F3F4F6",
  },
  logoContainerClosed: {
    position: "relative",
  },
  logoClosed: {
    opacity: 0.4,
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  closedMiniText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  closedBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  closedBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  textClosed: {
    color: "#9CA3AF",
  },
  ratingBadgeClosed: {
    backgroundColor: "#9CA3AF",
  },
});

