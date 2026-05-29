import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { FarmForm } from "@/src/features/farms/FarmForm";
import { useFarm, useUpdateFarm } from "@/src/features/farms/hooks";
import { FarmFormValues } from "@/src/features/farms/schema";
import { Colors } from "@/src/constants/Colors";

export default function EditFarmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: farm, isLoading } = useFarm(id);
  const update = useUpdateFarm(id);
  const [error, setError] = useState("");

  const onSubmit = (values: FarmFormValues) => {
    setError("");
    update.mutate(values, {
      onSuccess: () => router.back(),
      onError: (e) => setError(e instanceof Error ? e.message : "Could not save changes"),
    });
  };

  return (
    <Screen>
      <PageHeader title="Edit Farm" subtitle="Update this farm's details" />
      {isLoading || !farm ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : (
        <FarmForm
          submitLabel="Save Changes"
          submitting={update.isPending}
          serverError={error}
          onSubmit={onSubmit}
          defaultValues={{
            name: farm.name,
            location: farm.location,
            sizeHectares: farm.sizeHectares,
            type: farm.type,
            description: farm.description ?? "",
          }}
        />
      )}
    </Screen>
  );
}
