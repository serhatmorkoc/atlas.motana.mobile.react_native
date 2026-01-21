import { Image } from "expo-image";
import { Check, ImageOff, Minus, Plus, Star, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MenuItem } from "@/types/menu.types";
import { useProductVariations } from "@/hooks/useProductVariations";
import { optimizeImageUrl } from "@/utils/helpers";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ProductDetailModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, extras: Set<string>) => void;
}

export default function ProductDetailModal({
  visible,
  item,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());

  const {
    extras: variationExtras,
    loading: variationsLoading,
    error: variationsError,
  } = useProductVariations(item?.id);

  const effectiveExtras = variationExtras.length ? variationExtras : item?.extras ?? [];

  const toggleExtra = (extraId: string) => {
    const newExtras = new Set(selectedExtras);
    if (newExtras.has(extraId)) {
      newExtras.delete(extraId);
    } else {
      newExtras.add(extraId);
    }
    setSelectedExtras(newExtras);
  };

  const calculateTotalPrice = () => {
    if (!item) return 0;
    let total = item.price * quantity;
    effectiveExtras.forEach((extra) => {
      if (selectedExtras.has(extra.id)) {
        total += extra.price * quantity;
      }
    });
    return total;
  };

  const handleAddToCart = () => {
    if (item) {
      // Ensure extras come from DB variations when available
      const enrichedItem: MenuItem = {
        ...item,
        extras: effectiveExtras,
      };

      onAddToCart(enrichedItem, quantity, selectedExtras);
      setQuantity(1);
      setSelectedExtras(new Set());
      onClose();
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setSelectedExtras(new Set());
    onClose();
  };

  const extras = effectiveExtras;

  const renderExtraSection = (
    title: string,
    extras: MenuItem['extras']
  ) => {
    if (!extras || extras.length === 0) return null;

    return (
      <View style={styles.extrasSection}>
        <View style={styles.extrasSectionHeader}>
          <Text style={styles.extrasSectionTitle}>{title}</Text>
        </View>

        {extras.map((extra) => (
          <TouchableOpacity
            key={extra.id}
            style={styles.extraItem}
            onPress={() => toggleExtra(extra.id)}
            activeOpacity={0.7}
          >
            <View style={styles.extraItemLeft}>
              <View
                style={[
                  styles.extraCheckbox,
                  selectedExtras.has(extra.id) && styles.extraCheckboxChecked,
                ]}
              >
                {selectedExtras.has(extra.id) && (
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                )}
              </View>
              <Text style={styles.extraItemName}>{extra.name}</Text>
            </View>
            <Text style={styles.extraItemPrice}>+₺{extra.price.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View
        style={[styles.productModalContainer, { paddingBottom: insets.bottom }]}
      >
        <View
          style={[
            styles.productModalHeader,
            { paddingTop: insets.top > 0 ? insets.top : 16 },
          ]}
        >
          <View style={styles.modalHandle} />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <X size={22} color="#1F2937" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {item && (
          <>
            <ScrollView
              style={styles.productModalScroll}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              {variationsLoading && (
                <Text style={styles.variationStatusText}>Loading options…</Text>
              )}
              {!variationsLoading && variationsError && (
                <Text style={styles.variationStatusText}>
                  Failed to load options (showing base product).
                </Text>
              )}
              {item.image ? (
                <Image
                  source={{ uri: optimizeImageUrl(item.image) }}
                  style={styles.productImage}
                  contentFit="cover"
                  cachePolicy="none"
                />
              ) : (
                <View style={styles.noImageContainer}>
                  <ImageOff size={48} color="#D1D5DB" strokeWidth={1.5} />
                  <Text style={styles.noImageText}>No image available</Text>
                </View>
              )}

              <View style={styles.productInfo}>
                {item.popular && (
                  <View style={styles.productPopularBadge}>
                    <Star size={12} color="#FF6B35" fill="#FF6B35" />
                    <Text style={styles.productPopularText}>Most Popular</Text>
                  </View>
                )}
                <Text style={styles.productTitle}>{item.name}</Text>
                <Text style={styles.productDescription}>{item.description}</Text>
                <Text style={styles.productPrice}>₺{item.price.toFixed(2)}</Text>
              </View>

              {extras.length > 0 &&
                renderExtraSection("Options Choose Extras", extras)}

              <View style={styles.productModalScreenLabel}>
                <Text style={styles.productModalScreenLabelText}>
                  Product Detail Modal Screen
                </Text>
              </View>
            </ScrollView>

            <View style={styles.addToCartContainer}>
              <View style={styles.quantityControlsCompact}>
                <TouchableOpacity
                  style={[
                    styles.quantityButtonCompact,
                    quantity <= 1 && styles.quantityButtonDisabled,
                  ]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  activeOpacity={0.7}
                >
                  <Minus
                    size={18}
                    color={quantity <= 1 ? "#D1D5DB" : "#374151"}
                    strokeWidth={2.5}
                  />
                </TouchableOpacity>
                <Text style={styles.quantityValueCompact}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButtonCompact}
                  onPress={() => setQuantity(quantity + 1)}
                  activeOpacity={0.7}
                >
                  <Plus size={18} color="#374151" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
                activeOpacity={0.8}
              >
                <Text style={styles.addToCartText}>
                  Add • ₺{calculateTotalPrice().toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  productModalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  productModalHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalHandle: {
    position: "absolute" as const,
    top: 8,
    width: 36,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  modalCloseButton: {
    position: "absolute" as const,
    right: 16,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  productModalScroll: {
    flex: 1,
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: 220,
  },
  noImageContainer: {
    width: SCREEN_WIDTH,
    height: 220,
    backgroundColor: "#F9FAFB",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 12,
  },
  noImageText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500" as const,
  },
  productInfo: {
    padding: 20,
  },
  productPopularBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    alignSelf: "flex-start" as const,
    backgroundColor: "#FFF5F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
    gap: 5,
  },
  productPopularText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600" as const,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  productDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 14,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FF6B35",
  },
  variationStatusText: {
    fontSize: 12,
    color: "#6B7280",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  extrasSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  extrasSectionHeader: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  extrasSectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 2,
    marginTop: 12,
  },
  extrasSectionSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  extraItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  extraItemLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,
  },
  extraCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  extraCheckboxChecked: {
    borderColor: "#FF6B35",
    backgroundColor: "#FF6B35",
  },
  extraItemName: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500" as const,
  },
  extraItemPrice: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "600" as const,
  },
  quantityControlsCompact: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 4,
  },
  quantityButtonCompact: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityButtonDisabled: {
    backgroundColor: "#F9FAFB",
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityValueCompact: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
    minWidth: 32,
    textAlign: "center" as const,
  },
  addToCartContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center" as const,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  productModalScreenLabel: {
    paddingVertical: 20,
    alignItems: "center" as const,
  },
  productModalScreenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
});

