import { Router } from "express";
import mongoose from "mongoose";
import { getRedis } from "../infrastructure/cache/redis.js";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  let redis = "down";
  try {
    redis = (await getRedis().ping()) === "PONG" ? "up" : "down";
  } catch {
    redis = "down";
  }

  res.json({
    ok: redis === "up" && mongoose.connection.readyState === 1,
    services: {
      api: "up",
      mongodb: mongoose.connection.readyState === 1 ? "up" : "down",
      redis
    }
  });
});
