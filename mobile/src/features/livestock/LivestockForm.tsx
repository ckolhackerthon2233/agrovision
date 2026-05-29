import { View, Text, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@/src/lib/zodResolver";
import { Field } from "@/src/components/ui/Field";
import { Button } from "@/src/components/ui/Button";
import {
  livestockFormSchema,
  LivestockFormValues,
  LIVESTOCK_TYPES,
  LIVESTOCK_TYPE_META,
  HEALTH_STATUSES,
  HEALTH_META,
} from "./schema";

type Props = {
  defaultValues?: Partial<LivestockFormValues>;
  submitLabel: string;
  submitting?: boolean;
  serverError?: string;
  onSubmit: (values: LivestockFormValues) => void;
};

export function LivestockForm({ defaultValues, submitLabel, submitting, serverError, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LivestockFormValues>({
    resolver: zodResolver(livestockFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? "CATTLE",
      breed: defaultValues?.breed ?? "",
      count: defaultValues?.count ?? 1,
      healthStatus: defaultValues?.healthStatus ?? "HEALTHY",
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <View className="gap-5">
      {serverError ? (
        <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <Text className="text-red-600 text-sm">{serverError}</Text>
        </View>
      ) : null}

      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field label="Group / Animal Name" placeholder="e.g. Dairy herd" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
        )}
      />

      <View>
        <Text className="field__label">Type</Text>
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <View className="flex-row flex-wrap gap-2">
              {LIVESTOCK_TYPES.map((t) => {
                const active = value === t;
                return (
                  <TouchableOpacity key={t} className={`chip ${active ? "chip--active" : ""}`} activeOpacity={0.8} onPress={() => onChange(t)}>
                    <Text className={`chip__label ${active ? "chip__label--active" : ""}`}>
                      {LIVESTOCK_TYPE_META[t].icon}  {LIVESTOCK_TYPE_META[t].label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="breed"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field label="Breed (optional)" placeholder="e.g. Friesian" value={value ?? ""} onChangeText={onChange} onBlur={onBlur} error={errors.breed?.message} />
        )}
      />

      <Controller
        control={control}
        name="count"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Count"
            placeholder="1"
            keyboardType="numeric"
            value={value === undefined || value === null ? "" : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.count?.message}
          />
        )}
      />

      <View>
        <Text className="field__label">Health Status</Text>
        <Controller
          control={control}
          name="healthStatus"
          render={({ field: { value, onChange } }) => (
            <View className="flex-row flex-wrap gap-2">
              {HEALTH_STATUSES.map((s) => {
                const active = value === s;
                return (
                  <TouchableOpacity key={s} className={`chip ${active ? "chip--active" : ""}`} activeOpacity={0.8} onPress={() => onChange(s)}>
                    <Text className={`chip__label ${active ? "chip__label--active" : ""}`}>{HEALTH_META[s].label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="notes"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Notes (optional)"
            placeholder="Feeding, breeding, anything…"
            multiline
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.notes?.message}
            style={{ minHeight: 96, textAlignVertical: "top" }}
          />
        )}
      />

      <Button label={submitLabel} onPress={handleSubmit(onSubmit)} loading={submitting} />
    </View>
  );
}
