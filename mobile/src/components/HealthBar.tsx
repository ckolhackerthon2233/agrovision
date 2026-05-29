import { View, Text } from "react-native";
import { healthTone } from "@/src/features/crops/schema";

const TONE_COLOR = { success: "#2D6A4F", warning: "#C9821B", danger: "#C0392B" };

export function HealthBar({ score, showLabel = true }: { score: number; showLabel?: boolean }) {
  const color = TONE_COLOR[healthTone(score)];
  const pct = Math.max(0, Math.min(100, score));
  return (
    <View className="gap-1">
      {showLabel ? (
        <View className="flex-row justify-between">
          <Text className="text-muted text-xs font-semibold">Health</Text>
          <Text className="text-ink text-xs font-bold">{score}%</Text>
        </View>
      ) : null}
      <View className="h-2 rounded-full bg-surfaceAlt overflow-hidden">
        <View className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </View>
    </View>
  );
}
