import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { StatCard } from "@/src/components/ui/StatCard";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ModuleCard } from "@/src/components/ModuleCard";
import { MODULES } from "@/src/features/modules/registry";
import { images } from "@/src/constants/images";
import { href } from "@/src/lib/nav";

export default function DashboardScreen() {
  const router = useRouter();

  const goTo = (m: (typeof MODULES)[number]) =>
    router.push(href(m.href ?? `/(tabs)/modules/${m.key}`));

  const liveCount = MODULES.filter((m) => m.status === "live").length;

  return (
    <Screen>
      {/* Greeting */}
      <View className="header">
        <View>
          <Text className="header__title">AgriOS</Text>
          <Text className="header__subtitle">Your agricultural operating system</Text>
        </View>
        <View className="avatar">
          <Text className="avatar__emoji">🌿</Text>
        </View>
      </View>

      {/* Hero */}
      <View className="rounded-3xl overflow-hidden border border-white/10">
        <Image source={images.tractor} style={styles.hero} contentFit="cover" />
        <LinearGradient
          colors={["rgba(8,28,21,0.15)", "rgba(8,28,21,0.92)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View className="absolute left-5 bottom-5 right-5">
          <Text className="text-white text-2xl font-extrabold">Welcome back 👋</Text>
          <Text className="text-white/80 text-sm mt-1">
            Manage every part of your farm from one place.
          </Text>
        </View>
      </View>

      {/* Quick stats */}
      <View className="flex-row gap-3">
        <StatCard className="flex-1" icon="🧩" value={`${MODULES.length}`} label="Modules" />
        <StatCard className="flex-1" icon="🏡" value={`${liveCount}`} label="Live now" />
        <StatCard className="flex-1" icon="🌦️" value="24°" label="Weather" />
      </View>

      {/* Module grid */}
      <SectionHeader title="Modules" />
      <View className="flex-row flex-wrap gap-3">
        {MODULES.map((m) => (
          <ModuleCard key={m.key} module={m} onPress={() => goTo(m)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", height: 160 },
});
