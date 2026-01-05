import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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

interface MenuItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface RestaurantListCardProps {
  restaurant: Restaurant;
  menuItems?: MenuItem[];
}

export function RestaurantListCard({ restaurant, menuItems = [] }: RestaurantListCardProps) {
  const handleHeaderPress = () => {
    router.push(`/restaurant/${restaurant.id}` as any);
  };

  const handleMenuItemPress = () => {
    router.push(`/restaurant/${restaurant.id}` as any);
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
              source={{ uri: restaurant.image }}
              style={styles.logo}
              contentFit="cover"
            />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.name} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <Text style={styles.cuisine} numberOfLines={1}>
              {restaurant.cuisine}
            </Text>
            <View style={styles.headerInfo}>
              <View style={styles.ratingBadge}>
                <Star size={11} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
              <View style={styles.infoDot} />
              <View style={styles.infoItem}>
                <MapPin size={12} color="#64748B" strokeWidth={2.5} />
                <Text style={styles.infoText}>{restaurant.distance}</Text>
              </View>
              <View style={styles.infoDot} />
              <View style={styles.infoItem}>
                <Clock size={12} color="#64748B" strokeWidth={2.5} />
                <Text style={styles.infoText}>{restaurant.deliveryTime} dk</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <ChevronRight size={20} color="#94A3B8" strokeWidth={2} />
        </View>
      </TouchableOpacity>

      {menuItems.length > 0 && (
        <View style={styles.menuSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.menuScroll}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === 0 && styles.menuItemFirst,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
                onPress={handleMenuItemPress}
                activeOpacity={0.85}
              >
                <View style={styles.menuImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.menuImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.menuGradient}
                  />
                  <View style={styles.priceTag}>
                    <Text style={styles.menuPrice}>₺{item.price.toFixed(0)}</Text>
                  </View>
                </View>
                <View style={styles.menuNameContainer}>
                  <Text style={styles.menuName} numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#FAFBFC",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 56,
    height: 56,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#0F172A",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  cuisine: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500" as const,
    marginBottom: 6,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  infoDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  infoText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600" as const,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  menuSection: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  menuScroll: {
    paddingVertical: 14,
  },
  menuItem: {
    width: 130,
    marginRight: 10,
  },
  menuItemFirst: {
    marginLeft: 14,
  },
  menuItemLast: {
    marginRight: 14,
  },
  menuImageContainer: {
    width: 130,
    height: 130,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  menuImage: {
    width: 130,
    height: 130,
  },
  menuGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  priceTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  menuPrice: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#0F172A",
  },
  menuNameContainer: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  menuName: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#1E293B",
    lineHeight: 17,
  },
});
