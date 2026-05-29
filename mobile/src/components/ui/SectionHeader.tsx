import { View, Text, TouchableOpacity } from "react-native";

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="header">
      <Text className="section__title">{title}</Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text className="section__link">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
