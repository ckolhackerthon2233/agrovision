import { useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { StatCard } from "@/src/components/ui/StatCard";
import { Badge } from "@/src/components/ui/Badge";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";
import { Fab } from "@/src/components/ui/Fab";
import { useLivestockList } from "@/src/features/livestock/hooks";
import { Livestock, LIVESTOCK_TYPE_META, HEALTH_META } from "@/src/features/livestock/schema";
import { href } from "@/src/lib/nav";
import { Colors } from "@/src/constants/Colors";

export default function LivestockListScreen() {
  const router = useRouter();
  const { data: animals, isLoading, isError, error, refetch, isRefetching } = useLivestockList();

  const totalHead = useMemo(
    () => (animals ?? []).reduce((s, a) => s + a.count, 0),
    [animals],
  );

  return (
    <Screen
      overlay={<Fab onPress={() => router.push(href("/(tabs)/livestock/new"))} />}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={Colors.brand} />
      }
    >
      <View className="header">
        <View>
          <Text className="header__title">Livestock</Text>
          <Text className="header__subtitle">Herds, health and production</Text>
        </View>
        <View className="avatar">
          <Text className="avatar__emoji">🐄</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <StatCard className="flex-1" icon="🐄" value={`${animals?.length ?? 0}`} label="Groups" />
        <StatCard className="flex-1" icon="🔢" value={`${totalHead}`} label="Total head" />
      </View>

      {isLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Couldn't load livestock"
          text={error instanceof Error ? error.message : "Check that the API server is running."}
          action={<Button label="Retry" variant="ghost" onPress={() => refetch()} />}
        />
      ) : !animals?.length ? (
        <EmptyState
          icon="🐄"
          title="No livestock yet"
          text="Add your first herd or flock to track health and production."
          action={<Button label="Add Livestock" onPress={() => router.push(href("/(tabs)/livestock/new"))} />}
        />
      ) : (
        <View className="gap-3">
          {animals.map((animal) => (
            <AnimalRow key={animal.id} animal={animal} onPress={() => router.push(href(`/(tabs)/livestock/${animal.id}`))} />
          ))}
        </View>
      )}
    </Screen>
  );
}

function AnimalRow({ animal, onPress }: { animal: Livestock; onPress: () => void }) {
  const meta = LIVESTOCK_TYPE_META[animal.type];
  const health = HEALTH_META[animal.healthStatus];
  return (
    <TouchableOpacity className="list-row" activeOpacity={0.8} onPress={onPress}>
      <View className="w-12 h-12 rounded-2xl bg-tint items-center justify-center">
        <Text className="text-2xl">{meta.icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="list-row__title">{animal.name}</Text>
        <Text className="list-row__meta">
          {meta.label} · {animal.count} head{animal.breed ? ` · ${animal.breed}` : ""}
        </Text>
      </View>
      <Badge label={health.label} tone={health.tone} />
    </TouchableOpacity>
  );
}
