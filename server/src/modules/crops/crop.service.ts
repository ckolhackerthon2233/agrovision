import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";
import { CreateCropInput, UpdateCropInput } from "./crop.schema";

export const cropService = {
  list(ownerId: string) {
    return prisma.crop.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } });
  },

  async get(ownerId: string, id: string) {
    const crop = await prisma.crop.findFirst({ where: { id, ownerId } });
    if (!crop) throw new HttpError(404, "Crop not found");
    return crop;
  },

  create(ownerId: string, data: CreateCropInput) {
    return prisma.crop.create({ data: { ...data, ownerId } });
  },

  async update(ownerId: string, id: string, data: UpdateCropInput) {
    await cropService.get(ownerId, id);
    return prisma.crop.update({ where: { id }, data });
  },

  async remove(ownerId: string, id: string) {
    await cropService.get(ownerId, id);
    await prisma.crop.delete({ where: { id } });
  },
};
