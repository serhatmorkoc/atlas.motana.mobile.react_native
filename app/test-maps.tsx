import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { calculateDistance, calculateRemainingTime, getRoutePolyline } from '@/utils/google_maps';
import { CourierType, getTravelModeFromCourierType } from '@/utils/google_maps/types';
import { useStores } from '@/hooks/useStores';
import { Store } from '@/types/store.types';
import { useUserAddresses, Address } from '@/hooks/useUserAddresses';

export default function TestMapsScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourierType, setSelectedCourierType] = useState<CourierType>(CourierType.MOTORCYCLE);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [storeDropdownVisible, setStoreDropdownVisible] = useState(false);
  const [courierDropdownVisible, setCourierDropdownVisible] = useState(false);
  const [addressDropdownVisible, setAddressDropdownVisible] = useState(false);
  const [routeData, setRouteData] = useState<{
    coordinates: Array<{ latitude: number; longitude: number }>;
    color: string;
    courierType: CourierType;
  } | null>(null);

  // Fetch all stores
  const { stores, loading: storesLoading } = useStores({ limit: 200 });

  // Fetch user addresses
  const { addresses, loading: addressesLoading } = useUserAddresses();

  // Test coordinates (Istanbul - Taksim to Kadıköy)
  // Default fallback coordinates
  const defaultOrigin = { latitude: 41.0370, longitude: 28.9850 }; // Taksim
  const defaultDestination = { latitude: 40.9819, longitude: 29.0256 }; // Kadıköy

  // Find selected address from database (is_selected: true)
  const selectedAddressFromDB = useMemo(() => {
    return addresses.find(addr => addr.selected) || null;
  }, [addresses]);

  // Origin: Delivery Address (selected address)
  const testOrigin = useMemo(() => {
    if (selectedAddress && selectedAddress.latitude && selectedAddress.longitude) {
      return {
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
      };
    }
    return defaultOrigin;
  }, [selectedAddress]);

  // Destination: Selected Store
  const testDestination = useMemo(() => {
    if (selectedStore && selectedStore.latitude && selectedStore.longitude) {
      return {
        latitude: selectedStore.latitude,
        longitude: selectedStore.longitude,
      };
    }
    return defaultDestination;
  }, [selectedStore]);

  // Set selected address from DB on mount or when addresses change
  useEffect(() => {
    if (selectedAddressFromDB && !selectedAddress) {
      setSelectedAddress(selectedAddressFromDB);
    }
  }, [selectedAddressFromDB]);

  // Map region to fit both points - update when origin or destination changes
  const region = useMemo<Region>(() => {
    return {
      latitude: (testOrigin.latitude + testDestination.latitude) / 2,
      longitude: (testOrigin.longitude + testDestination.longitude) / 2,
      latitudeDelta: Math.abs(testOrigin.latitude - testDestination.latitude) * 1.5 || 0.1,
      longitudeDelta: Math.abs(testOrigin.longitude - testDestination.longitude) * 1.5 || 0.1,
    };
  }, [testOrigin, testDestination]);

  // Courier type colors
  const courierColors: Record<CourierType, string> = {
    [CourierType.MOTORCYCLE]: '#FF6B35', // Orange for motorcycle
    [CourierType.BICYCLE]: '#10B981',     // Green for bicycle
    [CourierType.WALKING]: '#3B82F6',     // Blue for walking
  };

  const testDistance = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing calculateDistance...');
      console.log('Origin:', testOrigin);
      console.log('Destination:', testDestination);

      const distanceResult = await calculateDistance(testOrigin, testDestination);
      console.log('Distance Result:', distanceResult);
      setResult(distanceResult);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Unknown error');
      Alert.alert('Error', err.message || 'Failed to calculate distance');
    } finally {
      setLoading(false);
    }
  };

  const testRemainingTime = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRouteData(null);

    try {
      console.log('Testing calculateRemainingTime...');

      const travelMode = getTravelModeFromCourierType(selectedCourierType);
      const timeResult = await calculateRemainingTime(testOrigin, testDestination, travelMode);
      console.log('Time Result:', timeResult);
      setResult(timeResult);

      // Get route polyline for map
      const routePolyline = await getRoutePolyline(testOrigin, testDestination, travelMode);
      setRouteData({
        coordinates: routePolyline.coordinates,
        color: courierColors[selectedCourierType],
        courierType: selectedCourierType,
      });

      // Fit map to show route
      if (routePolyline.coordinates.length > 0) {
        const lats = routePolyline.coordinates.map(c => c.latitude);
        const lngs = routePolyline.coordinates.map(c => c.longitude);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const newRegion: Region = {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
          longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.01),
        };

        mapRef.current?.animateToRegion(newRegion, 1000);
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Unknown error');
      Alert.alert('Error', err.message || 'Failed to calculate remaining time');
    } finally {
      setLoading(false);
    }
  };


  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setStoreDropdownVisible(false);
    setRouteData(null);
    setResult(null);
    
    // Update map region to show both origin and destination
    if (store.latitude && store.longitude && testOrigin) {
      const newRegion: Region = {
        latitude: (testOrigin.latitude + store.latitude) / 2,
        longitude: (testOrigin.longitude + store.longitude) / 2,
        latitudeDelta: Math.abs(testOrigin.latitude - store.latitude) * 1.5 || 0.1,
        longitudeDelta: Math.abs(testOrigin.longitude - store.longitude) * 1.5 || 0.1,
      };
      mapRef.current?.animateToRegion(newRegion, 500);
    }
  };

  const handleCourierTypeSelect = (courierType: CourierType) => {
    setSelectedCourierType(courierType);
    setCourierDropdownVisible(false);
    setRouteData(null);
    setResult(null);
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setAddressDropdownVisible(false);
    setRouteData(null);
    setResult(null);
    
    // Update map region to show both origin and destination
    if (address.latitude && address.longitude && selectedStore?.latitude && selectedStore?.longitude) {
      const newRegion: Region = {
        latitude: (address.latitude + selectedStore.latitude) / 2,
        longitude: (address.longitude + selectedStore.longitude) / 2,
        latitudeDelta: Math.abs(address.latitude - selectedStore.latitude) * 1.5 || 0.1,
        longitudeDelta: Math.abs(address.longitude - selectedStore.longitude) * 1.5 || 0.1,
      };
      mapRef.current?.animateToRegion(newRegion, 500);
    } else if (address.latitude && address.longitude) {
      const newRegion: Region = {
        latitude: address.latitude,
        longitude: address.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      mapRef.current?.animateToRegion(newRegion, 500);
    }
  };

  const getCourierTypeLabel = (courierType: CourierType): string => {
    if (courierType === CourierType.MOTORCYCLE) return 'Motorcycle';
    if (courierType === CourierType.BICYCLE) return 'Bicycle';
    return 'Walking';
  };

  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selectedStore?.id === item.id && styles.dropdownItemSelected,
      ]}
      onPress={() => handleStoreSelect(item)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.dropdownItemText,
          selectedStore?.id === item.id && styles.dropdownItemTextSelected,
        ]}
      >
        {item.name}
      </Text>
      {selectedStore?.id === item.id && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );

  const renderCourierTypeItem = ({ item }: { item: CourierType }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selectedCourierType === item && styles.dropdownItemSelected,
      ]}
      onPress={() => handleCourierTypeSelect(item)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.dropdownItemText,
          selectedCourierType === item && styles.dropdownItemTextSelected,
        ]}
      >
        {getCourierTypeLabel(item)}
      </Text>
      {selectedCourierType === item && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );

  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selectedAddress?.id === item.id && styles.dropdownItemSelected,
      ]}
      onPress={() => handleAddressSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.addressItemContent}>
        <Text
          style={[
            styles.dropdownItemText,
            selectedAddress?.id === item.id && styles.dropdownItemTextSelected,
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.addressItemSubtext,
            selectedAddress?.id === item.id && styles.addressItemSubtextSelected,
          ]}
          numberOfLines={1}
        >
          {item.address}
        </Text>
      </View>
      {selectedAddress?.id === item.id && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Google Maps API Test</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Section */}
        <View style={styles.mapCard}>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={region}
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              {/* Origin Marker (Delivery Address) */}
              <Marker
                coordinate={testOrigin}
                title={
                  selectedAddress 
                    ? `${selectedAddress.title} - ${selectedAddress.address}` 
                    : "Origin (Default)"
                }
                pinColor="#FF6B35"
              />
              
              {/* Destination Marker (Store) */}
              <Marker
                coordinate={testDestination}
                title={
                  selectedStore 
                    ? selectedStore.name 
                    : "Destination (Default)"
                }
                pinColor="#10B981"
              />

              {/* Route Polyline */}
              {routeData && routeData.coordinates.length > 0 && (
                <Polyline
                  coordinates={routeData.coordinates}
                  strokeColor={routeData.color}
                  strokeWidth={4}
                  lineDashPattern={routeData.courierType === CourierType.WALKING ? [5, 5] : undefined}
                />
              )}
            </MapView>
          </View>
        </View>
          {/* Delivery Address Selection */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Delivery Address (Origin)</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setAddressDropdownVisible(!addressDropdownVisible)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !selectedAddress && styles.dropdownButtonTextPlaceholder,
                ]}
                numberOfLines={1}
              >
                {selectedAddress ? `${selectedAddress.title} - ${selectedAddress.address}` : 'Select delivery address...'}
              </Text>
              {addressDropdownVisible ? (
                <ChevronUp size={20} color="#6B7280" />
              ) : (
                <ChevronDown size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
            {selectedAddress && (
              <Text style={styles.storeInfo}>
                {selectedAddress.title} - {selectedAddress.latitude?.toFixed(4)}, {selectedAddress.longitude?.toFixed(4)}
              </Text>
            )}
          </View>

          {/* Address Dropdown Modal */}
          <Modal
            visible={addressDropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setAddressDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setAddressDropdownVisible(false)}
            >
              <View style={styles.dropdownContainer}>
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownTitle}>Select Delivery Address</Text>
                  <TouchableOpacity
                    onPress={() => setAddressDropdownVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={addresses}
                  renderItem={renderAddressItem}
                  keyExtractor={(item) => item.id}
                  style={styles.dropdownList}
                  showsVerticalScrollIndicator={true}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        {addressesLoading ? 'Loading addresses...' : 'No addresses available'}
                      </Text>
                    </View>
                  }
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Store Selection */}
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Select Store (Destination)</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setStoreDropdownVisible(!storeDropdownVisible)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !selectedStore && styles.dropdownButtonTextPlaceholder,
                ]}
                numberOfLines={1}
              >
                {selectedStore ? selectedStore.name : 'Select a store...'}
              </Text>
              {storeDropdownVisible ? (
                <ChevronUp size={20} color="#6B7280" />
              ) : (
                <ChevronDown size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
            {selectedStore && (
              <Text style={styles.storeInfo}>
                {selectedStore.name} - {selectedStore.latitude?.toFixed(4)}, {selectedStore.longitude?.toFixed(4)}
              </Text>
            )}
            {!selectedStore && (
              <Text style={styles.storeInfo}>
                Please select a store to set destination
              </Text>
            )}
          </View>

          {/* Store Dropdown Modal */}
          <Modal
            visible={storeDropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setStoreDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setStoreDropdownVisible(false)}
            >
              <View style={styles.dropdownContainer}>
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownTitle}>Select Store</Text>
                  <TouchableOpacity
                    onPress={() => setStoreDropdownVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={stores}
                  renderItem={renderStoreItem}
                  keyExtractor={(item) => item.id}
                  style={styles.dropdownList}
                  showsVerticalScrollIndicator={true}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        {storesLoading ? 'Loading stores...' : 'No stores available'}
                      </Text>
                    </View>
                  }
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Courier Type Dropdown Modal */}
          <Modal
            visible={courierDropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setCourierDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setCourierDropdownVisible(false)}
            >
              <View style={styles.dropdownContainer}>
                <View style={styles.dropdownHeader}>
                  <Text style={styles.dropdownTitle}>Select Courier Type</Text>
                  <TouchableOpacity
                    onPress={() => setCourierDropdownVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={Object.values(CourierType)}
                  renderItem={renderCourierTypeItem}
                  keyExtractor={(item) => item}
                  style={styles.dropdownList}
                  showsVerticalScrollIndicator={true}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Courier Type</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setCourierDropdownVisible(!courierDropdownVisible)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownButtonText}>
                {getCourierTypeLabel(selectedCourierType)}
              </Text>
              {courierDropdownVisible ? (
                <ChevronUp size={20} color="#6B7280" />
              ) : (
                <ChevronDown size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Test Coordinates</Text>
            <View style={styles.coordBox}>
              <Text style={styles.coordLabel}>Origin (Delivery Address):</Text>
              <Text style={styles.coordText}>
                {selectedAddress 
                  ? `${selectedAddress.title} - ${testOrigin.latitude.toFixed(6)}, ${testOrigin.longitude.toFixed(6)}`
                  : `Default - ${testOrigin.latitude.toFixed(6)}, ${testOrigin.longitude.toFixed(6)}`
                }
              </Text>
            </View>
            <View style={styles.coordBox}>
              <Text style={styles.coordLabel}>Destination (Store):</Text>
              <Text style={styles.coordText}>
                {selectedStore 
                  ? `${selectedStore.name} - ${testDestination.latitude.toFixed(6)}, ${testDestination.longitude.toFixed(6)}`
                  : `Default - ${testDestination.latitude.toFixed(6)}, ${testDestination.longitude.toFixed(6)}`
                }
              </Text>
            </View>
          </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.testButton, loading && styles.testButtonDisabled]}
            onPress={testDistance}
            disabled={loading}
          >
            <Text style={styles.testButtonText}>
              {loading ? 'Testing...' : 'Test Distance'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.testButton, 
              styles.testButtonSecondary, 
              loading && styles.testButtonDisabled,
              { backgroundColor: courierColors[selectedCourierType] }
            ]}
            onPress={testRemainingTime}
            disabled={loading}
          >
            <Text style={[styles.testButtonText, styles.testButtonTextSecondary]}>
              {loading ? 'Loading Route...' : `Show ${selectedCourierType === CourierType.MOTORCYCLE ? 'Motorcycle' : selectedCourierType === CourierType.BICYCLE ? 'Bicycle' : 'Walking'} Route`}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>❌ Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            {error.includes('not authorized') && (
              <View style={styles.fixBox}>
                <Text style={styles.fixTitle}>🔧 How to Fix:</Text>
                <Text style={styles.fixText}>
                  1. Go to Google Cloud Console{'\n'}
                  2. Select your project{'\n'}
                  3. Enable these APIs:{'\n'}
                  • Distance Matrix API{'\n'}
                  • Directions API{'\n'}
                  4. Check API key restrictions{'\n'}
                  5. For mobile apps, use "None" or "IP addresses" restrictions
                </Text>
                <Text style={styles.fixLink}>
                  Console: console.cloud.google.com
                </Text>
              </View>
            )}
          </View>
        )}

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>✅ Result</Text>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Distance:</Text>
              <Text style={styles.resultValue}>{result.distanceText || result.distance + ' m'}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Duration:</Text>
              <Text style={styles.resultValue}>
                {result.remainingTimeText || result.durationText || 'N/A'}
              </Text>
            </View>
            {result.estimatedArrivalText && (
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>ETA:</Text>
                <Text style={styles.resultValue}>{result.estimatedArrivalText}</Text>
              </View>
            )}
            {result.travelMode && (
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Travel Mode:</Text>
                <Text style={styles.resultValue}>{result.travelMode}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40,
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 2,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  mapContainer: {
    height: 300,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  dropdownButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  dropdownButtonTextPlaceholder: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  dropdownList: {
    maxHeight: 400,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#FFF4F0',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  storeInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  testSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  coordBox: {
    marginBottom: 12,
  },
  coordLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  coordText: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  buttonSection: {
    gap: 12,
    marginBottom: 16,
  },
  testButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  testButtonSecondary: {
    backgroundColor: '#10B981',
  },
  testButtonDisabled: {
    opacity: 0.5,
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  testButtonTextSecondary: {
    color: '#FFFFFF',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
  },
  resultBox: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '700',
  },
  fixBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  fixTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  fixText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    marginBottom: 8,
  },
  fixLink: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  addressItemContent: {
    flex: 1,
    marginRight: 8,
  },
  addressItemSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  addressItemSubtextSelected: {
    color: '#FF6B35',
  },
});
