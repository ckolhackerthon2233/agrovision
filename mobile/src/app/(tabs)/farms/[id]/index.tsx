import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { StatCard } from "@/src/components/ui/StatCard";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { useFarm, useDeleteFarm } from "@/src/features/farms/hooks";
import { FARM_TYPE_META } from "@/src/features/farms/schema";
import { href } from "@/src/lib/nav";
import { Colors } from "@/src/constants/Colors";

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: farm, isLoading, isError, error } = useFarm(id);
  const del = useDeleteFarm();

  const confirmDelete = () => {
    if (!farm) return;
    Alert.alert("Delete farm", `Remove "${farm.name}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => del.mutate(id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  return (
    <Screen>
      <PageHeader title="Farm Details" />

      {isLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : isError || !farm ? (
        <EmptyState
          icon="⚠️"
          title="Farm not found"
          text={error instanceof Error ? error.message : "This farm may have been removed."}
        />
      ) : (
        <>
          <Card variant="solid">
            <Text className="text-4xl">{FARM_TYPE_META[farm.type].icon}</Text>
            <Text className="text-white text-2xl font-extrabold mt-2">{farm.name}</Text>
            <Text className="text-white/70 text-sm mt-1">📍 {farm.location}</Text>
            <View className="mt-3">
              <Badge label={FARM_TYPE_META[farm.type].label} tone="success" />
            </View>
          </Card>

          <View className="flex-row gap-3">
            <StatCard className="flex-1" icon="📐" value={`${farm.sizeHectares}`} label="Hectares" />
            <StatCard
              className="flex-1"
              icon="🗓️"
              value={new Date(farm.createdAt).toLocaleDateString()}
              label="Added"
            />
          </View>

          {farm.description ? (
            <Card>
              <Text className="card__title">About</Text>
              <Text className="text-muted text-sm leading-5 mt-2">{farm.description}</Text>
            </Card>
          ) : null}

          <Button
            label="Edit Farm"
            onPress={() => router.push(href(`/(tabs)/farms/${farm.id}/edit`))}
          />
          <Button
            label="Delete Farm"
            variant="danger"
            loading={del.isPending}
            onPress={confirmDelete}
          />
        </>
      )}
    </Screen>
  );
}
