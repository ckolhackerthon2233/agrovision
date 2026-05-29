import { View, Text, TextInput, TextInputProps } from "react-native";
import { Colors } from "@/src/constants/Colors";

export function Field({
  label,
  error,
  className = "",
  style,
  ...rest
}: { label?: string; error?: string; className?: string } & TextInputProps) {
  return (
    <View className={className}>
      {label ? <Text className="field__label">{label}</Text> : null}
      <TextInput
        placeholderTextColor={Colors.text.whiteAlpha50}
        className={`field__input ${error ? "field__input--error" : ""}`}
        style={style}
        {...rest}
      />
      {error ? <Text className="field__error">{error}</Text> : null}
    </View>
  );
}
