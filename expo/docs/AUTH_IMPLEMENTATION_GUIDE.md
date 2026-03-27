# Auth Implementation Guide - Kurye Uygulaması İçin

Bu doküman, kurye uygulamasına login, register ve auth işlemlerini eklemek için gerekli tüm kodları içerir.

## 📁 Dosya Yapısı

Aşağıdaki dosya yapısını oluşturun:

```
app/
├── auth/
│   ├── _layout.tsx          # Auth layout (Stack navigator)
│   ├── login.tsx            # Login ekranı
│   └── register.tsx         # Register ekranı
├── index.tsx                # Welcome/Splash screen (güncelle)
└── _layout.tsx              # Root layout (auth route ekle)

hooks/
└── useAuthUser.ts           # Auth hook

lib/
└── supabase/
    └── client.ts            # Supabase client

lib/apollo/mutations/
└── CreateUserMutation.ts   # User oluşturma mutation

components/common/
└── AlertModal.tsx           # Alert modal component

constants/
└── Colors.ts                # Renk sabitleri
```

---

## 1. Supabase Client (`lib/supabase/client.ts`)

```typescript
// Supabase Client for Realtime subscriptions and Auth
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/config/env';

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Realtime subscriptions will not work.'
  );
}

export const supabaseClient = createClient(
  config.supabaseUrl || '',
  config.supabaseAnonKey || '',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
```

---

## 2. Colors Constant (`constants/Colors.ts`)

```typescript
export const Colors = {
    primary: '#FF6B35',
    background: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    white: '#FFFFFF',
    border: '#E5E5E5',
    error: '#FF4444',
    success: '#00C851',
};
```

---

## 3. AlertModal Component (`components/common/AlertModal.tsx`)

```typescript
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, Animated } from "react-native";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react-native";

export type AlertType = "error" | "success" | "warning" | "info";

interface AlertModalProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  fadeAnim: Animated.Value;
  showCancel?: boolean;
}

export function AlertModal({
  visible,
  type = "info",
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  fadeAnim,
  showCancel = false,
}: AlertModalProps) {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <XCircle size={28} color="#EF4444" />;
      case "success":
        return <CheckCircle size={28} color="#10B981" />;
      case "warning":
        return <AlertCircle size={28} color="#F59E0B" />;
      default:
        return <Info size={28} color="#3B82F6" />;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case "error":
        return "#FEE2E2";
      case "success":
        return "#D1FAE5";
      case "warning":
        return "#FEF3C7";
      default:
        return "#DBEAFE";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "error":
        return styles.confirmErrorButton;
      case "success":
        return styles.confirmSuccessButton;
      case "warning":
        return styles.confirmWarningButton;
      default:
        return styles.confirmInfoButton;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContent,
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
          <View style={[styles.modalIcon, { backgroundColor: getIconBackground() }]}>
            {getIcon()}
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            {showCancel && (
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelModalButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmButton, getConfirmButtonStyle()]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    width: "85%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelModalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmErrorButton: {
    backgroundColor: "#EF4444",
  },
  confirmSuccessButton: {
    backgroundColor: "#10B981",
  },
  confirmWarningButton: {
    backgroundColor: "#F59E0B",
  },
  confirmInfoButton: {
    backgroundColor: "#3B82F6",
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
```

---

## 4. useAuthUser Hook (`hooks/useAuthUser.ts`)

```typescript
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';

/**
 * Hook to get the current authenticated user from Supabase
 * Returns the user ID and user object
 */
export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        // If there's an error, check if it's a critical auth error
        if (error) {
          // If session exists despite error, try to use it (might be a token refresh issue)
          if (session?.user) {
            console.warn('[Auth] Session error but session exists, using existing session:', error.message);
            setUser(session.user);
            setLoading(false);
            return;
          }
          
          // Only clear session if error is critical and no session exists
          const isCriticalError = 
            error.message?.includes('Refresh Token') || 
            error.message?.includes('Invalid') ||
            error.message?.includes('JWT');
          
          if (isCriticalError) {
            console.warn('[Auth] Critical session error, clearing invalid session:', error.message);
            try {
              await supabaseClient.auth.signOut();
            } catch (signOutError) {
              console.debug('[Auth] Error during signOut cleanup:', signOutError);
            }
            setUser(null);
          } else {
            // Non-critical error, just log it
            console.warn('[Auth] Non-critical session error:', error.message);
            setUser(null);
          }
          setLoading(false);
          return;
        }
        
        // No error, use the session
        setUser(session?.user ?? null);
      } catch (error) {
        // Handle unexpected errors
        console.error('[Auth] Unexpected error getting session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          // Token refresh failed, clear session
          console.warn('[Auth] Token refresh failed, clearing session');
          try {
            await supabaseClient.auth.signOut();
          } catch (error) {
            console.debug('[Auth] Error during signOut after token refresh failure:', error);
          }
          setUser(null);
        } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Ensure userId is a valid non-empty string, otherwise return null
  const userId = user?.id && typeof user.id === 'string' && user.id.trim() !== '' 
    ? user.id 
    : null;

  return {
    user,
    userId,
    loading,
    isAuthenticated: !!user && !!userId,
  };
};
```

