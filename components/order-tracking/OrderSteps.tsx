import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

export interface OrderStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  time?: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface OrderStepsProps {
  steps: OrderStep[];
  pulseAnim: Animated.Value;
}

export function OrderSteps({ steps, pulseAnim }: OrderStepsProps) {
  return (
    <View style={styles.stepsCard}>
      <Text style={styles.stepsTitle}>Order Progress</Text>
      
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepIndicatorColumn}>
              <Animated.View
                style={[
                  styles.stepCircle,
                  step.isCompleted && styles.stepCircleCompleted,
                  step.isActive && styles.stepCircleActive,
                  step.isActive && { transform: [{ scale: pulseAnim }] },
                ]}
              >
                {step.icon}
              </Animated.View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    step.isCompleted && styles.stepLineCompleted,
                  ]}
                />
              )}
            </View>
            
            <View style={styles.stepContent}>
              <View style={styles.stepTextRow}>
                <Text
                  style={[
                    styles.stepTitle,
                    (step.isCompleted || step.isActive) &&
                      styles.stepTitleActive,
                  ]}
                >
                  {step.title}
                </Text>
                {step.time && (
                  <Text style={styles.stepTime}>{step.time}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepSubtitle,
                  (step.isCompleted || step.isActive) &&
                    styles.stepSubtitleActive,
                ]}
              >
                {step.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 0,
  },
  stepRow: {
    flexDirection: "row",
    gap: 16,
  },
  stepIndicatorColumn: {
    alignItems: "center",
    width: 40,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleCompleted: {
    backgroundColor: "#10B981",
  },
  stepCircleActive: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  stepLine: {
    width: 3,
    height: 40,
    backgroundColor: "#E5E7EB",
    borderRadius: 1.5,
  },
  stepLineCompleted: {
    backgroundColor: "#10B981",
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stepTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  stepTitleActive: {
    color: "#1F2937",
  },
  stepTime: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
  },
  stepSubtitle: {
    fontSize: 12,
    color: "#D1D5DB",
    fontWeight: "500",
  },
  stepSubtitleActive: {
    color: "#6B7280",
  },
});
