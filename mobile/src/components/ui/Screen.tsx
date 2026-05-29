import { ReactNode } from "react";
import { View, ScrollView, StyleSheet, RefreshControlProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  /** Render content inside a ScrollView (default) or a plain flex container. */
  scroll?: boolean;
  /** Node rendered as an absolutely-positioned sibling (e.g. a FAB). */
  overlay?: ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

export function Screen({ children, scroll = true, overlay, refreshControl }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 };

  return (
    <View className="screen">
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.grow, pad]}
          refreshControl={refreshControl}
        >
          <View className="px-5 gap-5">{children}</View>
        </ScrollView>
      ) : (
        <View className="flex-1 px-5 gap-5" style={pad}>
          {children}
        </View>
      )}
      {overlay}
    </View>
  );
}

const styles = StyleSheet.create({
  grow: { flexGrow: 1 },
});
