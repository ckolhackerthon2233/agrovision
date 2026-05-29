import { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";

// A vertical bar that grows from the bottom on mount. Styled inline because
// NativeWind className isn't applied to Animated.View.
export function AnimatedBar({
  pct,
  color,
  label,
  value,
  delay = 0,
  trackHeight = 140,
}: {
  pct: number;
  color: string;
  label: string;
  value?: string;
  delay?: number;
  trackHeight?: number;
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

  const height = anim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  return (
    <View className="flex-1 items-center gap-2">
      {value ? <Text className="text-ink text-[11px] font-bold">{value}</Text> : null}
      <View
        style={{ height: trackHeight, width: 26 }}
        className="bg-surfaceAlt rounded-full justify-end overflow-hidden"
      >
        <Animated.View style={{ height, backgroundColor: color, width: "100%", borderRadius: 999 }} />
      </View>
      <Text className="text-muted text-[10px]">{label}</Text>
    </View>
  );
}
