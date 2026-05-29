import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { OnboardingSlide as SlideType } from "../data/slides";
import { Colors } from "@/src/constants/Colors";

const { width, height } = Dimensions.get("window");

interface Props {
  slide: SlideType;
}

export default function OnboardingSlide({ slide }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={slide.image}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={600}
        cachePolicy="memory-disk"
      />

      <View style={styles.darkOverlay} />

      <LinearGradient
        colors={[
          "transparent",
          "rgba(8,28,21,0.38)",
          "rgba(8,28,21,0.82)",
          "rgba(8,28,21,0.97)",
        ]}
        locations={[0.2, 0.5, 0.72, 1]}
        style={styles.gradient}
      />

      <View style={styles.topBar}>
        <View style={styles.logoPill}>
          <Text style={styles.logoEmoji}>🌿</Text>
          <Text style={styles.logoText}>AgroVision</Text>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <BlurView intensity={22} tint="dark" style={styles.blurContainer}>
          <View style={styles.glassInner}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{slide.badge}</Text>
            </View>

            <Text style={styles.title}>{slide.title}</Text>

            <Text style={[styles.subtitle, { color: slide.accentColor }]}>
              {slide.subtitle}
            </Text>

            <Text style={styles.description}>{slide.description}</Text>

            <View style={{ height: 108 }} />
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: "absolute",
    top: 56,
    left: 24,
    right: 24,
  },
  logoPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
    backgroundColor: Colors.glass.white,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoEmoji: {
    fontSize: 16,
  },
  logoText: {
    color: Colors.text.white,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cardWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: "hidden",
  },
  blurContainer: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.glass.border,
    overflow: "hidden",
  },
  glassInner: {
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 12,
    backgroundColor: "rgba(27,67,50,0.28)",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.glass.whiteMedium,
    borderWidth: 1,
    borderColor: Colors.glass.borderStrong,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 18,
  },
  badgeText: {
    color: Colors.text.white,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.text.white,
    fontSize: 38,
    fontWeight: "800",
    lineHeight: 45,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  description: {
    color: Colors.text.whiteAlpha70,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "400",
  },
});
