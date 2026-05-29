import { z } from "zod";

export const growthStageEnum = z.enum([
  "SEEDLING",
  "VEGETATIVE",
  "FLOWERING",
  "MATURING",
  "HARVESTED",
]);

export const createCropSchema = z.object({
  name: z.string().min(2).max(80),
  variety: z.string().max(80).nullish(),
  areaHectares: z.coerce.number().min(0).max(100000).default(0),
  growthStage: growthStageEnum.default("SEEDLING"),
  healthScore: z.coerce.number().int().min(0).max(100).default(100),
  plantingDate: z.coerce.date().nullish(),
  expectedHarvestDate: z.coerce.date().nullish(),
  notes: z.string().max(500).nullish(),
  farmId: z.string().nullish(),
});

export const updateCropSchema = createCropSchema.partial();

export type CreateCropInput = z.infer<typeof createCropSchema>;
export type UpdateCropInput = z.infer<typeof updateCropSchema>;
