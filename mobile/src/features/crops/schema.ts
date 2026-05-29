import { z } from "zod";

export const GROWTH_STAGES = [
  "SEEDLING",
  "VEGETATIVE",
  "FLOWERING",
  "MATURING",
  "HARVESTED",
] as const;
export const growthStageSchema = z.enum(GROWTH_STAGES);
export type GrowthStage = z.infer<typeof growthStageSchema>;

export const cropSchema = z.object({
  id: z.string(),
  name: z.string(),
  variety: z.string().nullable().optional(),
  areaHectares: z.number(),
  growthStage: growthStageSchema,
  healthScore: z.number(),
  plantingDate: z.string().nullable().optional(),
  expectedHarvestDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  farmId: z.string().nullable().optional(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Crop = z.infer<typeof cropSchema>;

export const cropFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80, "Name is too long"),
  variety: z.string().max(80).optional(),
  areaHectares: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .min(0, "Cannot be negative")
    .max(100000, "That seems too large"),
  growthStage: growthStageSchema,
  healthScore: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .int()
    .min(0, "0–100 only")
    .max(100, "0–100 only"),
  notes: z.string().max(500).optional(),
});
export type CropFormValues = z.infer<typeof cropFormSchema>;

export const GROWTH_STAGE_META: Record<GrowthStage, { label: string; icon: string }> = {
  SEEDLING: { label: "Seedling", icon: "🌱" },
  VEGETATIVE: { label: "Vegetative", icon: "🌿" },
  FLOWERING: { label: "Flowering", icon: "🌸" },
  MATURING: { label: "Maturing", icon: "🌾" },
  HARVESTED: { label: "Harvested", icon: "✅" },
};

/** Health score → tone for badges/bars. */
export function healthTone(score: number): "success" | "warning" | "danger" {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "danger";
}
