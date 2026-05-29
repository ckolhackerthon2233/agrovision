import { useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { StatCard } from "@/src/components/ui/StatCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";
import { Fab } from "@/src/components/ui/Fab";
import { HealthBar } from "@/src/components/HealthBar";
import { useCrops } from "@/src/features/crops/hooks";
import { Crop, GROWTH_STAGE_META } from "@/src/features/crops/schema";
import { href } from "@/src/lib/nav";
import { Colors } from "@/src/constants/Colors";

export default function CropsListScreen() {
  const router = useRouter();
  const { data: crops, isLoading, isError, error, refetch, isRefetching } = useCrops();

  const avgHealth = useMemo(() => {
    if (!crops?.length) return 0;
    return Math.round(crops.reduce((s, c) => s + c.healthScore, 0) / crops.length);
  }, [crops]);

  return (
    <Screen
      overlay={<Fab onPress={() => router.push(href("/(tabs)/crops/new"))} />}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={Colors.brand} />
      }
    >
      <View className="header">
        <View>
          <Text className="header__title">My Crops</Text>
          <Text className="header__subtitle">Track growth, health and harvests</Text>
        </View>
        <View className="avatar">
          <Text className="avatar__emoji">🌾</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <StatCard className="flex-1" icon="🌱" value={`${crops?.length ?? 0}`} label="Crops" />
        <StatCard className="flex-1" icon="💚" value={`${avgHealth}%`} label="Avg health" />
      </View>

      {isLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Couldn't load crops"
          text={error instanceof Error ? error.message : "Check that the API server is running."}
          action={<Button label="Retry" variant="ghost" onPress={() => refetch()} />}
        />
      ) : !crops?.length ? (
        <EmptyState
          icon="🌱"
          title="No crops yet"
          text="Add your first crop to start tracking growth, health and yield."
          action={<Button label="Add Your First Crop" onPress={() => router.push(href("/(tabs)/crops/new"))} />}
        />
      ) : (
        <View className="gap-3">
          {crops.map((crop) => (
            <CropRow key={crop.id} crop={crop} onPress={() => router.push(href(`/(tabs)/crops/${crop.id}`))} />
          ))}
        </View>
      )}
    </Screen>
  );
}

function CropRow({ crop, onPress }: { crop: Crop; onPress: () => void }) {
  const stage = GROWTH_STAGE_META[crop.growthStage];
  return (
    <TouchableOpacity className="bg-surface rounded-2xl p-4 border border-line gap-3" activeOpacity={0.8} onPress={onPress}>
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-2xl bg-tint items-center justify-center">
          <Text className="text-2xl">{stage.icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-ink text-base font-bold">{crop.name}</Text>
          <Text className="text-muted text-xs mt-0.5">
            {crop.variety ? `${crop.variety} · ` : ""}{stage.label} · {crop.areaHectares} ha
          </Text>
        </View>
        <Text className="text-faint text-xl">›</Text>
      </View>
      <HealthBar score={crop.healthScore} />
    </TouchableOpacity>
  );
}
