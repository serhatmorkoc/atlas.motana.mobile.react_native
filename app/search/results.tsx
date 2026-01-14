import { stores } from "@/mocks/stores";
import { menuItems } from "@/mocks/menu-items";
import { StoreCard, StoreListCard } from "@/components/home";
import { formatPrice } from "@/utils/formatters";
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
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  storeName?: string;
};

type Store = {
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
    "Stores": { cuisineKeywords: ["italian", "pizza", "fast food", "burgers", "japanese", "sushi", "turkish", "kebab", "mexican", "tacos", "asian", "noodles", "steakhouse", "bbq"], menuKeywords: [] },
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

  const isStoresCategory = params.category === "Stores";

  const { matchingStores, matchingMenuItems, storeMenuItemsMap } = useMemo(() => {
    const searchTerm = (params.query || "").toLowerCase();
    const categoryFilter = params.category;

    let filteredStores: Store[] = [];
    let filteredMenuItems: MenuItem[] = [];

    if (categoryFilter) {
      const { cuisineKeywords, menuKeywords } = getCategoryMapping(categoryFilter);
      
      filteredStores = stores.filter(r => {
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
      filteredStores = stores.filter(r =>
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
      storeName: stores.find(r => r.id === item.storeId)?.name,
    }));

    if (sortBy === "rating") {
      filteredStores.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "distance") {
      filteredStores.sort((a, b) => {
        const distA = parseFloat(a.distance.replace(" km", ""));
        const distB = parseFloat(b.distance.replace(" km", ""));
        return distA - distB;
      });
    }

    const menuItemsMap: Record<string, { id: string; name: string; image: string; price: number }[]> = {};
    filteredStores.forEach(store => {
      const storeMenuItems = menuItems
        .filter(item => item.storeId === store.id)
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
        }));
      menuItemsMap[store.id] = storeMenuItems;
    });

    return { 
      matchingStores: filteredStores, 
      matchingMenuItems: filteredMenuItems,
      storeMenuItemsMap: menuItemsMap,
    };
  }, [params.query, params.category, sortBy]);

  const totalResults = matchingStores.length + matchingMenuItems.length;

  const handleMenuItemPress = (item: MenuItem) => {
    router.push(`/store/${item.storeId}` as any);
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
          {matchingStores.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Stores</Text>
                <Text style={styles.sectionCount}>{matchingStores.length}</Text>
              </View>
              {isStoresCategory ? (
                <View style={styles.verticalList}>
                  {matchingStores.map((store) => (
                    <View key={store.id} style={styles.verticalListItem}>
                      <StoreListCard 
                        store={store} 
                        menuItems={storeMenuItemsMap[store.id] || []}
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
                  {matchingStores.map((store) => (
                    <View key={store.id} style={styles.cardWrapper}>
                      <StoreCard store={store} />
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
                        {item.storeName && (
                          <Text style={styles.storeName} numberOfLines={1}>
                            {item.storeName}
                          </Text>
                        )}
                      </View>
                      <View style={styles.priceTag}>
                        <Text style={styles.price}>{formatPrice(item.price)}</Text>
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
  storeName: {
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
