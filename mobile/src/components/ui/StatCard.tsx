import { View, Text } from "react-native";

export function StatCard({
  icon,
  value,
  label,
  className = "",
}: {
  icon: string;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <View className={`stat-card ${className}`}>
      <Text className="stat-card__icon">{icon}</Text>
      <Text className="stat-card__value">{value}</Text>
      <Text className="stat-card__label">{label}</Text>
    </View>
  );
}
