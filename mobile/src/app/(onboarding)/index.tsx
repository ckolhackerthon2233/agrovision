import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ListRenderItemInfo,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import {
  onboardingSlides,
  OnboardingSlide,
} from "@/src/features/onboarding/data/slides";
import OnboardingSlideComponent from "@/src/features/onboarding/components/OnboardingSlide";
import { Colors } from "@/src/constants/Colors";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLast = currentIndex === onboardingSlides.length - 1;

  const handleNext = useCallback(() => {
    if (isLast) {
      router.replace("/(auth)");
      return;
    }
    const next = currentIndex + 1;
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  }, [currentIndex, isLast, router]);

  const handleSkip = useCallback(() => {
    router.replace("/(auth)");
  }, [router]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(event.nativeEvent.contentOffset.x / width);
      if (idx >= 0 && idx < onboardingSlides.length) {
        setCurrentIndex(idx);
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<OnboardingSlide>) => (
      <OnboardingSlideComponent slide={item} />
    ),
    []
  );

  return (
    <View style={styles.root}>
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={[styles.navContainer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dotsRow}>
          {onboardingSlides.map((_, index) => (
            <DotIndicator key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        <View style={styles.buttonsRow}>
          {!isLast ? (
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              activeOpacity={0.7}
            >
              <BlurView intensity={20} tint="dark" style={styles.skipBlur}>
                <View style={styles.skipInner}>
                  <Text style={styles.skipText}>Skip</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}

          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButton}
            activeOpacity={0.85}
          >
            <View style={styles.nextInner}>
              {isLast ? (
                <Text style={styles.nextText}>Get Started 🚀</Text>
              ) : (
                <>
                  <Text style={styles.nextText}>Next</Text>
                  <Text style={styles.nextArrow}>→</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Dot Indicator ───────────────────────────────────────────────────────────

interface DotProps {
  index: number;
  scrollX: Animated.Value;
}

function DotIndicator({ index, scrollX }: DotProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const dotWidth = scrollX.interpolate({
    inputRange,
    outputRange: [8, 24, 8],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.4, 1, 0.4],
    extrapolate: "clamp",
  });

  return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} />;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary[900],
  },
  navContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  skipButton: {
    borderRadius: 50,
    overflow: "hidden",
  },
  skipBlur: {
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  skipInner: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: Colors.glass.white,
    borderRadius: 50,
  },
  skipText: {
    color: Colors.text.whiteAlpha70,
    fontSize: 15,
    fontWeight: "600",
  },
  skipPlaceholder: {
    width: 80,
  },
  nextButton: {
    flex: 1,
    borderRadius: 50,
  },
  nextInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: Colors.primary[700],
    borderWidth: 1,
    borderColor: Colors.primary[600],
  },
  nextText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  nextArrow: {
    color: Colors.primary[400],
    fontSize: 18,
    fontWeight: "700",
  },
});
