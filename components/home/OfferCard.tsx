import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { optimizeImageUrl } from "@/utils/helpers";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  storeName: string;
}

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <TouchableOpacity style={styles.offerCard}>
      <View style={styles.offerImageContainer}>
        <Image 
          source={{ uri: optimizeImageUrl(offer.image) }} 
          style={styles.offerImage} 
          contentFit="cover"
          cachePolicy="none"
          placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.offerGradient}
        />
        <View style={styles.offerBadge}>
          <Text style={styles.offerBadgeText}>{offer.discount}</Text>
        </View>
        <View style={styles.offerOverlayContent}>
          <Text style={styles.offerStoreOverlay}>{offer.storeName}</Text>
        </View>
      </View>
      <View style={styles.offerContent}>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        <Text style={styles.offerDescription}>{offer.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  offerCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  offerImageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
  },
  offerImage: {
    width: "100%",
    height: "100%",
  },
  offerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  offerBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  offerBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  offerOverlayContent: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  offerStoreOverlay: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  offerContent: {
    padding: 16,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  offerDescription: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 20,
  },
});
