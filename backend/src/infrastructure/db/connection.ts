import mongoose from "mongoose";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    throw error;
  }
}
