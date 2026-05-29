import { TouchableOpacity, Text } from "react-native";

export function Fab({ onPress, icon = "+" }: { onPress?: () => void; icon?: string }) {
  return (
    <TouchableOpacity className="fab" activeOpacity={0.85} onPress={onPress}>
      <Text className="fab__icon">{icon}</Text>
    </TouchableOpacity>
  );
}
