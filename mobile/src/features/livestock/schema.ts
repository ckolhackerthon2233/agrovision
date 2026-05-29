import { z } from "zod";

export const LIVESTOCK_TYPES = ["CATTLE", "GOAT", "SHEEP", "POULTRY", "PIG", "FISH"] as const;
export const livestockTypeSchema = z.enum(LIVESTOCK_TYPES);
export type LivestockType = z.infer<typeof livestockTypeSchema>;

export const HEALTH_STATUSES = ["HEALTHY", "MONITORING", "SICK"] as const;
export const healthStatusSchema = z.enum(HEALTH_STATUSES);
export type HealthStatus = z.infer<typeof healthStatusSchema>;

export const livestockSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: livestockTypeSchema,
  breed: z.string().nullable().optional(),
  count: z.number(),
  healthStatus: healthStatusSchema,
  notes: z.string().nullable().optional(),
  farmId: z.string().nullable().optional(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Livestock = z.infer<typeof livestockSchema>;

export const livestockFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(80, "Name is too long"),
  type: livestockTypeSchema,
  breed: z.string().max(80).optional(),
  count: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .int()
    .min(0, "Cannot be negative")
    .max(1000000, "That seems too large"),
  healthStatus: healthStatusSchema,
  notes: z.string().max(500).optional(),
});
export type LivestockFormValues = z.infer<typeof livestockFormSchema>;

export const LIVESTOCK_TYPE_META: Record<LivestockType, { label: string; icon: string }> = {
  CATTLE: { label: "Cattle", icon: "🐄" },
  GOAT: { label: "Goat", icon: "🐐" },
  SHEEP: { label: "Sheep", icon: "🐑" },
  POULTRY: { label: "Poultry", icon: "🐔" },
  PIG: { label: "Pig", icon: "🐖" },
  FISH: { label: "Fish", icon: "🐟" },
};

export const HEALTH_META: Record<
  HealthStatus,
  { label: string; tone: "success" | "warning" | "danger" }
> = {
  HEALTHY: { label: "Healthy", tone: "success" },
  MONITORING: { label: "Monitoring", tone: "warning" },
  SICK: { label: "Sick", tone: "danger" },
};
