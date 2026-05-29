import { View, Text } from "react-native";
import { Screen } from "@/src/components/ui/Screen";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";

export default function MarketScreen() {
  return (
    <Screen>
      <View className="header">
        <View>
          <Text className="header__title">Market</Text>
          <Text className="header__subtitle">Buy and sell farm produce</Text>
        </View>
        <View className="avatar">
          <Text className="avatar__emoji">🛒</Text>
        </View>
      </View>

      <EmptyState
        icon="🛒"
        title="Marketplace coming soon"
        text="Buy and sell produce, connect with buyers, and access real-time pricing."
        action={<Button label="List a Product" />}
      />
    </Screen>
  );
}
