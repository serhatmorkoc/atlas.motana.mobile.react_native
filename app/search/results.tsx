import { StoreCard, StoreListCard } from "@/components/home";
import { formatPrice } from "@/utils/formatters";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStores } from "@/hooks/useStores";
import { useUserAddresses } from "@/hooks/useUserAddresses";
import { Store } from "@/types/store.types";
import { apolloClient } from "@/lib/apollo/client";
import { GET_STORE_PRODUCTS } from "@/lib/apollo/queries/products";
import { MenuItem } from "@/types/menu.types";
import { Image } from "expo-image";
import { optimizeImageUrl } from "@/utils/helpers";

const { width } = Dimensions.get("window");

// In-memory cache for store preview products to avoid refetching when navigating
// back/forth within the same app session.
const STORE_PREVIEW_TTL_MS = 2 * 60 * 1000; // 2 minutes
const storePreviewCache = new Map<string, { items: MenuItem[]; ts: number }>();

interface GraphQLProduct {
  id: string;
  product_category_id: string | null;
  store_id: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  price: string;
  old_price: string | null;
  stock_quantity: number | null;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

interface GetStoreProductsData {
  productsCollection: {
    edges: Array<{
      node: GraphQLProduct;
    }>;
  };
}

export default function SearchResultsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ query?: string; category?: string }>();
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "distance">("relevance");
  const [storeMenuItemsMap, setStoreMenuItemsMap] = useState<Record<string, MenuItem[]>>({});
  const storeMenuItemsMapRef = useRef<Record<string, MenuItem[]>>({});
  const inFlightStoreIdsRef = useRef<Set<string>>(new Set());
  const [initialReady, setInitialReady] = useState(false);

  // Fetch selected address for distance calculation
  const { addresses, loading: addressesLoading } = useUserAddresses();
  const userLocation = React.useMemo(() => {
    const found = addresses.find(addr => addr.selected);
    if (found && found.latitude && found.longitude) {
      return { latitude: found.latitude, longitude: found.longitude };
    }
    return null;
  }, [addresses]);

  // Fetch stores from DB - filter by store_categories_id = 1
  const { stores, loading: storesLoading, error: storesError } = useStores({
    limit: 50,
    userLocation, // Pass selected address coordinates for distance calculation
  }) as { stores: Store[]; loading: boolean; error: any };

  // Filter stores by store_categories_id = 1
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const storeCategoryId = store.storeCategoriesId;
      const storeCategoryIdNum = typeof storeCategoryId === 'string' ? Number(storeCategoryId) : storeCategoryId;
      return storeCategoryIdNum === 1; 
    });
  }, [stores]);

  const isStoresCategory = params.category === "Stores";

  const { matchingStores, matchingMenuItems } = useMemo(() => {
    const searchTerm = (params.query || "").toLowerCase();
    const categoryFilter = params.category;

    let filtered: Store[] = [];
    let filteredMenuItems: MenuItem[] = [];

    if (categoryFilter) {
      // Already filtered by store_categories_id = 1
      filtered = filteredStores;
    } else if (searchTerm) {
      filtered = filteredStores.filter(r =>
        r.name.toLowerCase().includes(searchTerm) ||
        r.cuisine.toLowerCase().includes(searchTerm)
      );
    } else {
      filtered = filteredStores;
    }

    if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "distance") {
      filtered.sort((a, b) => {
        const distA = parseFloat(a.distance.replace(" km", ""));
        const distB = parseFloat(b.distance.replace(" km", ""));
        return distA - distB;
      });
    }

    return { 
      matchingStores: filtered, 
      matchingMenuItems: filteredMenuItems,
    };
  }, [params.query, params.category, sortBy, filteredStores]);

  const storeIdsForPreviewKey = useMemo(() => {
    return matchingStores.map((s) => s.id).slice().sort().join(",");
  }, [matchingStores]);

  // Reset initial gate when the result set changes.
  useEffect(() => {
    setInitialReady(false);
  }, [storeIdsForPreviewKey, isStoresCategory]);

  // Keep a ref for latest products map so we can fetch incrementally without re-running effects.
  useEffect(() => {
    storeMenuItemsMapRef.current = storeMenuItemsMap;
  }, [storeMenuItemsMap]);

  // Fetch preview products for stores shown on this screen.
  useEffect(() => {
    const storeIds = matchingStores.map((s) => s.id);

    let cancelled = false;

    // If no stores, clear state.
    if (storeIds.length === 0) {
      setStoreMenuItemsMap({});
      inFlightStoreIdsRef.current.clear();
      return;
    }

    const safeNumber = (value: string | null | undefined): number => {
      const n = value ? Number(value) : 0;
      return Number.isFinite(n) ? n : 0;
    };

    const fetchForStoreId = async (storeId: string) => {
      try {
        const result = await apolloClient.query({
          query: GET_STORE_PRODUCTS,
          variables: { storeId, first: 8 },
          fetchPolicy: 'network-only',
        });

        const products: MenuItem[] = (result.data?.productsCollection?.edges || []).map((edge: any) => {
          const p = edge.node;
          return {
            id: p.id,
            storeId: p.store_id ?? storeId,
            name: p.title ?? "Unnamed",
            description: p.description ?? "",
            price: safeNumber(p.price),
            image: p.image ?? "",
            category: "Other",
            // `MenuItem.popular` is `boolean | undefined` (no `null`)
            popular: p.is_popular ?? undefined,
            extras: [],
          };
        });

        if (!cancelled) {
          storePreviewCache.set(storeId, { items: products, ts: Date.now() });
          setStoreMenuItemsMap((prev) => ({ ...prev, [storeId]: products }));
        }
      } catch {
        if (!cancelled) {
          storePreviewCache.set(storeId, { items: [], ts: Date.now() });
          setStoreMenuItemsMap((prev) => ({ ...prev, [storeId]: [] }));
        }
      } finally {
        inFlightStoreIdsRef.current.delete(storeId);
      }
    };

    const run = async () => {
      const currentMap = storeMenuItemsMapRef.current;
      // First, hydrate from cache if available/fresh.
      for (const id of storeIds) {
        if (Object.prototype.hasOwnProperty.call(currentMap, id)) continue;
        const cached = storePreviewCache.get(id);
        if (cached && Date.now() - cached.ts < STORE_PREVIEW_TTL_MS) {
          setStoreMenuItemsMap((prev) =>
            Object.prototype.hasOwnProperty.call(prev, id) ? prev : { ...prev, [id]: cached.items }
          );
        }
      }

      const missingIds = storeIds.filter((id) => {
        if (Object.prototype.hasOwnProperty.call(currentMap, id)) return false;
        if (inFlightStoreIdsRef.current.has(id)) return false;
        const cached = storePreviewCache.get(id);
        if (cached && Date.now() - cached.ts < STORE_PREVIEW_TTL_MS) return false;
        return true;
      });

      if (missingIds.length === 0) return;

      // Concurrency limit to avoid hammering the network.
      const concurrency = 3;
      const queue = [...missingIds];
      const workers = Array.from({ length: Math.min(concurrency, queue.length) }, () =>
        (async () => {
          while (!cancelled && queue.length > 0) {
            const id = queue.shift();
            if (!id) return;
            inFlightStoreIdsRef.current.add(id);
            await fetchForStoreId(id);
          }
        })()
      );

      await Promise.all(workers);
    };

    run();

    return () => {
      cancelled = true;
    };
    // Intentionally depend on a stable key instead of the full array.
  }, [storeIdsForPreviewKey]);

  const totalResults = matchingStores.length + matchingMenuItems.length;

  const handleMenuItemPress = (item: MenuItem) => {
    router.push(`/store/${item.storeId}` as any);
  };

  // Gate: open screen only after everything is loaded (stores + distance + previews).
  const previewsReady =
    matchingStores.length === 0
      ? true
      : matchingStores.every((s) => Object.prototype.hasOwnProperty.call(storeMenuItemsMap, s.id));

  const shouldGate =
    // Wait for addresses so userLocation/distance ordering is stable.
    addressesLoading ||
    // Wait for distance calculation (useStores sets loading while calculating distances).
    storesLoading ||
    // If this screen renders store previews, wait for all previews to be fetched.
    (isStoresCategory && !previewsReady);

  useEffect(() => {
    if (initialReady) return;
    if (storesError) return;
    if (shouldGate) return;
    setInitialReady(true);
  }, [initialReady, storesError, shouldGate]);

  if (!initialReady) {
    return (
      <View style={styles.container}>
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
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      </View>
    );
  }

  if (storesError) {
    return (
      <View style={styles.container}>
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
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Failed to load stores</Text>
          <Text style={styles.emptyText}>
            {String(storesError.message || storesError)}
          </Text>
        </View>
      </View>
    );
  }

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
                        loadingMenuItems={false}
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
                    <Image
                      source={{ uri: optimizeImageUrl(item.image) }}
                      style={styles.menuItemImage}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                      transition={200}
                      placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
                    />
                    <View style={styles.menuItemOverlay}>
                      <View style={styles.menuItemInfo}>
                        <Text style={styles.menuItemName} numberOfLines={2}>
                          {item.name}
                        </Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
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
    gap: 2,
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
