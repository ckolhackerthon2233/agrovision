import { Request, Response } from "express";
import { createCropSchema, updateCropSchema } from "./crop.schema";
import { cropService } from "./crop.service";

export const cropController = {
  async list(req: Request, res: Response) {
    res.json(await cropService.list(req.userId!));
  },
  async get(req: Request, res: Response) {
    res.json(await cropService.get(req.userId!, req.params.id!));
  },
  async create(req: Request, res: Response) {
    const data = createCropSchema.parse(req.body);
    res.status(201).json(await cropService.create(req.userId!, data));
  },
  async update(req: Request, res: Response) {
    const data = updateCropSchema.parse(req.body);
    res.json(await cropService.update(req.userId!, req.params.id!, data));
  },
  async remove(req: Request, res: Response) {
    await cropService.remove(req.userId!, req.params.id!);
    res.status(204).send();
  },
};