---

## 5. CreateUserMutation (`lib/apollo/mutations/CreateUserMutation.ts`)

```typescript
import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($id: UUID!, $name: String!, $email: String!) {
    insertIntousersCollection(objects: { 
      id: $id, 
      name: $name, 
      email: $email,
      user_type: "COURIER",  # Kurye için "COURIER" kullanın
      is_active: true
    }) {
      records {
        id
        name
        email
        phone
        user_type
        is_active
      }
    }
  }
`;
```

**NOT:** Kurye uygulaması için `user_type: "COURIER"` kullanın (müşteri uygulamasında "CUSTOMER" kullanılıyor).

---

## 6. Auth Layout (`app/auth/_layout.tsx`)

```typescript
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
    );
}
```

---

## 7. Login Screen (`app/auth/login.tsx`)

```typescript
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabaseClient } from '@/lib/supabase/client';
import { AlertModal, AlertType } from '@/components/common/AlertModal';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<AlertType>('error');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const showAlert = (type: AlertType, title: string, message: string, onConfirm?: () => void) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const hideAlert = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setAlertVisible(false);
        });
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showAlert('error', 'Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Check for specific error types
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('invalid login credentials') || 
                    errorMessage.includes('invalid credentials')) {
                    showAlert('error', 'Login Failed', 'Invalid email or password. Please try again.');
                } else if (errorMessage.includes('email not confirmed')) {
                    showAlert('warning', 'Email Not Confirmed', 'Please check your email and confirm your account before logging in.');
                } else {
                    showAlert('error', 'Login Failed', error.message);
                }
                return;
            }

            if (data?.session) {
                router.replace('/(tabs)/home');  # Kurye uygulamasında ana ekran route'unuza göre değiştirin
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('error', 'Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        router.push('/auth/register');
    };

    return (
        <View style={styles.mainContainer}>
            <LinearGradient
                colors={[Colors.primary, '#FF8C61', '#FF6B35']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        <View style={styles.header}>
                            <View style={styles.logoBadge}>
                                <Text style={styles.logoText}>M</Text>
                            </View>
                            <Text style={styles.welcomeText}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to your account</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Email</Text>
                                    <View style={styles.inputContainer}>
                                        <Mail color={Colors.primary} size={18} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="hello@example.com"
                                            placeholderTextColor="#A0A0A0"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Lock color={Colors.primary} size={18} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor="#A0A0A0"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.loginButton} 
                                    onPress={handleLogin} 
                                    activeOpacity={0.9}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={[Colors.primary, '#FF8C61']}
                                        style={styles.loginButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <>
                                                <Text style={styles.loginButtonText}>Login</Text>
                                                <ArrowRight color="#FFFFFF" size={18} strokeWidth={2.5} />
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>New to Motana? </Text>
                                    <TouchableOpacity onPress={handleRegister}>
                                        <Text style={styles.signupText}>Create Account</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <AlertModal
                visible={alertVisible}
                type={alertType}
                title={alertTitle}
                message={alertMessage}
                onClose={hideAlert}
                fadeAnim={fadeAnim}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    logoBadge: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    logoText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 24,
        borderRadius: 24,
        padding: 24,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 44,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    inputIcon: {
        marginRight: 12,
        opacity: 0.8,
    },
    input: {
        flex: 1,
        height: '100%',
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 32,
        marginTop: -8,
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    loginButton: {
        borderRadius: 12,
        marginBottom: 32,
        overflow: 'hidden',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    loginButtonGradient: {
        flexDirection: 'row',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#6C757D',
        fontSize: 13,
        fontWeight: '500',
    },
    signupText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 13,
    },
});
```

---

## 8. Register Screen (`app/auth/register.tsx`)

```typescript
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabaseClient } from '@/lib/supabase/client';
import { AlertModal, AlertType } from '@/components/common/AlertModal';
import { useMutation } from '@apollo/client/react';
import { CREATE_USER_MUTATION } from '@/lib/apollo/mutations/CreateUserMutation';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<AlertType>('error');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const alertOnConfirmRef = useRef<(() => void) | undefined>(undefined);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [createUserMutation] = useMutation(CREATE_USER_MUTATION);

    const showAlert = (type: AlertType, title: string, message: string, onConfirm?: () => void) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        alertOnConfirmRef.current = onConfirm;
        setAlertVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const hideAlert = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setAlertVisible(false);
        });
    };

    const handleRegister = async () => {
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showAlert('error', 'Error', 'Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            showAlert('error', 'Error', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('error', 'Error', 'Passwords do not match');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('error', 'Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            // Sign up with Supabase
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        // Keep both keys for compatibility with common Supabase DB triggers
                        // that may read either `full_name` or `name` from auth metadata.
                        full_name: name,
                        name: name,
                    },
                },
            });

            if (error) {
                // Check if user already exists
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('already registered') || 
                    errorMessage.includes('user already exists') ||
                    errorMessage.includes('email already registered')) {
                    showAlert(
                        'warning',
                        'Email Already Registered',
                        'This email address is already registered. Please try logging in instead.',
                        () => {
                            hideAlert();
                            router.back();
                        }
                    );
                } else {
                    showAlert('error', 'Registration Failed', error.message);
                }
                return;
            }

            // Check if email confirmation is required
            if (data?.user && !data.session) {
                // Email confirmation is enabled in Supabase
                // Create user record in users table even if email confirmation is required
                if (data.user.id) {
                    try {
                        await createUserMutation({
                            variables: {
                                id: data.user.id,
                                name: name,
                                email: email,
                            },
                        });
                    } catch (createUserError) {
                        console.error('Error creating user record:', createUserError);
                        // Don't block registration if user creation fails
                    }
                }
                
                showAlert(
                    'info',
                    'Check Your Email',
                    'We sent you a confirmation email. Please check your inbox to verify your account.',
                    () => {
                        hideAlert();
                        router.back();
                    }
                );
                return;
            }

            // If session exists, user is automatically logged in (email confirmation disabled)
            if (data?.session && data?.user) {
                // Create user record in users table with name and email
                try {
                    await createUserMutation({
                        variables: {
                            id: data.user.id,
                            name: name,
                            email: email,
                        },
                    });
                } catch (createUserError: any) {
                    // If user already exists (duplicate key), that's okay - ignore it
                    if (!createUserError?.message?.includes('duplicate') && 
                        !createUserError?.message?.includes('already exists')) {
                        console.error('Error creating user record:', createUserError);
                    }
                }
                
                // Success! User is registered and logged in
                showAlert(
                    'success',
                    'Registration Successful',
                    'Your account has been created successfully! You are now logged in.',
                    () => {
                        hideAlert();
                        router.replace('/(tabs)/home');  # Kurye uygulamasında ana ekran route'unuza göre değiştirin
                    }
                );
            } else {
                // Fallback: if no session and no error, something unexpected happened
                showAlert(
                    'success',
                    'Registration Successful',
                    'Your account has been created. Please log in.',
                    () => {
                        hideAlert();
                        router.replace('/auth/login');
                    }
                );
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('error', 'Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        router.back();
    };

    return (
        <View style={styles.mainContainer}>
            <LinearGradient
                colors={[Colors.primary, '#FF8C61', '#FF6B35']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        <View style={styles.header}>
                            <View style={styles.logoBadge}>
                                <Text style={styles.logoText}>M</Text>
                            </View>
                            <Text style={styles.welcomeText}>Create Account</Text>
                            <Text style={styles.subtitle}>Join the Motana community</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.form}>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Full Name</Text>
                                    <View style={styles.inputContainer}>
                                        <User color={Colors.primary} size={18} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="John Doe"
                                            placeholderTextColor="#A0A0A0"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Email</Text>
                                    <View style={styles.inputContainer}>
                                        <Mail color={Colors.primary} size={18} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="hello@example.com"
                                            placeholderTextColor="#A0A0A0"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Lock color={Colors.primary} size={18} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor="#A0A0A0"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Confirm Password</Text>
                                    <View style={styles.inputContainer}>
                                        <Lock color={Colors.primary} size={18} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor="#A0A0A0"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    style={styles.registerButton} 
                                    onPress={handleRegister} 
                                    activeOpacity={0.9}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={[Colors.primary, '#FF8C61']}
                                        style={styles.registerButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <>
                                                <Text style={styles.registerButtonText}>Sign Up</Text>
                                                <ArrowRight color="#FFFFFF" size={18} strokeWidth={2.5} />
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={handleLogin}>
                                        <Text style={styles.loginText}>Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <AlertModal
                visible={alertVisible}
                type={alertType}
                title={alertTitle}
                message={alertMessage}
                onClose={hideAlert}
                onConfirm={alertOnConfirmRef.current}
                fadeAnim={fadeAnim}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    logoBadge: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    logoText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 24,
        borderRadius: 24,
        padding: 24,
        paddingBottom: 32,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 44,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    inputIcon: {
        marginRight: 10,
        opacity: 0.8,
    },
    input: {
        flex: 1,
        height: '100%',
        color: Colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    registerButton: {
        marginTop: 8,
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    registerButtonGradient: {
        flexDirection: 'row',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#6C757D',
        fontSize: 13,
        fontWeight: '500',
    },
    loginText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 13,
    },
});
```

---

## 9. Welcome/Splash Screen (`app/index.tsx`)

```typescript
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { Colors } from "@/constants/Colors";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { userId, loading: authLoading } = useAuthUser();
  const [minSplashDone, setMinSplashDone] = useState(false);
  const didNavigateRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) setMinSplashDone(true);
    }, 800);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const targetRoute = useMemo(() => {
    // If session exists, go straight into app; otherwise go to login.
    return userId ? "/(tabs)/home" : "/auth/login";  # Kurye uygulamasında ana ekran route'unuza göre değiştirin
  }, [userId]);

  useEffect(() => {
    if (didNavigateRef.current) return;
    if (authLoading) return;
    if (!minSplashDone) return;

    didNavigateRef.current = true;
    router.replace(targetRoute as any);
  }, [authLoading, minSplashDone, targetRoute]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={['#FFFFFF', '#FFF5F2']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ShoppingBag size={56} color={Colors.primary} strokeWidth={2} />
            </LinearGradient>
          </View>

          <View style={styles.brandContainer}>
            <Text style={styles.title}>motana</Text>
            <Text style={styles.versionText}>v{Constants.expoConfig?.version || "1.0.0"}</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  iconWrapper: {
    marginBottom: 28,
  },
  iconGradient: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  brandContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 3,
    textTransform: "lowercase",
    fontFamily: "System",
  },
  versionText: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.6,
    marginTop: 8,
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});
```

---

## 10. Root Layout Güncelleme (`app/_layout.tsx`)

`_layout.tsx` dosyasına auth route'unu ekleyin:

```typescript
// RootLayoutNav fonksiyonuna ekleyin:
<Stack.Screen name="auth" options={{ headerShown: false }} />
```

Tam örnek:

```typescript
function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />  {/* ← Bu satırı ekleyin */}
      {/* ... diğer screen'ler */}
    </Stack>
  );
}
```

---

## 11. Logout İşlemi

Logout için herhangi bir ekranda (örneğin account screen'de):

```typescript
import { supabaseClient } from '@/lib/supabase/client';
import { router } from 'expo-router';

