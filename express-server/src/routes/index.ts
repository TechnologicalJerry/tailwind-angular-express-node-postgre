import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler";
import userRoutes from "./user.routes";
import { db } from "../db.config";

const router = Router();

router.get(
  "/",
  (_request, response) => {
    response.status(200).json({
      service: "express-user-service",
      version: "v1",
    });
  },
);

router.get(
  "/health",
  asyncHandler(async (_request, response) => {
    const databaseConnected = await db.healthcheck();

    response.status(databaseConnected ? 200 : 503).json({
      status: databaseConnected ? "ok" : "degraded",
      database: databaseConnected ? "up" : "down",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  }),
);

router.use("/users", userRoutes);

export default router;