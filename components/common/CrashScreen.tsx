import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface CrashScreenProps {
  error: Error;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export function CrashScreen({ 
  error, 
  onRetry, 
  onDismiss,
  showDetails = true // Always show details in production for debugging
}: CrashScreenProps) {
  const insets = useSafeAreaInsets();

  const isConfigError = error.message.includes('environment variables') || 
                        error.message.includes('EXPO_PUBLIC_');
  
  const isLoginError = error.message.includes('[Login]');

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#FEE2E2', '#FEF2F2', '#FFFFFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={64} color="#DC2626" strokeWidth={1.5} />
          </View>

          <Text style={styles.title}>
            {isConfigError 
              ? 'Configuration Error' 
              : isLoginError 
              ? 'Login Error' 
              : 'Something Went Wrong'}
          </Text>

          <Text style={styles.message}>
            {isConfigError
              ? 'The app is missing required configuration. Please contact support or try again later.'
              : error.message || 'An unexpected error occurred. Please try again.'}
          </Text>

          {showDetails && error.stack && (
            <ScrollView style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Error Details:</Text>
              <Text style={styles.detailsText}>{error.stack}</Text>
            </ScrollView>
          )}

          <View style={styles.buttonContainer}>
            {onRetry && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={onRetry}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF6B35', '#FF8C61']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <RefreshCw size={18} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {onDismiss && (
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={onDismiss}
                activeOpacity={0.7}
              >
                <XCircle size={18} color="#6B7280" strokeWidth={2} />
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
            )}
          </View>

          {isConfigError && (
            <View style={styles.tipContainer}>
              <Text style={styles.tipText}>
                💡 This error usually means environment variables are missing in the build configuration.
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  detailsContainer: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    paddingHorizontal: 16,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  dismissButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  tipContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  tipText: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 18,
  },
});
