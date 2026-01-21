import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function HomeFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <Text style={styles.footerTitle}>Motana Food</Text>
        <Text style={styles.footerDescription}>
          Your favorite food, delivered fast
        </Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>About Us</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>•</Text>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>•</Text>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerLinks}>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Help Center</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>•</Text>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerContent: {
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF6B35",
    marginBottom: 8,
  },
  footerDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  footerLink: {
    paddingVertical: 4,
  },
  footerLinkText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  footerDivider: {
    fontSize: 12,
    color: "#D1D5DB",
    marginHorizontal: 4,
  },
});
