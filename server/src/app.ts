import express from "express";
import cors from "cors";
import { env } from "./env";
import { asyncHandler } from "./lib/async-handler";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/error";
import farmRoutes from "./modules/farms/farm.routes";
import cropRoutes from "./modules/crops/crop.routes";
import livestockRoutes from "./modules/livestock/livestock.routes";
import { createCrudRouter } from "./lib/crud";
import { resources } from "./resources";
import notificationRoutes from "./modules/notifications/notification.routes";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // Core modules with dedicated hand-written routers.
  app.use("/api/farms", asyncHandler(requireAuth), farmRoutes);
  app.use("/api/crops", asyncHandler(requireAuth), cropRoutes);
  app.use("/api/livestock", asyncHandler(requireAuth), livestockRoutes);

  // Remaining modules share a generic ownership-scoped CRUD router.
  for (const resource of resources) {
    app.use(`/api/${resource.path}`, asyncHandler(requireAuth), createCrudRouter(resource));
  }

  // Automation: email / SMS / WhatsApp reminders.
  app.use("/api/notifications", asyncHandler(requireAuth), notificationRoutes);

  app.use(errorHandler);
  return app;
}
