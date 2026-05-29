import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Colors } from "@/src/constants/Colors";

type Variant = "primary" | "ghost" | "danger";

const BG: Record<Variant, string> = {
  primary: "btn--primary",
  ghost: "btn--ghost",
  danger: "btn--danger",
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const isOff = disabled || loading;
  const labelClass =
    variant === "danger"
      ? "btn__label--danger"
      : variant === "primary"
        ? "btn__label--on-primary"
        : "btn__label";
  const spinnerColor = variant === "primary" ? Colors.text.white : Colors.brand;

  return (
    <TouchableOpacity
      className={`btn ${BG[variant]} ${isOff ? "opacity-60" : ""} ${className}`}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isOff}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <Text className={labelClass}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
