import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Bike,
  Clock,
  Heart,
  MapPin,
  Search,
  Share2,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MenuItemCard from "@/components/restaurant/MenuItemCard";
import ProductDetailModal from "@/components/restaurant/ProductDetailModal";
import { useCart, CartItem } from "@/contexts/CartContext";
import { getMenuItemsByRestaurant, MenuItem } from "@/mocks/menu-items";
import { brandRestaurants, restaurants } from "@/mocks/restaurants";

const HEADER_HEIGHT = 260;

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { addToCart, cartItems, getItemPrice } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;

  const allRestaurants = [...restaurants, ...brandRestaurants];
  const restaurant = allRestaurants.find((r) => r.id === id);
  const allMenuItems = getMenuItemsByRestaurant(id as string);
  const menuItems = searchQuery
    ? allMenuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allMenuItems;
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  if (!restaurant) {
    return null;
  }

  const restaurantCartItems = cartItems.filter((item: CartItem) => item.restaurantId === id);
  const restaurantCartTotal = restaurantCartItems.reduce((sum: number, item: CartItem) => sum + getItemPrice(item), 0);
  const restaurantCartCount = restaurantCartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  const openProductModal = (item: MenuItem) => {
    setSelectedItem(item);
    setProductModalVisible(true);
  };

  const closeProductModal = () => {
    setProductModalVisible(false);
  };

  const handleAddToCart = (item: MenuItem, quantity: number, extras: Set<string>) => {
    if (restaurant) {
      addToCart(item, quantity, extras, restaurant.name, restaurant.image);
      console.log('Added to cart:', item.name, 'qty:', quantity);
    }
    closeProductModal();
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [120, 180],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.View
        style={[
          styles.compactHeader,
          {
            paddingTop: insets.top,
            opacity: compactHeaderOpacity,
          },
        ]}
      >
        <View style={styles.compactHeaderContent}>
          <TouchableOpacity
            style={styles.compactBackButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#1F2937" strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.compactTitleContainer}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {restaurant.name}
            </Text>
            <View style={styles.compactInfo}>
              <Star size={11} color="#FFB800" fill="#FFB800" />
              <Text style={styles.compactInfoText}>{restaurant.rating}</Text>
              <Text style={styles.compactDot}>•</Text>
              <Text style={styles.compactInfoText}>
                {restaurant.deliveryTime} min
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.compactActionButton}>
            <Heart size={18} color="#1F2937" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.compactSearchContainer}>
          <Search size={16} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            style={styles.compactSearchInput}
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.headerImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.7)"]}
            style={styles.headerGradient}
          />

          <View style={[styles.headerTop, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Share2 size={18} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Heart size={18} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerBottom}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.cuisine}>{restaurant.cuisine}</Text>

            <View style={styles.headerInfo}>
              <View style={styles.infoBadge}>
                <Star size={13} color="#FFD700" fill="#FFD700" />
                <Text style={styles.infoBadgeText}>{restaurant.rating}</Text>
              </View>
              <View style={styles.infoBadge}>
                <Clock size={13} color="#FFFFFF" />
                <Text style={styles.infoBadgeText}>
                  {restaurant.deliveryTime} min
                </Text>
              </View>
              <View style={styles.infoBadge}>
                <MapPin size={13} color="#FFFFFF" />
                <Text style={styles.infoBadgeText}>{restaurant.distance}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryIconContainer}>
              <Bike size={20} color="#10B981" strokeWidth={2} />
            </View>
            <View style={styles.deliveryCardContent}>
              <Text style={styles.deliveryLabel}>Delivery</Text>
              <Text style={styles.deliveryValue} numberOfLines={1}>{restaurant.deliveryFee}</Text>
            </View>
          </View>
          <View style={styles.deliveryCard}>
            <View style={[styles.deliveryIconContainer, styles.deliveryIconOrange]}>
              <Clock size={20} color="#F59E0B" strokeWidth={2} />
            </View>
            <View style={styles.deliveryCardContent}>
              <Text style={styles.deliveryLabel}>Time</Text>
              <Text style={styles.deliveryValue}>{restaurant.deliveryTime} min</Text>
            </View>
          </View>
          <View style={styles.deliveryCard}>
            <View style={[styles.deliveryIconContainer, styles.deliveryIconPurple]}>
              <ShoppingBag size={20} color="#8B5CF6" strokeWidth={2} />
            </View>
            <View style={styles.deliveryCardContent}>
              <Text style={styles.deliveryLabel} numberOfLines={1}>Min. Order</Text>
              <Text style={styles.deliveryValue} numberOfLines={1}>₺50</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={18} color="#9CA3AF" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {restaurant.rating >= 4.5 && (
          <View style={styles.promoContainer}>
            <LinearGradient
              colors={["#FEF3C7", "#FDE68A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.promoBanner}
            >
              <View style={styles.promoIconWrap}>
                <Zap size={16} color="#D97706" fill="#D97706" />
              </View>
              <Text style={styles.promoText}>Top Rated Restaurant</Text>
            </LinearGradient>
          </View>
        )}

        {categories.map((category) => {
          const items = menuItems.filter((item) => item.category === category);

          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>

              {items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onPress={openProductModal}
                />
              ))}
            </View>
          );
        })}

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Restaurant Screen</Text>
        </View>
      </Animated.ScrollView>

      <ProductDetailModal
        visible={productModalVisible}
        item={selectedItem}
        onClose={closeProductModal}
        onAddToCart={handleAddToCart}
        restaurantName={restaurant.name}
        restaurantImage={restaurant.image}
      />

      {restaurantCartCount > 0 && (
        <TouchableOpacity
          style={[styles.cartFloatingBar, { bottom: insets.bottom + 16 }]}
          activeOpacity={0.9}
          onPress={() => router.push('/checkout' as any)}
        >
          <View style={styles.cartBarLeft}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{restaurantCartCount}</Text>
            </View>
            <Text style={styles.cartBarText}>View Cart</Text>
          </View>
          <Text style={styles.cartBarPrice}>₺{restaurantCartTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    position: "relative" as const,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerTop: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerActions: {
    flexDirection: "row" as const,
    gap: 10,
  },
  headerBottom: {
    position: "absolute" as const,
    bottom: 16,
    left: 16,
    right: 16,
  },
  restaurantName: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  cuisine: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500" as const,
    marginBottom: 10,
  },
  headerInfo: {
    flexDirection: "row" as const,
    gap: 10,
  },
  infoBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  infoBadgeText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
  compactHeader: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  compactHeaderContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  compactBackButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  compactTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#1F2937",
    letterSpacing: -0.2,
  },
  compactInfo: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginTop: 2,
    gap: 4,
  },
  compactInfoText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500" as const,
  },
  compactDot: {
    fontSize: 11,
    color: "#D1D5DB",
  },
  compactActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  compactSearchContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  compactSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500" as const,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
  },
  searchInputContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500" as const,
  },
  deliveryInfo: {
    flexDirection: "row" as const,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryCard: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    paddingHorizontal: 4,
  },
  deliveryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexShrink: 0,
  },
  deliveryIconOrange: {
    backgroundColor: "#FEF3C7",
  },
  deliveryIconPurple: {
    backgroundColor: "#EDE9FE",
  },
  deliveryCardContent: {
    alignItems: "flex-start" as const,
    flexShrink: 0,
  },
  deliveryCardDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E5E7EB",
  },
  deliveryLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500" as const,
    marginBottom: 1,
  },
  deliveryValue: {
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "700" as const,
  },
  promoContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  promoBanner: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  promoIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(217, 119, 6, 0.15)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  promoText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#92400E",
  },
  categorySection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  screenLabel: {
    paddingVertical: 20,
    alignItems: "center" as const,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
  cartFloatingBar: {
    position: "absolute" as const,
    left: 16,
    right: 16,
    backgroundColor: "#10B981",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  cartBarLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  cartBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  cartBadgeText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  cartBarText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  cartBarPrice: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});
