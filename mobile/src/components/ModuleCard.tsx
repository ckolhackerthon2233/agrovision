import { View, Text, TouchableOpacity } from "react-native";
import { ModuleDef } from "@/src/features/modules/registry";

// Grid tile used on the dashboard. Tapping it navigates to the module.
export function ModuleCard({ module: m, onPress }: { module: ModuleDef; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="w-[47%] bg-surface rounded-3xl p-4 border border-line"
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
        style={{ backgroundColor: m.accent }}
      >
        <Text className="text-2xl">{m.icon}</Text>
      </View>
      <Text className="text-ink text-sm font-bold" numberOfLines={1}>
        {m.title}
      </Text>
      <Text className="text-muted text-xs mt-1" numberOfLines={2}>
        {m.tagline}
      </Text>
      <View className={`badge mt-3 ${m.status === "live" ? "badge--success" : ""}`}>
        <Text className="badge__label">{m.status === "live" ? "Live" : "Soon"}</Text>
      </View>
    </TouchableOpacity>
  );
}
