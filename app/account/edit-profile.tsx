import { ChevronLeft, User, Mail, Phone, Camera, Check, Loader2 } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useUser } from "@/hooks/useUser";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, loading, updateProfile, updating } = useUser();
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setForm({
        firstName,
        lastName,
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSave = async () => {
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    
    const result = await updateProfile({
      name: fullName,
      email: form.email.trim(),
      phone: form.phone.trim(),
    });

    if (result.success) {
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } else {
      Alert.alert("Error", result.error || "Failed to update profile");
    }
  };

  if (loading) {
    return <LoadingScreen title="Loading profile..." subtitle="Please wait" />;
  }

  const isFormValid = 
    form.firstName.trim() !== "" && 
    form.lastName.trim() !== "" && 
    form.email.trim() !== "" && 
    form.phone.trim() !== "";

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft color="#1F2937" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#FF6B35" strokeWidth={2} />
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Camera size={16} color="#FF6B35" />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.rowInputs}>
            <View style={[styles.inputCard, styles.halfInput]}>
              <View style={styles.inputRow}>
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'firstName' && styles.inputFocused]}
                    placeholder="First name"
                    placeholderTextColor="#9CA3AF"
                    value={form.firstName}
                    onChangeText={(text) => setForm({ ...form, firstName: text })}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>

            <View style={[styles.inputCard, styles.halfInput]}>
              <View style={styles.inputRow}>
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'lastName' && styles.inputFocused]}
                    placeholder="Last name"
                    placeholderTextColor="#9CA3AF"
                    value={form.lastName}
                    onChangeText={(text) => setForm({ ...form, lastName: text })}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputIconContainer}>
                <Mail size={18} color="#FF6B35" />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={[styles.input, focusedField === 'email' && styles.inputFocused]}
                  placeholder="your@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputIconContainer}>
                <Phone size={18} color="#FF6B35" />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={[styles.input, focusedField === 'phone' && styles.inputFocused]}
                  placeholder="+995 XXX XXX XXX"
                  placeholderTextColor="#9CA3AF"
                  value={form.phone}
                  onChangeText={(text) => setForm({ ...form, phone: text })}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <User size={20} color="#6B7280" />
          <Text style={styles.infoText}>
            Your profile information is used for order updates and personalized recommendations.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, (!isFormValid || updating) && styles.saveButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.7}
            disabled={!isFormValid || updating}
          >
            {updating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Check size={18} color="#FFFFFF" />
            )}
            <Text style={styles.saveButtonText}>
              {updating ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account / Edit Profile Screen</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1F2937",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  avatarSection: {
    alignItems: "center" as const,
    marginBottom: 32,
    marginTop: 8,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FEF3F0",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 3,
    borderColor: "#FF6B35",
    marginBottom: 16,
  },
  changePhotoButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFF5F2",
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FF6B35",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputRow: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
  },
  inputIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF5F2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6B7280",
    marginBottom: 6,
  },
  input: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: "#1F2937",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  inputFocused: {
    borderBottomColor: "#FF6B35",
  },
  rowInputs: {
    flexDirection: "row" as const,
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  infoCard: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: "row" as const,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#6B7280",
  },
  saveButton: {
    flex: 1.5,
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#FDBA74",
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  screenLabel: {
    paddingVertical: 12,
    alignItems: "center" as const,
    marginTop: 16,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
});
