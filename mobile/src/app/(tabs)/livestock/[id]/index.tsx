import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { StatCard } from "@/src/components/ui/StatCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useLivestock, useDeleteLivestock } from "@/src/features/livestock/hooks";
import { LIVESTOCK_TYPE_META, HEALTH_META } from "@/src/features/livestock/schema";
import { href } from "@/src/lib/nav";
import { Colors } from "@/src/constants/Colors";

export default function LivestockDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: animal, isLoading, isError, error } = useLivestock(id);
  const del = useDeleteLivestock();

  const confirmDelete = () => {
    if (!animal) return;
    Alert.alert("Delete livestock", `Remove "${animal.name}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => del.mutate(id, { onSuccess: () => router.back() }) },
    ]);
  };

  return (
    <Screen>
      <PageHeader title="Livestock Details" />

      {isLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : isError || !animal ? (
        <EmptyState
          icon="⚠️"
          title="Not found"
          text={error instanceof Error ? error.message : "This group may have been removed."}
        />
      ) : (
        <>
          <Card variant="solid">
            <Text className="text-4xl">{LIVESTOCK_TYPE_META[animal.type].icon}</Text>
            <Text className="text-white text-2xl font-extrabold mt-2">{animal.name}</Text>
            <Text className="text-white/80 text-sm mt-1">
              {LIVESTOCK_TYPE_META[animal.type].label}
              {animal.breed ? ` · ${animal.breed}` : ""}
            </Text>
          </Card>

          <View className="flex-row gap-3">
            <StatCard className="flex-1" icon="🔢" value={`${animal.count}`} label="Head" />
            <StatCard className="flex-1" icon="🗓️" value={new Date(animal.createdAt).toLocaleDateString()} label="Added" />
          </View>

          <Card>
            <Text className="card__title mb-2">Health</Text>
            <Badge label={HEALTH_META[animal.healthStatus].label} tone={HEALTH_META[animal.healthStatus].tone} />
          </Card>

          {animal.notes ? (
            <Card>
              <Text className="card__title">Notes</Text>
              <Text className="text-muted text-sm leading-5 mt-2">{animal.notes}</Text>
            </Card>
          ) : null}

          <Card variant="accent">
            <Text className="card__title">💉 Vaccination & production logs</Text>
            <Text className="card__subtitle">Health records, vaccination schedules and production tracking are coming soon.</Text>
          </Card>

          <Button label="Edit" onPress={() => router.push(href(`/(tabs)/livestock/${animal.id}/edit`))} />
          <Button label="Delete" variant="danger" loading={del.isPending} onPress={confirmDelete} />
        </>
      )}
    </Screen>
  );
}
