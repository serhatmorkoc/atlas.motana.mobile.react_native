import { restaurants } from "@/mocks/restaurants";
import { menuItems } from "@/mocks/menu-items";
import { RestaurantCard, RestaurantListCard } from "@/components/home";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantName?: string;
};

type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  deliveryFee: string;
  distance: string;
};

const getCategoryMapping = (categoryName: string): { cuisineKeywords: string[]; menuKeywords: string[] } => {
  const mappings: Record<string, { cuisineKeywords: string[]; menuKeywords: string[] }> = {
    "Restaurants": { cuisineKeywords: ["italian", "pizza", "fast food", "burgers", "japanese", "sushi", "turkish", "kebab", "mexican", "tacos", "asian", "noodles", "steakhouse", "bbq"], menuKeywords: [] },
    "Cafe & Bakery": { cuisineKeywords: ["coffee", "cafe", "bakery"], menuKeywords: ["coffee", "pastry", "cake", "croissant"] },
    "Bakery": { cuisineKeywords: ["bakery", "bread"], menuKeywords: ["bread", "pastry", "cake", "croissant"] },
    "Groceries": { cuisineKeywords: ["grocery", "market"], menuKeywords: [] },
    "Market": { cuisineKeywords: ["market", "grocery"], menuKeywords: [] },
    "Health & Wellness": { cuisineKeywords: ["healthy", "vegan", "organic", "salad"], menuKeywords: ["salad", "smoothie", "juice"] },
    "Pharmacy": { cuisineKeywords: ["pharmacy"], menuKeywords: [] },
  };

  const normalized = categoryName.toLowerCase();
  for (const [key, value] of Object.entries(mappings)) {
    if (key.toLowerCase() === normalized) {
      return value;
    }
  }
  
  return { cuisineKeywords: [normalized], menuKeywords: [normalized] };
};

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ query?: string; category?: string }>();
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "distance">("relevance");

  const isRestaurantsCategory = params.category === "Restaurants";

  const { matchingRestaurants, matchingMenuItems, restaurantMenuItemsMap } = useMemo(() => {
    const searchTerm = (params.query || "").toLowerCase();
    const categoryFilter = params.category;

    let filteredRestaurants: Restaurant[] = [];
    let filteredMenuItems: MenuItem[] = [];

    if (categoryFilter) {
      const { cuisineKeywords, menuKeywords } = getCategoryMapping(categoryFilter);
      
      filteredRestaurants = restaurants.filter(r => {
        const cuisineLower = r.cuisine.toLowerCase();
        return cuisineKeywords.some(keyword => cuisineLower.includes(keyword));
      });

      if (menuKeywords.length > 0) {
        filteredMenuItems = menuItems.filter(item => {
          const itemCategoryLower = item.category.toLowerCase();
          const itemNameLower = item.name.toLowerCase();
          return menuKeywords.some(keyword => 
            itemCategoryLower.includes(keyword) || itemNameLower.includes(keyword)
          );
        }).slice(0, 20);
      }
    } else if (searchTerm) {
      filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm) ||
        r.cuisine.toLowerCase().includes(searchTerm)
      );

      filteredMenuItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      ).slice(0, 20);
    }

    filteredMenuItems = filteredMenuItems.map(item => ({
      ...item,
      restaurantName: restaurants.find(r => r.id === item.restaurantId)?.name,
    }));

    if (sortBy === "rating") {
      filteredRestaurants.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "distance") {
      filteredRestaurants.sort((a, b) => {
        const distA = parseFloat(a.distance.replace(" km", ""));
        const distB = parseFloat(b.distance.replace(" km", ""));
        return distA - distB;
      });
    }

    const menuItemsMap: Record<string, { id: string; name: string; image: string; price: number }[]> = {};
    filteredRestaurants.forEach(restaurant => {
      const restaurantMenuItems = menuItems
        .filter(item => item.restaurantId === restaurant.id)
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
        }));
      menuItemsMap[restaurant.id] = restaurantMenuItems;
    });

    return { 
      matchingRestaurants: filteredRestaurants, 
      matchingMenuItems: filteredMenuItems,
      restaurantMenuItemsMap: menuItemsMap,
    };
  }, [params.query, params.category, sortBy]);

  const totalResults = matchingRestaurants.length + matchingMenuItems.length;

  const handleMenuItemPress = (item: MenuItem) => {
    router.push(`/restaurant/${item.restaurantId}` as any);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {params.category || "Search Results"}
          </Text>
        </View>
        <Text style={styles.resultCount}>
          {totalResults} results found
        </Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "relevance" && styles.sortButtonActive]}
            onPress={() => setSortBy("relevance")}
          >
            <Text style={[styles.sortButtonText, sortBy === "relevance" && styles.sortButtonTextActive]}>
              Relevance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "rating" && styles.sortButtonActive]}
            onPress={() => setSortBy("rating")}
          >
            <Text style={[styles.sortButtonText, sortBy === "rating" && styles.sortButtonTextActive]}>
              Rating
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "distance" && styles.sortButtonActive]}
            onPress={() => setSortBy("distance")}
          >
            <Text style={[styles.sortButtonText, sortBy === "distance" && styles.sortButtonTextActive]}>
              Distance
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {totalResults === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>
            Try searching for something else or browse categories
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {matchingRestaurants.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Restaurants</Text>
                <Text style={styles.sectionCount}>{matchingRestaurants.length}</Text>
              </View>
              {isRestaurantsCategory ? (
                <View style={styles.verticalList}>
                  {matchingRestaurants.map((restaurant) => (
                    <View key={restaurant.id} style={styles.verticalListItem}>
                      <RestaurantListCard 
                        restaurant={restaurant} 
                        menuItems={restaurantMenuItemsMap[restaurant.id] || []}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScroll}
                >
                  {matchingRestaurants.map((restaurant) => (
                    <View key={restaurant.id} style={styles.cardWrapper}>
                      <RestaurantCard restaurant={restaurant} />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {matchingMenuItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Items</Text>
                <Text style={styles.sectionCount}>{matchingMenuItems.length}</Text>
              </View>
              <View style={styles.menuItemsGrid}>
                {matchingMenuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItemCard}
                    activeOpacity={0.7}
                    onPress={() => handleMenuItemPress(item)}
                  >
                    <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                    <View style={styles.menuItemOverlay}>
                      <View style={styles.menuItemInfo}>
                        <Text style={styles.menuItemName} numberOfLines={2}>
                          {item.name}
                        </Text>
                        {item.restaurantName && (
                          <Text style={styles.restaurantName} numberOfLines={1}>
                            {item.restaurantName}
                          </Text>
                        )}
                      </View>
                      <View style={styles.priceTag}>
                        <Text style={styles.price}>₺{item.price.toFixed(2)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.screenLabel}>
            <Text style={styles.screenLabelText}>Search Results Screen</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTop: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
    flex: 1,
    marginLeft: 12,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: "row" as const,
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  sortButtonActive: {
    backgroundColor: "#FF6B35",
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6B7280",
  },
  sortButtonTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#9CA3AF",
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  cardWrapper: {
    marginRight: 0,
  },
  menuItemsGrid: {
    paddingHorizontal: 16,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  menuItemCard: {
    width: (width - 44) / 2,
    height: 200,
    borderRadius: 16,
    overflow: "hidden" as const,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  menuItemImage: {
    width: "100%",
    height: "100%",
    position: "absolute" as const,
  },
  menuItemOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between" as const,
    padding: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: "rgba(255,255,255,0.8)",
  },
  priceTag: {
    backgroundColor: "#FF6B35",
    alignSelf: "flex-start" as const,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center" as const,
    paddingHorizontal: 32,
  },
  verticalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  verticalListItem: {
    marginBottom: 0,
  },
  screenLabel: {
    paddingVertical: 12,
    alignItems: "center" as const,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
});
