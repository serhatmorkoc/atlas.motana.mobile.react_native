import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Heart, Bike } from "lucide-react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const RESTAURANT_CARD_WIDTH = width * 0.55;

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  deliveryFee: string;
  distance: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.restaurantImageContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.restaurantImage}
          contentFit="cover"
          placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
        />
        <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.7}>
          <Heart size={16} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>★ {restaurant.rating}</Text>
        </View>
      </View>
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.cuisine} numberOfLines={1}>
          {restaurant.cuisine}
        </Text>
        <View style={styles.restaurantFooter}>
          <View style={styles.deliveryBadge}>
            <Bike size={11} color="#4A7C59" strokeWidth={2.5} />
            <Text style={styles.deliveryBadgeText}>{restaurant.deliveryTime} min</Text>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.feeBadge}>
              <Text style={styles.feeBadgeText}>{restaurant.deliveryFee}</Text>
            </View>
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceBadgeText}>{restaurant.distance}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  restaurantCard: {
    width: RESTAURANT_CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  restaurantImageContainer: {
    position: "relative",
    width: "100%",
    height: 120,
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingBadgeText: {
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "700",
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  cuisine: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 10,
    fontWeight: "500",
  },
  restaurantFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deliveryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(141, 185, 154, 0.35)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  deliveryBadgeText: {
    fontSize: 11,
    color: "#4A7C59",
    fontWeight: "600",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feeBadge: {
    backgroundColor: "#FFF0EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  feeBadgeText: {
    fontSize: 11,
    color: "#FF6B35",
    fontWeight: "700",
  },
  distanceBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceBadgeText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
});
