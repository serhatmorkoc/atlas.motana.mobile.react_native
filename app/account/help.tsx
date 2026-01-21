import { router } from "expo-router";
import {
  ChevronLeft,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Clock,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "How do I track my order?",
    answer: "You can track your order in real-time from the 'My Orders' section. Once your order is confirmed, you'll see live updates on the order status and delivery progress.",
  },
  {
    id: "2",
    question: "What payment methods are accepted?",
    answer: "We accept Visa, Mastercard, Motana Wallet, and Cash on Delivery. You can manage your payment methods in the 'Payment Methods' section.",
  },
  {
    id: "3",
    question: "How can I cancel my order?",
    answer: "You can cancel your order within 2 minutes of placing it. Go to 'My Orders', select the order, and tap 'Cancel Order'. After 2 minutes, please contact support.",
  },
  {
    id: "4",
    question: "What if my order is delayed?",
    answer: "If your order is taking longer than expected, you'll receive notifications. You can also contact our support team for assistance.",
  },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need help? We&apos;re here for you</Text>
          <View style={styles.contactCards}>
            <TouchableOpacity style={styles.contactCard}>
              <View style={[styles.contactIconBg, { backgroundColor: "#DCFCE7" }]}>
                <MessageCircle size={24} color="#16A34A" />
              </View>
              <Text style={styles.contactCardTitle}>Live Chat</Text>
              <Text style={styles.contactCardDesc}>Chat with us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard}>
              <View style={[styles.contactIconBg, { backgroundColor: "#DBEAFE" }]}>
                <Phone size={24} color="#2563EB" />
              </View>
              <Text style={styles.contactCardTitle}>Call Us</Text>
              <Text style={styles.contactCardDesc}>+995 555 000</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard}>
              <View style={[styles.contactIconBg, { backgroundColor: "#FEF3C7" }]}>
                <Mail size={24} color="#D97706" />
              </View>
              <Text style={styles.contactCardTitle}>Email</Text>
              <Text style={styles.contactCardDesc}>Get support</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusCard}>
          <Clock size={20} color="#FF6B35" />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>Support Hours</Text>
            <Text style={styles.statusText}>Available 24/7</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.faqItem}
                onPress={() => toggleFAQ(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <View style={styles.faqIconContainer}>
                    <HelpCircle size={20} color="#FF6B35" />
                  </View>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <ChevronRight
                    size={20}
                    color="#9CA3AF"
                    style={{
                      transform: [{ rotate: expandedFAQ === item.id ? "90deg" : "0deg" }],
                    }}
                  />
                </View>
                {expandedFAQ === item.id && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.legalList}>
            <TouchableOpacity style={styles.legalItem}>
              <View style={styles.legalLeft}>
                <FileText size={20} color="#6B7280" />
                <Text style={styles.legalText}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.legalItem}>
              <View style={styles.legalLeft}>
                <ShieldCheck size={20} color="#6B7280" />
                <Text style={styles.legalText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.screenLabel}>
          <Text style={styles.screenLabelText}>Account / Help Screen</Text>
        </View>
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
  contactSection: {
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center" as const,
  },
  contactCards: {
    flexDirection: "row" as const,
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  contactCardTitle: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#1F2937",
    marginBottom: 2,
  },
  contactCardDesc: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  statusCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFF5F2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  statusText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500" as const,
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
  faqList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  faqHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  faqIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5F2",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  faqAnswer: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
    marginTop: 12,
    marginLeft: 48,
  },
  legalList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  legalItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  legalLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  legalText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1F2937",
  },
  screenLabel: {
    paddingVertical: 12,
    alignItems: "center" as const,
  },
  screenLabelText: {
    fontSize: 10,
    color: "#D1D5DB",
    fontWeight: "500" as const,
  },
});
