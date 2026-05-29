import { View, Text, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@/src/lib/zodResolver";
import { Field } from "@/src/components/ui/Field";
import { Button } from "@/src/components/ui/Button";
import {
  farmFormSchema,
  FarmFormValues,
  FARM_TYPES,
  FARM_TYPE_META,
} from "./schema";

type Props = {
  defaultValues?: Partial<FarmFormValues>;
  submitLabel: string;
  submitting?: boolean;
  serverError?: string;
  onSubmit: (values: FarmFormValues) => void;
};

export function FarmForm({
  defaultValues,
  submitLabel,
  submitting,
  serverError,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FarmFormValues>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      location: defaultValues?.location ?? "",
      sizeHectares: defaultValues?.sizeHectares ?? 0,
      type: defaultValues?.type ?? "MIXED",
      description: defaultValues?.description ?? "",
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
          <Field
            label="Farm Name"
            placeholder="e.g. Green Valley Maize"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="location"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Location"
            placeholder="e.g. Nakuru, Kenya"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.location?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="sizeHectares"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Size (hectares)"
            placeholder="0"
            keyboardType="numeric"
            value={value === undefined || value === null ? "" : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.sizeHectares?.message}
          />
        )}
      />

      <View>
        <Text className="field__label">Farm Type</Text>
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <View className="flex-row flex-wrap gap-2">
              {FARM_TYPES.map((t) => {
                const active = value === t;
                return (
                  <TouchableOpacity
                    key={t}
                    className={`chip ${active ? "chip--active" : ""}`}
                    activeOpacity={0.8}
                    onPress={() => onChange(t)}
                  >
                    <Text className={`chip__label ${active ? "chip__label--active" : ""}`}>
                      {FARM_TYPE_META[t].icon}  {FARM_TYPE_META[t].label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.type ? <Text className="field__error">{errors.type.message}</Text> : null}
      </View>

      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Description (optional)"
            placeholder="Notes about this farm…"
            multiline
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.description?.message}
            style={{ minHeight: 96, textAlignVertical: "top" }}
          />
        )}
      />

      <Button label={submitLabel} onPress={handleSubmit(onSubmit)} loading={submitting} />
    </View>
  );
}
