import { Router } from "express";
import { ZodObject } from "zod";
import { asyncHandler } from "./async-handler";
import { HttpError } from "./http-error";

export type ResourceConfig = {
  /** URL segment, e.g. "farms" → /api/farms */
  path: string;
  /** Prisma model delegate, e.g. prisma.farm (kept loose so any model fits). */
  delegate: any;
  /** Zod object for create. Update uses `.partial()` of it. */
  schema: ZodObject<any>;
  /** Order rows on list (default: newest first). */
  orderBy?: Record<string, "asc" | "desc">;
};

// Builds a standard, ownership-scoped CRUD router for any resource:
//   GET    /        list (owner's rows)
//   GET    /:id     read one (owned)
//   POST   /        create (ownerId injected)
//   PATCH  /:id     update (owned)
//   DELETE /:id     delete (owned)
// Every row is scoped to req.userId so users only ever touch their own data.
export function createCrudRouter({
  delegate,
  schema,
  orderBy = { createdAt: "desc" },
}: Omit<ResourceConfig, "path">) {
  const updateSchema = schema.partial();
  const router = Router();

  const getOwned = async (ownerId: string, id: string) => {
    const row = await delegate.findFirst({ where: { id, ownerId } });
    if (!row) throw new HttpError(404, "Not found");
    return row;
  };

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      res.json(await delegate.findMany({ where: { ownerId: req.userId }, orderBy }));
    }),
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      res.json(await getOwned(req.userId!, req.params.id!));
    }),
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const data = schema.parse(req.body);
      res.status(201).json(await delegate.create({ data: { ...data, ownerId: req.userId } }));
    }),
  );

  router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      await getOwned(req.userId!, req.params.id!);
      const data = updateSchema.parse(req.body);
      res.json(await delegate.update({ where: { id: req.params.id }, data }));
    }),
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      await getOwned(req.userId!, req.params.id!);
      await delegate.delete({ where: { id: req.params.id } });
      res.status(204).send();
    }),
  );

  return router;
}
