import { router } from "expo-router";
import { ChevronLeft, CreditCard, Calendar, Lock } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddCardScreen() {
  const insets = useSafeAreaInsets();
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardHolder, setCardHolder] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [isDefault, setIsDefault] = useState<boolean>(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\//g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (text: string) => {
    setCvv(text.replace(/[^0-9]/g, "").substring(0, 3));
  };

  const handleSaveCard = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      Alert.alert("Error", "Please enter a valid 16-digit card number");
      return;
    }

    if (expiryDate.length !== 5) {
      Alert.alert("Error", "Please enter a valid expiry date (MM/YY)");
      return;
    }

    if (cvv.length !== 3) {
      Alert.alert("Error", "Please enter a valid 3-digit CVV");
      return;
    }

    Alert.alert(
      "Success",
      "Your card has been added successfully!",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft color="#1F2937" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Card</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardPreview}>
          <View style={styles.cardPreviewGradient}>
            <View style={styles.cardPreviewTop}>
              <CreditCard size={32} color="#FFFFFF" />
              <Text style={styles.cardPreviewChip}>CHIP</Text>
            </View>
            <Text style={styles.cardPreviewNumber}>
              {cardNumber || "•••• •••• •••• ••••"}
            </Text>
            <View style={styles.cardPreviewBottom}>
              <View style={styles.cardPreviewInfo}>
                <Text style={styles.cardPreviewLabel}>CARD HOLDER</Text>
                <Text style={styles.cardPreviewValue}>
                  {cardHolder || "YOUR NAME"}
                </Text>
              </View>
              <View style={styles.cardPreviewInfo}>
                <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
                <Text style={styles.cardPreviewValue}>
                  {expiryDate || "MM/YY"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputWrapper}>
              <CreditCard size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9CA3AF"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Holder Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.inputFull]}
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputWrapper}>
                <Calendar size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#9CA3AF"
                  value={expiryDate}
                  onChangeText={handleExpiryChange}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={[styles.inputContainer, styles.inputHalf]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor="#9CA3AF"
                  value={cvv}
                  onChangeText={handleCvvChange}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.defaultOption}
            onPress={() => setIsDefault(!isDefault)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, isDefault && styles.checkboxChecked]}
            >
              {isDefault && <View style={styles.checkboxInner} />}
            </View>
            <View style={styles.defaultOptionText}>
              <Text style={styles.defaultOptionTitle}>
                Set as default payment method
              </Text>
              <Text style={styles.defaultOptionSubtitle}>
                This card will be used for future orders
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.securityInfo}>
            <Lock size={16} color="#6B7280" />
            <Text style={styles.securityText}>
              Your card information is encrypted and secure. We use industry-standard SSL encryption.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveCard}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Add Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  cardPreview: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardPreviewGradient: {
    backgroundColor: "#1F2937",
    padding: 24,
    minHeight: 200,
    justifyContent: "space-between" as const,
  },
  cardPreviewTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  cardPreviewChip: {
    fontSize: 10,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    letterSpacing: 1,
  },
  cardPreviewNumber: {
    fontSize: 24,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    letterSpacing: 2,
    marginVertical: 20,
  },
  cardPreviewBottom: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  cardPreviewInfo: {
    gap: 4,
  },
  cardPreviewLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  cardPreviewValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
  },
  inputWrapper: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    padding: 0,
  },
  inputFull: {
    paddingLeft: 0,
  },
  inputRow: {
    flexDirection: "row" as const,
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  defaultOption: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  checkboxChecked: {
    borderColor: "#FF6B35",
    backgroundColor: "#FF6B35",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  defaultOptionText: {
    flex: 1,
    gap: 2,
  },
  defaultOptionTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  defaultOptionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  securityInfo: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: "#16A34A",
    lineHeight: 18,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center" as const,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
});
