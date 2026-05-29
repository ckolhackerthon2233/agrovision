import { Request, Response } from "express";
import { createFarmSchema, updateFarmSchema } from "./farm.schema";
import { farmService } from "./farm.service";

export const farmController = {
  async list(req: Request, res: Response) {
    res.json(await farmService.list(req.userId!));
  },

  async get(req: Request, res: Response) {
    res.json(await farmService.get(req.userId!, req.params.id!));
  },

  async create(req: Request, res: Response) {
    const data = createFarmSchema.parse(req.body);
    res.status(201).json(await farmService.create(req.userId!, data));
  },

  async update(req: Request, res: Response) {
    const data = updateFarmSchema.parse(req.body);
    res.json(await farmService.update(req.userId!, req.params.id!, data));
  },

  async remove(req: Request, res: Response) {
    await farmService.remove(req.userId!, req.params.id!);
    res.status(204).send();
  },
};
