import { z } from "zod";

export const FARM_TYPES = ["CROP", "LIVESTOCK", "MIXED", "AQUACULTURE", "POULTRY"] as const;
export const farmTypeSchema = z.enum(FARM_TYPES);
export type FarmType = z.infer<typeof farmTypeSchema>;

// Shape returned by the API.
export const farmSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  sizeHectares: z.number(),
  type: farmTypeSchema,
  description: z.string().nullable().optional(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Farm = z.infer<typeof farmSchema>;

// Shape used by the create/edit form. `sizeHectares` is coerced so the numeric
// TextInput (a string) validates and submits as a number.
export const farmFormSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80, "Name is too long"),
  location: z.string().min(2, "Add a location").max(120, "Location is too long"),
  sizeHectares: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .min(0, "Cannot be negative")
    .max(100000, "That seems too large"),
  type: farmTypeSchema,
  description: z.string().max(500, "Keep it under 500 characters").optional(),
});
export type FarmFormValues = z.infer<typeof farmFormSchema>;

export const FARM_TYPE_META: Record<FarmType, { label: string; icon: string }> = {
  CROP: { label: "Crop", icon: "🌾" },
  LIVESTOCK: { label: "Livestock", icon: "🐄" },
  MIXED: { label: "Mixed", icon: "🌱" },
  AQUACULTURE: { label: "Aquaculture", icon: "🐟" },
  POULTRY: { label: "Poultry", icon: "🐔" },
};
