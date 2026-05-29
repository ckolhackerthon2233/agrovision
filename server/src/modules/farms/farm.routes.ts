import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { farmController } from "./farm.controller";

const router = Router();

router.get("/", asyncHandler(farmController.list));
router.post("/", asyncHandler(farmController.create));
router.get("/:id", asyncHandler(farmController.get));
router.patch("/:id", asyncHandler(farmController.update));
router.delete("/:id", asyncHandler(farmController.remove));

export default router;
