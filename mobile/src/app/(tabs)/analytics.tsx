import { View, Text } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { EmptyState } from "@/src/components/ui/EmptyState";

export default function AnalyticsScreen() {
  return (
    <Screen>
      <View className="header">
        <View>
          <Text className="header__title">Analytics</Text>
          <Text className="header__subtitle">Yields, costs and trends</Text>
        </View>
        <View className="avatar">
          <Text className="avatar__emoji">📊</Text>
        </View>
      </View>

      <EmptyState
        icon="📊"
        title="No data yet"
        text="Add crops and record activities to see yield forecasts, health trends, and AI insights."
      />
    </Screen>
  );
}
