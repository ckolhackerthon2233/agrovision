import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { StatCard } from "@/src/components/ui/StatCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { HealthBar } from "@/src/components/HealthBar";
import { useCrop, useDeleteCrop } from "@/src/features/crops/hooks";
import { GROWTH_STAGES, GROWTH_STAGE_META } from "@/src/features/crops/schema";
import { href } from "@/src/lib/nav";
import { Colors } from "@/src/constants/Colors";

export default function CropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: crop, isLoading, isError, error } = useCrop(id);
  const del = useDeleteCrop();

  const confirmDelete = () => {
    if (!crop) return;
    Alert.alert("Delete crop", `Remove "${crop.name}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => del.mutate(id, { onSuccess: () => router.back() }) },
    ]);
  };

  return (
    <Screen>
      <PageHeader title="Crop Details" />

      {isLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : isError || !crop ? (
        <EmptyState
          icon="⚠️"
          title="Crop not found"
          text={error instanceof Error ? error.message : "This crop may have been removed."}
        />
      ) : (
        <>
          <Card variant="solid">
            <Text className="text-4xl">{GROWTH_STAGE_META[crop.growthStage].icon}</Text>
            <Text className="text-white text-2xl font-extrabold mt-2">{crop.name}</Text>
            {crop.variety ? <Text className="text-white/80 text-sm mt-1">{crop.variety}</Text> : null}
            <View className="badge mt-3 self-start" style={{ backgroundColor: "rgba(255,255,255,0.18)" }}>
              <Text className="badge__label text-white">{GROWTH_STAGE_META[crop.growthStage].label}</Text>
            </View>
          </Card>

          {/* Health */}
          <Card>
            <View className="flex-row items-end justify-between mb-3">
              <Text className="card__title">Crop Health</Text>
              <Text className="text-ink text-3xl font-extrabold">{crop.healthScore}%</Text>
            </View>
            <HealthBar score={crop.healthScore} showLabel={false} />
          </Card>

          <View className="flex-row gap-3">
            <StatCard className="flex-1" icon="📐" value={`${crop.areaHectares}`} label="Hectares" />
            <StatCard className="flex-1" icon="🗓️" value={new Date(crop.createdAt).toLocaleDateString()} label="Added" />
          </View>

          {/* Growth timeline (screen8 style) */}
          <Card>
            <Text className="card__title mb-3">Growth Timeline</Text>
            <View className="gap-2">
              {GROWTH_STAGES.map((s, i) => {
                const current = s === crop.growthStage;
                const done = GROWTH_STAGES.indexOf(crop.growthStage) > i;
                return (
                  <View key={s} className="flex-row items-center gap-3">
                    <View
                      className="w-7 h-7 rounded-full items-center justify-center"
                      style={{ backgroundColor: current || done ? Colors.brand : Colors.surfaceAlt }}
                    >
                      <Text className="text-xs">{done ? "✓" : GROWTH_STAGE_META[s].icon}</Text>
                    </View>
                    <Text className={current ? "text-ink font-bold" : "text-muted"}>
                      {GROWTH_STAGE_META[s].label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>

          {crop.notes ? (
            <Card>
              <Text className="card__title">Notes</Text>
              <Text className="text-muted text-sm leading-5 mt-2">{crop.notes}</Text>
            </Card>
          ) : null}

          <Button
            label="📈 Predict yield (AI)"
            onPress={() => router.push(href(`/(tabs)/crops/${crop.id}/predict`))}
          />
          <Button
            label="🤖 Scan health with AI"
            variant="ghost"
            onPress={() =>
              Alert.alert("AI Disease Detection", "Photo-based crop scanning is coming soon.")
            }
          />
          <Button label="Edit Crop" variant="ghost" onPress={() => router.push(href(`/(tabs)/crops/${crop.id}/edit`))} />
          <Button label="Delete Crop" variant="danger" loading={del.isPending} onPress={confirmDelete} />
        </>
      )}
    </Screen>
  );
}
