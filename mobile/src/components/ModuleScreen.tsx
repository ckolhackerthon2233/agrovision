import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Card } from "@/src/components/ui/Card";
import { StatCard } from "@/src/components/ui/StatCard";
import { Badge } from "@/src/components/ui/Badge";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { ModuleDef } from "@/src/features/modules/registry";

// Reusable overview page rendered for every module that doesn't have its own
// dedicated screen yet. Keeps all module pages consistent and on-brand.
export function ModuleScreen({ module: m }: { module: ModuleDef }) {
  return (
    <Screen>
      <PageHeader title={m.title} />

      {/* Hero */}
      <View className="rounded-3xl overflow-hidden border border-white/10">
        {m.image ? (
          <Image source={m.image} style={styles.hero} contentFit="cover" />
        ) : (
          <View style={[styles.hero, { backgroundColor: m.accent }]} />
        )}
        <LinearGradient
          colors={["transparent", "rgba(8,28,21,0.92)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View className="absolute left-4 bottom-4 right-4 flex-row items-center gap-3">
          <View
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: m.accent }}
          >
            <Text className="text-3xl">{m.icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-xl font-extrabold">{m.title}</Text>
            <Text className="text-white/70 text-xs mt-0.5">{m.tagline}</Text>
          </View>
        </View>
      </View>

      <Badge
        label={m.status === "live" ? "Live" : "In development"}
        tone={m.status === "live" ? "success" : "warning"}
      />

      {/* Stats */}
      {m.stats?.length ? (
        <View className="flex-row gap-3">
          {m.stats.map((s) => (
            <StatCard key={s.label} className="flex-1" icon={s.icon} value={s.value} label={s.label} />
          ))}
        </View>
      ) : null}

      {/* Features */}
      <SectionHeader title="What you can do" />
      <View className="gap-3">
        {m.features.map((f) => (
          <Card key={f.title} className="flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-2xl bg-tint items-center justify-center">
              <Text className="text-xl">{f.icon}</Text>
            </View>
            <View className="flex-1">
              <Text className="card__title">{f.title}</Text>
              <Text className="text-muted text-xs mt-0.5">{f.desc}</Text>
            </View>
          </Card>
        ))}
      </View>

      {m.status === "soon" ? (
        <Card variant="accent">
          <Text className="card__title">🚧 Coming soon</Text>
          <Text className="card__subtitle">
            This module is on the AgriOS roadmap. We build feature-by-feature — the
            screens and backend for {m.title} land in an upcoming pass.
          </Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", height: 180 },
});
