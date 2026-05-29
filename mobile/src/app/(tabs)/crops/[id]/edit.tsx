import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { CropForm } from "@/src/features/crops/CropForm";
import { useCrop, useUpdateCrop } from "@/src/features/crops/hooks";
import { CropFormValues } from "@/src/features/crops/schema";
import { Colors } from "@/src/constants/Colors";

export default function EditCropScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: crop, isLoading } = useCrop(id);
  const update = useUpdateCrop(id);
  const [error, setError] = useState("");

  const onSubmit = (values: CropFormValues) => {
    setError("");
    update.mutate(values, {
      onSuccess: () => router.back(),
      onError: (e) => setError(e instanceof Error ? e.message : "Could not save changes"),
    });
  };

  return (
    <Screen>
      <PageHeader title="Edit Crop" subtitle="Update this crop's details" />
      {isLoading || !crop ? (
        <View className="mt-10 items-center">
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : (
        <CropForm
          submitLabel="Save Changes"
          submitting={update.isPending}
          serverError={error}
          onSubmit={onSubmit}
          defaultValues={{
            name: crop.name,
            variety: crop.variety ?? "",
            areaHectares: crop.areaHectares,
            growthStage: crop.growthStage,
            healthScore: crop.healthScore,
            notes: crop.notes ?? "",
          }}
        />
      )}
    </Screen>
  );
}
