import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowRight, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabaseClient } from '@/lib/supabase/client';
import { AlertModal, AlertType } from '@/components/common/AlertModal';
import { errorHandler } from '@/services/errorHandler';
import ErrorBoundary from '@/components/common/ErrorBoundary';


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
        
        // STEP 1: Log start
        console.log('[Login] STEP 1: Starting login process');
        errorHandler.handleError(
            new Error(`[Login] STEP 1: Starting login for: ${email.substring(0, 5)}...`),
            false,
            'Login Step 1'
        );

        try {
            // STEP 2: Check Supabase client
            console.log('[Login] STEP 2: Checking Supabase client...');
            try {
                // Test if client is accessible
                const testClient = supabaseClient;
                console.log('[Login] STEP 2: ✅ Supabase client accessible');
                errorHandler.handleError(
                    new Error('[Login] STEP 2: Supabase client accessible'),
                    false,
                    'Login Step 2'
                );
            } catch (clientError: any) {
                console.error('[Login] STEP 2: ❌ Supabase client error:', clientError);
                errorHandler.handleError(
                    new Error(`[Login] STEP 2: Supabase client error: ${clientError?.message || 'Unknown'}`),
                    true,
                    'Login Step 2 - Client Error'
                );
                showAlert('error', 'Configuration Error', `Supabase client error: ${clientError?.message || 'Unknown error'}`);
                return;
            }

            // STEP 3: Attempt login
            console.log('[Login] STEP 3: Calling supabaseClient.auth.signInWithPassword...');
            errorHandler.handleError(
                new Error('[Login] STEP 3: Calling signInWithPassword'),
                false,
                'Login Step 3'
            );

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            // STEP 4: Check response
            console.log('[Login] STEP 4: Received response from Supabase');
            if (error) {
                console.error('[Login] STEP 4: ❌ Supabase error:', error);
                const loginError = new Error(`[Login] STEP 4: Supabase error: ${error.message}`);
                errorHandler.handleError(loginError, false, 'Login Step 4 - Supabase Error');
                
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('invalid login credentials') || 
                    errorMessage.includes('invalid credentials')) {
                    showAlert('error', 'Login Failed', 'Invalid email or password. Please try again.');
                } else if (errorMessage.includes('email not confirmed')) {
                    showAlert('warning', 'Email Not Confirmed', 'Please check your email and confirm your account before logging in.');
                } else {
                    showAlert('error', 'Login Failed', `Login failed: ${error.message}`);
                }
                return;
            }

            // STEP 5: Check session
            console.log('[Login] STEP 5: Checking session...');
            if (!data?.session) {
                console.error('[Login] STEP 5: ❌ No session returned');
                const noSessionError = new Error('[Login] STEP 5: No session returned after successful login');
                errorHandler.handleError(noSessionError, false, 'Login Step 5 - No Session');
                showAlert('error', 'Login Failed', 'No session created. Please try again.');
                return;
            }

            console.log('[Login] STEP 5: ✅ Session created:', data.session.user?.id);

            // STEP 6: Navigate to home
            console.log('[Login] STEP 6: Navigating to home screen...');

            // Small delay to ensure state is updated
            await new Promise(resolve => setTimeout(resolve, 100));

            try {
                router.replace('/(tabs)/home');
                console.log('[Login] STEP 6: ✅ Navigation called successfully');
            } catch (navError: any) {
                console.error('[Login] STEP 6: ❌ Navigation error:', navError);
                errorHandler.handleError(
                    new Error(`[Login] STEP 6: Navigation error: ${navError?.message || 'Unknown'}`),
                    true,
                    'Login Step 6 - Navigation Error'
                );
                showAlert('error', 'Navigation Error', `Failed to navigate: ${navError?.message || 'Unknown error'}`);
            }

        } catch (error: any) {
            // STEP X: Catch all errors
            console.error('[Login] STEP X: ❌ CRASH:', error);
            const crashError = new Error(
                `[Login] STEP X: CRASH - ${error?.message || 'Unknown error'}\n` +
                `Stack: ${error?.stack || 'No stack trace'}\n` +
                `Name: ${error?.name || 'Unknown'}\n` +
                `Type: ${typeof error}`
            );
            errorHandler.handleError(crashError, true, 'Login CRASH');
            
            const errorMessage = error?.message || 'An unexpected error occurred';
            const errorDetails = `Error: ${errorMessage}\n\n` +
                `Type: ${error?.name || typeof error}\n` +
                (error?.stack ? `Stack: ${error.stack.substring(0, 300)}...` : 'No stack trace');
            
            showAlert('error', 'Login Crash', errorDetails);
        } finally {
            setLoading(false);
            console.log('[Login] FINAL: Login process completed');
        }
    };

    const handleRegister = () => {
        router.push('/auth/register');
    };

    const handleDebugEnv = () => {
        router.push('/debug-env');
    };

    return (
        <ErrorBoundary>
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

                                    {/* Debug Buttons - Remove in production */}
                                    <View style={styles.debugButtonsContainer}>
                                        <TouchableOpacity 
                                            style={styles.debugButton}
                                            onPress={handleDebugEnv}
                                            activeOpacity={0.7}
                                        >
                                            <Settings size={14} color="#9CA3AF" strokeWidth={2} />
                                            <Text style={styles.debugButtonText}>Debug Env</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.debugButton}
                                            onPress={() => router.push('/debug-errors')}
                                            activeOpacity={0.7}
                                        >
                                            <Settings size={14} color="#9CA3AF" strokeWidth={2} />
                                            <Text style={styles.debugButtonText}>Debug Errors</Text>
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
        </ErrorBoundary>
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
        // Removed shadows as requested
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
    debugButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 24,
        justifyContent: 'center',
    },
    debugButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    debugButtonText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '500',
    },
});
