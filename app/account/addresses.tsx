import { ChevronLeft, MapPin, Plus, Home, Briefcase, Check, Edit2, Navigation, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

type Address = {
  id: number;
  title: string;
  address: string;
  type: "home" | "work" | "other";
  selected: boolean;
  floor?: string;
  building?: string;
  street?: string;
  landmark?: string;
  city?: string;
  district?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};

const mockAddresses: Address[] = [
  {
    id: 1,
    title: "Home",
    address: "Alemdağ Caddesi No:145, Ümraniye, Istanbul",
    type: "home",
    selected: true,
    floor: "5",
    building: "A Blok",
    street: "Alemdağ Caddesi No:145",
    landmark: "Near Ümraniye State Hospital",
    city: "Istanbul",
    district: "Ümraniye",
    region: "Marmara",
    postalCode: "34760",
    country: "Turkey",
    latitude: 41.0186,
    longitude: 29.1256,
  },
  {
    id: 2,
    title: "Work",
    address: "Büyükdere Caddesi No:193, Şişli, Istanbul",
    type: "work",
    selected: false,
    floor: "12",
    building: "Maya Akar Center",
    street: "Büyükdere Caddesi No:193",
    landmark: "Maya Akar Shopping Mall",
    city: "Istanbul",
    district: "Şişli",
    region: "Marmara",
    postalCode: "34394",
    country: "Turkey",
    latitude: 41.0614,
    longitude: 28.9892,
  },
  {
    id: 3,
    title: "My Office",
    address: "Polonezköy Caddesi No:47, Beykoz, Istanbul",
    type: "other",
    selected: false,
    floor: "2",
    building: "Villa Polonezkoy",
    street: "Polonezköy Caddesi No:47",
    landmark: "Near Polonezkoy Nature Park entrance",
    city: "Istanbul",
    district: "Beykoz",
    region: "Marmara",
    postalCode: "34829",
    country: "Turkey",
    latitude: 41.0667,
    longitude: 29.0833,
  },
];

export default function AddressesScreen() {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleSelectAddress = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        selected: addr.id === id,
      }))
    );
  };

  const handleEdit = (address: Address) => {
    router.push({
      pathname: "/account/edit-address" as any,
      params: {
        id: address.id.toString(),
        title: address.title,
        floor: address.floor || "",
        building: address.building || "",
        street: address.street || "",
        landmark: address.landmark || "",
        city: address.city || "",
        district: address.district || "",
        region: address.region || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        type: address.type,
        latitude: address.latitude?.toString() || "",
        longitude: address.longitude?.toString() || "",
      },
    });
  };

  const handleDeletePress = (address: Address) => {
    if (address.selected) return;
    setAddressToDelete(address);
    setDeleteModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirmDelete = () => {
    if (addressToDelete) {
      setAddresses(addresses.filter((a) => a.id !== addressToDelete.id));
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
      setAddressToDelete(null);
    });
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return (
          <View style={[styles.addressIconBg, { backgroundColor: "#FF6B35" }]}>
            <Home color="#FFFFFF" size={18} />
          </View>
        );
      case "work":
        return (
          <View style={[styles.addressIconBg, { backgroundColor: "#3B82F6" }]}>
            <Briefcase color="#FFFFFF" size={18} />
          </View>
        );
      default:
        return (
          <View style={[styles.addressIconBg, { backgroundColor: "#10B981" }]}>
            <MapPin color="#FFFFFF" size={18} />
          </View>
        );
    }
  };

  const filteredAddresses = addresses.filter((addr) =>
    addr.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    addr.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAddressCard = (addr: Address) => (
    <TouchableOpacity
      key={addr.id}
      style={[styles.addressCard, addr.selected && styles.addressCardSelected]}
      onPress={() => handleSelectAddress(addr.id)}
      activeOpacity={0.7}
    >
      <View style={styles.addressCardLeft}>
        {getAddressIcon(addr.type)}
        <View style={styles.addressInfo}>
          <Text style={styles.addressTitle}>{addr.title}</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {addr.address}
          </Text>
        </View>
      </View>
      <View style={styles.addressCardRight}>
        {addr.selected && (
          <View style={styles.defaultBadge}>
            <Check size={14} color="#FFFFFF" />
          </View>
        )}
        {!addr.selected && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(addr)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(addr)}
        >
          <Edit2 size={16} color="#6B7280" />
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Delivery Address</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <MapPin color="#9CA3AF" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search address..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          {filteredAddresses.map(renderAddressCard)}
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/account/add-address" as any)}
        >
          <View style={styles.addIconContainer}>
            <Plus color="#FF6B35" size={20} />
          </View>
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.locationButton}>
          <View style={[styles.addressIconBg, { backgroundColor: "#8B5CF6" }]}>
            <Navigation color="#FFFFFF" size={18} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Use Current Location</Text>
            <Text style={styles.locationSubtitle}>Get your precise delivery location</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <MapPin size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            Make sure your delivery address is accurate for faster and more reliable deliveries.
          </Text>
        </View>

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account / Addresses Screen</Text>
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
            <Text style={styles.deleteModalTitle}>Delete Address</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete &quot;{addressToDelete?.title}&quot;? This action cannot be undone.
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
                <Trash2 size={16} color="#FFFFFF" />
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
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
  searchContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  addressCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  addressCardSelected: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF5F2",
  },
  addressCardLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
  addressIconBg: {
    width: 44,
    height: 32,
    borderRadius: 6,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
  addressCardRight: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  defaultBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF6B35",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  addButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFF5F2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderStyle: "dashed" as const,
  },
  addIconContainer: {
    width: 44,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FF6B35",
  },
  locationButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoCard: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
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
});
