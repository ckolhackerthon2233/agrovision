import { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { StatCard } from "@/src/components/ui/StatCard";
import { Field } from "@/src/components/ui/Field";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { Button } from "@/src/components/ui/Button";
import { Fab } from "@/src/components/ui/Fab";
import { useFarms } from "@/src/features/farms/hooks";
import { useFarmFilters } from "@/src/features/farms/store";
import { FARM_TYPES, FARM_TYPE_META, Farm } from "@/src/features/farms/schema";
import { href } from "@/src/lib/nav";
import { Colors } from "@/src/constants/Colors";

export default function FarmsListScreen() {
  const router = useRouter();
  const { data: farms, isLoading, isError, error, refetch, isRefetching } = useFarms();
  const { search, typeFilter, setSearch, setTypeFilter } = useFarmFilters();

  const filtered = useMemo(() => {
    let list = farms ?? [];
    if (typeFilter !== "ALL") list = list.filter((f) => f.type === typeFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (f) => f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q),
      );
    }
    return list;
  }, [farms, typeFilter, search]);

  const totalHectares = useMemo(
    () => (farms ?? []).reduce((sum, f) => sum + f.sizeHectares, 0),
    [farms],
  );

  return (
    <Screen
      overlay={<Fab onPress={() => router.push(href("/(tabs)/farms/new"))} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => refetch()}
          tintColor={Colors.brand}
        />
      }
    >
      <View className="header">
        <View>
          <Text className="header__title">My Farms</Text>
          <Text className="header__subtitle">Manage your farm operations</Text>
        </View>
        <View className="avatar">
          <Text className="avatar__emoji">🏡</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <StatCard className="flex-1" icon="🏡" value={`${farms?.length ?? 0}`} label="Farms" />
        <StatCard
          className="flex-1"
          icon="📐"
          value={`${Math.round(totalHectares * 10) / 10}`}
          label="Total hectares"
        />
      </View>

      <Field placeholder="🔍  Search by name or location…" value={search} onChangeText={setSearch} />

      <View className="flex-row flex-wrap gap-2">
        <TypeChip label="All" active={typeFilter === "ALL"} onPress={() => setTypeFilter("ALL")} />
        {FARM_TYPES.map((t) => (
          <TypeChip
            key={t}
            label={`${FARM_TYPE_META[t].icon} ${FARM_TYPE_META[t].label}`}
            active={typeFilter === t}
            onPress={() => setTypeFilter(t)}
          />
        ))}
      </View>

      {isLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : isError ? (
        <EmptyState
          icon="⚠️"
          title="Couldn't load farms"
          text={error instanceof Error ? error.message : "Check that the API server is running."}
          action={<Button label="Retry" variant="ghost" onPress={() => refetch()} />}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🌱"
          title={farms?.length ? "No matches" : "No farms yet"}
          text={
            farms?.length
              ? "Try a different search term or filter."
              : "Add your first farm to start managing your operation."
          }
          action={
            farms?.length ? undefined : (
              <Button
                label="Add Your First Farm"
                onPress={() => router.push(href("/(tabs)/farms/new"))}
              />
            )
          }
        />
      ) : (
        <View className="gap-3">
          {filtered.map((farm) => (
            <FarmRow
              key={farm.id}
              farm={farm}
              onPress={() => router.push(href(`/(tabs)/farms/${farm.id}`))}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function TypeChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`chip ${active ? "chip--active" : ""}`}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text className={`chip__label ${active ? "chip__label--active" : ""}`}>{label}</Text>
    </TouchableOpacity>
  );
}

function FarmRow({ farm, onPress }: { farm: Farm; onPress: () => void }) {
  return (
    <TouchableOpacity className="list-row" activeOpacity={0.8} onPress={onPress}>
      <View className="w-12 h-12 rounded-2xl bg-primary-700 items-center justify-center">
        <Text className="text-2xl">{FARM_TYPE_META[farm.type].icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="list-row__title">{farm.name}</Text>
        <Text className="list-row__meta">
          📍 {farm.location} · {farm.sizeHectares} ha
        </Text>
      </View>
      <Text className="text-faint text-xl">›</Text>
    </TouchableOpacity>
  );
}
