import { ChevronLeft, Home, Building2, MapPin, Navigation, MapPinned, Check, Crosshair } from "lucide-react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useUserAddresses } from "@/hooks/useUserAddresses";

const addressTypes = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: Building2 },
  { id: "other", label: "Other", icon: MapPin },
];

interface GeocodedAddress {
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  name?: string;
  district?: string;
  subregion?: string;
  formattedAddress?: string;
}

export default function EditAddressScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const { updateAddress, updating } = useUserAddresses();
  const addressId = params.id as string;
  
  const [form, setForm] = useState({
    title: (params.title as string) || "",
    floor: (params.floor as string) || "",
    building: (params.building as string) || "",
    street: (params.street as string) || "",
    landmark: (params.landmark as string) || "",
    city: (params.city as string) || "",
    district: (params.district as string) || "",
    region: (params.region as string) || "",
    postalCode: (params.postalCode as string) || "",
    country: (params.country as string) || "",
  });

  const [selectedType, setSelectedType] = useState<"home" | "work" | "other">(
    (params.type as "home" | "work" | "other") || "home"
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    params.latitude && params.longitude
      ? {
          latitude: parseFloat(params.latitude as string),
          longitude: parseFloat(params.longitude as string),
        }
      : null
  );
  
  const [region, setRegion] = useState<Region>({
    latitude: params.latitude ? parseFloat(params.latitude as string) : 41.0082,
    longitude: params.longitude ? parseFloat(params.longitude as string) : 28.9784,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [isInitialLoad] = useState(false);

  const reverseGeocodeLocation = useCallback(async (latitude: number, longitude: number) => {
    if (Platform.OS === 'web') {
      setIsGeocodingAddress(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        );
        const data = await response.json();
        
        const addressData: GeocodedAddress = {
          street: data.address?.road || data.address?.street,
          city: data.address?.city || data.address?.town || data.address?.village,
          region: data.address?.state || data.address?.province,
          country: data.address?.country,
          postalCode: data.address?.postcode,
          district: data.address?.suburb || data.address?.neighbourhood,
          formattedAddress: data.display_name,
        };
        
        setForm(prev => ({
          ...prev,
          street: addressData.street || prev.street,
          city: addressData.city || prev.city,
          district: addressData.district || prev.district,
          region: addressData.region || prev.region,
          postalCode: addressData.postalCode || prev.postalCode,
          country: addressData.country || prev.country,
        }));
      } catch (error) {
        if (__DEV__) console.log('Error reverse geocoding (web):', error);
      } finally {
        setIsGeocodingAddress(false);
      }
    } else {
      setIsGeocodingAddress(true);
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        
        if (results && results.length > 0) {
          const result = results[0];
          const addressData: GeocodedAddress = {
            street: result.street ?? result.name ?? undefined,
            city: result.city ?? undefined,
            region: result.region ?? undefined,
            country: result.country ?? undefined,
            postalCode: result.postalCode ?? undefined,
            district: result.district ?? result.subregion ?? undefined,
            name: result.name ?? undefined,
            formattedAddress: [result.street, result.district, result.city, result.region]
              .filter(Boolean)
              .join(', '),
          };
          
          setForm(prev => ({
            ...prev,
            street: addressData.street || prev.street,
            city: addressData.city || prev.city,
            district: addressData.district || prev.district,
            region: addressData.region || prev.region,
            postalCode: addressData.postalCode || prev.postalCode,
            country: addressData.country || prev.country,
          }));
        }
      } catch (error) {
        if (__DEV__) console.log('Error reverse geocoding:', error);
      } finally {
        setIsGeocodingAddress(false);
      }
    }
  }, []);

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      if (navigator.geolocation) {
        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setRegion(newRegion);
            setSelectedLocation({ latitude, longitude });
            setIsLoadingLocation(false);
          },
          (error) => {
            if (__DEV__) console.log('Error getting location:', error);
            setIsLoadingLocation(false);
          },
          { enableHighAccuracy: true }
        );
      }
    } else {
      try {
        setIsLoadingLocation(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Location permission is needed to show your current location on the map.',
            [{ text: 'OK' }]
          );
          setIsLoadingLocation(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        const { latitude, longitude } = location.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setRegion(newRegion);
        setSelectedLocation({ latitude, longitude });
        setIsLoadingLocation(false);
      } catch (error) {
        if (__DEV__) console.log('Error getting current location:', error);
        setIsLoadingLocation(false);
      }
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      reverseGeocodeLocation(selectedLocation.latitude, selectedLocation.longitude);
    }
  }, [selectedLocation, reverseGeocodeLocation]);

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    setSelectedLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };

  const centerOnCurrentLocation = () => {
    getCurrentLocation();
  };

  const handleSave = async () => {
    if (!isFormValid || !addressId) return;

    const result = await updateAddress(addressId, {
      label: form.title,
      type: selectedType,
      street: form.street,
      district: form.district,
      city: form.city,
      region: form.region,
      postalCode: form.postalCode,
      country: form.country,
      building: form.building,
      floor: form.floor,
      landmark: form.landmark,
      latitude: selectedLocation?.latitude,
      longitude: selectedLocation?.longitude,
    });

    if (result.success) {
      Alert.alert("Success", "Address updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Error", result.error || "Failed to update address");
    }
  };

  const isFormValid = form.title.trim() !== "" && form.street.trim() !== "" && form.city.trim() !== "";

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
          <Text style={styles.headerTitle}>Edit Address</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.typeSection}>
            <Text style={styles.sectionTitle}>Address Type</Text>
          <View style={styles.typeContainer}>
            {addressTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                  onPress={() => setSelectedType(type.id as "home" | "work" | "other")}
                  activeOpacity={0.7}
                >
                  <View style={[styles.typeIconBg, isSelected && styles.typeIconBgSelected]}>
                    <IconComponent size={20} color={isSelected ? "#FFFFFF" : "#6B7280"} />
                  </View>
                  <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
                    {type.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.typeCheck}>
                      <Check size={12} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <View style={styles.mapHeaderContent}>
              <View style={styles.mapHeaderIcon}>
                <MapPin size={20} color="#FF6B35" />
              </View>
              <View style={styles.mapHeaderText}>
                <Text style={styles.mapHeaderTitle}>Select Your Location</Text>
                <Text style={styles.mapHeaderSubtitle}>Tap or drag the pin to adjust</Text>
              </View>
            </View>

          </View>

          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              region={region}
              onRegionChangeComplete={handleRegionChangeComplete}
              showsUserLocation
              showsMyLocationButton={false}
            />
            
            <View style={styles.centerMarker} pointerEvents="none">
              <MapPin size={40} color="#FF6B35" fill="#FF6B35" strokeWidth={2} />
              <View style={styles.markerDot} />
            </View>
            
            <TouchableOpacity
              style={styles.myLocationButton}
              onPress={centerOnCurrentLocation}
              activeOpacity={0.7}
            >
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#FF6B35" />
              ) : (
                <Crosshair size={20} color="#FF6B35" />
              )}
            </TouchableOpacity>

            {(isGeocodingAddress || isInitialLoad) && (
              <View style={styles.geocodingOverlay}>
                <View style={styles.geocodingCard}>
                  <ActivityIndicator size="small" color="#FF6B35" />
                  <Text style={styles.geocodingText}>
                    {isInitialLoad ? 'Loading location...' : 'Finding address...'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Details</Text>
          
            <View style={styles.inputCard}>
              <View style={styles.inputRow}>
                <View style={styles.inputIconContainer}>
                  <Home size={18} color="#FF6B35" />
                </View>
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Address Title *</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'title' && styles.inputFocused]}
                    placeholder="e.g., Home, Work, Mom's House"
                    placeholderTextColor="#9CA3AF"
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputCard}>
              <View style={styles.inputRow}>
                <View style={styles.inputIconContainer}>
                  <MapPinned size={18} color="#FF6B35" />
                </View>
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Street / Neighborhood *</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'street' && styles.inputFocused]}
                    placeholder="Enter street or neighborhood"
                    placeholderTextColor="#9CA3AF"
                    value={form.street}
                    onChangeText={(text) => setForm({ ...form, street: text })}
                    onFocus={() => setFocusedField('street')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputCard, styles.halfInput]}>
                <View style={styles.inputRow}>
                  <View style={styles.inputIconContainerSmall}>
                    <MapPin size={16} color="#FF6B35" />
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabelSmall}>District</Text>
                    <TextInput
                      style={[styles.inputSmall, focusedField === 'district' && styles.inputFocused]}
                      placeholder="District"
                      placeholderTextColor="#9CA3AF"
                      value={form.district}
                      onChangeText={(text) => setForm({ ...form, district: text })}
                      onFocus={() => setFocusedField('district')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.inputCard, styles.halfInput]}>
                <View style={styles.inputRow}>
                  <View style={styles.inputIconContainerSmall}>
                    <MapPin size={16} color="#FF6B35" />
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabelSmall}>City *</Text>
                    <TextInput
                      style={[styles.inputSmall, focusedField === 'city' && styles.inputFocused]}
                      placeholder="City"
                      placeholderTextColor="#9CA3AF"
                      value={form.city}
                      onChangeText={(text) => setForm({ ...form, city: text })}
                      onFocus={() => setFocusedField('city')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputCard, styles.halfInput]}>
                <View style={styles.inputRow}>
                  <View style={styles.inputIconContainerSmall}>
                    <MapPin size={16} color="#FF6B35" />
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabelSmall}>Region</Text>
                    <TextInput
                      style={[styles.inputSmall, focusedField === 'region' && styles.inputFocused]}
                      placeholder="Region/State"
                      placeholderTextColor="#9CA3AF"
                      value={form.region}
                      onChangeText={(text) => setForm({ ...form, region: text })}
                      onFocus={() => setFocusedField('region')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.inputCard, styles.halfInput]}>
                <View style={styles.inputRow}>
                  <View style={styles.inputIconContainerSmall}>
                    <MapPin size={16} color="#FF6B35" />
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabelSmall}>Postal Code</Text>
                    <TextInput
                      style={[styles.inputSmall, focusedField === 'postalCode' && styles.inputFocused]}
                      placeholder="Postal Code"
                      placeholderTextColor="#9CA3AF"
                      value={form.postalCode}
                      onChangeText={(text) => setForm({ ...form, postalCode: text })}
                      onFocus={() => setFocusedField('postalCode')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.inputCard}>
              <View style={styles.inputRow}>
                <View style={styles.inputIconContainer}>
                  <MapPinned size={18} color="#FF6B35" />
                </View>
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Country</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'country' && styles.inputFocused]}
                    placeholder="Country"
                    placeholderTextColor="#9CA3AF"
                    value={form.country}
                    onChangeText={(text) => setForm({ ...form, country: text })}
                    onFocus={() => setFocusedField('country')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputCard, styles.halfInput]}>
                <View style={styles.inputRow}>
                  <View style={styles.inputIconContainerSmall}>
                    <Building2 size={16} color="#FF6B35" />
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabelSmall}>Building</Text>
                    <TextInput
                      style={[styles.inputSmall, focusedField === 'building' && styles.inputFocused]}
                      placeholder="Block / Building"
                      placeholderTextColor="#9CA3AF"
                      value={form.building}
                      onChangeText={(text) => setForm({ ...form, building: text })}
                      onFocus={() => setFocusedField('building')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.inputCard, styles.halfInput]}>
                <View style={styles.inputRow}>
                  <View style={styles.inputIconContainerSmall}>
                    <MapPin size={16} color="#FF6B35" />
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabelSmall}>Floor / Apt</Text>
                    <TextInput
                      style={[styles.inputSmall, focusedField === 'floor' && styles.inputFocused]}
                      placeholder="Floor / Apt No"
                      placeholderTextColor="#9CA3AF"
                      value={form.floor}
                      onChangeText={(text) => setForm({ ...form, floor: text })}
                      onFocus={() => setFocusedField('floor')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.inputCard}>
              <View style={styles.inputRow}>
                <View style={styles.inputIconContainer}>
                  <Navigation size={18} color="#FF6B35" />
                </View>
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Landmark (Optional)</Text>
                  <TextInput
                    style={[styles.inputMultiline, focusedField === 'landmark' && styles.inputFocused]}
                    placeholder="Nearby landmark or directions for courier"
                    placeholderTextColor="#9CA3AF"
                    value={form.landmark}
                    onChangeText={(text) => setForm({ ...form, landmark: text })}
                    onFocus={() => setFocusedField('landmark')}
                    onBlur={() => setFocusedField(null)}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MapPin size={20} color="#6B7280" />
            <Text style={styles.infoText}>
              Adding accurate details helps couriers find your location faster and ensures smooth delivery.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, (!isFormValid || updating) && styles.saveButtonDisabled]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={!isFormValid || updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Check size={18} color="#FFFFFF" />
              )}
              <Text style={styles.saveButtonText}>
                {updating ? "Saving..." : "Save Address"}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  mapContainer: {
    height: 320,
    backgroundColor: "#E5E7EB",
    position: "relative" as const,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  map: {
    flex: 1,
  },
  myLocationButton: {
    position: "absolute" as const,
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  geocodingOverlay: {
    position: "absolute" as const,
    top: 16,
    left: 16,
    right: 16,
  },
  geocodingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  geocodingText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  typeSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  mapSection: {
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
  },
  formContainer: {
    padding: 16,
    paddingTop: 0,
  },
  mapHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mapHeaderContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  mapHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF5F2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  mapHeaderText: {
    flex: 1,
  },
  mapHeaderTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  mapHeaderSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500" as const,
    lineHeight: 18,
  },
  centerMarker: {
    position: "absolute" as const,
    top: "50%" as const,
    left: "50%" as const,
    marginLeft: -20,
    marginTop: -40,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    position: "absolute" as const,
    bottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
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
  typeContainer: {
    flexDirection: "row" as const,
    gap: 12,
  },
  typeCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    position: "relative" as const,
  },
  typeCardSelected: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF5F2",
  },
  typeIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  typeIconBgSelected: {
    backgroundColor: "#FF6B35",
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6B7280",
  },
  typeLabelSelected: {
    color: "#FF6B35",
  },
  typeCheck: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF6B35",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputRow: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
  },
  inputIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF5F2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  inputIconContainerSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFF5F2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 10,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 6,
  },
  inputLabelSmall: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: "#1F2937",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  inputSmall: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: "#1F2937",
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  inputFocused: {
    borderBottomColor: "#FF6B35",
  },
  inputMultiline: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: "#1F2937",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    minHeight: 48,
  },
  rowInputs: {
    flexDirection: "row" as const,
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  infoCard: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: "row" as const,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#6B7280",
  },
  saveButton: {
    flex: 1.5,
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#FDBA74",
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
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
