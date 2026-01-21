import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import NetInfo from '@react-native-community/netinfo';

interface NoNetworkScreenProps {
  onRetry?: () => void;
}

export function NoNetworkScreen({ onRetry }: NoNetworkScreenProps) {
  const insets = useSafeAreaInsets();
  const [isRetrying, setIsRetrying] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Pulse animation for the icon
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Check network status
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected && onRetry) {
        onRetry();
      }
    } catch (error) {
      if (__DEV__) {
        console.log('[Network] Retry check failed:', error);
      }
    }
    
    // Add a small delay for UX
    setTimeout(() => {
      setIsRetrying(false);
    }, 1000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#1F2937', '#374151', '#1F2937']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        {/* Animated Icon */}
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.iconInner}>
            <WifiOff size={64} color="#EF4444" strokeWidth={1.5} />
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>No Internet Connection</Text>
        
        {/* Description */}
        <Text style={styles.description}>
          Please check your network settings and try again. Make sure you're connected to Wi-Fi or mobile data.
        </Text>

        {/* Retry Button */}
        <TouchableOpacity
          style={[styles.retryButton, isRetrying && styles.retryButtonDisabled]}
          onPress={handleRetry}
          disabled={isRetrying}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isRetrying ? ['#6B7280', '#6B7280'] : ['#FF6B35', '#FF8C61']}
            style={styles.retryButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isRetrying ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <RefreshCw size={20} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Quick Tips:</Text>
          <View style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Check if airplane mode is off</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Try switching between Wi-Fi and mobile data</Text>
          </View>
          <View style={styles.tipRow}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>Move closer to your router</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 300,
  },
  retryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 48,
  },
  retryButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 48,
    gap: 10,
  },
  retryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D1D5DB',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
    marginTop: 1,
  },
  tipText: {
    fontSize: 13,
    color: '#9CA3AF',
    flex: 1,
    lineHeight: 18,
  },
});

export default NoNetworkScreen;
