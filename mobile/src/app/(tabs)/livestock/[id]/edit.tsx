import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { LivestockForm } from "@/src/features/livestock/LivestockForm";
import { useLivestock, useUpdateLivestock } from "@/src/features/livestock/hooks";
import { LivestockFormValues } from "@/src/features/livestock/schema";
import { Colors } from "@/src/constants/Colors";

export default function EditLivestockScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: animal, isLoading } = useLivestock(id);
  const update = useUpdateLivestock(id);
  const [error, setError] = useState("");

  const onSubmit = (values: LivestockFormValues) => {
    setError("");
    update.mutate(values, {
      onSuccess: () => router.back(),
      onError: (e) => setError(e instanceof Error ? e.message : "Could not save changes"),
    });
  };

  return (
    <Screen>
      <PageHeader title="Edit Livestock" subtitle="Update this group's details" />
      {isLoading || !animal ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : (
        <LivestockForm
          submitLabel="Save Changes"
          submitting={update.isPending}
          serverError={error}
          onSubmit={onSubmit}
          defaultValues={{
            name: animal.name,
            type: animal.type,
            breed: animal.breed ?? "",
            count: animal.count,
            healthStatus: animal.healthStatus,
            notes: animal.notes ?? "",
          }}
        />
      )}
    </Screen>
  );
}
