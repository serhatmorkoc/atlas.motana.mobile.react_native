import { categories } from "@/constants/categories";
import { router } from "expo-router";
import { UtensilsCrossed, ShoppingCart, Store, Heart, Sparkles, Pill, PawPrint, Smartphone, BookOpen, Gift, Dumbbell, Home, Gamepad2, Car, Shirt, Coffee, Croissant, Wine, Baby, Leaf, Search } from "lucide-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const iconMap: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>> = {
  UtensilsCrossed,
  ShoppingCart,
  Store,
  Heart,
  Sparkles,
  Pill,
  PawPrint,
  Smartphone,
  BookOpen,
  Gift,
  Dumbbell,
  Home,
  Gamepad2,
  Car,
  Shirt,
  Coffee,
  Croissant,
  Wine,
  Baby,
  Leaf,
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/search/results" as any,
        params: { query: searchQuery },
      });
    }
  };

  const handleCategoryPress = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      router.push({
        pathname: "/search/results" as any,
        params: { category: category.name },
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + 16 },
          ]}
        >
          <View style={styles.searchInputContainer}>
            <Search color="#9CA3AF" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants, stores, items..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20, flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>All Categories</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((category) => {
                  const IconComponent = iconMap[category.icon];
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryCard}
                      activeOpacity={0.7}
                      onPress={() => handleCategoryPress(category.id)}
                    >
                      <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}15` }]}>
                        {IconComponent && <IconComponent size={32} color={category.color} strokeWidth={2} />}
                      </View>
                      <Text style={styles.categoryName} numberOfLines={2}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.screenLabel}>
                <Text style={styles.screenLabelText}>Search Screen</Text>
              </View>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  searchInputContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500" as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  categoriesSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  categoriesGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "space-between" as const,
    rowGap: 16,
  },
  categoryCard: {
    width: "23.5%",
    alignItems: "center" as const,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#374151",
    textAlign: "center" as const,
    lineHeight: 16,
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
