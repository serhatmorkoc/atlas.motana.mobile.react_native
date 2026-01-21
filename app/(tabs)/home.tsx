import React, { useEffect, useRef, useState, useCallback, useMemo, Suspense } from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Bike, AlertCircle } from "lucide-react-native";

import { offers } from "@/mocks/offers"; // TODO: Replace with DB offers when table exists
import { categories } from "@/constants/categories";
import { useStores } from "@/hooks/useStores";
import { Store } from "@/types/store.types";
import LoadingScreen from "@/components/common/LoadingScreen";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useUserAddresses } from "@/hooks/useUserAddresses";
import { useFocusEffect } from "expo-router";

import { 
  CategoryCard, 
  StoreCard, 
  OfferCard, 
  HomeHeader
} from "@/components/home";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;
const OFFER_SIDE_SPACING = 16;

function HomeContent() {
  const insets = useSafeAreaInsets();
  const offerScrollRef = useRef<ScrollView>(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const totalOffers = offers.length;
  
  // Debug: Log home screen mount
  React.useEffect(() => {
    console.log('[Home] STEP 1: Home screen mounted');
    console.log('[Home] STEP 1: Checking Relay environment...');
    const { config } = require('@/config/env');
    console.log('[Home] STEP 1: Config check:', {
      supabaseUrl: config.supabaseUrl ? '✅' : '❌',
      supabaseGraphqlUrl: config.supabaseGraphqlUrl ? '✅' : '❌',
    });
  }, []);
  
  // Fetch selected address
  console.log('[Home] STEP 2: Calling useUserAddresses...');
  const { addresses, loading: addressesLoading, refetch: refetchAddresses } = useUserAddresses();
  const selectedAddress = React.useMemo(() => {
    const found = addresses.find(addr => addr.selected);
    return found ? { title: found.title, address: found.address } : null;
  }, [addresses]);

  // Get selected address coordinates for distance calculation
  const userLocation = React.useMemo(() => {
    const found = addresses.find(addr => addr.selected);
    if (found && found.latitude && found.longitude) {
      return { latitude: found.latitude, longitude: found.longitude };
    }
    return null;
  }, [addresses]);

  console.log('[Home] STEP 3: Calling useStores...');
  const { stores, loading: storesLoading, error: storesError, refetch } = useStores({
    limit: 50, // Fetch more stores for filtering
    isActive: true,
    // isAvailable is NOT filtered - we want to show closed stores too (grayed out)
    userLocation, // Pass selected address coordinates for distance calculation
  });

  /**
   * We want Home to feel like "one operation":
   * - fetch stores
   * - fetch selected address (for location)
   * - calculate distances (async)
   * Then render ONCE (no flicker).
   *
   * After the first ready render, we allow background updates without blocking the UI.
   */
  const [initialReady, setInitialReady] = useState(false);

  useEffect(() => {
    if (initialReady) return;

    // If stores are not available yet, keep waiting.
    if (stores.length === 0) return;

    // Wait for addresses (if any) to load so userLocation is stable.
    if (addressesLoading) return;

    // If we have a userLocation, wait for distance calculation to finish.
    if (userLocation && storesLoading) return;

    setInitialReady(true);
  }, [initialReady, stores.length, addressesLoading, userLocation, storesLoading]);

  // Refetch address when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetchAddresses().catch((err: any) => {
        // Ignore AbortError - it's normal when component unmounts or query is cancelled
        if (err?.name === 'AbortError' || err?.message === 'The operation was aborted.') {
          return;
        }
        // Show error modal for other errors
        setErrorMessage(err?.message || 'Failed to refresh address information. Please try again.');
        setErrorModalVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, [refetchAddresses, fadeAnim])
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([refetch(), refetchAddresses()]);
    } catch (err: any) {
      // Ignore AbortError - it's normal when component unmounts or query is cancelled
      if (err?.name !== 'AbortError' && err?.message !== 'The operation was aborted.') {
        setErrorMessage(err?.message || 'Failed to refresh data. Please try again.');
        setErrorModalVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleCloseErrorModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setErrorModalVisible(false);
    });
  };
  
  // Memoize store lists to prevent unnecessary recalculations
  const brandStores = useMemo(() => stores.slice(0, 10), [stores]);
  const popularStores = useMemo(() => stores.slice(0, 10), [stores]);
  const newStores = useMemo(() => [...stores].reverse().slice(0, 10), [stores]);
  const topRatedStores = useMemo(() => 
    [...stores].sort((a, b) => b.rating - a.rating).slice(0, 10), 
    [stores]
  );
  const fastestStores = useMemo(() => 
    [...stores].sort(
      (a, b) =>
        parseInt(a.deliveryTime.split("-")[0]) -
        parseInt(b.deliveryTime.split("-")[0])
    ).slice(0, 10),
    [stores]
  );
  const budgetFriendly = useMemo(() => 
    [...stores].sort((a, b) => parseInt(a.deliveryFee.replace('₺', '')) - parseInt(b.deliveryFee.replace('₺', ''))).slice(0, 10),
    [stores]
  );
  const fineDining = useMemo(() => 
    stores.filter(r => r.rating >= 4.7).slice(0, 10),
    [stores]
  );
  const reorderedBrands = brandStores;
  
  const loopedOffers = useMemo(() => [...offers, ...offers, ...offers], []);
  const initialScrollIndex = offers.length;

  useEffect(() => {
    setTimeout(() => {
      offerScrollRef.current?.scrollTo({
        x: initialScrollIndex * (CARD_WIDTH + 12),
        animated: false,
      });
    }, 50);
  }, [initialScrollIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentOfferIndex + 1;
      setCurrentOfferIndex(nextIndex);
      offerScrollRef.current?.scrollTo({
        x: (initialScrollIndex + nextIndex) * (CARD_WIDTH + 12),
        animated: true,
      });
      
      if (nextIndex >= totalOffers) {
        setTimeout(() => {
          setCurrentOfferIndex(0);
          offerScrollRef.current?.scrollTo({
            x: initialScrollIndex * (CARD_WIDTH + 12),
            animated: false,
          });
        }, 350);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentOfferIndex, totalOffers, initialScrollIndex]);

  const handleOfferScrollEnd = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + 12));
    const actualIndex = (index - initialScrollIndex + totalOffers) % totalOffers;
    
    if (index < totalOffers) {
      offerScrollRef.current?.scrollTo({
        x: (index + totalOffers) * (CARD_WIDTH + 12),
        animated: false,
      });
    } else if (index >= totalOffers * 2) {
      offerScrollRef.current?.scrollTo({
        x: (index - totalOffers) * (CARD_WIDTH + 12),
        animated: false,
      });
    }
    
    if (actualIndex !== currentOfferIndex) {
      setCurrentOfferIndex(actualIndex);
    }
  };

  // Initial load: block rendering until everything is ready (stores + distance).
  if (!initialReady) {
    // If we already know there are no stores, show the empty state instead of infinite loading.
    if (!storesLoading && stores.length === 0 && !storesError) {
      return (
        <View style={styles.container}>
          <HomeHeader insets={insets} selectedAddress={selectedAddress} />
          <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
            <Text style={{ color: "#6B7280", fontWeight: "600" }}>
              No stores found in DB.
            </Text>
          </View>
        </View>
      );
    }

    return <LoadingScreen title="Loading home…" subtitle="Preparing your feed" />;
  }

  if (storesError) {
    return (
      <View style={styles.container}>
        <HomeHeader insets={insets} selectedAddress={selectedAddress} />
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ color: "#DC2626", fontWeight: "700" }}>Failed to load stores</Text>
          <Text style={{ color: "#6B7280", marginTop: 6 }}>
            {String(storesError.message || storesError)}
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            activeOpacity={0.85}
            style={{
              marginTop: 14,
              alignSelf: "flex-start",
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 12,
              backgroundColor: "#FF6B35",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (stores.length === 0) {
    return (
      <View style={styles.container}>
        <HomeHeader insets={insets} selectedAddress={selectedAddress} />
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ color: "#6B7280", fontWeight: "600" }}>
            No stores found in DB.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeHeader insets={insets} selectedAddress={selectedAddress ? { title: selectedAddress.title, address: selectedAddress.address } : null} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 16 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B35"
          />
        }
      >
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesGrid}>
            {categories.slice(0, 10).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Offers in your area</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <ScrollView
            ref={offerScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offerScroll}
            snapToInterval={CARD_WIDTH + 12}
            decelerationRate="fast"
            onMomentumScrollEnd={handleOfferScrollEnd}
          >
            {loopedOffers.map((offer, index) => (
              <OfferCard key={`${offer.id}-${index}`} offer={offer} />
            ))}
          </ScrollView>
          <View style={styles.paginationContainer}>
            {offers.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentOfferIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>The brands you know</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {reorderedBrands.slice(0, 10).map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What&apos;s popular</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {popularStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New on Motana Food</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {newStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top rated</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {topRatedStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fastest delivery</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {fastestStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget friendly</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {budgetFriendly.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fine dining</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {fineDining.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Local favorites</Text>
            <View style={styles.seeAllBadge}>
              <Text style={styles.seeAllText}>see all</Text>
            </View>
          </View>
          <View style={styles.gridContainer}>
            {stores.slice(3, 9).map((store) => (
               <GridStoreCard key={store.id} store={store} />
            ))}
          </View>
        </View>
        <View style={styles.footerLogo}>
          <Text style={styles.screenLabelText}>Home Screen</Text>
        </View>
      </ScrollView>

      {/* Error Modal */}
      <Modal
        visible={errorModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseErrorModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseErrorModal}
          />
          <Animated.View
            style={[
              styles.errorModalContent,
              {
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.errorModalIcon}>
              <AlertCircle size={28} color="#EF4444" />
            </View>
            <Text style={styles.errorModalTitle}>Error</Text>
            <Text style={styles.errorModalMessage}>
              {errorMessage}
            </Text>
            <TouchableOpacity
              style={styles.errorModalButton}
              onPress={handleCloseErrorModal}
              activeOpacity={0.7}
            >
              <Text style={styles.errorModalButtonText}>OK</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

// Wrapper component with error boundary
export default function HomeScreen() {
  const [resetKey, setResetKey] = useState(0);
  
  const handleReset = useCallback(() => {
    setResetKey(prev => prev + 1);
  }, []);
  
  return (
    <ErrorBoundary key={resetKey} onReset={handleReset}>
      <Suspense fallback={<LoadingScreen title="Loading home..." subtitle="Preparing your feed" />}>
        <HomeContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function GridStoreCard({ store }: { store: Store }) {
  const isClosed = store.isAvailable === false;

  const handlePress = () => {
    if (isClosed) return;
    router.push(`/store/${store.id}` as any);
  };

  return (
    <TouchableOpacity 
      style={[styles.gridCard, isClosed && styles.gridCardClosed]}
      onPress={handlePress}
      activeOpacity={isClosed ? 1 : 0.7}
      disabled={isClosed}
    >
      <View style={styles.gridImageContainer}>
        <Image
          source={{ uri: store.image }}
          style={[styles.gridImage, isClosed && styles.gridImageClosed]}
          contentFit="cover"
          placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
        />
        {isClosed && (
          <View style={styles.gridClosedOverlay}>
            <View style={styles.gridClosedBadge}>
              <Text style={styles.gridClosedText}>CLOSED</Text>
            </View>
          </View>
        )}
      </View>
      <View style={[styles.gridContent, isClosed && styles.gridContentClosed]}>
        <Text style={[styles.gridName, isClosed && styles.textClosed]} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={[styles.gridCuisine, isClosed && styles.textClosed]} numberOfLines={1}>
          {store.cuisine}
        </Text>
        <View style={styles.gridMetaRow}>
          <Text style={[styles.gridRating, isClosed && styles.textClosed]}>⭐ {store.rating}</Text>
          <View style={styles.gridTimeContainer}>
            <Bike size={10} color={isClosed ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
            <Text style={[styles.gridTime, isClosed && styles.textClosed]}>{store.deliveryTime}</Text>
          </View>
        </View>
        <View style={styles.gridFooter}>
          <Text style={[styles.gridFee, isClosed && styles.textClosed]}>{store.deliveryFee}</Text>
          <Text style={[styles.gridDistance, isClosed && styles.textClosed]}>{store.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  categoriesSection: {
    marginBottom: 16,
    paddingTop: 8,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  seeAllBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  seeAllText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 2,
  },
  offerScroll: {
    paddingHorizontal: OFFER_SIDE_SPACING,
    gap: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: "#FF6B35",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  gridCard: {
    width: (width - 44) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  gridImage: {
    width: "100%",
    height: 130,
  },
  gridContent: {
    padding: 12,
  },
  gridName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  gridCuisine: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
    fontWeight: "500",
  },
  gridMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  gridRating: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "600",
  },
  gridTime: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  errorModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    width: "85%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  errorModalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  errorModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  errorModalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  errorModalButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  errorModalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  gridTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  gridFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridFee: {
    fontSize: 13,
    color: "#FF6B35",
    fontWeight: "700",
  },
  gridDistance: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  footerLogo: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#E5E7EB",
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
  // Grid card closed state styles
  gridCardClosed: {
    opacity: 0.85,
  },
  gridImageContainer: {
    position: "relative" as const,
  },
  gridImageClosed: {
    opacity: 0.4,
  },
  gridClosedOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  gridClosedBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gridClosedText: {
    fontSize: 12,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  gridContentClosed: {
    backgroundColor: "#F9FAFB",
  },
  textClosed: {
    color: "#9CA3AF",
  },
});
