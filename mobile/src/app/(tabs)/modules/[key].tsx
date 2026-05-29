import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/src/components/ui/Screen";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ModuleScreen } from "@/src/components/ModuleScreen";
import { getModule } from "@/src/features/modules/registry";

export default function ModulePage() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const module = getModule(key);

  if (!module) {
    return (
      <Screen>
        <PageHeader title="Module" />
        <EmptyState icon="🧩" title="Module not found" text="This module isn't in the catalogue." />
      </Screen>
    );
  }

  return <ModuleScreen module={module} />;
}
