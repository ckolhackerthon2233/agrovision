import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { cropController } from "./crop.controller";

const router = Router();

router.get("/", asyncHandler(cropController.list));
router.post("/", asyncHandler(cropController.create));
router.get("/:id", asyncHandler(cropController.get));
router.patch("/:id", asyncHandler(cropController.update));
router.delete("/:id", asyncHandler(cropController.remove));

export default router;
