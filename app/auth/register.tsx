import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, ShoppingBag, Check } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = "Ad soyad gerekli";
    }
    
    if (!email.trim()) {
      newErrors.email = "E-posta gerekli";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Geçerli bir e-posta girin";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Telefon numarası gerekli";
    } else if (phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Geçerli bir telefon numarası girin";
    }
    
    if (!password) {
      newErrors.password = "Şifre gerekli";
    } else if (password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalı";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gerekli";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }
    
    if (!acceptedTerms) {
      newErrors.terms = "Kullanım koşullarını kabul etmelisiniz";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(tabs)/home" as any);
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push("/auth/login" as any);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = "";
    
    if (cleaned.length > 0) {
      formatted = "(" + cleaned.substring(0, 3);
    }
    if (cleaned.length > 3) {
      formatted += ") " + cleaned.substring(3, 6);
    }
    if (cleaned.length > 6) {
      formatted += " " + cleaned.substring(6, 8);
    }
    if (cleaned.length > 8) {
      formatted += " " + cleaned.substring(8, 10);
    }
    
    return formatted;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF6B35", "#FF8C5A"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.headerContent, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <ShoppingBag size={32} color="#FF6B35" strokeWidth={2} />
            </View>
            <Text style={styles.welcomeText}>Hesap Oluştur</Text>
            <Text style={styles.subtitleText}>Hemen kayıt ol, alışverişe başla!</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <View style={[styles.inputWrapper, errors.fullName && styles.inputError]}>
                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Adınız Soyadınız"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  autoCapitalize="words"
                />
              </View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="ornek@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon</Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                <Phone size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="(5XX) XXX XX XX"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(formatPhoneNumber(text));
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="En az 6 karakter"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre Tekrar</Text>
              <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifrenizi tekrar girin"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => {
                setAcceptedTerms(!acceptedTerms);
                if (errors.terms) setErrors({ ...errors, terms: undefined });
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.termsText}>
                <Text style={styles.termsLink}>Kullanım Koşulları</Text> ve{" "}
                <Text style={styles.termsLink}>Gizlilik Politikası</Text>{"'nı kabul ediyorum"}
              </Text>
            </TouchableOpacity>
            {errors.terms && <Text style={[styles.errorText, { marginTop: -8, marginBottom: 16 }]}>{errors.terms}</Text>}

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <Text style={styles.socialButtonText}>Google ile Kayıt Ol</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <Text style={styles.socialButtonText}>Apple ile Kayıt Ol</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.loginContainer, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerGradient: {
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoSection: {
    alignItems: "center",
    paddingBottom: 8,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1F2937",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 54,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 6,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  termsLink: {
    color: "#FF6B35",
    fontWeight: "600" as const,
  },
  registerButton: {
    backgroundColor: "#FF6B35",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginHorizontal: 16,
  },
  socialButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FF6B35",
  },
});
