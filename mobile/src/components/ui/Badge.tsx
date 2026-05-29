import { View, Text } from "react-native";

type Tone = "neutral" | "success" | "warning" | "danger";

const TONE: Record<Tone, string> = {
  neutral: "",
  success: "badge--success",
  warning: "badge--warning",
  danger: "badge--danger",
};

export function Badge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  return (
    <View className={`badge ${TONE[tone]}`}>
      <Text className="badge__label">{label}</Text>
    </View>
  );
}
