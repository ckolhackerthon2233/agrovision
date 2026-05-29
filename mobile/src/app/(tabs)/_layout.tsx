import { Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.ink.faint,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon icon="🌿" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="farms"
        options={{
          title: "Farms",
          tabBarIcon: ({ focused }) => <TabIcon icon="🏡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="crops"
        options={{
          title: "My Crops",
          tabBarIcon: ({ focused }) => <TabIcon icon="🌾" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",
          tabBarIcon: ({ focused }) => <TabIcon icon="🛒" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
      {/* Reached from the dashboard module grid — not tabs themselves. */}
      <Tabs.Screen name="modules" options={{ href: null }} />
      <Tabs.Screen name="livestock" options={{ href: null }} />
      <Tabs.Screen name="iot" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
    height: 72,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabItem: {
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  iconWrapper: {
    width: 36,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconWrapperActive: {
    backgroundColor: Colors.tint,
  },
  icon: {
    fontSize: 18,
  },
});
