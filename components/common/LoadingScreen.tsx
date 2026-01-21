import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Loader2 } from "lucide-react-native";

import { colors } from "@/theme/colors";

type LoadingScreenProps = {
  title?: string;
  subtitle?: string;
};

export default function LoadingScreen({
  title = "Loading…",
  subtitle,
}: LoadingScreenProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient 
        colors={[colors.background.default, colors.background.paper]} 
        style={StyleSheet.absoluteFill} 
      />

      <View style={styles.center}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Loader2 size={30} color={colors.primary.main} strokeWidth={2.6} />
        </Animated.View>

        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 260,
  },
});

