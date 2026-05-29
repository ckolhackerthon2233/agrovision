import { View, Text, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@/src/lib/zodResolver";
import { Field } from "@/src/components/ui/Field";
import { Button } from "@/src/components/ui/Button";
import { cropFormSchema, CropFormValues, GROWTH_STAGES, GROWTH_STAGE_META } from "./schema";

type Props = {
  defaultValues?: Partial<CropFormValues>;
  submitLabel: string;
  submitting?: boolean;
  serverError?: string;
  onSubmit: (values: CropFormValues) => void;
};

export function CropForm({ defaultValues, submitLabel, submitting, serverError, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CropFormValues>({
    resolver: zodResolver(cropFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      variety: defaultValues?.variety ?? "",
      areaHectares: defaultValues?.areaHectares ?? 0,
      growthStage: defaultValues?.growthStage ?? "SEEDLING",
      healthScore: defaultValues?.healthScore ?? 100,
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
          <Field label="Crop Name" placeholder="e.g. Maize" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
        )}
      />

      <Controller
        control={control}
        name="variety"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field label="Variety (optional)" placeholder="e.g. DK 8031" value={value ?? ""} onChangeText={onChange} onBlur={onBlur} error={errors.variety?.message} />
        )}
      />

      <Controller
        control={control}
        name="areaHectares"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Area (hectares)"
            placeholder="0"
            keyboardType="numeric"
            value={value === undefined || value === null ? "" : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.areaHectares?.message}
          />
        )}
      />

      <View>
        <Text className="field__label">Growth Stage</Text>
        <Controller
          control={control}
          name="growthStage"
          render={({ field: { value, onChange } }) => (
            <View className="flex-row flex-wrap gap-2">
              {GROWTH_STAGES.map((s) => {
                const active = value === s;
                return (
                  <TouchableOpacity
                    key={s}
                    className={`chip ${active ? "chip--active" : ""}`}
                    activeOpacity={0.8}
                    onPress={() => onChange(s)}
                  >
                    <Text className={`chip__label ${active ? "chip__label--active" : ""}`}>
                      {GROWTH_STAGE_META[s].icon}  {GROWTH_STAGE_META[s].label}
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
        name="healthScore"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Health Score (0–100)"
            placeholder="100"
            keyboardType="numeric"
            value={value === undefined || value === null ? "" : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.healthScore?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { value, onChange, onBlur } }) => (
          <Field
            label="Notes (optional)"
            placeholder="Anything worth remembering…"
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
