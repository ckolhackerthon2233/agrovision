import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

type Variant = "glass" | "solid" | "accent";

const VARIANT: Record<Variant, string> = {
  glass: "",
  solid: "card--solid",
  accent: "card--accent",
};

export function Card({
  children,
  variant = "glass",
  className = "",
  ...rest
}: { children: ReactNode; variant?: Variant; className?: string } & ViewProps) {
  return (
    <View className={`card ${VARIANT[variant]} ${className}`} {...rest}>
      {children}
    </View>
  );
}
