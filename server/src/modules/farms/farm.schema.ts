import { z } from "zod";

export const farmTypeEnum = z.enum([
  "CROP",
  "LIVESTOCK",
  "MIXED",
  "AQUACULTURE",
  "POULTRY",
]);

export const createFarmSchema = z.object({
  name: z.string().min(2).max(80),
  location: z.string().min(2).max(120),
  sizeHectares: z.coerce.number().min(0).max(100000).default(0),
  type: farmTypeEnum.default("MIXED"),
  description: z.string().max(500).nullish(),
});

export const updateFarmSchema = createFarmSchema.partial();

export type CreateFarmInput = z.infer<typeof createFarmSchema>;
export type UpdateFarmInput = z.infer<typeof updateFarmSchema>;
