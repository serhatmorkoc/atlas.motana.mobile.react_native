import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Bike } from "lucide-react-native";
import { optimizeImageUrl } from "@/utils/helpers";

const { width } = Dimensions.get("window");
const STORE_CARD_WIDTH = width * 0.53;

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

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  const isClosed = store.isAvailable === false;

  const handlePress = () => {
    if (isClosed) return;
    router.push(`/store/${store.id}` as any);
  };

  return (
    <TouchableOpacity
      style={[styles.storeCard, isClosed && styles.storeCardClosed]}
      onPress={handlePress}
      activeOpacity={isClosed ? 1 : 0.7}
      disabled={isClosed}
    >
      <View style={styles.storeImageContainer}>
        <Image
          source={{ uri: optimizeImageUrl(store.image) }}
          style={[styles.storeImage, isClosed && styles.storeImageClosed]}
          contentFit="cover"
          placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
        />
        {isClosed && (
          <View style={styles.closedOverlay}>
            <View style={styles.closedBadge}>
              <Text style={styles.closedText}>CLOSED</Text>
            </View>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {store.rating}</Text>
        </View>
      </View>
      <View style={[styles.storeInfo, isClosed && styles.storeInfoClosed]}>
        <Text style={[styles.storeName, isClosed && styles.textClosed]} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={[styles.cuisine, isClosed && styles.textClosed]} numberOfLines={1}>
          {store.cuisine}
        </Text>
        <View style={styles.storeFooter}>
          <View style={[styles.deliveryBadge, isClosed && styles.deliveryBadgeClosed]}>
            <Bike size={11} color={isClosed ? "#9CA3AF" : "#4A7C59"} strokeWidth={2.5} />
            <Text style={[styles.deliveryBadgeText, isClosed && styles.textClosed]}>
              {store.deliveryTime} min
            </Text>
          </View>
          <View style={styles.footerRight}>
            <View style={[styles.feeBadge, isClosed && styles.badgeClosed]}>
              <Text style={[styles.feeBadgeText, isClosed && styles.textClosed]}>
                {store.deliveryFee}
              </Text>
            </View>
            <View style={[styles.distanceBadge, isClosed && styles.badgeClosed]}>
              <Text style={[styles.distanceBadgeText, isClosed && styles.textClosed]}>
                {store.distance}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  storeCard: {
    width: STORE_CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  storeImageContainer: {
    width: "100%",
    height: 134,
    position: "relative",
  },
  storeImage: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1F2937",
  },
  storeInfo: {
    padding: 11,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  storeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4A7C59",
  },
  footerRight: {
    flexDirection: "row",
    gap: 6,
  },
  feeBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  feeBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#374151",
  },
  distanceBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#374151",
  },
  // Closed state styles
  storeCardClosed: {
    opacity: 0.85,
  },
  storeImageClosed: {
    opacity: 0.5,
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  closedBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closedText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  storeInfoClosed: {
    backgroundColor: "#F3F4F6",
  },
  textClosed: {
    color: "#9CA3AF",
  },
  deliveryBadgeClosed: {
    backgroundColor: "#E5E7EB",
  },
  badgeClosed: {
    backgroundColor: "#E5E7EB",
  },
});

