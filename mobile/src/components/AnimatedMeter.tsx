import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

// A horizontal bar that fills to `pct` on mount (for risk / confidence meters).
export function AnimatedMeter({
  pct,
  color,
  delay = 0,
}: {
  pct: number;
  color: string;
  delay?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const target = Math.max(0, Math.min(100, pct));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: target,
      duration: 800,
      delay,
      useNativeDriver: false,
    }).start();
  }, [anim, target, delay]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  return (
    <View className="h-2.5 rounded-full bg-surfaceAlt overflow-hidden">
      <Animated.View style={{ width, backgroundColor: color, height: "100%", borderRadius: 999 }} />
    </View>
  );
}
