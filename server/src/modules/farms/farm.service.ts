import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";
import { CreateFarmInput, UpdateFarmInput } from "./farm.schema";

export const farmService = {
  list(ownerId: string) {
    return prisma.farm.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  },

  async get(ownerId: string, id: string) {
    const farm = await prisma.farm.findFirst({ where: { id, ownerId } });
    if (!farm) throw new HttpError(404, "Farm not found");
    return farm;
  },

  create(ownerId: string, data: CreateFarmInput) {
    return prisma.farm.create({ data: { ...data, ownerId } });
  },

  async update(ownerId: string, id: string, data: UpdateFarmInput) {
    await farmService.get(ownerId, id); // ownership check
    return prisma.farm.update({ where: { id }, data });
  },

  async remove(ownerId: string, id: string) {
    await farmService.get(ownerId, id); // ownership check
    await prisma.farm.delete({ where: { id } });
  },
};
