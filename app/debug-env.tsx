/**
 * Debug screen to check environment variables in production
 * Access via: /debug-env
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { config } from '@/config/env';
import { CheckCircle, XCircle, Copy, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';

export default function DebugEnvScreen() {
  const insets = useSafeAreaInsets();
  const [showValues, setShowValues] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const envVars = [
    {
      key: 'EXPO_PUBLIC_SUPABASE_URL',
      value: config.supabaseUrl,
      required: true,
    },
    {
      key: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
      value: config.supabaseAnonKey,
      required: true,
    },
    {
      key: 'EXPO_PUBLIC_SUPABASE_GRAPHQL_URL',
      value: config.supabaseGraphqlUrl,
      required: true,
    },
    {
      key: 'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY',
      value: config.googleMapsApiKey,
      required: true,
    },
  ];

  const copyToClipboard = (text: string, key: string) => {
    // For now, just show the value in an alert
    // In production, you can manually copy from the visible value
    Alert.alert('Value', text, [{ text: 'OK' }]);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskValue = (value: string) => {
    if (!value) return 'MISSING';
    if (value.length <= 10) return value;
    return `${value.substring(0, 10)}...${value.substring(value.length - 4)}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Environment Variables</Text>
        <TouchableOpacity
          onPress={() => setShowValues(!showValues)}
          style={styles.toggleButton}
        >
          {showValues ? (
            <EyeOff size={20} color="#6B7280" />
          ) : (
            <Eye size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {__DEV__ ? '🔧 Development Mode' : '🚀 Production Mode'}
          </Text>
          <Text style={styles.infoSubtext}>
            {__DEV__ 
              ? 'Reading from .env file' 
              : 'Reading from Expo Dashboard Secrets'}
          </Text>
        </View>

        {envVars.map((envVar) => {
          const isValid = !!envVar.value && envVar.value.trim() !== '';
          const displayValue = showValues 
            ? envVar.value 
            : maskValue(envVar.value || '');

          return (
            <View key={envVar.key} style={styles.envCard}>
              <View style={styles.envHeader}>
                <View style={styles.envHeaderLeft}>
                  {isValid ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <XCircle size={20} color="#EF4444" />
                  )}
                  <Text style={styles.envKey}>{envVar.key}</Text>
                </View>
                {envVar.required && (
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>Required</Text>
                  </View>
                )}
              </View>

              <View style={styles.envValueContainer}>
                <Text 
                  style={[
                    styles.envValue,
                    !isValid && styles.envValueMissing
                  ]}
                  numberOfLines={1}
                >
                  {displayValue}
                </Text>
                {isValid && (
                  <TouchableOpacity
                    onPress={() => copyToClipboard(envVar.value, envVar.key)}
                    style={styles.copyButton}
                  >
                    {copiedKey === envVar.key ? (
                      <Text style={styles.copiedText}>✓</Text>
                    ) : (
                      <Copy size={16} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {!isValid && (
                <Text style={styles.errorText}>
                  ⚠️ This variable is missing. Check your{' '}
                  {__DEV__ ? '.env file' : 'Expo Dashboard Secrets'}.
                </Text>
              )}
            </View>
          );
        })}

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            {envVars.filter(v => v.value).length} / {envVars.length} variables loaded
          </Text>
          {envVars.every(v => v.value) ? (
            <Text style={styles.summarySuccess}>✅ All required variables are present</Text>
          ) : (
            <Text style={styles.summaryError}>
              ❌ Some required variables are missing
            </Text>
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
  toggleButton: {
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
  envCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  envHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  envHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  envKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  requiredText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  envValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  envValue: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'monospace',
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  envValueMissing: {
    color: '#EF4444',
    fontStyle: 'italic',
  },
  copyButton: {
    padding: 8,
  },
  copiedText: {
    fontSize: 16,
    color: '#10B981',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summarySuccess: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  summaryError: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 4,
  },
});
