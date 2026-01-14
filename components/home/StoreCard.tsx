import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Bike } from "lucide-react-native";

const { width } = Dimensions.get("window");
const STORE_CARD_WIDTH = width * 0.55;

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

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => router.push(`/store/${store.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.storeImageContainer}>
        <Image
          source={{ uri: store.image }}
          style={styles.storeImage}
          contentFit="cover"
          placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
        />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {store.rating}</Text>
        </View>
      </View>
      <View style={styles.storeInfo}>
        <Text style={styles.storeName} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={styles.cuisine} numberOfLines={1}>
          {store.cuisine}
        </Text>
        <View style={styles.storeFooter}>
          <View style={styles.deliveryBadge}>
            <Bike size={11} color="#4A7C59" strokeWidth={2.5} />
            <Text style={styles.deliveryBadgeText}>{store.deliveryTime} min</Text>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.feeBadge}>
              <Text style={styles.feeBadgeText}>{store.deliveryFee}</Text>
            </View>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceBadgeText}>{store.distance}</Text>
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
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  storeImageContainer: {
    width: "100%",
    height: 140,
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
    padding: 12,
  },
  storeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 10,
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
});

