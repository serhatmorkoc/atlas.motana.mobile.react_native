import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { router } from "expo-router";
import { 
  UtensilsCrossed, ShoppingCart, Store, Heart, Sparkles, Pill, PawPrint, 
  Smartphone, BookOpen, Gift, Dumbbell, Home, Gamepad2, Car, Shirt, 
  Coffee, Croissant, Wine, Baby, Leaf 
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const iconMap: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>> = {
  UtensilsCrossed, ShoppingCart, Store, Heart, Sparkles, Pill, PawPrint,
  Smartphone, BookOpen, Gift, Dumbbell, Home, Gamepad2, Car, Shirt,
  Coffee, Croissant, Wine, Baby, Leaf,
};

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    icon: string;
    color: string;
  };
  onPress?: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon];

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/search/results" as any,
        params: { category: category.name },
      });
    }
  };
  
  return (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7} onPress={handlePress}>
      <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}15` }]}>
        {IconComponent && <IconComponent size={28} color={category.color} strokeWidth={2} />}
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    width: (width - 64) / 5,
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    lineHeight: 14,
  },
});
