import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface MenuItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showBadge?: boolean;
  badgeCount?: number;
  isLast?: boolean;
}

export function MenuItem({ icon, iconBg, title, subtitle, onPress, showBadge, badgeCount, isLast }: MenuItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && styles.menuItemLast]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          {icon}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuItemText}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {showBadge && badgeCount && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
        <ChevronRight size={18} color="#C4C4C4" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
