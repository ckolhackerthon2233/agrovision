import { Request, Response } from "express";
import { createLivestockSchema, updateLivestockSchema } from "./livestock.schema";
import { livestockService } from "./livestock.service";

export const livestockController = {
  async list(req: Request, res: Response) {
    res.json(await livestockService.list(req.userId!));
  },
  async get(req: Request, res: Response) {
    res.json(await livestockService.get(req.userId!, req.params.id!));
  },
  async create(req: Request, res: Response) {
    const data = createLivestockSchema.parse(req.body);
    res.status(201).json(await livestockService.create(req.userId!, data));
  },
  async update(req: Request, res: Response) {
    const data = updateLivestockSchema.parse(req.body);
    res.json(await livestockService.update(req.userId!, req.params.id!, data));
  },
  async remove(req: Request, res: Response) {
    await livestockService.remove(req.userId!, req.params.id!);
    res.status(204).send();
  },
};
