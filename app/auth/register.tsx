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
import { CREATE_USER } from '@/lib/apollo/mutations/user';

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
    
    const [createUserMutation] = useMutation(CREATE_USER);

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
                                user: {
                                    id: data.user.id,
                                    full_name: name,
                                    email: email,
                                },
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
                            user: {
                                id: data.user.id,
                                name: name,
                                email: email,
                                user_type: "CUSTOMER",
                                is_active: true,
                            },
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
                        router.replace('/(tabs)/home');
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
