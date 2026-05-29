import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { livestockController } from "./livestock.controller";

const router = Router();

router.get("/", asyncHandler(livestockController.list));
router.post("/", asyncHandler(livestockController.create));
router.get("/:id", asyncHandler(livestockController.get));
router.patch("/:id", asyncHandler(livestockController.update));
router.delete("/:id", asyncHandler(livestockController.remove));

export default router;
