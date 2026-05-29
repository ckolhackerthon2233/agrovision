import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export function PageHeader({
  title,
  subtitle,
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  return (
    <View className="gap-3">
      {showBack ? (
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-11 h-11 rounded-full bg-surface border border-line items-center justify-center"
        >
          <Text className="text-ink text-xl">←</Text>
        </TouchableOpacity>
      ) : null}
      <View>
        <Text className="header__title">{title}</Text>
        {subtitle ? <Text className="header__subtitle">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
