import { z } from "zod";

export const livestockTypeEnum = z.enum([
  "CATTLE",
  "GOAT",
  "SHEEP",
  "POULTRY",
  "PIG",
  "FISH",
]);

export const healthStatusEnum = z.enum(["HEALTHY", "MONITORING", "SICK"]);

export const createLivestockSchema = z.object({
  name: z.string().min(1).max(80),
  type: livestockTypeEnum.default("CATTLE"),
  breed: z.string().max(80).nullish(),
  count: z.coerce.number().int().min(0).max(1000000).default(1),
  healthStatus: healthStatusEnum.default("HEALTHY"),
  notes: z.string().max(500).nullish(),
  farmId: z.string().nullish(),
});

export const updateLivestockSchema = createLivestockSchema.partial();

export type CreateLivestockInput = z.infer<typeof createLivestockSchema>;
export type UpdateLivestockInput = z.infer<typeof updateLivestockSchema>;
