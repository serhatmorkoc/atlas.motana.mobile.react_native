import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ChevronLeft,
  Heart,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { favoriteStores } from "@/mocks/orders";

const { width } = Dimensions.get("window");

interface FavoriteStore {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  deliveryFee: string;
  distance: string;
  isFavorite: boolean;
}

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState<FavoriteStore[]>(favoriteStores);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<FavoriteStore | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleRemoveFavoritePress = (store: FavoriteStore) => {
    setStoreToDelete(store);
    setDeleteModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirmDelete = () => {
    if (storeToDelete) {
      setFavorites(favorites.filter((fav) => fav.id !== storeToDelete.id));
    }
    handleCloseDeleteModal();
  };

  const handleCloseDeleteModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setDeleteModalVisible(false);
      setStoreToDelete(null);
    });
  };

  const renderFavoriteCard = (store: FavoriteStore) => (
    <TouchableOpacity key={store.id} style={styles.storeCard} activeOpacity={0.7}>
      <Image
        source={{ uri: store.image }}
        style={styles.storeImage}
        contentFit="cover"
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavoritePress(store)}
      >
        <Heart size={16} color="#FFFFFF" fill="#EF4444" />
      </TouchableOpacity>
      <View style={styles.storeInfo}>
        <Text style={styles.storeName} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={styles.cuisine} numberOfLines={1}>
          {store.cuisine}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft color="#1F2937" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.subtitle}>
          {favorites.length} {favorites.length === 1 ? "store" : "stores"} saved
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {favorites.length > 0 ? (
          <>
            <View style={styles.gridContainer}>
              {favorites.map(renderFavoriteCard)}
            </View>
            <View style={styles.infoCard}>
              <Heart size={20} color="#6B7280" />
              <Text style={styles.infoText}>
                Tap the heart icon to remove from favorites.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Heart size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Start adding stores to your favorites list
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.back()}
            >
              <Text style={styles.exploreButtonText}>Explore Stores</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account / Favorites Screen</Text>
        </View>
      </ScrollView>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseDeleteModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseDeleteModal}
          />
          <Animated.View
            style={[
              styles.deleteModalContent,
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
            <View style={styles.deleteModalIcon}>
              <Trash2 size={28} color="#EF4444" />
            </View>
            <Text style={styles.deleteModalTitle}>Remove from Favorites</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to remove &quot;{storeToDelete?.name}&quot; from your favorites?
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={handleCloseDeleteModal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleConfirmDelete}
                activeOpacity={0.7}
              >
                <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.confirmDeleteButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  gridContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  storeCard: {
    width: (width - 44) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  storeImage: {
    width: "100%",
    height: 120,
  },
  removeButton: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  storeInfo: {
    padding: 12,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1F2937",
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyState: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center" as const,
  },
  exploreButton: {
    marginTop: 12,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  infoCard: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  screenLabel: {
    paddingVertical: 12,
    alignItems: "center" as const,
    marginTop: 16,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  deleteModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 340,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  deleteModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 8,
  },
  deleteModalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center" as const,
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: "row" as const,
    gap: 12,
    width: "100%",
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  cancelModalButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#6B7280",
  },
  confirmDeleteButton: {
    flex: 1,
    flexDirection: "row" as const,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
  },
  confirmDeleteButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