const handleLogout = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      return;
    }
    // Navigate to login screen
    router.replace("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
```

---

## 12. Gerekli Dependencies

`package.json`'da şunların olması gerekiyor:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.90.1",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@apollo/client": "^4.1.2",
    "expo-linear-gradient": "~15.0.8",
    "lucide-react-native": "^0.562.0",
    "expo-router": "~6.0.17"
  }
}
```

---

## 13. Environment Variables

`.env` veya `config/env.ts` dosyasında:

```typescript
export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};
```

---

## 14. Önemli Notlar

1. **user_type**: CreateUserMutation'da kurye için `"COURIER"` kullanın (müşteri uygulamasında `"CUSTOMER"` kullanılıyor).

2. **Route'lar**: Login ve register başarılı olduğunda yönlendirilecek route'u kurye uygulamanızın yapısına göre değiştirin:
   - `router.replace('/(tabs)/home')` → Kurye uygulamasının ana ekran route'una göre değiştirin

3. **Logo/Icon**: Login ve register ekranlarındaki logo/icon'u kurye uygulamasına göre değiştirebilirsiniz.

4. **Colors**: `Colors.primary` değerini kurye uygulamasının renk temasına göre değiştirebilirsiniz.

5. **Email Confirmation**: Supabase'de email confirmation açık/kapalı olabilir. Kod her iki durumu da handle ediyor.

---

## 15. Test Checklist

- [ ] Login ekranı açılıyor
- [ ] Register ekranı açılıyor
- [ ] Login işlemi çalışıyor
- [ ] Register işlemi çalışıyor
- [ ] Hata mesajları gösteriliyor
- [ ] Başarılı login/register sonrası yönlendirme çalışıyor
- [ ] Logout işlemi çalışıyor
- [ ] Session persist ediliyor (uygulama kapanıp açıldığında login kalıyor)
- [ ] Welcome screen doğru route'a yönlendiriyor

---

## Kullanım

1. Yukarıdaki tüm dosyaları kurye uygulamasına kopyalayın
2. Route'ları kurye uygulamasının yapısına göre güncelleyin
3. `user_type: "COURIER"` olduğundan emin olun
4. Environment variables'ları ayarlayın
5. Test edin!
