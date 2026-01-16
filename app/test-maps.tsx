import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculateDistance, calculateRemainingTime } from '@/utils/google_maps';
import { config } from '@/config/env';

export default function TestMapsScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Test coordinates (Istanbul - Taksim to Kadıköy)
  const testOrigin = { latitude: 41.0370, longitude: 28.9850 }; // Taksim
  const testDestination = { latitude: 40.9819, longitude: 29.0256 }; // Kadıköy

  const testDistance = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing calculateDistance...');
      console.log('API Key exists:', !!config.googleMapsApiKey);
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

    try {
      console.log('Testing calculateRemainingTime...');
      console.log('API Key exists:', !!config.googleMapsApiKey);

      const timeResult = await calculateRemainingTime(testOrigin, testDestination);
      console.log('Time Result:', timeResult);
      setResult(timeResult);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Unknown error');
      Alert.alert('Error', err.message || 'Failed to calculate remaining time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Google Maps API Test</Text>
        <Text style={styles.subtitle}>
          API Key: {config.googleMapsApiKey ? '✅ Configured' : '❌ Missing'}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Test Coordinates</Text>
          <View style={styles.coordBox}>
            <Text style={styles.coordLabel}>Origin (Taksim):</Text>
            <Text style={styles.coordText}>
              {testOrigin.latitude}, {testOrigin.longitude}
            </Text>
          </View>
          <View style={styles.coordBox}>
            <Text style={styles.coordLabel}>Destination (Kadıköy):</Text>
            <Text style={styles.coordText}>
              {testDestination.latitude}, {testDestination.longitude}
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
            style={[styles.testButton, styles.testButtonSecondary, loading && styles.testButtonDisabled]}
            onPress={testRemainingTime}
            disabled={loading}
          >
            <Text style={[styles.testButtonText, styles.testButtonTextSecondary]}>
              {loading ? 'Testing...' : 'Test ETA (with Traffic)'}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>❌ Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>✅ Result</Text>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Distance:</Text>
              <Text style={styles.resultValue}>{result.distanceText}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Duration:</Text>
              <Text style={styles.resultValue}>{result.durationText}</Text>
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

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Info</Text>
          <Text style={styles.infoText}>
            Check console logs for detailed API responses.
          </Text>
          <Text style={styles.infoText}>
            Make sure EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is set in .env file.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  infoBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#1E3A8A',
    marginBottom: 4,
    lineHeight: 18,
  },
});
