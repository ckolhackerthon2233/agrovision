import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { href } from "@/src/lib/nav";

const MENU_ITEMS = [
  { icon: "🌾", label: "My Farm Profile" },
  { icon: "🔔", label: "Notifications" },
  { icon: "🔒", label: "Security" },
  { icon: "🌐", label: "Language" },
  { icon: "❓", label: "Help & Support" },
  { icon: "⭐", label: "Rate AgroVision" },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View className="header">
        <View>
          <Text className="header__title">Profile</Text>
          <Text className="header__subtitle">Account & settings</Text>
        </View>
      </View>

      <Card className="flex-row items-center gap-4">
        <View className="w-16 h-16 rounded-full bg-tint border border-line items-center justify-center">
          <Text className="text-3xl">👨‍🌾</Text>
        </View>
        <View>
          <Text className="text-ink text-lg font-bold">Farm User</Text>
          <View className="badge badge--success mt-1">
            <Text className="badge__label">🌾 Farmer</Text>
          </View>
        </View>
      </Card>

      <View className="bg-surface rounded-3xl border border-line overflow-hidden">
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            className={`flex-row items-center gap-3 px-5 py-4 ${
              i < MENU_ITEMS.length - 1 ? "border-b border-line" : ""
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-xl w-7">{item.icon}</Text>
            <Text className="flex-1 text-ink text-base font-medium">{item.label}</Text>
            <Text className="text-faint text-xl">›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button label="Sign Out" variant="danger" onPress={() => router.replace(href("/(auth)"))} />
    </Screen>
  );
}
