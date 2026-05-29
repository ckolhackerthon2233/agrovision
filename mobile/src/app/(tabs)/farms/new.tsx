import { useState } from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { FarmForm } from "@/src/features/farms/FarmForm";
import { useCreateFarm } from "@/src/features/farms/hooks";
import { FarmFormValues } from "@/src/features/farms/schema";

export default function NewFarmScreen() {
  const router = useRouter();
  const create = useCreateFarm();
  const [error, setError] = useState("");

  const onSubmit = (values: FarmFormValues) => {
    setError("");
    create.mutate(values, {
      onSuccess: () => router.back(),
      onError: (e) => setError(e instanceof Error ? e.message : "Could not create farm"),
    });
  };

  return (
    <Screen>
      <PageHeader title="Add Farm" subtitle="Create a new farm in your operation" />
      <FarmForm
        submitLabel="Create Farm"
        submitting={create.isPending}
        serverError={error}
        onSubmit={onSubmit}
      />
    </Screen>
  );
}
