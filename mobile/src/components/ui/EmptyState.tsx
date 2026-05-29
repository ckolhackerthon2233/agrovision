import { ReactNode } from "react";
import { View, Text } from "react-native";

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: string;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <View className="empty">
      <Text className="empty__icon">{icon}</Text>
      <Text className="empty__title">{title}</Text>
      {text ? <Text className="empty__text">{text}</Text> : null}
      {action ? <View className="mt-6 w-full">{action}</View> : null}
    </View>
  );
}
