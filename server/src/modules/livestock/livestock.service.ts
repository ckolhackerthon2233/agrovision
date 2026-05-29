import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";
import { CreateLivestockInput, UpdateLivestockInput } from "./livestock.schema";

export const livestockService = {
  list(ownerId: string) {
    return prisma.livestock.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } });
  },

  async get(ownerId: string, id: string) {
    const animal = await prisma.livestock.findFirst({ where: { id, ownerId } });
    if (!animal) throw new HttpError(404, "Livestock not found");
    return animal;
  },

  create(ownerId: string, data: CreateLivestockInput) {
    return prisma.livestock.create({ data: { ...data, ownerId } });
  },

  async update(ownerId: string, id: string, data: UpdateLivestockInput) {
    await livestockService.get(ownerId, id);
    return prisma.livestock.update({ where: { id }, data });
  },

  async remove(ownerId: string, id: string) {
    await livestockService.get(ownerId, id);
    await prisma.livestock.delete({ where: { id } });
  },
};
