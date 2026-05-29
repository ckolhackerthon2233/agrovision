import { useState } from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { CropForm } from "@/src/features/crops/CropForm";
import { useCreateCrop } from "@/src/features/crops/hooks";
import { CropFormValues } from "@/src/features/crops/schema";

export default function NewCropScreen() {
  const router = useRouter();
  const create = useCreateCrop();
  const [error, setError] = useState("");

  const onSubmit = (values: CropFormValues) => {
    setError("");
    create.mutate(values, {
      onSuccess: () => router.back(),
      onError: (e) => setError(e instanceof Error ? e.message : "Could not add crop"),
    });
  };

  return (
    <Screen>
      <PageHeader title="Add Crop" subtitle="Track a new crop's growth and health" />
      <CropForm submitLabel="Add Crop" submitting={create.isPending} serverError={error} onSubmit={onSubmit} />
    </Screen>
  );
}
