import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Bike } from "lucide-react-native";

import { offers } from "@/mocks/offers";
import { brandStores, stores } from "@/mocks/stores";
import { categories } from "@/constants/categories";

import { 
  CategoryCard, 
  StoreCard, 
  OfferCard, 
  HomeHeader
} from "@/components/home";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;
const OFFER_SIDE_SPACING = 16;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const offerScrollRef = useRef<ScrollView>(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const totalOffers = offers.length;
  
  const loopedOffers = [...offers, ...offers, ...offers];
  const initialScrollIndex = offers.length;

  const popularStores = stores.slice(0, 10);
  const newStores = [...stores].reverse().slice(0, 10);
  const topRatedStores = [...stores]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  const fastestStores = [...stores]
    .sort(
      (a, b) =>
        parseInt(a.deliveryTime.split("-")[0]) -
        parseInt(b.deliveryTime.split("-")[0])
    )
    .slice(0, 10);
  const budgetFriendly = [...stores]
    .sort((a, b) => parseInt(a.deliveryFee.replace('₺', '')) - parseInt(b.deliveryFee.replace('₺', '')))
    .slice(0, 10);
  const fineDining = [...stores]
    .filter(r => r.rating >= 4.7)
    .slice(0, 10);
  const reorderedBrands = [
    ...brandStores.slice(2),
    ...brandStores.slice(0, 2)
  ];

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

  return (
    <View style={styles.container}>
      <HomeHeader insets={insets} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 16 },
        ]}
        showsVerticalScrollIndicator={false}
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
          <Text style={styles.logoText}>motana</Text>
          <Text style={styles.screenLabelText}>Home Screen</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function GridStoreCard({ store }: { store: typeof stores[0] }) {
  return (
    <TouchableOpacity 
      style={styles.gridCard}
      onPress={() => router.push(`/store/${store.id}` as any)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: store.image }}
        style={styles.gridImage}
        contentFit="cover"
        placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
      />
      <View style={styles.gridContent}>
        <Text style={styles.gridName} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={styles.gridCuisine} numberOfLines={1}>
          {store.cuisine}
        </Text>
        <View style={styles.gridMetaRow}>
          <Text style={styles.gridRating}>⭐ {store.rating}</Text>
          <View style={styles.gridTimeContainer}>
            <Bike size={10} color="#6B7280" strokeWidth={2} />
            <Text style={styles.gridTime}>{store.deliveryTime}</Text>
          </View>
        </View>
        <View style={styles.gridFooter}>
          <Text style={styles.gridFee}>{store.deliveryFee}</Text>
          <Text style={styles.gridDistance}>{store.distance}</Text>
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
    gap: 16,
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
});
