/**
 * Debug screen to view stored errors in production
 * Access via: /debug-errors
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorHandler } from '@/services/errorHandler';

interface StoredError {
  message: string;
  stack?: string;
  context?: string;
  timestamp: string;
}

export default function DebugErrorsScreen() {
  const insets = useSafeAreaInsets();
  const [errors, setErrors] = useState<StoredError[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadErrors();
  }, []);

  const loadErrors = async () => {
    try {
      setLoading(true);
      const keys = await AsyncStorage.getAllKeys();
      const errorKeys = keys.filter(key => key.startsWith('error_'));
      const errorData = await Promise.all(
        errorKeys.map(async (key) => {
          const data = await AsyncStorage.getItem(key);
          return data ? JSON.parse(data) : null;
        })
      );
      setErrors(errorData.filter(Boolean).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error loading stored errors:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const errorKeys = keys.filter(key => key.startsWith('error_'));
      await Promise.all(errorKeys.map(key => AsyncStorage.removeItem(key)));
      setErrors([]);
    } catch (error) {
      console.error('Error clearing stored errors:', error);
    }
  };

  const recentErrors = errorHandler.getRecentErrors(20);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Error Logs</Text>
        <TouchableOpacity onPress={clearErrors} style={styles.clearButton}>
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {__DEV__ ? '🔧 Development Mode' : '🚀 Production Mode'}
          </Text>
          <Text style={styles.infoSubtext}>
            Recent errors from errorHandler and AsyncStorage
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In-Memory Errors ({recentErrors.length})</Text>
          {recentErrors.length === 0 ? (
            <Text style={styles.emptyText}>No errors in memory</Text>
          ) : (
            recentErrors.map((errorInfo, index) => (
              <View key={index} style={styles.errorCard}>
                <View style={styles.errorHeader}>
                  <AlertTriangle size={16} color="#EF4444" />
                  <Text style={styles.errorTime}>
                    {errorInfo.timestamp.toLocaleString()}
                  </Text>
                  {errorInfo.isFatal && (
                    <View style={styles.fatalBadge}>
                      <Text style={styles.fatalText}>FATAL</Text>
                    </View>
                  )}
                </View>
                {errorInfo.context && (
                  <Text style={styles.errorContext}>Context: {errorInfo.context}</Text>
                )}
                <Text style={styles.errorMessage}>{errorInfo.error.message}</Text>
                {errorInfo.error.stack && (
                  <ScrollView style={styles.stackContainer}>
                    <Text style={styles.stackText}>{errorInfo.error.stack}</Text>
                  </ScrollView>
                )}
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Stored Errors ({errors.length})</Text>
            <TouchableOpacity onPress={loadErrors} style={styles.refreshButton}>
              <RefreshCw size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : errors.length === 0 ? (
            <Text style={styles.emptyText}>No stored errors</Text>
          ) : (
            errors.map((error, index) => (
              <View key={index} style={styles.errorCard}>
                <View style={styles.errorHeader}>
                  <AlertTriangle size={16} color="#EF4444" />
                  <Text style={styles.errorTime}>
                    {new Date(error.timestamp).toLocaleString()}
                  </Text>
                </View>
                {error.context && (
                  <Text style={styles.errorContext}>Context: {error.context}</Text>
                )}
                <Text style={styles.errorMessage}>{error.message}</Text>
                {error.stack && (
                  <ScrollView style={styles.stackContainer}>
                    <Text style={styles.stackText}>{error.stack}</Text>
                  </ScrollView>
                )}
              </View>
            ))
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  clearButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#3B82F6',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  errorTime: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  fatalBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fatalText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  errorContext: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 8,
  },
  stackContainer: {
    maxHeight: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  stackText: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 20,
  },
});
