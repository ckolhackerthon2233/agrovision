import { useState } from "react";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { LivestockForm } from "@/src/features/livestock/LivestockForm";
import { useCreateLivestock } from "@/src/features/livestock/hooks";
import { LivestockFormValues } from "@/src/features/livestock/schema";

export default function NewLivestockScreen() {
  const router = useRouter();
  const create = useCreateLivestock();
  const [error, setError] = useState("");

  const onSubmit = (values: LivestockFormValues) => {
    setError("");
    create.mutate(values, {
      onSuccess: () => router.back(),
      onError: (e) => setError(e instanceof Error ? e.message : "Could not add livestock"),
    });
  };

  return (
    <Screen>
      <PageHeader title="Add Livestock" subtitle="Register a herd, flock or group" />
      <LivestockForm submitLabel="Add Livestock" submitting={create.isPending} serverError={error} onSubmit={onSubmit} />
    </Screen>
  );
}
